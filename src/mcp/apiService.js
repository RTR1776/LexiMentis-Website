/**
 * apiService.js - Simplified API service for the MCP implementation
 * 
 * This module provides functions to interact with the MCP services.
 */

import { handleMcpAssistantRequest } from './mcpAssistant';

/**
 * Send a conversation to the MCP assistant
 * 
 * @param {Array<{role: string, content: string}>} messages - The conversation history
 * @returns {Promise<{reply: string, sources: Array}>} The assistant's reply and sources
 */
export const sendToMcpAssistant = async (messages) => {
  try {
    // Use the local MCP implementation
    console.log('Using simplified local MCP implementation');
    const response = await handleMcpAssistantRequest({ body: { messages } });
    
    if (response.status !== 200) {
      throw new Error(response.body.error || 'An error occurred with the local MCP');
    }
    
    return response.body;
  } catch (error) {
    console.error('Error in MCP API service:', error);
    return { 
      reply: 'I apologize, but I encountered an error while processing your question. Please try again or contact support if the issue persists.',
      sources: []
    };
  }
}; 