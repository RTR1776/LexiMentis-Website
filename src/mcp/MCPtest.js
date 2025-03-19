// Import your MCP components
const { initializeMongo, closeMongoConnection } = require('./mongodb');
const { createMCPAssistant, handleMCPMessage } = require('./mcpAssistant');
const { generateEmbeddings } = require('./embeddings');

async function testMCP() {
  console.log("Starting MCP test...");
  
  try {
    // 1. Test MongoDB connection
    console.log("Testing MongoDB connection...");
    await initializeMongo();
    console.log("✅ MongoDB connection successful");
    
    // 2. Test embedding generation
    console.log("\nTesting embedding generation...");
    const testText = "This is a sample text for testing embeddings in our workers' compensation system.";
    const embeddings = await generateEmbeddings(testText);
    console.log(`✅ Embeddings generated: ${embeddings.length} dimensions`);
    
    // 3. Test MCP Assistant with a basic query
    console.log("\nTesting MCP Assistant...");
    const assistant = await createMCPAssistant();
    
    // Sample MCP message
    const mcpMessage = {
      role: "user",
      content: "What are the basic requirements for filing a workers' compensation claim in Kansas?",
      context: {
        // Simplified context for testing
        user: {
          name: "Test User",
          role: "Attorney"
        },
        case: {
          jurisdiction: "Kansas",
          caseType: "Workers Compensation"
        }
      }
    };
    
    console.log("Sending test message to MCP Assistant...");
    const response = await handleMCPMessage(assistant, mcpMessage);
    
    console.log("\n✅ MCP Assistant Response:");
    console.log("------------------------");
    console.log(response.content);
    console.log("------------------------");
    
    // 4. Close MongoDB connection
    await closeMongoConnection();
    console.log("\nMCP test completed successfully!");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    // Ensure we close the MongoDB connection even on error
    try {
      await closeMongoConnection();
    } catch (closeError) {
      console.error("Error closing MongoDB connection:", closeError);
    }
  }
}

// Run the test
testMCP();