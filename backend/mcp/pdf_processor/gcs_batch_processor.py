#!/usr/bin/env python3
"""
Script to process Kansas Workers' Compensation Appeal Decisions from Google Cloud Storage
in batches of 250 with review after each batch.
"""

import json
from pdf_processor import PDFProcessor

def review_batch(batch_results):
    """
    Review function that displays summary of the processed batch and asks user
    if they want to continue.
    
    Args:
        batch_results: List of processed document data
        
    Returns:
        bool: True to continue processing, False to stop
    """
    print(f"\n===== BATCH REVIEW: Processed {len(batch_results)} documents =====")
    
    # Display summary of each document
    for i, doc in enumerate(batch_results, 1):
        title = doc.get('title', 'Untitled')
        pages = len(doc.get('pages', []))
        source = doc.get('source', {}).get('path', 'Unknown')
        
        print(f"{i}. {title} ({pages} pages) - {source}")
    
    # Ask user if they want to continue
    response = input("\nContinue processing next batch? (y/n): ").strip().lower()
    return response == 'y' or response == 'yes'

def save_batch(batch_results, filename):
    """
    Save batch results to a JSON file.
    
    Args:
        batch_results: List of processed document data
        filename: Filename to save the data
    """
    with open(filename, 'w') as f:
        json.dump(batch_results, f, indent=2)
    print(f"Saved batch results to {filename}")

def main():
    processor = PDFProcessor()
    
    print("Starting batch processing of Kansas WC Appeal Decisions...")
    print("Files will be pulled from leximentis_mvp bucket, KS WC Appeal Decisions folder")
    print("Processing will occur in batches of 250 files with review after each batch")
    
    all_results = []
    
    def review_and_save(batch_results):
        batch_number = len(all_results) // 250 + 1
        all_results.extend(batch_results)
        save_batch(batch_results, f"batch_{batch_number}_results.json")
        return review_batch(batch_results)
    
    # Process the documents in batches of 250
    results = processor.process_ks_wc_appeals(
        batch_size=250,
        review_callback=review_and_save
    )
    
    print(f"Completed processing. Total documents processed: {len(results)}")

if __name__ == "__main__":
    main() 