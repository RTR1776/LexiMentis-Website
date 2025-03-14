"""
LexiMentis MCP Assistant Service

This module implements a simple MCP Assistant service using the Anthropic Claude API.
"""

import json
import logging
from typing import Dict, List, Any

import anthropic
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from config import ANTHROPIC_API_KEY, LOG_LEVEL, DEFAULT_JURISDICTION

# Configure logging
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="LexiMentis MCP Assistant API",
    description="API for the LexiMentis MCP Assistant service",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Anthropic client
claude = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# Define request model
class AssistantRequest(BaseModel):
    messages: List[Dict[str, str]]
    jurisdiction: str = DEFAULT_JURISDICTION

# Define response model
class AssistantResponse(BaseModel):
    reply: str

@app.post("/api/mcp-assistant", response_model=AssistantResponse)
async def mcp_assistant(request: AssistantRequest) -> Dict[str, str]:
    """
    Process a request to the MCP Assistant
    
    Args:
        request: The assistant request containing messages and jurisdiction
        
    Returns:
        Dictionary with the assistant's reply
    """
    try:
        logger.info(f"Received request for jurisdiction: {request.jurisdiction}")
        
        # Prepare system prompt with jurisdiction-specific information
        system_prompt = f"""You are a workers' compensation legal assistant for {request.jurisdiction}.
You provide accurate information about workers' compensation laws, procedures, and benefits.
You should focus on providing factual information and not legal advice.
Always clarify that you are an AI assistant and not a lawyer."""
        
        # Prepare messages for Claude
        claude_messages = [{"role": "system", "content": system_prompt}]
        
        # Add user messages, filtering out system messages from the frontend
        for msg in request.messages:
            if msg["role"] != "system":
                claude_messages.append({"role": msg["role"], "content": msg["content"]})
        
        # Call Claude API
        response = claude.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=2000,
            messages=claude_messages,
        )
        
        # Extract the reply
        reply = response.content[0].text
        
        logger.info("Successfully generated response")
        return {"reply": reply}
    
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    from config import MCP_SERVER_HOST, MCP_SERVER_PORT
    
    uvicorn.run(
        "mcp_assistant:app",
        host=MCP_SERVER_HOST,
        port=MCP_SERVER_PORT,
        reload=True,
    ) 