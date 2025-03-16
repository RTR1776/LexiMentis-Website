#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Example script for using the Model Context Protocol with the processed data.
This is a simplified example to demonstrate the concept.
"""

import os
import json
import numpy as np
from typing import List, Dict, Any, Optional
from sklearn.metrics.pairwise import cosine_similarity

from pdf_processor import BGEEmbedder

class ModelContextProtocolHandler:
    """
    Handler for the Model Context Protocol.
    
    This is a simplified implementation to demonstrate the concept.
    In a real-world scenario, you would use a proper MCP implementation.
    """
    
    def __init__(self, processed_docs_path: str):
        """
        Initialize the MCP handler.
        
        Args:
            processed_docs_path: Path to the processed documents JSON file
        """
        self.embedder = BGEEmbedder()
        self.vector_store = self._load_vector_store(processed_docs_path)
        print(f"Loaded {len(self.vector_store)} documents into vector store")
    
    def _load_vector_store(self, processed_docs_path: str) -> List[Dict[str, Any]]:
        """
        Load the processed documents into a vector store.
        
        Args:
            processed_docs_path: Path to the processed documents JSON file
            
        Returns:
            List of documents with embeddings
        """
        if not os.path.exists(processed_docs_path):
            raise FileNotFoundError(f"Processed documents file not found: {processed_docs_path}")
        
        with open(processed_docs_path, 'r') as f:
            processed_docs = json.load(f)
        
        vector_store = []
        for doc in processed_docs:
            # Skip documents without embeddings
            if not doc.get("embedding"):
                continue
            
            # Add document to vector store
            vector_store.append({
                "id": doc["metadata"]["filename"],
                "metadata": doc["metadata"],
                "embedding": doc["embedding"],
                "content": doc["full_text"],
                "sections": doc["sections"]
            })
        
        return vector_store
    
    def retrieve_context(self, 
                        query: str, 
                        top_k: int = 3, 
                        max_tokens: int = 2000) -> List[Dict[str, Any]]:
        """
        Retrieve context for a query using the Model Context Protocol.
        
        Args:
            query: Query text
            top_k: Number of top results to return
            max_tokens: Maximum number of tokens to return
            
        Returns:
            List of context items in MCP format
        """
        # Generate query embedding
        query_embedding = self.embedder.generate_embedding(query)
        
        # Calculate similarities
        similarities = []
        for doc in self.vector_store:
            doc_embedding = doc["embedding"]
            similarity = cosine_similarity(
                np.array(query_embedding).reshape(1, -1),
                np.array(doc_embedding).reshape(1, -1)
            )[0][0]
            similarities.append((doc, similarity))
        
        # Sort by similarity
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        # Format as MCP context items
        context_items = []
        total_tokens = 0
        
        for doc, similarity in similarities[:top_k]:
            # Estimate tokens (rough approximation: 4 chars = 1 token)
            doc_tokens = len(doc["content"]) // 4
            
            # Check if adding this document would exceed the token limit
            if total_tokens + doc_tokens > max_tokens:
                # Truncate the content to fit within the token limit
                remaining_tokens = max_tokens - total_tokens
                truncated_content = doc["content"][:remaining_tokens * 4] + "..."
                
                context_items.append({
                    "id": doc["id"],
                    "text": truncated_content,
                    "metadata": {
                        "source": doc["metadata"]["filename"],
                        "document_type": doc["metadata"]["document_type"],
                        "claimant": doc["metadata"]["claimant_name"],
                        "docket_number": doc["metadata"]["docket_number"],
                        "appeal_number": doc["metadata"]["appeal_number"],
                        "relevance_score": similarity
                    }
                })
                
                total_tokens = max_tokens
                break
            
            # Add the full document
            context_items.append({
                "id": doc["id"],
                "text": doc["content"],
                "metadata": {
                    "source": doc["metadata"]["filename"],
                    "document_type": doc["metadata"]["document_type"],
                    "claimant": doc["metadata"]["claimant_name"],
                    "docket_number": doc["metadata"]["docket_number"],
                    "appeal_number": doc["metadata"]["appeal_number"],
                    "relevance_score": similarity
                }
            })
            
            total_tokens += doc_tokens
        
        return context_items

class MCPChatbot:
    """
    Simple chatbot using the Model Context Protocol.
    
    This is a simplified implementation to demonstrate the concept.
    In a real-world scenario, you would use a proper LLM API.
    """
    
    def __init__(self, mcp_handler: ModelContextProtocolHandler):
        """
        Initialize the chatbot.
        
        Args:
            mcp_handler: Model Context Protocol handler
        """
        self.mcp_handler = mcp_handler
    
    def chat(self, user_query: str) -> str:
        """
        Chat with the user.
        
        Args:
            user_query: User query
            
        Returns:
            Chatbot response
        """
        # Retrieve context using MCP
        context_items = self.mcp_handler.retrieve_context(user_query)
        
        # Format the context for the LLM
        formatted_context = self._format_context_for_llm(context_items)
        
        # In a real implementation, you would call an LLM API here
        # For this example, we'll just return a simulated response
        response = self._simulate_llm_response(user_query, formatted_context)
        
        return response
    
    def _format_context_for_llm(self, context_items: List[Dict[str, Any]]) -> str:
        """
        Format context items for the LLM.
        
        Args:
            context_items: Context items in MCP format
            
        Returns:
            Formatted context
        """
        formatted_context = "CONTEXT:\n\n"
        
        for i, item in enumerate(context_items):
            formatted_context += f"Document {i+1}: {item['metadata']['source']}\n"
            formatted_context += f"Type: {item['metadata']['document_type']}\n"
            if item['metadata']['claimant']:
                formatted_context += f"Claimant: {item['metadata']['claimant']}\n"
            formatted_context += f"Relevance: {item['metadata']['relevance_score']:.4f}\n\n"
            formatted_context += f"Content:\n{item['text'][:500]}...\n\n"
        
        return formatted_context
    
    def _simulate_llm_response(self, query: str, context: str) -> str:
        """
        Simulate an LLM response.
        
        In a real implementation, you would call an LLM API here.
        
        Args:
            query: User query
            context: Formatted context
            
        Returns:
            Simulated LLM response
        """
        # This is just a placeholder for demonstration purposes
        return (
            f"Based on the workers compensation appeal board documents I've reviewed, "
            f"I can provide the following information about '{query}':\n\n"
            f"The documents indicate that this is a complex legal matter involving workers "
            f"compensation claims. The appeal process typically involves reviewing evidence, "
            f"medical records, and legal precedents.\n\n"
            f"I've found several relevant documents that discuss this topic in detail. "
            f"Would you like me to elaborate on any specific aspect of your question?"
        )

def main():
    """Example of using the Model Context Protocol with a chatbot."""
    # Path to processed documents
    processed_docs_path = "data/processed/processed_docs.json"
    
    try:
        # Initialize the MCP handler
        mcp_handler = ModelContextProtocolHandler(processed_docs_path)
        
        # Initialize the chatbot
        chatbot = MCPChatbot(mcp_handler)
        
        # Example conversation
        print("Workers Compensation Appeal Board Chatbot")
        print("----------------------------------------")
        print("Type 'exit' to end the conversation.")
        print()
        
        while True:
            user_query = input("You: ")
            
            if user_query.lower() in ["exit", "quit", "bye"]:
                print("Chatbot: Goodbye!")
                break
            
            response = chatbot.chat(user_query)
            print(f"Chatbot: {response}")
            print()
    
    except FileNotFoundError:
        print(f"Error: Processed documents file not found at {processed_docs_path}")
        print("Please run the PDF processor first to generate the processed documents.")
        return

if __name__ == "__main__":
    main() 