// vector-search/index.js - Google Cloud Function for MongoDB vector search

const { MongoClient } = require('mongodb');

// MongoDB connection string - replace with your MongoDB Atlas connection string
const uri = process.env.MONGODB_URI;
let client = null;

/**
 * HTTP Cloud Function for vector search in MongoDB
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
exports.searchVectors = async (req, res) => {
  // Set CORS headers for browser requests
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  try {
    const { vector, limit = 5, minScore = 0.7 } = req.body;
    
    if (!vector || !Array.isArray(vector)) {
      return res.status(400).json({ 
        error: 'Invalid request: vector array is required' 
      });
    }
    
    // Initialize MongoDB client if not already connected
    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
      console.log('Connected to MongoDB Atlas');
    }
    
    const database = client.db('workers_comp'); // Replace with your database name
    const collection = database.collection('cases'); // Replace with your collection name
    
    console.log(`Searching vectors with limit: ${limit}, minScore: ${minScore}`);
    
    // Execute vector search using MongoDB Atlas Vector Search
    const documents = await collection.aggregate([
      {
        $search: {
          "vectorSearch": {
            "queryVector": vector,
            "path": "embedding", // Make sure this matches your field name
            "numCandidates": limit * 10,
            "limit": limit,
            "similarity": "cosine"
          }
        }
      },
      {
        $project: {
          "_id": 0,
          "text": 1,
          "source": 1,
          "score": { $meta: "searchScore" }
        }
      }
    ]).toArray();
    
    console.log(`Found ${documents.length} matching documents`);
    
    // Format the results to match the expected structure
    const formattedResults = documents.map(doc => ({
      document: {
        text: doc.text,
        source: doc.source || 'Workers Comp Database'
      },
      score: doc.score
    }));
    
    // Return the documents
    res.status(200).json({ documents: formattedResults });
  } catch (error) {
    console.error('Error searching vectors:', error);
    res.status(500).json({ 
      error: `Internal server error: ${error.message}`,
      documents: [] 
    });
  }
};