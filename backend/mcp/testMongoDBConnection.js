// MongoDB connection test utility
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { getEmbedding } from './openai.js';

dotenv.config();

const testMongoDBConnection = async () => {
  console.log('Testing MongoDB Connection...');
  
  try {
    // Use multiple fallback options for maximum compatibility
    const MONGODB_URI = process.env.MONGODB_URI || 
                        process.env.REACT_APP_MONGODB_URI;
    const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 
                            process.env.DB_NAME || 
                            process.env.REACT_APP_DB_NAME;
    const COLLECTION_NAME = process.env.MONGODB_COLLECTION || 
                           process.env.COLLECTION_NAME || 
                           process.env.REACT_APP_COLLECTION_NAME;
    
    // Check for required environment variables
    if (!MONGODB_URI) {
      console.error('MongoDB URI is not defined. Please check your environment variables.');
      return false;
    }
    
    if (!MONGODB_DB_NAME) {
      console.error('MongoDB database name is not defined. Please check your environment variables.');
      return false;
    }

    console.log('Environment variables found:');
    console.log('- MONGODB_URI:', MONGODB_URI.substring(0, 20) + '...');
    console.log('- MONGODB_DB_NAME:', MONGODB_DB_NAME);
    
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    await client.connect();
    console.log('Successfully connected to MongoDB Atlas');
    
    // Get database and list collections
    const db = client.db(MONGODB_DB_NAME);
    const collections = await db.listCollections().toArray();
    
    console.log(`Collections in database: ${collections.map(c => c.name).join(', ')}`);
    
    // Test vector capabilities by inserting and querying a test document
    const testCollection = 'connection_test';
    
    // Create test collection if it doesn't exist
    if (!collections.some(c => c.name === testCollection)) {
      console.log(`Creating test collection: ${testCollection}`);
      await db.createCollection(testCollection);
    }
    
    // Generate a test embedding
    const testText = "Kansas workers compensation test document";
    console.log('Generating test embedding...');
    const embedding = await getEmbedding(testText);
    console.log(`Generated embedding with ${embedding.length} dimensions`);
    
    // Insert test document
    const testDoc = {
      text: testText,
      embedding: embedding,
      metadata: { test: true },
      createdAt: new Date()
    };
    
    await db.collection(testCollection).insertOne(testDoc);
    console.log('Test document inserted successfully');
    
    // Create vector index
    try {
      await db.collection(testCollection).createIndex(
        { embedding: "vector" },
        { 
          name: "vector_index",
          vectorDimension: embedding.length 
        }
      );
      console.log('Vector index created successfully');
    } catch (indexError) {
      console.warn('Warning during index creation:', indexError.message);
      // Index might already exist
    }
    
    // Test vector search
    console.log('Testing vector search...');
    try {
      const searchResults = await db.collection(testCollection)
        .aggregate([
          {
            $vectorSearch: {
              index: "vector_index",
              path: "embedding",
              queryVector: embedding,
              numCandidates: 10,
              limit: 5
            }
          }
        ])
        .toArray();
      
      console.log(`Vector search returned ${searchResults.length} results`);
      console.log('Vector search functionality confirmed');
    } catch (searchError) {
      console.error('Vector search failed:', searchError);
      console.log('MongoDB connection succeeded but vector search functionality failed');
    }
    
    // Clean up
    await db.collection(testCollection).deleteMany({ metadata: { test: true } });
    console.log('Test documents cleaned up');
    
    await client.close();
    console.log('MongoDB connection test completed successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return false;
  }
};

// Run the test
testMongoDBConnection()
  .then(success => {
    console.log(`MongoDB connection test ${success ? 'passed' : 'failed'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error during MongoDB test:', error);
    process.exit(1);
  }); 