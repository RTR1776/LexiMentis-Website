// Import your MCP components
const { initializeMongo, closeMongoConnection } = require('./mongodb');
const { createMCPAssistant, handleMCPMessage } = require('./mcpAssistant');
const { generateEmbeddings } = require('./embeddings');

// Use ES modules
import { handleMcpAssistantRequest } from './mcpAssistant';
import { queryVectorDatabase } from './mongodb';

// Test function for database query
const testDatabaseQuery = async () => {
  console.log('Testing database query...');
  try {
    const result = await queryVectorDatabase('What is the burden of proof in Kansas workers compensation cases?');
    console.log('Query results:', result);
    return result;
  } catch (error) {
    console.error('Database query test failed:', error);
    throw error; // propagate the error
  }
};

// Test function for MCP assistant
const testMcpAssistant = async () => {
  console.log('Testing MCP assistant...');
  const messages = [
    { role: 'system', content: 'You are a helpful assistant for Kansas Workers Compensation.' },
    { role: 'user', content: 'What is the burden of proof in Kansas workers compensation cases?' }
  ];
  
  try {
    const result = await handleMcpAssistantRequest(messages);
    console.log('MCP Assistant results:', result);
    return result;
  } catch (error) {
    console.error('MCP Assistant test failed:', error);
    throw error; // propagate the error
  }
};

// Add this function to check environment variables
const checkEnvironmentVariables = () => {
  console.log('Checking environment variables availability:');
  
  // Don't log the actual values for security, just check if they exist
  const environmentVars = [
    'REACT_APP_MONGODB_URI',
    'REACT_APP_DB_NAME',
    'REACT_APP_COLLECTION_NAME',
    'REACT_APP_OPENAI_API_KEY',
    'REACT_APP_USE_DIRECT_INTEGRATION'
  ];
  
  const results = {};
  environmentVars.forEach(varName => {
    results[varName] = process.env[varName] ? 'Available ✓' : 'Missing ✗';
  });
  
  console.table(results);
  
  return Object.values(results).every(result => result === 'Available ✓');
};

// Update the runTests function to check environment variables first
const runTests = async () => {
  console.log('Starting tests...');
  
  // First check if we have all required environment variables
  const envVarsAvailable = checkEnvironmentVariables();
  
  if (!envVarsAvailable) {
    console.error('ERROR: One or more required environment variables are missing.');
    console.log('Please ensure the following variables are set in your system or .env file:');
    console.log('- REACT_APP_MONGODB_URI');
    console.log('- REACT_APP_DB_NAME'); 
    console.log('- REACT_APP_COLLECTION_NAME');
    console.log('- REACT_APP_OPENAI_API_KEY');
    console.log('- REACT_APP_USE_DIRECT_INTEGRATION');
    return;
  }
  
  try {
    await testDatabaseQuery();
    await testMcpAssistant();
    console.log('Tests completed successfully.');
  } catch (error) {
    console.error('Test suite failed:', error);
  }
};

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runTests();
}

export { testDatabaseQuery, testMcpAssistant, runTests };