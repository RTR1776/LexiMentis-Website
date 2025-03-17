"""
PDF Processor for Workers Compensation Appeal Board Documents
------------------------------------------------------------
This script processes PDF documents from Google Cloud Storage,
extracts text using PyMuPDF, and generates embeddings using BGE-L v1.5.
"""

import os
import re
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any, Iterator
from dataclasses import dataclass, asdict
import tempfile
import fitz  # PyMuPDF

# Google Cloud
from google.cloud import storage
from google.oauth2 import service_account

# Data Processing
import pandas as pd
import numpy as np

# PyTorch and BGE Embedding
import torch
from transformers import AutoTokenizer, AutoModel
from tqdm.notebook import tqdm

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class DocumentMetadata:
    """Metadata for a document extracted from PDF."""
    filename: str
    docket_number: Optional[str] = None
    appeal_number: Optional[str] = None
    case_number: Optional[str] = None
    claimant_name: Optional[str] = None
    document_title: Optional[str] = None
    document_date: Optional[str] = None
    document_type: Optional[str] = None
    
@dataclass
class ProcessedDocument:
    """Processed document with metadata and content."""
    metadata: DocumentMetadata
    full_text: str
    sections: Dict[str, str]
    embedding: Optional[List[float]] = None
    
class GCSHandler:
    """Handles interactions with Google Cloud Storage."""
    
    def __init__(self, 
                 credentials_path: Optional[str] = None,
                 bucket_name: str = None):
        """
        Initialize GCS handler.
        
        Args:
            credentials_path: Path to service account credentials JSON file
            bucket_name: Name of the GCS bucket
        """
        self.credentials_path = credentials_path
        self.bucket_name = bucket_name
        self.client = self._initialize_client()
        
    def _initialize_client(self):
        """Initialize GCS client with credentials."""
        try:
            if self.credentials_path and os.path.exists(self.credentials_path):
                credentials = service_account.Credentials.from_service_account_file(
                    self.credentials_path
                )
                return storage.Client(credentials=credentials)
            else:
                # Use default credentials (e.g., when running on GCP)
                return storage.Client()
        except Exception as e:
            logger.error(f"Failed to initialize GCS client: {e}")
            raise
    
    def list_files(self, prefix: str = "") -> List[str]:
        """
        List files in the bucket with the given prefix.
        
        Args:
            prefix: Prefix to filter files
            
        Returns:
            List of file paths
        """
        try:
            bucket = self.client.get_bucket(self.bucket_name)
            blobs = bucket.list_blobs(prefix=prefix)
            return [blob.name for blob in blobs]
        except Exception as e:
            logger.error(f"Failed to list files in bucket {self.bucket_name}: {e}")
            raise
    
    def download_file(self, 
                      gcs_path: str, 
                      local_path: str) -> str:
        """
        Download a file from GCS to local storage.
        
        Args:
            gcs_path: Path to file in GCS
            local_path: Local path to save the file
            
        Returns:
            Path to the downloaded file
        """
        try:
            os.makedirs(os.path.dirname(local_path), exist_ok=True)
            
            bucket = self.client.get_bucket(self.bucket_name)
            blob = bucket.blob(gcs_path)
            blob.download_to_filename(local_path)
            
            logger.info(f"Downloaded {gcs_path} to {local_path}")
            return local_path
        except Exception as e:
            logger.error(f"Failed to download {gcs_path}: {e}")
            raise
    
    def upload_file(self, 
                   local_path: str, 
                   gcs_path: str) -> str:
        """
        Upload a file from local storage to GCS.
        
        Args:
            local_path: Local path of the file
            gcs_path: Path to save the file in GCS
            
        Returns:
            GCS path of the uploaded file
        """
        try:
            bucket = self.client.get_bucket(self.bucket_name)
            blob = bucket.blob(gcs_path)
            blob.upload_from_filename(local_path)
            
            logger.info(f"Uploaded {local_path} to {gcs_path}")
            return gcs_path
        except Exception as e:
            logger.error(f"Failed to upload {local_path}: {e}")
            raise

