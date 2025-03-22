export default async function handler(req, res) {
  const { path } = req.query;
  const apiUrl = `https://your-backend-api-url.com/${path.join('/')}`;
  
  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers needed
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' 
        ? JSON.stringify(req.body) 
        : undefined,
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
} 