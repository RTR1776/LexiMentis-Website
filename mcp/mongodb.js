/**
 * mongodb.js - MongoDB integration for vector search
 * 
 * This module provides functions to search vectors in MongoDB
 * for the LexiMentis MCP implementation.
 */

import { getVectorEmbedding } from './embeddings';
import { MongoClient } from 'mongodb';

// Add some validation and fallback
const MONGODB_URI = process.env.REACT_APP_MONGODB_URI;
const DB_NAME = process.env.REACT_APP_DB_NAME || 'leximentis';
const COLLECTION_NAME = process.env.REACT_APP_COLLECTION_NAME || 'documents';

// Enhance validation
if (!MONGODB_URI || MONGODB_URI.includes('placeholder')) {
  console.error('MongoDB URI is not properly configured. Please set REACT_APP_MONGODB_URI in your system environment variables.');
}

// Create a MongoDB client
let client = null;

/**
 * Get MongoDB client connection
 * 
 * @returns {Promise<MongoClient>} MongoDB client
 */
const getMongoClient = async () => {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
  }
  return client;
};

// Enhanced MongoDB connection with fallback to REACT_APP prefixed variables
const connectToMongoDB = async () => {
  try {
    // Use non-prefixed vars with fallback to REACT_APP prefixed vars
    const MONGODB_URI = process.env.MONGODB_URI || process.env.REACT_APP_MONGODB_URI;
    const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || process.env.REACT_APP_MONGODB_DB_NAME;
    
    // Check for required environment variables
    if (!MONGODB_URI) {
      throw new Error('MongoDB URI is not defined. Please check your environment variables.');
    }
    
    if (!MONGODB_DB_NAME) {
      throw new Error('MongoDB database name is not defined. Please check your environment variables.');
    }

    console.log('Connecting to MongoDB with URI:', MONGODB_URI.substring(0, 20) + '...');
    
    const client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    
    await client.connect();
    console.log('Successfully connected to MongoDB Atlas');
    
    const db = client.db(MONGODB_DB_NAME);
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

/**
 * Find similar documents based on vector similarity
 * 
 * @param {Array<number>} queryVector - The query vector to compare against
 * @param {number} limit - Maximum number of results to return
 * @param {number} minScore - Minimum similarity score (0-1)
 * @returns {Promise<Array<{document: Object, score: number}>>} Matching documents with scores
 */
export const findSimilarDocuments = async (queryVector, limit = 5, minScore = 0.7) => {
  if (!queryVector || !Array.isArray(queryVector)) {
    throw new Error('Invalid query vector provided');
  }

  try {
    const client = await getMongoClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Perform vector search using MongoDB's $vectorSearch operator
    const results = await collection.aggregate([
      {
        $vectorSearch: {
          index: "vectorIndex",
          queryVector: queryVector,
          numCandidates: limit * 10,
          limit: limit,
          path: "embedding"
        }
      },
      {
        $project: {
          document: {
            text: "$text",
            source: "$source"
          },
          score: { $meta: "vectorSearchScore" }
        }
      }
    ]).toArray();

    // Filter results by minimum score if needed
    const filteredResults = results.filter(doc => doc.score >= minScore);
    
    console.log(`Found ${filteredResults.length} relevant documents`);
    return filteredResults;
  } catch (error) {
    console.error('Error performing vector search in MongoDB:', error);
    throw new Error('Unable to retrieve documents. Please check the database connection and vector search configuration.');
  }
};

// Enhanced vector search function with better error handling
const searchVectors = async (collection, queryEmbedding, limit = 5) => {
  try {
    const { client, db } = await connectToMongoDB();
    
    // Ensure the collection exists
    const collections = await db.listCollections({name: collection}).toArray();
    if (collections.length === 0) {
      console.warn(`Collection ${collection} does not exist. Creating it now.`);
      await db.createCollection(collection);
      
      // Create the vector index if needed
      await db.collection(collection).createIndex({ embedding: "vector" }, { 
        name: "vector_index",
        vectorDimension: queryEmbedding.length 
      });
    }
    
    const results = await db.collection(collection)
      .aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: limit * 10,
            limit: limit
          }
        },
        {
          $project: {
            _id: 0,
            text: 1,
            source: 1,
            metadata: 1,
            score: { $meta: "vectorSearchScore" }
          }
        }
      ])
      .toArray();
    
    await client.close();
    return results;
  } catch (error) {
    console.error(`Error searching vectors in ${collection}:`, error);
    // Return empty results but don't crash the application
    return [];
  }
};

/**
 * Query the vector database with a text query
 * 
 * @param {string} query - The text query to search for
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Array<{source: string, text: string, score: number}>>} Matching documents with scores
 */
export const queryVectorDatabase = async (query, limit = 5) => {
  // Debug log
  console.log('MongoDB query initiated for:', query);
  
  try {
    // Get embedding for the query
    const queryEmbedding = await getVectorEmbedding(query);
    
    // Get similar documents
    const similarDocs = await findSimilarDocuments(queryEmbedding, limit);
    
    // Format the results for the application
    const results = similarDocs.map(doc => ({
      source: doc.document.source,
      text: doc.document.text,
      score: doc.score
    }));
    
    console.log(`Returning ${results.length} relevant documents`);
    return results;
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    throw error; // Propagate the error instead of returning mock data
  }
}; 