#!/bin/bash

# Run the entire PDF processing pipeline

# Set variables
GCS_BUCKET="your-bucket-name"  # Replace with your bucket name
GCS_FOLDERS=("folder1/" "folder2/" "folder3/")  # Replace with your folder paths
MAX_PDFS=10  # Set to empty for all PDFs
USE_OCR=true
USE_BGE=true

# Create data directory
mkdir -p data

# Print banner
echo "=========================================================="
echo "PDF Processor for Workers Compensation Appeal Board Documents"
echo "=========================================================="
echo

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "Error: Python is not installed"
    exit 1
fi

# Check if required packages are installed
echo "Checking required packages..."
pip install -r requirements.txt
echo

# Process PDFs
echo "Processing PDFs..."
CMD="python pdf_processor.py --gcs-bucket $GCS_BUCKET"

# Add folders
for folder in "${GCS_FOLDERS[@]}"; do
    CMD="$CMD --gcs-folders $folder"
done

# Add options
if [ ! -z "$MAX_PDFS" ]; then
    CMD="$CMD --max-pdfs $MAX_PDFS"
fi

if [ "$USE_OCR" = true ]; then
    CMD="$CMD --use-ocr"
fi

if [ "$USE_BGE" = true ]; then
    CMD="$CMD --use-bge"
fi

# Run the command
echo "Running: $CMD"
eval $CMD
echo

# Run RAG example
echo "Running RAG example..."
python rag_example.py
echo

# Run MCP example
echo "Running MCP example..."
python mcp_example.py
echo

echo "Pipeline completed successfully!" 