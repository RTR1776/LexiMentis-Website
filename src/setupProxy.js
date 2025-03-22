const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.leximentis.com',
      changeOrigin: true,
    })
  );
  
  // If you have a separate MCP service
  app.use(
    '/mcp-api',
    createProxyMiddleware({
      target: 'https://api.leximentis.com',
      changeOrigin: true,
      pathRewrite: {
        '^/mcp-api': '/api', 
      },
    })
  );
}; 