/**
 * embeddings.js - Handles embeddings using BGE-L for the MCP implementation
 * 
 * This module provides functions to create and work with embeddings using BGE embeddings
 * for semantic search in the LexiMentis platform.
 */

/**
 * Generate embeddings for a given text using BGE-L
 * 
 * @param {string} text - The text to generate embeddings for
 * @returns {Promise<Array<number>>} The embedding vector
 */
export const generateEmbeddings = async (text) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BEGEL_ENDPOINT || 'http://localhost:8000'}/embed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    throw error;
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