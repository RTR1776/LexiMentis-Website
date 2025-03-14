# LexiMentis - AI Workers' Compensation Assistant

A modern React application for LexiMentis, an AI-powered workers' compensation assistant for attorneys in Kansas and Missouri.

## Features

- Interactive fractal animation landing page with Three.js
- Cost savings calculator for legal practices
- Demo AI interface for workers' compensation queries
- Booking system for consultations
- Responsive design using Tailwind CSS

## Technology Stack

- React 18
- React Router for navigation
- Three.js for WebGL graphics
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Then edit the `.env` file with your actual API keys and configuration values.
4. Start the development server:
   ```
   npm start
   ```

### Environment Variables

The application uses several environment variables for configuration. Copy the `.env.example` file to `.env` and update the values:

#### API Keys
- `ANTHROPIC_API_KEY` - Your Anthropic Claude API key
- `OPENAI_API_KEY` - Your OpenAI API key

#### Google Cloud Platform
- `GOOGLE_APPLICATION_CREDENTIALS` - Path to your GCP service account JSON file
- `GCP_PROJECT_ID` - Your Google Cloud project ID
- `GCP_STORAGE_BUCKET` - GCP storage bucket for document storage

#### MongoDB
- `MONGODB_URI` - MongoDB connection URI
- `MONGODB_DB_NAME` - MongoDB database name
- `MONGODB_USER` - MongoDB username
- `MONGODB_PASSWORD` - MongoDB password

#### Application Settings
- `NODE_ENV` - Environment (development/production)
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_GA_TRACKING_ID` - Google Analytics tracking ID
- `LOG_LEVEL` - Logging level
- `DEFAULT_JURISDICTION` - Default jurisdiction (KS/MO)

#### MCP Server Settings
- `MCP_SERVER_PORT` - Port for the MCP server
- `MCP_SERVER_HOST` - Host for the MCP server

#### Calendly Integration
- `REACT_APP_CALENDLY_URL` - Your Calendly booking URL

### Building for Production

```
npm run build
```

## Deployment

This project is configured for easy deployment on Vercel.

## Project Structure

- `/public` - Static assets
- `/src` - Application source code
  - `/components` - Reusable UI components
  - `/pages` - Page components
  - `/three` - Three.js related code and shaders
  - `/utils` - Utility functions including environment variable handling
