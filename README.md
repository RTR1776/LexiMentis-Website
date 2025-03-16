# LexiMentis

AI-powered legal platform that transforms workers' compensation practice in Kansas and Missouri using the Model Context Protocol (MCP).

## Overview

LexiMentis integrates AI technology with deep legal expertise to streamline document processing, case management, and legal research for workers' compensation cases. The platform is designed specifically for small to mid-sized law firms handling workers' compensation cases in Kansas and Missouri.

## Key Features

- **Document Analysis**: Automated extraction and analysis of legal documents
- **Medical Record Summarization**: Intelligent processing of medical records to identify key information
- **Form Automation**: Smart generation of jurisdiction-specific forms
- **Legal Research**: AI-powered research assistant for workers' compensation law
- **Case Management**: Workflow automation for managing case progression
- **Interactive Assistant**: AI assistant specialized in workers' compensation matters

## Architecture

LexiMentis is built on the Model Context Protocol (MCP) architecture, providing a modular approach to AI integration:

- **Document MCP**: Processes and analyzes legal documents
- **Knowledge MCP**: Maintains legal knowledge base and research capabilities
- **Medical MCP**: Analyzes medical records and identifies relevant information
- **Forms MCP**: Automates form completion for different jurisdictions
- **Workflow MCP**: Manages case processes and workflow automation
- **Assistant MCP**: Provides interactive assistance to legal professionals

## Technology Stack

### Backend
- Python 3.10+ with FastAPI
- Poetry for dependency management
- MongoDB for vector and document storage
- Google Cloud Storage for document storage
- Direct integration with Anthropic Claude and OpenAI APIs
- PyMuPDF for document processing

### Frontend
- React with TypeScript
- Next.js for build and routing
- Tailwind CSS for styling
- React Hook Form with Zod validation

### Infrastructure
- Google Cloud Platform (GCP)
- Docker and Docker Compose
- GitHub Actions for CI/CD

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker and Docker Compose
- GCP account with configured access

### Local Development

1. Clone the repository
```bash
git clone https://github.com/your-org/leximentis.git
cd leximentis
```

2. Start the development environment
```bash
docker-compose up -d
```

3. Access the applications
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## License

Proprietary - All Rights Reserved

## Links

- [Corporate Website](https://www.leximentis.com/)
- [Missouri Workers' Compensation](https://labor.mo.gov/DWC)
- [Kansas Workers' Compensation](https://www.dol.ks.gov/WC/home)
