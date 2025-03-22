# Model Context Protocol (MCP) Implementation for LexiMentis

## Overview

This directory contains the Model Context Protocol (MCP) implementation for the LexiMentis legal platform, specializing in workers' compensation cases for Kansas and Missouri. The MCP architecture enables efficient, context-aware interactions between the frontend application and large language models.

## Components

### Core Files
- **mcpAssistant.js**: Main MCP implementation for handling context-aware conversations
- **mongodb.js**: MongoDB connection and vector database operations
- **embeddings.js**: Text embedding generation using Google Cloud Vertex AI
- **openai.js**: OpenAI API integration for LLM capabilities
- **apiService.js**: API service for handling requests and responses
- **MCPtest.js**: Test script to verify MCP functionality

## Setup Instructions

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Google Cloud Platform account with Vertex AI access
- OpenAI API key

### Environment Variables
Create a `.env` file in the project root with the following variables:

```
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@your-cluster.mongodb.net/leximentis
MONGODB_DB_NAME=leximentis
MONGODB_COLLECTION=documents
MONGODB_VECTOR_COLLECTION=vectors

# Google Cloud Configuration
GCP_PROJECT_ID=your-gcp-project-id
GCP_LOCATION=us-central1
GCP_EMBEDDING_MODEL_ID=your-bge-model-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4
```

### Installation
1. Install dependencies:
   ```
   npm install
   ```

2. Ensure MongoDB is properly configured with vector search capability.

3. Verify Vertex AI access and the embedding model deployment.

## Usage

### Testing the MCP Implementation
Run the test script to verify functionality:

```
node src/mcp/MCPtest.js
```

Successful execution will:
1. Connect to MongoDB
2. Generate embeddings using Vertex AI
3. Process a sample query using MCP
4. Return a relevant response from OpenAI

### Integration with Frontend

Import and use the MCP components in your application:

```javascript
const { createMCPAssistant, handleMCPMessage } = require('./mcp/mcpAssistant');

// Initialize assistant
const assistant = await createMCPAssistant();

// Create MCP message with context
const mcpMessage = {
  role: "user",
  content: "What are the filing deadlines for workers' compensation claims?",
  context: {
    user: { role: "Attorney", jurisdiction: "Kansas" },
    case: { caseType: "Workers Compensation", clientInjuryDate: "2023-01-15" }
  }
};

// Handle message
const response = await handleMCPMessage(assistant, mcpMessage);
```

## Architecture

LexiMentis MCP implements a modular architecture:

1. **Vector Database** (MongoDB):
   - Stores document text and vector embeddings
   - Enables semantic search for relevant legal information

2. **Embedding Generation** (Vertex AI):
   - Converts text to vector embeddings using BGE model
   - Supports efficient semantic similarity matching

3. **Context Assembly**:
   - Retrieves relevant information based on query context
   - Assembles jurisdictional legal knowledge from vector store

4. **LLM Integration** (OpenAI):
   - Generates responses with appropriate legal context
   - Ensures responses are relevant to Kansas/Missouri workers' compensation law

## Security Considerations

- All API keys and credentials should be stored securely
- Implement proper authentication for production use
- Ensure client data confidentiality with appropriate access controls
- Follow legal ethics guidelines for AI-assisted legal work

## Troubleshooting

Common issues:
- **MongoDB Connection Errors**: Verify connection string and network access
- **Embedding Generation Failures**: Check Vertex AI permissions and model availability
- **OpenAI API Errors**: Validate API key and usage limits
- **MCP Context Issues**: Examine context structure in mcpAssistant.js

## License

Copyright © 2024 LexiMentis. All Rights Reserved.
