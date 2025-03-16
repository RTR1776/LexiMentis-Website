# PDF Processor for Workers Compensation Appeal Board Documents

This project provides a comprehensive solution for processing PDF documents from Google Cloud Storage, extracting key information, and generating embeddings for RAG (Retrieval-Augmented Generation) applications.

## Features

- **Google Cloud Storage Integration**: Download PDFs from GCS buckets
- **Multi-method PDF Extraction**: Uses PyPDF2, pdfplumber, and OCR (Tesseract) for robust text extraction
- **Intelligent Document Processing**: Extracts metadata like docket numbers, appeal numbers, claimant information, etc.
- **Section Identification**: Identifies and extracts document sections
- **BGE Embeddings**: Generates embeddings using BGE-L v1.5 for RAG applications
- **Parallel Processing**: Processes multiple PDFs in parallel for efficiency

## Requirements

- Python 3.8+
- Google Cloud Storage access
- Tesseract OCR (for scanned PDFs)
- PyTorch
- Transformers library

## Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd pdf-processor
   ```

2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

3. Install Tesseract OCR (if needed for scanned PDFs):
   - On Ubuntu/Debian:
     ```
     apt-get update && apt-get install -y tesseract-ocr poppler-utils
     ```
   - On Windows:
     Download and install from [Tesseract GitHub](https://github.com/UB-Mannheim/tesseract/wiki)
   - On macOS:
     ```
     brew install tesseract poppler
     ```

## Usage

### Command Line Interface

The PDF processor can be run from the command line:

```bash
python pdf_processor.py --gcs-bucket your-bucket-name --gcs-folders folder1/ folder2/ folder3/ --use-ocr --use-bge
```

Command line arguments:
- `--gcs-credentials`: Path to GCS credentials JSON file (optional if using default credentials)
- `--gcs-bucket`: Name of the GCS bucket (required)
- `--gcs-folders`: GCS folder paths containing PDFs (required)
- `--local-dir`: Local directory for downloaded and processed files (default: "data")
- `--max-pdfs`: Maximum number of PDFs to process (optional)
- `--num-workers`: Number of worker threads (default: 4)
- `--use-ocr`: Enable OCR for scanned PDFs
- `--use-bge`: Enable BGE for embeddings
- `--bge-model`: BGE model name (default: "BAAI/bge-large-en-v1.5")

### Jupyter Notebook

A Jupyter notebook (`pdf_processor_demo.ipynb`) is provided to demonstrate how to use the PDF processor in an interactive environment.

To run the notebook:
```bash
jupyter notebook pdf_processor_demo.ipynb
```

## Output

The PDF processor generates the following outputs:

1. **JSON File**: Contains all processed documents with metadata, full text, sections, and embeddings
2. **CSV File**: Contains metadata for all processed documents for easy analysis

## Using with RAG

The generated embeddings can be used with RAG systems:

1. Store the embeddings in a vector database (e.g., Pinecone, Weaviate, Chroma)
2. Implement a retrieval system using the embeddings
3. Integrate with a language model using the Model Context Protocol

## Customization

The PDF processor can be customized for specific needs:

- Modify the regex patterns in `DocumentProcessor` to extract different metadata
- Adjust the embedding generation in `BGEEmbedder` for different models
- Implement additional extraction methods in `PDFExtractor`

## License

[MIT License](LICENSE)

## Acknowledgements

- [BGE Models](https://github.com/FlagOpen/BAAI-Embeddings) for the embedding model
- [PyPDF2](https://github.com/py-pdf/PyPDF2) and [pdfplumber](https://github.com/jsvine/pdfplumber) for PDF extraction
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) for OCR capabilities 