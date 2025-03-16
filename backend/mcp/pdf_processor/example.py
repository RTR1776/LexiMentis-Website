#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Example script for using the PDF processor.
"""

import os
from pdf_processor import PDFProcessor

def main():
    """Example of using the PDF processor."""
    # Configuration
    gcs_bucket_name = "your-bucket-name"  # Replace with your bucket name
    gcs_credentials_path = None  # Set to None if using default credentials on GCP
    
    # PDF folders in GCS
    gcs_folders = [
        "folder1/",  # Replace with your folder paths
        "folder2/",
        "folder3/"
    ]
    
    # Local data directory
    local_data_dir = "data"
    
    # Create the data directory if it doesn't exist
    os.makedirs(local_data_dir, exist_ok=True)
    
    # Initialize the PDF processor
    processor = PDFProcessor(
        gcs_credentials_path=gcs_credentials_path,
        gcs_bucket_name=gcs_bucket_name,
        local_data_dir=local_data_dir,
        use_ocr=True,  # Enable OCR for scanned PDFs
        use_bge=True,  # Enable BGE for embeddings
        bge_model_name="BAAI/bge-large-en-v1.5"  # Use BGE-L v1.5
    )
    
    # Process PDFs (limit to 10 for testing)
    max_pdfs = 10  # Set to None to process all PDFs
    num_workers = 4  # Number of parallel workers
    
    print(f"Processing PDFs from {gcs_folders} in bucket {gcs_bucket_name}")
    
    # Process PDFs
    docs = processor.process_pdfs(
        gcs_folders=gcs_folders,
        max_pdfs=max_pdfs,
        num_workers=num_workers
    )
    
    print(f"Successfully processed {len(docs)} documents")
    
    # Save processed documents
    output_dir = processor.save_processed_docs(docs)
    print(f"Saved processed documents to {output_dir}")
    
    # Print some statistics
    doc_types = {}
    for doc in docs:
        doc_type = doc.metadata.document_type
        doc_types[doc_type] = doc_types.get(doc_type, 0) + 1
    
    print("\nDocument types:")
    for doc_type, count in doc_types.items():
        print(f"  {doc_type}: {count}")

if __name__ == "__main__":
    main() 