const fs = require('fs');

// List of variables to extract from system environment
const environmentVars = [
  'MONGODB_URI',
  'DB_NAME',
  'COLLECTION_NAME',
  'REACT_APP_DB_NAME',
  'REACT_APP_COLLECTION_NAME',
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'USE_DIRECT_INTEGRATION',
  'REACT_APP_USE_DIRECT_INTEGRATION',
  'GOOGLE_CLOUD_PROJECT',
  'GCP_PROJECT_ID',
  'GCP_LOCATION'
];

// Generate .env content
const envContent = environmentVars
  .filter(varName => process.env[varName])
  .map(varName => `${varName}=${process.env[varName]}`)
  .join('\n');

// Write to .env file
fs.writeFileSync('.env', envContent);
console.log('.env file generated successfully'); 