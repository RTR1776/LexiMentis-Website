"""
Direct GCS Processor for Workers' Compensation Documents
--------------------------------------------------------
This script directly interfaces with Google Cloud Storage without 
relying on the PDFProcessor's GCS handler.
"""

import os
import re
import json
import logging
import tempfile
from pathlib import Path
from datetime import datetime
from google.cloud import storage
from pdf_processor import PDFProcessor
from dataclasses import asdict

# Keep the improved regex patterns and extraction functions

class DirectGCSProcessor:
    """Process PDF files directly from Google Cloud Storage."""
    
    def __init__(self, 
                 bucket_name="leximentis_mvp",
                 local_data_dir="processed_data/gcs_direct", 
                 use_bge=True):
        """Initialize processor with direct GCS access."""
        self.bucket_name = bucket_name
        self.local_data_dir = Path(local_data_dir)
        os.makedirs(self.local_data_dir, exist_ok=True)
        
        # Initialize standard processor for PDF extraction and embeddings
        self.processor = PDFProcessor(
            gcs_bucket_name=bucket_name,
            local_data_dir=str(self.local_data_dir),
            use_bge=use_bge
        )
        
        # Initialize direct GCS client
        self.storage_client = storage.Client()
        self.bucket = self.storage_client.bucket(bucket_name)
    
    def process_folder(self, folder_path, max_documents=100, batch_size=10):
        """Process PDF files from the specified GCS folder path."""
        # List blobs in folder
        blobs = list(self.bucket.list_blobs(prefix=folder_path))
        pdf_files = [blob.name for blob in blobs if blob.name.lower().endswith('.pdf')]
        
        if max_documents and max_documents < len(pdf_files):
            logging.info(f"Limiting to {max_documents} documents from {len(pdf_files)} available")
            pdf_files = pdf_files[:max_documents]
        
        logging.info(f"Found {len(pdf_files)} PDF files to process")
        
        # Process in batches
        results = []
        for i in range(0, len(pdf_files), batch_size):
            batch = pdf_files[i:i+batch_size]
            logging.info(f"Processing batch {i//batch_size + 1}/{(len(pdf_files)-1)//batch_size + 1}")
            batch_results = self._process_batch(batch)
            results.extend(batch_results)
        
        # Save all results
        self._save_results(results)
        
        return results
    
    def _process_batch(self, pdf_files):
        """Process a batch of PDF files."""
        results = []
        for pdf_path in pdf_files:
            filename = os.path.basename(pdf_path)
            logging.info(f"Processing {filename}...")
            
            try:
                # Create temp file for PDF
                with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
                    temp_path = temp_file.name
                
                # Download blob to temp file
                blob = self.bucket.blob(pdf_path)
                blob.download_to_filename(temp_path)
                
                # Extract text
                text = self.processor.pdf_extractor.extract_text(temp_path)
                logging.info(f"  - Extracted {len(text)} characters")
                
                # Process document
                processed_doc = self.processor.doc_processor.process_document(filename, text)
                
                # Apply improved extraction
                claimant_name, method = extract_claimant_with_improved_patterns(filename, text)
                if claimant_name:
                    processed_doc.metadata.claimant_name = claimant_name
                    logging.info(f"  - Claimant found: {claimant_name} (method: {method})")
                else:
                    logging.warning(f"  - No claimant found for {filename}")
                
                # Generate embeddings
                if self.processor.use_bge:
                    logging.info(f"  - Generating embeddings...")
                    processed_doc = self.processor.embedder.embed_document(processed_doc)
                
                # Convert to dictionary
                doc_dict = {
                    "metadata": asdict(processed_doc.metadata),
                    "full_text": processed_doc.full_text,
                    "sections": processed_doc.sections,
                    "embedding": processed_doc.embedding,
                    "extraction_method": method,
                    "source": f"gs://{self.bucket_name}/{pdf_path}"
                }
                
                # Save individual file
                output_file = self.local_data_dir / f"{filename.replace('.pdf', '')}.json"
                with open(output_file, 'w') as f:
                    json.dump(doc_dict, f, indent=2)
                
                results.append(doc_dict)
                
                # Clean up temp file
                os.unlink(temp_path)
                
            except Exception as e:
                logging.error(f"Error processing {filename}: {str(e)}")
        
        return results
    
    def _save_results(self, results):
        """Save all results to files."""
        if not results:
            return
        
        # Save combined results
        all_results_file = self.local_data_dir / "all_processed_documents.json"
        with open(all_results_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        # Generate metrics
        total = len(results)
        metrics = {
            "claimant_name": sum(1 for r in results if r["metadata"]["claimant_name"]),
            "docket_number": sum(1 for r in results if r["metadata"]["docket_number"]),
            "appeal_number": sum(1 for r in results if r["metadata"]["appeal_number"]),
            "case_number": sum(1 for r in results if r["metadata"]["case_number"]),
            "document_date": sum(1 for r in results if r["metadata"]["document_date"]),
            "document_type": sum(1 for r in results if r["metadata"]["document_type"])
        }
        
        # Save metrics
        metrics_file = self.local_data_dir / "extraction_metrics.json"
        with open(metrics_file, 'w') as f:
            json.dump({
                "total_documents": total,
                "metrics": metrics,
                "timestamp": datetime.now().isoformat()
            }, f, indent=2)
        
        logging.info(f"All results saved to {all_results_file}")
        logging.info("\nExtraction metrics:")
        for field, count in metrics.items():
            logging.info(f"  - {field}: {count}/{total} ({count/total*100:.1f}%)")

def main():
    """Process documents from the specified GCS bucket and folder."""
    processor = DirectGCSProcessor(
        bucket_name="leximentis_mvp",
        local_data_dir="processed_data/gcs_direct",
        use_bge=True
    )
    
    # Target the specific folder with appeal decisions
    target_folder = "KS WC Appeal Decisions/ks-work-comp-appeals-v1"
    
    results = processor.process_folder(
        folder_path=target_folder,
        max_documents=100,
        batch_size=10
    )
    
    print(f"Processing complete. {len(results)} documents processed.")

if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    main() 