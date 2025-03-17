from backend.mcp.pdf_processor.pdf_processor import PDFProcessor
import os
from pymongo import MongoClient
import logging
import argparse
import signal
import sys
import time
import json

# Set up command line arguments
parser = argparse.ArgumentParser(description='Process PDFs and store in MongoDB')
parser.add_argument('--batch-size', type=int, default=10, help='Number of documents per batch')
parser.add_argument('--max-documents', type=int, default=10, help='Maximum number of documents to process')
parser.add_argument('--mongodb-uri', type=str, default='mongodb://localhost:27017/', help='MongoDB connection URI')
parser.add_argument('--db-name', type=str, default='leximentis', help='MongoDB database name')
parser.add_argument('--collection', type=str, default='ks_wc_appeals', help='MongoDB collection name')
parser.add_argument('--gcs-bucket', type=str, default='leximentis_mvp', help='GCS bucket name')
parser.add_argument('--use-ocr', action='store_true', default=False, help='Use OCR for text extraction')
parser.add_argument('--use-bge', action='store_true', default=True, help='Generate BGE embeddings')
args = parser.parse_args()

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create output directory with timestamp
from datetime import datetime
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
output_dir = f"./processed_batches_{timestamp}"
os.makedirs(output_dir, exist_ok=True)

# MongoDB connection with retry logic
def connect_mongodb(uri, max_retries=3):
    """Connect to MongoDB with retry logic"""
    for attempt in range(max_retries):
        try:
            client = MongoClient(uri, serverSelectionTimeoutMS=5000)
            # Test the connection
            client.admin.command('ping')
            return client
        except Exception as e:
            logger.error(f"MongoDB connection attempt {attempt + 1} failed: {e}")
            if attempt + 1 == max_retries:
                raise
            time.sleep(2)  # Wait before retrying

# Replace the MongoDB connection code with:
try:
    # Try connecting to MongoDB
    mongo_client = connect_mongodb(args.mongodb_uri)
    db = mongo_client[args.db_name]
    collection = db[args.collection]
    logger.info(f"Successfully connected to MongoDB - {args.db_name}.{args.collection}")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {str(e)}")
    logger.info("Continuing without MongoDB storage...")
    mongo_client = None
    db = None
    collection = None

# Initialize the processor
processor = PDFProcessor(
    gcs_bucket_name=args.gcs_bucket,
    local_data_dir=output_dir,
    use_ocr=args.use_ocr,
    use_bge=args.use_bge
)

# Update the review_batch function to handle no MongoDB connection
def review_batch(batch_results):
    """Display batch summary and save results to MongoDB."""
    batch_num = len(os.listdir(output_dir)) + 1
    
    logger.info(f"\n===== BATCH {batch_num}: Processed {len(batch_results)} documents =====")
    
    # Display sample of documents
    for i, doc in enumerate(batch_results[:10], 1):
        metadata = doc.get('metadata', {})
        docket = metadata.get('docket_number', 'Unknown')
        source = doc.get('source', {}).get('path', 'Unknown')
        logger.info(f"{i}. Docket: {docket} - {source}")
    
    # Store documents in MongoDB if available
    if collection is not None:
        try:
            if batch_results:
                collection.insert_many(batch_results)
                logger.info(f"Successfully stored {len(batch_results)} documents in MongoDB")
        except Exception as e:
            logger.error(f"Failed to store documents in MongoDB: {str(e)}")
    else:
        # Save to JSON file instead
        batch_file = os.path.join(output_dir, f"batch_{batch_num}.json")
        with open(batch_file, 'w') as f:
            json.dump(batch_results, f)
        logger.info(f"Saved batch results to {batch_file} (MongoDB not available)")
    
    return True

def signal_handler(sig, frame):
    """Handle interrupt signals gracefully"""
    logger.info("\nShutting down gracefully... Please wait...")
    try:
        # Close MongoDB connection
        if 'mongo_client' in globals():
            mongo_client.close()
            logger.info("Closed MongoDB connection")
        
        # Clean up temporary files if any
        if 'output_dir' in globals() and os.path.exists(output_dir):
            logger.info(f"Temporary files remain in: {output_dir}")
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")
    
    logger.info("Shutdown complete")
    sys.exit(0)

# Register the signal handler
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

try:
    # Process Kansas WC Appeal Decisions in batches
    logger.info(f"Starting processing with batch size {args.batch_size}, max documents {args.max_documents}")
    logger.info("Press Ctrl+C to stop processing")
    
    results = processor.process_ks_wc_appeals(
        batch_size=args.batch_size,
        review_callback=review_batch,
        max_documents=args.max_documents
    )

    logger.info(f"Completed processing. Total documents processed: {len(results)}")

except KeyboardInterrupt:
    logger.info("\nProcess interrupted by user")
    signal_handler(signal.SIGINT, None)
except Exception as e:
    logger.error(f"Error during processing: {e}")
    signal_handler(signal.SIGINT, None)
finally:
    # Close MongoDB connection
    if 'mongo_client' in globals():
        mongo_client.close()