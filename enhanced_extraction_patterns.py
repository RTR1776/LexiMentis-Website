# Add respondent and insurance carrier patterns
respondent_patterns = [
    # Pattern for standard format with "Respondent" label
    r'VS\.\s*\)?\s*\n\s*\)?\s*\n\s*([A-Z][A-Za-z\s\.\-\']+)\s*\n\s*\)?\s*\nRespondent',
    
    # Alternative pattern for different document structures
    r'(?:VS\.|v\.)\s*\)?\s*\n.*?\n\s*([A-Z][A-Za-z\s\.\-\']+)\s*\n\s*.*?(?:Respondent|RESPONDENT)',
    
    # Fallback pattern
    r'([A-Z][A-Za-z\s\.\-\']+)\s*\)?\s*\n\s*Respondent'
]

insurance_carrier_patterns = [
    # Pattern for standard format with "Insurance Carrier" label
    r'AND\s*\)?\s*\n\s*\)?\s*\n\s*([A-Z][A-Za-z\s\.\-\']+)\s*\n\s*\)?\s*\nInsurance Carrier',
    
    # Alternative pattern
    r'(?:AND|and)\s*\)?\s*\n.*?\n\s*([A-Z][A-Za-z\s\.\-\']+)\s*\n\s*.*?(?:Insurance Carrier|INSURANCE CARRIER)',
]

# Update the date patterns to better handle the "Dated this" format
date_patterns = [
    # Format with "Dated this ___ day of Month Year" - prioritize this
    r'Dated\s+this\s+(?:\d+(?:st|nd|rd|th)?\s+)?day\s+of\s+(\w+\s+\d{4})',
    
    # Other date formats remain as backup
    r'(?:Date of Award|Date\s+of\s+filing|Filed|Date|DATE)[:\s]+(\w+\s+\d{1,2},?\s+\d{4}|\d{1,2}/\d{1,2}/\d{4}|\d{1,2}-\d{1,2}-\d{4})',
    r'^((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4})',
    r'\b(\d{1,2}/\d{1,2}/\d{4})\b',
    r'\b(\d{4}-\d{1,2}-\d{1,2})\b',
    r'\b((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4})\b'
]

# Update the extract_metadata_with_patterns function
def extract_metadata_with_patterns(filename, text):
    """
    Extract metadata using enhanced pattern matching.
    
    Args:
        filename: Name of the PDF file
        text: Extracted text from the PDF
        
    Returns:
        Dictionary with extracted metadata
    """
    metadata = {
        "claimant_name": None,
        "extraction_method": None,
        "docket_number": None,
        "appeal_number": None,
        "case_number": None,
        "document_date": None,
        "respondent": None,
        "insurance_carrier": None
    }
    
    # Extract claimant name (existing code)
    # ...
    
    # Extract respondent
    for pattern in respondent_patterns:
        match = re.search(pattern, text, re.MULTILINE)
        if match:
            metadata["respondent"] = match.group(1).strip()
            break
    
    # Extract insurance carrier (may not exist in all documents)
    for pattern in insurance_carrier_patterns:
        match = re.search(pattern, text, re.MULTILINE)
        if match:
            metadata["insurance_carrier"] = match.group(1).strip()
            break
    
    # Extract dates with priority to "Dated this" format
    for i, pattern in enumerate(date_patterns):
        match = re.search(pattern, text, re.MULTILINE)
        if match:
            date_text = match.group(1).strip()
            # For "Month Year" format, use as is
            if re.match(r'\w+\s+\d{4}$', date_text):
                metadata["document_date"] = date_text
            # For other formats, try to extract just month and year
            else:
                try:
                    # Try to parse and format as Month Year
                    date_parts = re.findall(r'([A-Za-z]+)\s+\d{1,2}?,?\s+(\d{4})', date_text)
                    if date_parts:
                        month, year = date_parts[0]
                        metadata["document_date"] = f"{month} {year}"
                    else:
                        metadata["document_date"] = date_text
                except:
                    # If parsing fails, use the original text
                    metadata["document_date"] = date_text
            break
    
    # Rest of existing extraction code...
    # ...
    
    return metadata 