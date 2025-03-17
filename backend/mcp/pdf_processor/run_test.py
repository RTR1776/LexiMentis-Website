from pdf_processor import PDFProcessor

def review_batch(batch_results):
    """Simple callback to review each batch of processed documents"""
    print(f"\n=== Processed {len(batch_results)} documents ===")
    for doc in batch_results:
        metadata = doc['metadata']
        print(f"- {metadata['filename']}: {metadata['document_type']} ({metadata['claimant_name'] or 'No claimant found'})")
    return True

# Initialize the processor
processor = PDFProcessor(
    gcs_bucket_name="leximentis_mvp",
    local_data_dir="processed_data",
    use_bge=True  # Set to False if you want to skip embeddings for initial test
)

# Process 10 documents
results = processor.process_ks_wc_appeals(
    batch_size=10,
    max_documents=10,
    review_callback=review_batch
)

print(f"\nProcessing complete. Total documents processed: {len(results)}")