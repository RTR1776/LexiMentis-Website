# Run the entire PDF processing pipeline

# Set variables
$GCS_BUCKET = "your-bucket-name"  # Replace with your bucket name
$GCS_FOLDERS = @("folder1/", "folder2/", "folder3/")  # Replace with your folder paths
$MAX_PDFS = 10  # Set to $null for all PDFs
$USE_OCR = $true
$USE_BGE = $true

# Create data directory
New-Item -ItemType Directory -Force -Path "data" | Out-Null

# Print banner
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "PDF Processor for Workers Compensation Appeal Board Documents" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    python --version | Out-Null
}
catch {
    Write-Host "Error: Python is not installed" -ForegroundColor Red
    exit 1
}

# Check if required packages are installed
Write-Host "Checking required packages..." -ForegroundColor Yellow
pip install -r requirements.txt
Write-Host ""

# Process PDFs
Write-Host "Processing PDFs..." -ForegroundColor Yellow
$CMD = "python pdf_processor.py --gcs-bucket $GCS_BUCKET"

# Add folders
foreach ($folder in $GCS_FOLDERS) {
    $CMD = "$CMD --gcs-folders $folder"
}

# Add options
if ($MAX_PDFS -ne $null) {
    $CMD = "$CMD --max-pdfs $MAX_PDFS"
}

if ($USE_OCR) {
    $CMD = "$CMD --use-ocr"
}

if ($USE_BGE) {
    $CMD = "$CMD --use-bge"
}

# Run the command
Write-Host "Running: $CMD" -ForegroundColor Green
Invoke-Expression $CMD
Write-Host ""

# Run RAG example
Write-Host "Running RAG example..." -ForegroundColor Yellow
python rag_example.py
Write-Host ""

# Run MCP example
Write-Host "Running MCP example..." -ForegroundColor Yellow
python mcp_example.py
Write-Host ""

Write-Host "Pipeline completed successfully!" -ForegroundColor Green 