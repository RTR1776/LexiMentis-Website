import fitz  # PyMuPDF
import re
import os
import json
from pathlib import Path

# Sample regex patterns for testing
patterns = {
    'claimant': r'(?:CLAIMANT|Claimant)[:\s]+([A-Z][A-Za-z\s\.\-\']+)(?=\n|,|\s+v\.|\s+vs\.|\s+appellant|\s+respondent|$)',
    'claimant_v': r'^\s*([A-Z][A-Za-z\s\.\-\']+)\s+v\.|\s+vs\.',
    'docket_number': r'(?:^|\s|No\.\s*)(\d{5,7}(?:[A-Z]{1,2})?|\d{1,2},\d{3}(?:[A-Z]{1,2})?)(?:\s|$)',
    'appeal_number': r'(?:^|\s|No\.\s*)(AP-\d{2}-\d{4}-\d{3}|AP\s*\d{1,6}(?:\s*[A-Z]{1,2})?(?:\s*\d{2,4})?)(?:\s|$)',
    'case_number': r'(?:Case(?:\s+No\.?)?|No\.?|Number)[:\s]+([A-Z0-9\-]+)',
    'document_date': r'(?:Date of Award|Date\s+of\s+filing|Filed|Date|DATE)[:\s]+(\w+\s+\d{1,2},?\s+\d{4}|\d{1,2}/\d{1,2}/\d{4}|\d{1,2}-\d{1,2}-\d{4})'
}

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file using PyMuPDF."""
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        print(f"Error extracting text from {pdf_path}: {e}")
        return ""

def analyze_pdf(pdf_path):
    """Analyze a PDF document and extract metadata using regex patterns."""
    filename = os.path.basename(pdf_path)
    print(f"\nAnalyzing {filename}...")
    
    # Extract text from PDF
    text = extract_text_from_pdf(pdf_path)
    if not text:
        return None
    
    print(f"Extracted {len(text)} characters")
    
    # Create result dictionary
    result = {
        "filename": filename,
        "claimant_name": None,
        "docket_number": None,
        "appeal_number": None,
        "case_number": None,
        "document_date": None,
        "document_type": None,
        "extract_method": None
    }
    
    # Try standard claimant pattern
    claimant_match = re.search(patterns['claimant'], text)
    if claimant_match:
        result["claimant_name"] = claimant_match.group(1).strip()
        result["extract_method"] = "standard_pattern"
    else:
        # Try the v. pattern
        claimant_v_match = re.search(patterns['claimant_v'], text, re.MULTILINE)
        if claimant_v_match:
            result["claimant_name"] = claimant_v_match.group(1).strip()
            result["extract_method"] = "v_pattern"
        else:
            # Check first 20 lines for any name-like pattern
            first_lines = text.split('\n')[:20]
            for line in first_lines:
                name_match = re.match(r'^([A-Z][A-Za-z\s\.\-\']+)$', line.strip())
                if name_match and len(name_match.group(1).split()) >= 2:
                    result["claimant_name"] = name_match.group(1).strip()
                    result["extract_method"] = "name_pattern"
                    break
    
    # Extract other metadata
    for pattern_name, pattern in patterns.items():
        if pattern_name.startswith('claimant'):
            continue  # Already handled above
        
        match = re.search(pattern, text)
        if match:
            result[pattern_name] = match.group(1).strip()
    
    # Determine document type
    if "DECISION" in text:
        result["document_type"] = "Decision"
    elif "OPINION" in text:
        result["document_type"] = "Opinion"
    elif "ORDER" in text:
        result["document_type"] = "Order"
    else:
        result["document_type"] = "Unknown"
    
    # Print results
    print("Extraction results:")
    for key, value in result.items():
        if key != "extract_method":
            print(f"  - {key.replace('_', ' ').title()}: {value or 'NOT FOUND'}")
    
    # Additional context for debugging
    if not result["claimant_name"]:
        print("\nFirst 500 characters for debugging:")
        print(text[:500])
    
    return result

def main():
    """Analyze all PDFs in the current directory."""
    current_dir = Path(os.path.dirname(os.path.abspath(__file__)))
    pdf_files = list(current_dir.glob("*.pdf"))
    output_dir = current_dir / "processed_data"
    os.makedirs(output_dir, exist_ok=True)
    
    if not pdf_files:
        print("No PDF files found in the current directory")
        return
    
    print(f"Found {len(pdf_files)} PDF files to analyze")
    
    # Process all PDF files
    results = []
    for pdf in pdf_files:
        result = analyze_pdf(pdf)
        if result:
            results.append(result)
    
    # Save results to JSON file
    output_file = output_dir / "pdf_analysis_results.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\nResults saved to {output_file}")
    
    # Summary statistics
    claimant_found = sum(1 for r in results if r["claimant_name"])
    doc_types = {}
    for r in results:
        doc_type = r["document_type"]
        doc_types[doc_type] = doc_types.get(doc_type, 0) + 1
    
    print("\nSummary:")
    print(f"Total PDFs analyzed: {len(results)}")
    print(f"Claimants found: {claimant_found}/{len(results)} ({claimant_found/len(results)*100:.1f}%)")
    print("Document types:")
    for doc_type, count in doc_types.items():
        print(f"  - {doc_type}: {count}")

if __name__ == "__main__":
    main() 