from backend.mcp.pdf_processor.pdf_processor import PDFProcessor
import os
from pymongo import MongoClient
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create output directory with timestamp
from datetime import datetime
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
output_dir = f"./processed_batches_{timestamp}"
os.makedirs(output_dir, exist_ok=True)

# MongoDB connection
try:
    mongo_client = MongoClient("mongodb://localhost:27017/")  # Update with your MongoDB connection string if different
    db = mongo_client["leximentis"]
    collection = db["ks_wc_appeals"]
    logger.info("Successfully connected to MongoDB")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {str(e)}")
    raise

# Initialize the processor
processor = PDFProcessor(
    gcs_bucket_name="leximentis_mvp",
    local_data_dir=output_dir,
    use_ocr=True,  # Enable OCR for scanned PDFs
    use_bge=True   # Enable embeddings
)

# Define a review callback function (optional)
def review_batch(batch_results):
    """Display batch summary and save results to MongoDB."""
    batch_num = len(os.listdir(output_dir)) + 1
    
    logger.info(f"\n===== BATCH {batch_num}: Processed {len(batch_results)} documents =====")
    
    # Display sample of documents (first 10)
    for i, doc in enumerate(batch_results[:10], 1):
        metadata = doc.get('metadata', {})
        docket = metadata.get('docket_number', 'Unknown')
        source = doc.get('source', {}).get('path', 'Unknown')
        
        logger.info(f"{i}. Docket: {docket} - {source}")
    
    # Store documents in MongoDB
    try:
        if batch_results:
            collection.insert_many(batch_results)
            logger.info(f"Successfully stored {len(batch_results)} documents in MongoDB")
    except Exception as e:
        logger.error(f"Failed to store documents in MongoDB: {str(e)}")
    
    # Always continue with next batch
    return True

# Process Kansas WC Appeal Decisions in batches of 100
results = processor.process_ks_wc_appeals(
    batch_size=100,
    review_callback=review_batch,
    max_documents=100  # Limit to 100 documents total for testing
)

logger.info(f"Completed processing. Total documents processed: {len(results)}")

# Close MongoDB connection
mongo_client.close()