class PDFExtractor:
    """Extracts text from PDF documents using PyMuPDF."""
    
    def extract_text(self, pdf_path: str) -> str:
        """
        Extract text from a PDF using PyMuPDF.
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            Extracted text
        """
        try:
            text = ""
            with fitz.open(pdf_path) as doc:
                for page in doc:
                    text += page.get_text() + "\n"
            return text
        except Exception as e:
            logger.error(f"Failed to extract text from {pdf_path}: {e}")
            return ""

class DocumentProcessor:
    """Processes extracted text to identify document structure and metadata."""
    
    def __init__(self):
        """Initialize document processor."""
        # Regex patterns for identifying document components
        self.patterns = {
            'docket_number': r'(?:^|\s)(\d{1,6}(?:\s*[A-Z]{1,2})?(?:\s*\d{2,4})?)(?:\s|$)',
            'appeal_number': r'(?:^|\s)(AP\s*\d{1,6}(?:\s*[A-Z]{1,2})?(?:\s*\d{2,4})?)(?:\s|$)',
            'case_number': r'(?:Case|No\.?|Number)[\s:]*([A-Z0-9\-]+)',
            'claimant': r'(?:Claimant|CLAIMANT)[:\s]+([A-Za-z\s\.\-\']+)(?:\n|,|$)',
            'document_title': r'(?:BEFORE|Before)[\s\n]+THE[\s\n]+WORKERS[\'\s]+COMPENSATION[\s\n]+(?:APPEAL[\s\n]+)?BOARD',
            'document_date': r'(?:Date|DATE)[:\s]+(\w+\s+\d{1,2},?\s+\d{4})',
            'section_header': r'^([A-Z][A-Z\s]+)(?:\n|:)'
        }
    
    def process_document(self, 
                         filename: str, 
                         text: str) -> ProcessedDocument:
        """
        Process document text to extract metadata and structure.
        
        Args:
            filename: Name of the PDF file
            text: Extracted text from the PDF
            
        Returns:
            Processed document with metadata and content
        """
        # Clean the text
        cleaned_text = self._clean_text(text)
        
        # Extract metadata
        metadata = self._extract_metadata(filename, cleaned_text)
        
        # Extract sections
        sections = self._extract_sections(cleaned_text)
        
        return ProcessedDocument(
            metadata=metadata,
            full_text=cleaned_text,
            sections=sections,
            embedding=None
        )
    
    def _clean_text(self, text: str) -> str:
        """
        Clean the extracted text.
        
        Args:
            text: Raw extracted text
            
        Returns:
            Cleaned text
        """
        # Remove repeated headers
        lines = text.split('\n')
        unique_lines = []
        header_pattern = re.compile(r'Page \d+ of \d+|WORKERS[\' ]COMPENSATION APPEAL BOARD')
        
        for i, line in enumerate(lines):
            # Skip repeated headers
            if header_pattern.search(line) and i > 0:
                continue
            
            # Remove excessive whitespace
            line = re.sub(r'\s+', ' ', line).strip()
            
            if line:
                unique_lines.append(line)
        
        cleaned_text = '\n'.join(unique_lines)
        
        # Remove other common artifacts
        cleaned_text = re.sub(r'(?:\r\n|\r|\n){3,}', '\n\n', cleaned_text)
        
        return cleaned_text
    
    def _extract_metadata(self, filename: str, text: str) -> DocumentMetadata:
        """Extract metadata from document text."""
        metadata = DocumentMetadata(filename=filename)
        
        try:
            # Extract docket number from filename or text
            if filename.startswith(tuple(str(i) for i in range(10))):
                docket_match = re.search(r'^(\d+)', filename)
                if docket_match:
                    metadata.docket_number = docket_match.group(1)
            else:
                docket_match = re.search(self.patterns['docket_number'], text)
                if docket_match:
                    metadata.docket_number = docket_match.group(1)
            
            # Extract appeal number from filename or text
            if filename.startswith('AP'):
                appeal_match = re.search(r'^(AP\d+)', filename)
                if appeal_match:
                    metadata.appeal_number = appeal_match.group(1)
            else:
                appeal_match = re.search(self.patterns['appeal_number'], text)
                if appeal_match:
                    metadata.appeal_number = appeal_match.group(1)
            
            # Rest of the metadata extraction with error handling
            for field, pattern in [
                ('case_number', self.patterns['case_number']),
                ('claimant_name', self.patterns['claimant']),
                ('document_title', self.patterns['document_title']),
                ('document_date', self.patterns['document_date'])
            ]:
                try:
                    match = re.search(pattern, text)
                    if match:
                        setattr(metadata, field, match.group(1).strip() if field != 'document_title' else match.group(0).strip())
                except Exception as e:
                    logger.warning(f"Failed to extract {field} from document: {e}")
            
            # Determine document type based on content
            if "DECISION" in text:
                metadata.document_type = "Decision"
            elif "OPINION" in text:
                metadata.document_type = "Opinion"
            elif "ORDER" in text:
                metadata.document_type = "Order"
            else:
                metadata.document_type = "Unknown"
            
        except Exception as e:
            logger.error(f"Error extracting metadata from {filename}: {e}")
            # Return metadata with at least the filename
        
        return metadata
    
    def _extract_sections(self, text: str) -> Dict[str, str]:
        """
        Extract sections from document text.
        
        Args:
            text: Cleaned document text
            
        Returns:
            Dictionary of section names and content
        """
        sections = {}
        
        # Find all potential section headers
        section_matches = list(re.finditer(self.patterns['section_header'], text, re.MULTILINE))
        
        if not section_matches:
            # If no sections found, treat the whole document as one section
            sections["FULL_TEXT"] = text
            return sections
        
        # Process each section
        for i, match in enumerate(section_matches):
            section_name = match.group(1).strip()
            start_pos = match.start()
            
            # Determine end position (start of next section or end of text)
            if i < len(section_matches) - 1:
                end_pos = section_matches[i + 1].start()
            else:
                end_pos = len(text)
            
            # Extract section content
            section_content = text[start_pos:end_pos].strip()
            sections[section_name] = section_content
        
        # Check if we missed the beginning of the document
        if section_matches and section_matches[0].start() > 0:
            intro_text = text[:section_matches[0].start()].strip()
            if intro_text:
                sections["INTRODUCTION"] = intro_text
        
        return sections

