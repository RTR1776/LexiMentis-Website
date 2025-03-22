/**
 * apiService.js - Simplified API service for the MCP implementation
 * 
 * This module provides functions to interact with the MCP services.
 */

import { handleMcpAssistantRequest } from './mcpAssistant';
import { getApiUrl } from '../utils/env';
import { getEmbedding, searchVectors } from './embeddings';
import { callAIModel } from './aiModel';

const API_BASE_URL = getApiUrl();
const USE_DIRECT_INTEGRATION = process.env.REACT_APP_USE_DIRECT_INTEGRATION === 'true';

const CORS_PROXY = process.env.NODE_ENV === 'development' 
  ? 'https://cors-anywhere.herokuapp.com/' 
  : '';

/**
 * Send a conversation to the MCP assistant
 * 
 * @param {Array<{role: string, content: string}>} messages - The conversation history
 * @returns {Promise<{reply: string, sources: Array}>} The assistant's reply and sources
 */
export const sendToMcpAssistant = async (messages) => {
  try {
    console.log('Sending request to MCP Assistant');
    
    // Extract the last user message for vector search
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content;
    
    if (!lastUserMessage) {
      console.warn('No user message found in the conversation');
      return { reply: "I couldn't understand your question. Could you please try again?" };
    }
    
    // Attempt to get vector DB results
    let vectorResults = [];
    let errorMessage = null;
    
    try {
      // Generate embedding for the user query
      const embedding = await getEmbedding(lastUserMessage);
      
      // Search for relevant documents
      vectorResults = await searchVectors('ks_workcomp_appeals', embedding, 3);
      
      console.log(`Found ${vectorResults.length} relevant documents`);
    } catch (dbError) {
      console.error('Error accessing vector database:', dbError);
      errorMessage = dbError.message;
      
      // Continue execution even if vector search fails
      vectorResults = [];
    }
    
    // Prepare the context for the AI assistant
    const context = vectorResults.length > 0 
      ? `Here is some relevant information about Kansas workers' compensation:\n\n${
          vectorResults.map(r => `SOURCE: ${r.source}\n${r.text}`).join('\n\n')
        }`
      : "I don't have specific information about that in my knowledge base.";
    
    // Add context to the messages
    const messagesWithContext = [
      ...messages,
      { 
        role: 'system', 
        content: `You are a helpful workers' compensation assistant specializing in Kansas and Missouri law. ${
          errorMessage 
            ? `Note: There was an error accessing the vector database: ${errorMessage}. Please inform the user.` 
            : ''
        }\n\nHere's some relevant context for the user's query:\n${context}`
      }
    ];
    
    // Call the AI model
    const response = await callAIModel(messagesWithContext);
    
    return {
      reply: response,
      sources: vectorResults
    };
  } catch (error) {
    console.error('Error in MCP Assistant:', error);
    return { 
      reply: "I'm sorry, I encountered an error processing your request. Please try again or contact support if the issue persists.",
      sources: []
    };
  }
}; 