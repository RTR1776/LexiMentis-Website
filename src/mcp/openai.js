/**
 * openai.js - Handles OpenAI API integration for the MCP implementation
 * 
 * This module provides functions to interact with OpenAI's API for
 * generating responses in the LexiMentis platform.
 */

import { getEnv } from '../utils/env';

/**
 * Generate a response using OpenAI's chat API
 * 
 * @param {Array<{role: string, content: string}>} messages - Array of conversation messages
 * @param {Object} options - Additional options for the API call
 * @returns {Promise<string>} The generated response
 */
export const generateChatResponse = async (messages, options = {}) => {
  try {
    const apiKey = getEnv('REACT_APP_OPENAI_API_KEY', null, true);
    const model = options.model || process.env.REACT_APP_OPENAI_MODEL || 'gpt-4-turbo';
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
        top_p: options.top_p || 1,
        frequency_penalty: options.frequency_penalty || 0,
        presence_penalty: options.presence_penalty || 0
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
};

/**
 * Format context from retrieved documents for the MCP system message
 * 
 * @param {Array<{document: Object, score: number}>} relevantDocuments - Documents retrieved with their relevance scores
 * @returns {string} Formatted context string for the system message
 */
export const formatContextForSystemMessage = (relevantDocuments) => {
  if (!relevantDocuments || relevantDocuments.length === 0) {
    return '';
  }

  // Only use documents with score above a certain threshold
  const significantDocs = relevantDocuments.filter(doc => doc.score > 0.7);
  
  if (significantDocs.length === 0) {
    return '';
  }

  // Format the document texts into a context string with citations
  const formattedContext = significantDocs
    .map((doc, index) => {
      const source = doc.document.source || `Reference ${index + 1}`;
      return `[${source}]: ${doc.document.text.substring(0, 1000)}${doc.document.text.length > 1000 ? '...' : ''}`;
    })
    .join('\n\n');

  return `
Relevant information from the knowledge base:

${formattedContext}

Please use this information to answer the user's questions about Kansas and Missouri workers compensation law if applicable.
`;
}; 