class BGEEmbedder:
    """Generates embeddings using BGE-L v1.5 model."""
    
    def __init__(self, 
                 model_name: str = "BAAI/bge-large-en-v1.5",
                 device: str = None):
        """
        Initialize BGE embedder.
        
        Args:
            model_name: Name of the BGE model
            device: Device to run the model on (cpu, cuda, etc.)
        """
        self.model_name = model_name
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = None
        self.model = None
        
        self._load_model()
    
    def _load_model(self):
        """Load the BGE model and tokenizer."""
        try:
            logger.info(f"Loading BGE model {self.model_name} on {self.device}")
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModel.from_pretrained(self.model_name)
            self.model.to(self.device)
            self.model.eval()
            logger.info("BGE model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load BGE model: {e}")
            raise
    
    @torch.no_grad()
    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for text.
        
        Args:
            text: Text to embed
            
        Returns:
            Embedding vector as a list of floats
        """
        # Truncate text if too long (BGE models typically have a max length of 512 tokens)
        max_length = 512
        
        # Encode the text
        encoded_input = self.tokenizer(
            text,
            padding=True,
            truncation=True,
            max_length=max_length,
            return_tensors='pt'
        ).to(self.device)
        
        # Generate embedding
        outputs = self.model(**encoded_input)
        
        # Use [CLS] token embedding as the sentence embedding
        embedding = outputs.last_hidden_state[:, 0].cpu().numpy()[0]
        
        # Normalize the embedding
        embedding = embedding / np.linalg.norm(embedding)
        
        return embedding.tolist()
    
    def embed_document(self, doc: ProcessedDocument) -> ProcessedDocument:
        """
        Generate embedding for a document.
        
        Args:
            doc: Processed document
            
        Returns:
            Document with embedding
        """
        # Combine metadata and content for embedding
        text_to_embed = f"{doc.metadata.document_title or ''}\n"
        text_to_embed += f"{doc.metadata.claimant_name or ''}\n"
        
        # Add sections to the text
        for section_name, section_content in doc.sections.items():
            # Skip very large sections or use only the beginning
            if len(section_content) > 10000:
                section_content = section_content[:10000] + "..."
            text_to_embed += f"{section_name}:\n{section_content}\n\n"
        
        # Generate embedding
        doc.embedding = self.generate_embedding(text_to_embed)
        
        return doc

class PDFProcessor:
    """Main class for processing PDFs from GCS."""
    
    def __init__(self,
                 gcs_credentials_path: Optional[str] = None,
                 gcs_bucket_name: str = None,
                 local_data_dir: str = "data",
                 use_bge: bool = True,
                 bge_model_name: str = "BAAI/bge-large-en-v1.5"):
        """
        Initialize PDF processor.
        
        Args:
            gcs_credentials_path: Path to GCS credentials JSON file
            gcs_bucket_name: Name of the GCS bucket
            local_data_dir: Directory to store downloaded and processed files
            use_bge: Whether to use BGE for embeddings
            bge_model_name: Name of the BGE model
        """
        self.local_data_dir = Path(local_data_dir)
        self.local_data_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize components
        self.gcs = GCSHandler(
            credentials_path=gcs_credentials_path,
            bucket_name=gcs_bucket_name
        )
        
        self.pdf_extractor = PDFExtractor()
        self.doc_processor = DocumentProcessor()
        
        self.use_bge = use_bge
        if use_bge:
            self.embedder = BGEEmbedder(model_name=bge_model_name)
        else:
            self.embedder = None
    
    def process_pdfs(self, 
                     gcs_folders: List[str],
                     max_pdfs: Optional[int] = None,
                     num_workers: int = 4) -> List[ProcessedDocument]:
        """
        Process PDFs from GCS folders.
        
        Args:
            gcs_folders: List of GCS folder paths
            max_pdfs: Maximum number of PDFs to process (None for all)
            num_workers: Number of worker threads
            
        Returns:
            List of processed documents
        """
        # Get list of PDF files
        pdf_files = []
        for folder in gcs_folders:
            files = self.gcs.list_files(prefix=folder)
            pdf_files.extend([f for f in files if f.lower().endswith('.pdf')])
        
        logger.info(f"Found {len(pdf_files)} PDF files")
        
        if max_pdfs:
            pdf_files = pdf_files[:max_pdfs]
            logger.info(f"Processing {len(pdf_files)} PDF files (limited by max_pdfs)")
        
        # Process PDFs in parallel
        processed_docs = []
        with ThreadPoolExecutor(max_workers=num_workers) as executor:
            futures = [executor.submit(self._process_single_pdf, pdf_file) 
                      for pdf_file in pdf_files]
            
            for future in tqdm(futures, desc="Processing PDFs"):
                try:
                    doc = future.result()
                    if doc:
                        processed_docs.append(doc)
                except Exception as e:
                    logger.error(f"Error processing PDF: {e}")
        
        logger.info(f"Successfully processed {len(processed_docs)} documents")
        return processed_docs
    
    def _process_single_pdf(self, gcs_path: str) -> Optional[ProcessedDocument]:
        """
        Process a single PDF file.
        
        Args:
            gcs_path: Path to PDF in GCS
            
        Returns:
            Processed document or None if processing failed
        """
        try:
            # Extract filename
            filename = os.path.basename(gcs_path)
            
            # Download PDF
            local_pdf_path = self.local_data_dir / "pdfs" / filename
            self.gcs.download_file(gcs_path, str(local_pdf_path))
            
            # Extract text
            text = self.pdf_extractor.extract_text(str(local_pdf_path))
            
            if not text.strip():
                logger.warning(f"No text extracted from {filename}")
                return None
            
            # Process document
            doc = self.doc_processor.process_document(filename, text)
            
            # Generate embedding if enabled
            if self.use_bge and self.embedder:
                doc = self.embedder.embed_document(doc)
            
            return doc
        
        except Exception as e:
            logger.error(f"Failed to process {gcs_path}: {e}")
            return None
    
    def save_processed_docs(self, 
                           docs: List[ProcessedDocument], 
                           output_dir: str = None) -> str:
        """
        Save processed documents to disk.
        
        Args:
            docs: List of processed documents
            output_dir: Directory to save the documents (default: local_data_dir/processed)
            
        Returns:
            Path to the output directory
        """
        if output_dir is None:
            output_dir = self.local_data_dir / "processed"
        
        os.makedirs(output_dir, exist_ok=True)
        
        # Save as JSON
        json_path = os.path.join(output_dir, "processed_docs.json")
        with open(json_path, 'w') as f:
            # Convert dataclasses to dictionaries
            docs_dict = [
                {
                    "metadata": asdict(doc.metadata),
                    "full_text": doc.full_text,
                    "sections": doc.sections,
                    "embedding": doc.embedding
                }
                for doc in docs
            ]
            json.dump(docs_dict, f, indent=2)
        
        logger.info(f"Saved {len(docs)} processed documents to {json_path}")
        
        # Save metadata as CSV for easy analysis
        csv_path = os.path.join(output_dir, "metadata.csv")
        metadata_df = pd.DataFrame([asdict(doc.metadata) for doc in docs])
        metadata_df.to_csv(csv_path, index=False)
        
        logger.info(f"Saved metadata to {csv_path}")
        
        return output_dir

    def process_gcs_bucket(
        self,
        bucket_name: str,
        folder_path: str,
        batch_size: int = 250,
        review_callback: Optional[callable] = None,
        max_documents: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Process PDFs from a Google Cloud Storage bucket in batches.
        
        Args:
            bucket_name: Name of the GCS bucket
            folder_path: Path to the folder within the bucket
            batch_size: Number of PDFs to process in each batch
            review_callback: Optional callback function for batch review
            max_documents: Maximum number of PDFs to process (None for all)
            
        Returns:
            List of processed document data
        """
        all_results = []
        client = storage.Client()
        bucket = client.get_bucket(bucket_name)
        
        # List all blobs in the specified folder and subfolders
        blobs = list(bucket.list_blobs(prefix=folder_path))
        pdf_blobs = [blob for blob in blobs if blob.name.lower().endswith('.pdf')]
        
        # Apply max_documents limit if specified
        if max_documents is not None and max_documents > 0:
            pdf_blobs = pdf_blobs[:max_documents]
            total_pdfs = len(pdf_blobs)
            print(f"Processing {total_pdfs} PDF files (limited by max_documents)")
        else:
            total_pdfs = len(pdf_blobs)
            print(f"Found {total_pdfs} PDF files in bucket '{bucket_name}' under path '{folder_path}'")
        
        # Process PDFs in batches
        for i in range(0, total_pdfs, batch_size):
            batch_blobs = pdf_blobs[i:i+batch_size]
            batch_results = self._process_gcs_batch(batch_blobs)
            all_results.extend(batch_results)
            
            print(f"Processed batch {i//batch_size + 1} ({len(batch_blobs)} files)")
            
            # Allow for review after each batch if callback is provided
            if review_callback and batch_results:
                should_continue = review_callback(batch_results)
                if not should_continue:
                    print("Processing halted after review")
                    break
        
        return all_results
    
    def _process_gcs_batch(self, blobs: List[storage.Blob]) -> List[Dict[str, Any]]:
        """
        Process a batch of PDF blobs from Google Cloud Storage.
        """
        results = []
        
        for blob in blobs:
            try:
                # Create a temporary file to store the downloaded PDF
                with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
                    temp_path = temp_file.name
                    blob.download_to_filename(temp_path)
                
                # Extract text
                text = self.pdf_extractor.extract_text(temp_path)
                
                if not text.strip():
                    logger.warning(f"No text extracted from {blob.name}")
                    continue
                
                # Process document
                filename = os.path.basename(blob.name)
                doc = self.doc_processor.process_document(filename, text)
                
                # Generate embedding if enabled
                if self.use_bge and self.embedder:
                    doc = self.embedder.embed_document(doc)
                
                # Convert to dictionary format
                doc_dict = {
                    'metadata': asdict(doc.metadata),
                    'full_text': doc.full_text,
                    'sections': doc.sections,
                    'embedding': doc.embedding,
                    'source': {
                        'bucket': blob.bucket.name,
                        'path': blob.name,
                        'size': blob.size,
                        'updated': blob.updated.isoformat() if blob.updated else None
                    }
                }
                
                results.append(doc_dict)
                
                # Clean up the temporary file
                os.unlink(temp_path)
                
            except Exception as e:
                logger.error(f"Error processing {blob.name}: {str(e)}")
                # Continue with the next file even if this one fails
        
        return results

    def process_ks_wc_appeals(
        self,
        batch_size: int = 10,
        review_callback: Optional[callable] = None,
        max_documents: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Process Kansas Workers' Compensation Appeal Decisions from the leximentis_mvp bucket.
        
        Args:
            batch_size: Number of PDFs to process in each batch (default: 10)
            review_callback: Optional callback function for batch review
            max_documents: Maximum number of PDFs to process (default: 10)
            
        Returns:
            List of processed document data
        """
        bucket_name = "leximentis_mvp"
        folder_path = "KS WC Appeal Decisions"
        
        logger.info(f"Processing {max_documents} documents from {bucket_name}/{folder_path}")
        
        return self.process_gcs_bucket(
            bucket_name=bucket_name,
            folder_path=folder_path,
            batch_size=batch_size,
            review_callback=review_callback,
            max_documents=max_documents
        )

def main():
    """Main function to run the PDF processor."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Process PDFs from Google Cloud Storage")
    parser.add_argument("--gcs-credentials", type=str, help="Path to GCS credentials JSON file")
    parser.add_argument("--gcs-bucket", type=str, required=True, help="Name of the GCS bucket")
    parser.add_argument("--gcs-folders", type=str, nargs="+", required=True, 
                        help="GCS folder paths containing PDFs")
    parser.add_argument("--local-dir", type=str, default="data", 
                        help="Local directory for downloaded and processed files")
    parser.add_argument("--max-pdfs", type=int, default=None, 
                        help="Maximum number of PDFs to process")
    parser.add_argument("--num-workers", type=int, default=4, 
                        help="Number of worker threads")
    parser.add_argument("--use-bge", action="store_true", 
                        help="Use BGE for embeddings")
    parser.add_argument("--bge-model", type=str, default="BAAI/bge-large-en-v1.5", 
                        help="BGE model name")
    
    args = parser.parse_args()
    
    # Initialize processor
    processor = PDFProcessor(
        gcs_credentials_path=args.gcs_credentials,
        gcs_bucket_name=args.gcs_bucket,
        local_data_dir=args.local_dir,
        use_bge=args.use_bge,
        bge_model_name=args.bge_model
    )
    
    # Process PDFs
    docs = processor.process_pdfs(
        gcs_folders=args.gcs_folders,
        max_pdfs=args.max_pdfs,
        num_workers=args.num_workers
    )
    
    # Save processed documents
    processor.save_processed_docs(docs)

if __name__ == "__main__":
    main() 