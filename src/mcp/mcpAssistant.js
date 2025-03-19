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
import { generateChatResponse, formatContextForSystemMessage } from './openai';
import { findSimilarDocuments } from './mongodb';

/**
 * Process a user query through the simplified Model Context Protocol
 * 
 * @param {Array<{role: string, content: string}>} messages - Conversation history
 * @returns {Promise<{reply: string, sources: Array}>} Generated response and sources
 */
export const processQuery = async (messages) => {
  try {
    // Extract the latest user message for context retrieval
    const userMessages = messages.filter(msg => msg.role === 'user');
    const latestUserMessage = userMessages[userMessages.length - 1]?.content;
    
    if (!latestUserMessage) {
      throw new Error('No user message found in the conversation');
    }

    // Step 1: Generate embedding for the query
    const queryEmbedding = await generateEmbeddings(latestUserMessage);

    // Step 2: Retrieve relevant documents using the embedding
    const relevantDocuments = await findSimilarDocuments(queryEmbedding);
    
    // Step 3: Format retrieved context for the system message
    const contextEnhancement = formatContextForSystemMessage(relevantDocuments);
    
    // Step 4: Build enhanced conversation with context
    const systemContent = `You are a knowledgeable AI assistant specializing in Kansas and Missouri workers' compensation law. 
Provide accurate, helpful information based only on the content provided to you. 
If information is not provided in the context, acknowledge the limitations of your knowledge on the specific question.
Always cite your sources when providing information.
${contextEnhancement}`;

    const enhancedMessages = [
      { role: 'system', content: systemContent },
      ...messages.filter(msg => msg.role !== 'system')
    ];

    // Step 5: Generate response using OpenAI
    const response = await generateChatResponse(enhancedMessages);
    
    // Extract sources for display in the UI
    const sources = relevantDocuments.map(doc => ({
      text: doc.document.text,
      source: doc.document.source || 'Unknown Source',
      score: doc.score
    }));

    return {
      reply: response,
      sources: sources
    };
  } catch (error) {
    console.error('Error in MCP processing:', error);
    return {
      reply: 'I apologize, but I encountered an error while processing your question. Please try again or contact support if the issue persists.',
      sources: []
    };
  }
};

/**
 * Handle an MCP Assistant request
 * 
 * @param {Request} req - The incoming request object
 * @returns {Promise<Object>} The response object with the generated reply and sources
 */
export const handleMcpAssistantRequest = async (req) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return {
        status: 400,
        body: { error: 'Invalid request: messages array is required' }
      };
    }
    
    const result = await processQuery(messages);
    
    return {
      status: 200,
      body: result
    };
  } catch (error) {
    console.error('Error handling MCP assistant request:', error);
    
    return {
      status: 500,
      body: { 
        error: 'An error occurred while processing your request',
        reply: 'I apologize, but I encountered an error while processing your question. Please try again.',
        sources: []
      }
    };
  }
}; 