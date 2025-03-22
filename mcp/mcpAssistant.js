/**
 * mcpAssistant.js - Simplified MCP implementation for the LexiMentis AI Assistant
 * 
 * This module implements a simplified Model Context Protocol pattern by:
 * 1. Using embeddings of user queries
 * 2. Retrieving relevant context from a knowledge base
 * 3. Augmenting the conversation with this context
 * 4. Sending the enriched prompt to OpenAI for response generation
 */

import { generateEmbeddings } from './embeddings';
import { generateChatResponse, formatContextForSystemMessage, getOpenAICompletion } from './openai';
import { findSimilarDocuments, queryVectorDatabase } from './mongodb';

/**
 * Handle an MCP Assistant request
 * 
 * @param {Array<{role: string, content: string}>} messages - The conversation history
 * @returns {Promise<Object>} The response object with the generated reply and sources
 */
export const handleMcpAssistantRequest = async (messages) => {
  // Extract the last user message
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
  
  if (!lastUserMessage) {
    throw new Error('No user message found in the conversation');
  }
  
  // Debug log
  console.log('Processing query:', lastUserMessage);
  
  // Get relevant documents from MongoDB
  const relevantDocuments = await queryVectorDatabase(lastUserMessage);
  
  // Debug log
  console.log(`Found ${relevantDocuments.length} relevant documents`);
  
  // Format documents as context
  const context = relevantDocuments.map(doc => 
    `Source: ${doc.source}\n${doc.text}`
  ).join('\n\n');
  
  // Create a system message with the context
  const systemMessage = {
    role: 'system',
    content: `You are a knowledgeable AI assistant specializing in Kansas and Missouri workers' compensation law.
Provide accurate, helpful information based only on the content provided to you.
If information is not provided in the context, acknowledge the limitations of your knowledge on the specific question.
Always cite your sources when providing information.

Answer using the following information:

${context}`
  };
  
  // Replace any existing system message or add one
  const updatedMessages = [...messages];
  const systemMessageIndex = updatedMessages.findIndex(m => m.role === 'system');
  if (systemMessageIndex >= 0) {
    updatedMessages[systemMessageIndex] = systemMessage;
  } else {
    updatedMessages.unshift(systemMessage);
  }
  
  // Get completion with the enhanced context
  const completion = await getOpenAICompletion(updatedMessages);
  
  return {
    reply: completion,
    sources: relevantDocuments.map(doc => ({
      source: doc.source,
      text: doc.text,
      score: doc.score
    }))
  };
};

/**
 * Process a user query through the simplified Model Context Protocol
 * This method is kept for backward compatibility
 */
export const processQuery = async (messages) => {
  return handleMcpAssistantRequest(messages);
}; 