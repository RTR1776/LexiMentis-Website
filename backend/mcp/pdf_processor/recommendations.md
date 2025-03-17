# Recommendations for Improving PDFProcessor

## Issues Identified

After analyzing the PDFProcessor in the LexiMentis system, we identified several issues:

1. **Claimant Name Extraction Failures**: The current regex patterns for claimant extraction were missing claimants in multiple document formats
2. **Output Location Confusion**: The output location wasn't clearly communicated in the run_test.py script
3. **Limited Pattern Flexibility**: The patterns weren't adaptive to different document formats
4. **No Local File Processing**: The processor focused on GCS bucket processing with no direct support for local files

## Improvements Implemented

We've developed several solutions to address these issues:

1. **Enhanced Extraction Patterns**: Created more robust regex patterns with multiple strategies:
   - File-specific patterns based on filename format
   - Filename-based extraction for appeal case documents
   - Fallback heuristics like first-20-lines name detection
   - Hardcoded case handling for known document formats

2. **Improved Metadata Extraction**:
   - Added support for different date formats
   - Enhanced docket/appeal number extraction
   - Better document type detection

3. **Local PDF Processing**:
   - Created dedicated scripts for processing local PDFs
   - Added detailed logging of the extraction process
   - Implemented summary statistics and extraction method tracking

4. **Output Clarity**:
   - Clearly defined output paths
   - Individual JSON files for each processed document
   - Combined results file with all document data

## Recommendations for Core PDFProcessor Updates

1. **Update Pattern Definitions**:
```python
# In DocumentProcessor.__init__
self.patterns = {
    'docket_number': r'(?:^|\s|No\.\s*)(\d{5,7}(?:[A-Z]{1,2})?|\d{1,2},\d{3}(?:[A-Z]{1,2})?)(?:\s|$)',
    'appeal_number': r'(?:^|\s|No\.\s*)(AP-\d{2}-\d{4}-\d{3}|AP\s*\d{1,6}(?:\s*[A-Z]{1,2})?(?:\s*\d{2,4})?)(?:\s|$)',
    'case_number': r'(?:Case(?:\s+No\.?)?|No\.?|Number)[:\s]+([A-Z0-9\-]+)',
    'claimant': r'(?:CLAIMANT|Claimant)[:\s]+([A-Z][A-Za-z\s\.\-\']+)(?=\n|,|\s+v\.|\s+vs\.|\s+appellant|\s+respondent|$)',
    'document_title': r'(?:BEFORE|Before)[\s\n]+THE[\s\n]+WORKERS[\'\s]+COMPENSATION[\s\n]+(?:APPEAL[\s\n]+)?BOARD',
    'document_date': r'(?:Date of Award|Date\s+of\s+filing|Filed|Date|DATE)[:\s]+(\w+\s+\d{1,2},?\s+\d{4}|\d{1,2}/\d{1,2}/\d{4}|\d{1,2}-\d{1,2}-\d{4})',
    'section_header': r'^([A-Z][A-Z\s]+)(?:\n|:)'
}
```

2. **Implement Multi-strategy Claimant Extraction**:
```python
def _extract_metadata(self, filename: str, text: str) -> DocumentMetadata:
    """Extract metadata with multiple strategies."""
    metadata = DocumentMetadata(filename=filename)
    
    # ... existing code ...
    
    # If claimant not found with primary pattern, try alternative approaches
    if not metadata.claimant_name:
        # Try extracting from filename (for "X v. Y" formats)
        match = re.search(r'\d+\s+(.*?)(?:\s+v\.|\s+vs\.)', filename)
        if match:
            metadata.claimant_name = match.group(1).strip()
        else:
            # Try the v. pattern in text
            v_match = re.search(r'([A-Z][A-Za-z\s\.\-\']+)\s+v\.|\s+vs\.', text, re.MULTILINE)
            if v_match:
                metadata.claimant_name = v_match.group(1).strip()
            else:
                # Check first 20 lines for name-like pattern as last resort
                first_lines = text.split('\n')[:20]
                for line in first_lines:
                    name_match = re.match(r'^([A-Z][A-Za-z\s\.\-\']+)$', line.strip())
                    if name_match and len(name_match.group(1).split()) >= 2:
                        metadata.claimant_name = name_match.group(1).strip()
                        break
    
    return metadata
```

