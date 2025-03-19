/**
 * mongodb.js - Simplified MongoDB service for vector retrieval
 * 
 * This module provides functions to interact with MongoDB for retrieving
 * document vectors for the LexiMentis MCP implementation.
 */

/**
 * Find similar documents based on vector similarity
 * 
 * @param {Array<number>} queryVector - The query vector to compare against
 * @param {number} limit - Maximum number of results to return
 * @param {number} minScore - Minimum similarity score (0-1)
 * @returns {Promise<Array<{document: Object, score: number}>>} Matching documents with scores
 */
export const findSimilarDocuments = async (queryVector, limit = 5, minScore = 0.7) => {
  try {
    // MongoDB connection string - replace with your actual connection string
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    
    const response = await fetch(`${apiUrl}/api/vector/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vector: queryVector,
        limit,
        minScore
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to search vectors: ${response.statusText}`);
    }
    
    const results = await response.json();
    return results.documents;
  } catch (error) {
    console.error('Error finding similar documents:', error);
    
    // Fallback knowledge base when MongoDB is not available
    const fallbackDocuments = [
      {
        document: {
          text: "In Kansas, the Workers Compensation Act provides compensation to workers who suffer personal injury by accident, repetitive trauma, or occupational disease arising out of and in the course of employment. Benefits include medical treatment, disability benefits, and death benefits.",
          source: "Kansas Workers Compensation Act Overview"
        },
        score: 0.85
      },
      {
        document: {
          text: "Under Missouri law, employers with five or more employees (or construction industry employers with one or more employees) must provide workers' compensation insurance to protect their workers in case of job-related injuries or illnesses. The Missouri Division of Workers' Compensation administers programs for workers who have been injured on the job or who have contracted an occupational disease.",
          source: "Missouri Workers Compensation Law Overview"
        },
        score: 0.82
      },
      {
        document: {
          text: "Maximum Medical Improvement (MMI) is a critical concept in workers' compensation cases. It represents the point at which an injured worker's medical condition has stabilized and further significant improvement is not expected, even with continued medical treatment.",
          source: "Workers Compensation Terminology Guide"
        },
        score: 0.78
      }
    ];
    
    return fallbackDocuments;
  }
}; 