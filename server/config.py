"""
LexiMentis Configuration Module

This module loads environment variables for the LexiMentis backend services.
"""

import os
from typing import Optional, Dict, Any
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_env(key: str, default: Optional[str] = None, required: bool = False) -> Optional[str]:
    """
    Get an environment variable with validation
    
    Args:
        key: The environment variable key
        default: Optional default value if not found
        required: Whether the variable is required
        
    Returns:
        The environment variable value or default
        
    Raises:
        ValueError: If the variable is required but not set
    """
    value = os.getenv(key, default)
    
    if required and value is None:
        raise ValueError(f"Required environment variable {key} is not set")
        
    return value

# API Keys
ANTHROPIC_API_KEY = get_env("ANTHROPIC_API_KEY", required=True)
OPENAI_API_KEY = get_env("OPENAI_API_KEY", required=True)

# Google Cloud Platform
GCP_CREDENTIALS_PATH = get_env("GOOGLE_APPLICATION_CREDENTIALS", required=True)
GCP_PROJECT_ID = get_env("GCP_PROJECT_ID", required=True)
GCP_STORAGE_BUCKET = get_env("GCP_STORAGE_BUCKET", required=True)

# MongoDB
MONGODB_URI = get_env("MONGODB_URI", required=True)
MONGODB_DB_NAME = get_env("MONGODB_DB_NAME", "leximentis")
MONGODB_USER = get_env("MONGODB_USER")
MONGODB_PASSWORD = get_env("MONGODB_PASSWORD")

# Application Settings
ENV = get_env("NODE_ENV", "development")
LOG_LEVEL = get_env("LOG_LEVEL", "info")
DEFAULT_JURISDICTION = get_env("DEFAULT_JURISDICTION", "KS")

# MCP Server Settings
MCP_SERVER_PORT = int(get_env("MCP_SERVER_PORT", "3001"))
MCP_SERVER_HOST = get_env("MCP_SERVER_HOST", "localhost")

def is_development() -> bool:
    """Check if we're in development mode"""
    return ENV.lower() == "development"

def is_production() -> bool:
    """Check if we're in production mode"""
    return ENV.lower() == "production"

def get_mongodb_connection_options() -> Dict[str, Any]:
    """
    Get MongoDB connection options
    
    Returns:
        Dictionary of MongoDB connection options
    """
    return {
        "host": MONGODB_URI,
        "username": MONGODB_USER,
        "password": MONGODB_PASSWORD,
        "authSource": "admin",
        "retryWrites": True,
        "w": "majority"
    }

def get_gcp_config() -> Dict[str, str]:
    """
    Get Google Cloud Platform configuration
    
    Returns:
        Dictionary of GCP configuration
    """
    return {
        "credentials_path": GCP_CREDENTIALS_PATH,
        "project_id": GCP_PROJECT_ID,
        "storage_bucket": GCP_STORAGE_BUCKET
    } 