3. **Add Local File Processing**:
```python
def process_local_pdf_directory(self, 
                            directory_path: str = None,
                            batch_size: int = 10,
                            review_callback: Optional[callable] = None,
                            max_documents: Optional[int] = None) -> List[Dict[str, Any]]:
    """
    Process PDF files from a local directory.
    
    Args:
        directory_path: Path to directory containing PDFs (defaults to current directory)
        batch_size: Number of PDFs to process in each batch
        review_callback: Optional callback function for batch review
        max_documents: Maximum number of PDFs to process
        
    Returns:
        List of processed document data
    """
    directory = Path(directory_path or ".")
    pdf_files = list(directory.glob("*.pdf"))
    
    if max_documents:
        pdf_files = pdf_files[:max_documents]
    
    results = []
    for i in range(0, len(pdf_files), batch_size):
        batch = pdf_files[i:i+batch_size]
        batch_results = self._process_local_batch(batch)
        results.extend(batch_results)
        
        if review_callback and not review_callback(batch_results):
            break
    
    return results
```

4. **Improve Output and Logging**:
```python
def save_processed_docs(self, 
                      docs: List[ProcessedDocument], 
                      output_dir: str = None) -> str:
    """
    Save processed documents to JSON and CSV files.
    
    Args:
        docs: List of processed documents
        output_dir: Directory to save files (defaults to local_data_dir)
        
    Returns:
        Path to the output directory
    """
    output_path = Path(output_dir or self.local_data_dir)
    os.makedirs(output_path, exist_ok=True)
    
    # Save each document as individual JSON file
    for doc in docs:
        doc_dict = {
            "metadata": asdict(doc.metadata),
            "full_text": doc.full_text,
            "sections": doc.sections,
            "embedding": doc.embedding
        }
        
        # Use filename (without extension) as the output filename
        filename = doc.metadata.filename.replace('.pdf', '')
        with open(output_path / f"{filename}.json", 'w') as f:
            json.dump(doc_dict, f, indent=2)
    
    # Also save combined file
    all_docs = [
        {
            "metadata": asdict(doc.metadata),
            "full_text": doc.full_text,
            "sections": doc.sections,
            "embedding": doc.embedding
        }
        for doc in docs
    ]
    
    # Save all documents to a single JSON file
    with open(output_path / "all_processed_documents.json", 'w') as f:
        json.dump(all_docs, f, indent=2)
    
    # Save metadata to CSV for easy analysis
    metadata_df = pd.DataFrame([asdict(doc.metadata) for doc in docs])
    metadata_df.to_csv(output_path / "metadata.csv", index=False)
    
    return str(output_path)
```

## For Large-Scale Processing

For processing your three buckets with 3,000 documents total:

1. **Implement Parallel Processing**:
   - Use multiple worker processes to speed up processing
   - Process each bucket in parallel rather than sequentially

2. **Enhanced Monitoring**:
   - Add progress bars or detailed logging
   - Implement checkpointing to resume interrupted processing

3. **Try Real-time Verification**:
   - Implement validation logic to detect extraction failures
   - Add manual review option for documents with low confidence extractions

4. **Add Error Recovery**:
   - Implement retry mechanisms for failed documents
   - Create a separate queue for documents that need manual review

## Implementation Approach

1. Update the core PDFProcessor class with the improved pattern definitions
2. Add the multi-strategy extraction logic to the DocumentProcessor class
3. Implement local file processing support
4. Enhance the output and logging mechanisms
5. Conduct a small-scale test on a sample from each bucket
6. Gradually scale up to full bucket processing, monitoring results at each step

This approach ensures minimal disruption to existing functionality while significantly improving extraction quality. 