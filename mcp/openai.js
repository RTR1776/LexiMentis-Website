/**
 * openai.js - OpenAI API integration for chat completions
 * 
 * This module provides functions to interact with OpenAI's API
 * for generating chat completions.
 */

import axios from 'axios';

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY;
const CHAT_MODEL = process.env.REACT_APP_OPENAI_MODEL || 'gpt-4';
const MAX_TOKENS = 1000;
const TEMPERATURE = 0.7;

/**
 * Format context documents for a system message
 * 
 * @param {Array<{document: Object, score: number}>} documents - Retrieved documents
 * @returns {string} Formatted context string
 */
export const formatContextForSystemMessage = (documents) => {
  if (!documents || documents.length === 0) {
    return '';
  }

  const formattedDocs = documents.map(doc => {
    const source = doc.document.source || 'Unknown Source';
    const text = doc.document.text || '';
    return `Source: ${source}\n${text}`;
  }).join('\n\n');

  return `\nPlease use the following information to answer the question:\n\n${formattedDocs}`;
};

/**
 * Generate a chat response using OpenAI API
 * 
 * @param {Array<{role: string, content: string}>} messages - Conversation history
 * @returns {Promise<string>} Generated response text
 */
export const generateChatResponse = async (messages) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please check your environment variables.');
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error('Invalid messages provided for chat completion');
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: CHAT_MODEL,
        messages: messages,
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error('Invalid response from OpenAI API');
    }
  } catch (error) {
    console.error('Error generating chat completion:', error);
    throw new Error(`Failed to generate chat completion: ${error.message}`);
  }
};

/**
 * Get a completion from OpenAI for the given messages
 * 
 * @param {Array<{role: string, content: string}>} messages - The conversation history
 * @returns {Promise<string>} The completion text
 */
export const getOpenAICompletion = async (messages) => {
  return await generateChatResponse(messages);
};

/**
 * Generate embedding vector for a text using OpenAI API
 * 
 * @param {string} text - Text to generate embedding for
 * @returns {Promise<Array<number>>} The embedding vector
 */
export async function getEmbedding(text) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please check your environment variables.');
  }

  if (!text || typeof text !== 'string') {
    throw new Error('Invalid text provided for embedding generation');
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        model: 'text-embedding-ada-002',
        input: text
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && 
        response.data.data && 
        response.data.data[0] && 
        response.data.data[0].embedding) {
      return response.data.data[0].embedding;
    } else {
      throw new Error('Invalid response from OpenAI API');
    }
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
} 