"""
PDF Processor for Workers Compensation Appeal Board Documents
------------------------------------------------------------
This package provides tools for processing PDF documents from Google Cloud Storage,
extracting key information, and generating embeddings for RAG applications.
"""

from .pdf_processor import (
    DocumentMetadata,
    ProcessedDocument,
    GCSHandler,
    PDFExtractor,
    DocumentProcessor,
    BGEEmbedder,
    PDFProcessor
)

__version__ = "0.1.0"
__author__ = "Your Name"
__email__ = "your.email@example.com" 