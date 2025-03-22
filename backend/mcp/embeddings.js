/**
 * embeddings.js - Handles embeddings for the MCP implementation
 * 
 * This module provides functions to create and work with embeddings for
 * semantic search in the LexiMentis platform.
 */

import axios from 'axios';
import { connectToMongoDB } from './mongodb';

/**
 * Generate embeddings for a given text using Google Cloud AI Platform
 * 
 * @param {string} text - The text to generate embeddings for
 * @returns {Promise<Array<number>>} The embedding vector
 */
export const generateEmbeddings = async (text) => {
  try {
    // Get the endpoint URL from environment variables
    const endpoint = process.env.REACT_APP_BEGEL_ENDPOINT;
    if (!endpoint) {
      throw new Error('Embedding endpoint URL not configured');
    }
    
    // Since we're calling directly from browser to Google Cloud, we need to handle CORS
    // by using a proxy URL for development, which can be configured in package.json
    // or using a service like CORS Anywhere (for development only)
    const proxyUrl = process.env.REACT_APP_PROXY_URL || '';
    const requestUrl = `${proxyUrl}${endpoint}`;
    
    console.log("Generating embeddings with Google Cloud AI Platform...");
    
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add Google Cloud authentication if required (usually handled by Cloud Functions)
        // 'Authorization': `Bearer ${process.env.REACT_APP_GCP_TOKEN}`
      },
      body: JSON.stringify({ 
        text, 
        model: process.env.REACT_APP_BEGEL_MODEL || 'BAAI/bge-large-en-v1.5' 
      }),
    });

    if (!response.ok) {
      throw new Error(`Embedding generation failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.embedding;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    // Create a fallback embedding that's consistent but not useful for actual retrieval
    // This is just to prevent the application from crashing during development
    return Array.from({ length: 768 }, () => 0.001);
  }
};

/**
 * Calculates cosine similarity between two vectors
 * 
 * @param {Array<number>} a - First vector
 * @param {Array<number>} b - Second vector
 * @returns {number} The cosine similarity score (between -1 and 1)
 */
export const cosineSimilarity = (a, b) => {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  return dotProduct / (normA * normB);
};

/**
 * Ranks documents by similarity to a query
 * 
 * @param {string} query - The search query
 * @param {Array<{text: string, embedding?: Array<number>}>} documents - Documents to search through
 * @returns {Promise<Array<{document: any, score: number}>>} Ranked documents with similarity scores
 */
export const rankDocumentsByQuery = async (query, documents) => {
  const queryEmbedding = await generateEmbeddings(query);
  
  // For any documents without embeddings, generate them
  const documentsWithEmbeddings = await Promise.all(
    documents.map(async (doc) => {
      if (!doc.embedding) {
        const embedding = await generateEmbeddings(doc.text);
        return { ...doc, embedding };
      }
      return doc;
    })
  );
  
  // Calculate similarity scores
  const scoredDocuments = documentsWithEmbeddings.map(doc => ({
    document: doc,
    score: cosineSimilarity(queryEmbedding, doc.embedding)
  }));
  
  // Sort by similarity score (descending)
  return scoredDocuments.sort((a, b) => b.score - a.score);
};

// Configuration
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const EMBEDDING_MODEL = 'text-embedding-ada-002';

/**
 * Generate vector embeddings for text using OpenAI API
 * 
 * @param {string} text - The text to generate embeddings for
 * @returns {Promise<Array<number>>} The embedding vector
 */
export const getVectorEmbedding = async (text) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!apiKey || apiKey.includes('placeholder')) {
    console.error('OpenAI API key not properly configured.');
    throw new Error('OpenAI API key not properly configured.');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-ada-002'
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API returned status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.data && data.data[0] && data.data[0].embedding) {
      return data.data[0].embedding;
    } else {
      throw new Error('Invalid response from OpenAI API');
    }
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
};

// Option 1: Create an alias instead of redeclaring
export { getVectorEmbedding as openAIEmbeddings };

// OR Option 2: Export the function without redeclaring
export { getVectorEmbedding };

// Enhanced function to store document embeddings in MongoDB
const storeDocumentEmbeddings = async (documents, collection) => {
  try {
    if (!documents || documents.length === 0) {
      console.warn('No documents provided for embedding storage');
      return { success: false, message: 'No documents provided' };
    }

    console.log(`Storing ${documents.length} document embeddings in ${collection}`);
    
    // Connect to MongoDB
    const { client, db } = await connectToMongoDB();
    
    // Ensure collection exists and has vector index
    const collections = await db.listCollections({name: collection}).toArray();
    
    if (collections.length === 0) {
      console.log(`Creating collection ${collection} with vector search capabilities`);
      await db.createCollection(collection);
    }
    
    // Process documents in batches to avoid memory issues
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < documents.length; i += batchSize) {
      batches.push(documents.slice(i, i + batchSize));
    }
    
    let totalStored = 0;
    
    for (const [index, batch] of batches.entries()) {
      console.log(`Processing batch ${index + 1}/${batches.length}`);
      
      // Generate embeddings for the batch
      const embeddingResults = await Promise.all(
        batch.map(async (doc) => {
          const embedding = await getVectorEmbedding(doc.text);
          return {
            ...doc,
            embedding,
            createdAt: new Date()
          };
        })
      );
      
      // Store the embeddings
      const result = await db.collection(collection).insertMany(embeddingResults);
      totalStored += result.insertedCount;
    }
    
    // Create or update vector index after documents are inserted
    const sampleDoc = await db.collection(collection).findOne();
    if (sampleDoc && sampleDoc.embedding) {
      const dimension = sampleDoc.embedding.length;
      
      try {
        await db.collection(collection).createIndex(
          { embedding: "vector" },
          { 
            name: "vector_index",
            vectorDimension: dimension 
          }
        );
        console.log(`Created or updated vector index with dimension ${dimension}`);
      } catch (indexError) {
        console.warn('Vector index creation warning:', indexError.message);
        // Index might already exist with different dimensions
      }
    }
    
    await client.close();
    
    return { 
      success: true, 
      message: `Successfully stored ${totalStored} document embeddings in ${collection}` 
    };
  } catch (error) {
    console.error('Error storing document embeddings:', error);
    return { success: false, message: error.message };
  }
}; 