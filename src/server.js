import express from 'express';
import cors from 'cors';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const app = express();
app.use(cors());
app.use(express.json());

// Load secrets securely
async function loadSecrets() {
  if (process.env.NODE_ENV === 'production') {
    const client = new SecretManagerServiceClient();
    const secretName = 'projects/leximentis/secrets/MONGODB_URI/versions/latest';
    const [version] = await client.accessSecretVersion({name: secretName});
    process.env.MONGODB_URI = version.payload.data.toString();
    
    // Load other secrets
    // ...
  }
}

// Initialize API routes after secrets are loaded
async function startServer() {
  await loadSecrets();
  
  // Import routes that use the secrets
  import('./routes/vector-search.js').then(module => {
    app.use('/api/vectors', module.default);
  });
  
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Workers compensation API running on port ${PORT}`);
  });
}

startServer(); 