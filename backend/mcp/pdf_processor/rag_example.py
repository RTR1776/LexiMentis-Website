#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Example script for using the processed data with a RAG system.
"""

import os
import json
import numpy as np
from typing import List, Dict, Any
from sklearn.metrics.pairwise import cosine_similarity

from pdf_processor import BGEEmbedder

class SimpleRAGSystem:
    """Simple RAG system using the processed documents."""
    
    def __init__(self, processed_docs_path: str):
        """
        Initialize the RAG system.
        
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
    
    def query(self, query_text: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Query the RAG system.
        
        Args:
            query_text: Query text
            top_k: Number of top results to return
            
        Returns:
            List of top-k results with similarity scores
        """
        # Generate query embedding
        query_embedding = self.embedder.generate_embedding(query_text)
        
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
        
        # Return top-k results
        return [
            {
                "document": doc,
                "similarity": similarity,
                "metadata": doc["metadata"],
                "content_preview": doc["content"][:200] + "..." if len(doc["content"]) > 200 else doc["content"]
            }
            for doc, similarity in similarities[:top_k]
        ]
    
    def generate_response(self, query_text: str, top_k: int = 3) -> str:
        """
        Generate a response to a query using RAG.
        
        Args:
            query_text: Query text
            top_k: Number of top results to use
            
        Returns:
            Generated response
        """
        # Query the RAG system
        results = self.query(query_text, top_k=top_k)
        
        if not results:
            return "I couldn't find any relevant information to answer your question."
        
        # Format the response
        response = f"Based on the documents I found, here's what I know about '{query_text}':\n\n"
        
        for i, result in enumerate(results):
            response += f"Document {i+1}: {result['metadata']['filename']}\n"
            response += f"Type: {result['metadata']['document_type']}\n"
            if result['metadata']['claimant_name']:
                response += f"Claimant: {result['metadata']['claimant_name']}\n"
            response += f"Relevance: {result['similarity']:.4f}\n"
            response += f"Preview: {result['content_preview']}\n\n"
        
        response += "Would you like more specific information from any of these documents?"
        
        return response

def main():
    """Example of using the RAG system."""
    # Path to processed documents
    processed_docs_path = "data/processed/processed_docs.json"
    
    # Initialize the RAG system
    try:
        rag_system = SimpleRAGSystem(processed_docs_path)
    except FileNotFoundError:
        print(f"Error: Processed documents file not found at {processed_docs_path}")
        print("Please run the PDF processor first to generate the processed documents.")
        return
    
    # Example queries
    example_queries = [
        "What are the key factors in determining workers compensation?",
        "How does the appeal process work?",
        "What is the role of medical evidence in workers compensation cases?"
    ]
    
    # Process each query
    for query in example_queries:
        print(f"\n\nQuery: {query}")
        print("-" * 80)
        
        # Generate response
        response = rag_system.generate_response(query)
        print(response)

if __name__ == "__main__":
    main() 