from pdf_processor import PDFProcessor
import inspect

def inspect_pdf_processor():
    """Inspect the PDFProcessor class to understand its attributes and methods."""
    # Create an instance
    processor = PDFProcessor(gcs_bucket_name="leximentis_mvp", local_data_dir="processed_data")
    
    # Print all attributes
    print("PDFProcessor Attributes:")
    print("-----------------------")
    for attr in dir(processor):
        if not attr.startswith("__"):
            try:
                value = getattr(processor, attr)
                attr_type = type(value).__name__
                print(f"{attr} ({attr_type})")
            except Exception as e:
                print(f"{attr} (Error accessing: {str(e)})")
    
    # Try to access specific attributes we were using
    print("\nChecking specific attributes:")
    print("--------------------------")
    attrs_to_check = ["pdf_extractor", "_pdf_extractor", "doc_processor", "_doc_processor", 
                      "embedder", "_embedder", "use_bge", "_use_bge", 
                      "gcs_handler", "_gcs_handler", "gcs_bucket_name"]
    
    for attr in attrs_to_check:
        try:
            value = getattr(processor, attr, "Not found")
            print(f"{attr}: {value if value == 'Not found' else 'Available'}")
        except Exception as e:
            print(f"{attr}: Error - {str(e)}")

if __name__ == "__main__":
    inspect_pdf_processor() 