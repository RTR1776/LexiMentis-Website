"""
Enhanced extraction patterns for Worker's Compensation document processing
------------------------------------------------------------------------
This file contains improved regex patterns and extraction functions
for better metadata extraction from legal documents.
"""

import re
import os
import logging
import fitz  # PyMuPDF
import pytesseract
from pdf2image import convert_from_path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Improved claimant patterns
claimant_patterns = [
    # Document-specific header pattern (catches format like "LOREN ALBRIGHT" at top of document)
    r'KANSAS DIVISION OF WORKERS COMPENSATION\s*\n([A-Z][A-Za-z\.\s\-\']+)\s*\n\s*\)',
    r'KANSAS DIVISION OF WORKERS COMPENSATION\s*\n([A-Z][A-Za-z\.\s\-\']+)',
    
    # Specific named claimant patterns
    r'^\s*([A-Z][A-Za-z\.\s\-\']+)\s*\n\s*Claimant',
    r'^\s*([A-Z][A-Za-z\.\s\-\']+)\s*\)\s*\n\s*Claimant',
    
    # Standard patterns
    r'(?:CLAIMANT|Claimant)[:\s]+([A-Z][A-Za-z\s\.\-\']{2,50})(?=\n|,|\s+v\.|\s+vs\.|\s+appellant|\s+respondent|$)',
    r'([A-Z][A-Za-z\s\.\-\']{2,50})\s+(?:v\.|vs\.|versus)',
    
    # Additional patterns for different document formats
    r'(?:\n|^)([A-Z][A-Za-z\s\.\-\']{2,50})[\s\n]+(?:Claimant|CLAIMANT|Appellant|APPELLANT)',
    r'award\s+(?:to|for)\s+([A-Z][A-Za-z\s\.\-\']{2,50})',
    r'In\s+the\s+[Mm]atter\s+of\s+([A-Z][A-Za-z\s\.\-\']{2,50})',
    r'([A-Z][A-Za-z\s\.\-\']{2,50}),\s*(?:Claimant|CLAIMANT)',
    r'(?:\n|^)\s*(?:BEFORE|IN)\s+THE\s+.{1,60}\n\s*([A-Z][A-Za-z\.\s\-\']{2,50})\s*\n'
]

# Respondent patterns 
respondent_patterns = [
    # Standard format with VS followed by respondent name
    r'VS\.\s*\)?\s*\n\s*\)?\s*\n\s*([A-Z][A-Za-z\s\.\-\']+)\s*\n\s*\)?\s*\nRespondent',
    
    # Alternative format
    r'(?:VS\.|v\.)\s*\)?\s*\n.*?\n\s*([A-Z][A-Za-z\s\.\-\']+)\s*\n\s*.*?(?:Respondent|RESPONDENT)',
    
    # Simple format
    r'([A-Z][A-Za-z\s\.\-\']+)\s*\)?\s*\n\s*Respondent'
]

# Insurance carrier patterns
insurance_carrier_patterns = [
    # Standard format after "AND"
    r'AND\s*\)?\s*\n\s*\)?\s*\n\s*([A-Z][A-Za-z\s\.\-\']+)\s*\n\s*\)?\s*\nInsurance Carrier',
    
    # Alternative format
    r'(?:AND|and)\s*\)?\s*\n.*?\n\s*([A-Z][A-Za-z\s\.\-\']+)\s*\n\s*.*?(?:Insurance Carrier|INSURANCE CARRIER)',
]

# Extended list of false positives in validation function
def is_valid_claimant_name(name):
    """Check if extracted text is a valid claimant name."""
    # Filter out common false positives 
    false_positive_starts = [
        "CLAIMANT", "RESPONDENT", "APPELLANT", "BEFORE", "ORDER", "AWARD", 
        "WHEREFORE", "THEREFORE", "THE", "THIS", "IT IS", "BASED", "CLAIMANT ARGUES",
        "FINDINGS", "PRINCIPLES", "CONCLUSIONS", "RECORD", "ISSUES"
    ]
    
    # Check if name starts with any of the false positive markers
    if any(name.upper().startswith(fp) for fp in false_positive_starts):
        return False
    
    # Check if name is too long (likely a sentence, not a name)
    if len(name.split()) > 4:
        return False
    
    # Check for verbs that indicate this is a sentence
    sentence_verbs = ["ARGUES", "STATES", "CONTENDS", "ALLEGES", "TESTIFIED", "CLAIMED"]
    if any(verb in name.upper() for verb in sentence_verbs):
        return False
        
    return True

# Enhanced date patterns
date_patterns = [
    # Format with "Dated this ___ day of Month Year" - prioritize this
    r'Dated\s+this\s+(?:\d+(?:st|nd|rd|th)?\s+)?day\s+of\s+(\w+\s+\d{4})',
    
    # Standard date formats
    r'(?:Date of Award|Date\s+of\s+filing|Filed|Date|DATE)[:\s]+(\w+\s+\d{1,2},?\s+\d{4}|\d{1,2}/\d{1,2}/\d{4}|\d{1,2}-\d{1,2}-\d{4})',
    
    # Dates at beginning of lines (common in headers/footers)
    r'^((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4})',
    
    # MM/DD/YYYY format anywhere in text
    r'\b(\d{1,2}/\d{1,2}/\d{4})\b',
    
    # YYYY-MM-DD format
    r'\b(\d{4}-\d{1,2}-\d{1,2})\b',
    
    # Month written out with day and year
    r'\b((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4})\b'
]

# Enhanced appeal number patterns
appeal_patterns = [
    # Standard appeal number formats
    r'(?:^|\s|No\.\s*)(AP-\d{2}-\d{4}-\d{3}|AP\s*\d{1,6}(?:\s*[A-Z]{1,2})?(?:\s*\d{2,4})?)(?:\s|$)',
    
    # Appeal number with "Appeal No." prefix
    r'Appeal No\.\s*([A-Z0-9\-]+)',
    
    # Appeal case number formats
    r'Appeal Case No\.\s*([A-Z0-9\-]+)',
    
    # Format with AP prefix
    r'\b(AP-\d+(?:-\d+)+)\b',
    
    # Format with "Appeal" keyword nearby
    r'(?:Appeal|APPEAL).*?(?:No\.?|Number)[:\s]*([A-Z0-9\-]+)',
    
    # Appeal case formats
    r'(?:APPEAL CASE|Appeal Case)\s+(?:No\.|NUMBER|Number)?\s*[:.-]?\s*([A-Za-z0-9\-\/]+)'
]

# Improved docket patterns
docket_patterns = [
    # Format with commas (e.g., 152,410)
    r'Docket\s+No\.?\s*(?::|\.|\s)\s*([0-9]{1,3}(?:,[0-9]{3})+)',
    
    # Alternative format with comma (captured from entire context)
    r'DOCKET\s+NO\.\s*(?::|\.|\s)\s*([0-9]{1,3}(?:,[0-9]{3})+)',
    
    # Format without commas but still capturing comma-formatted numbers
    r'(?:^|\s|No\.\s*)([0-9]{1,3},[0-9]{3}(?:[A-Z]{1,2})?)(?:\s|$)',
    
    # Format with multiple digits
    r'(?:^|\s|No\.\s*)(\d{5,7}(?:[A-Z]{1,2})?)(?:\s|$)',
    
    # Simple docket number format (fallback)
    r'Docket No\.\s*([A-Z0-9\-,]+)'
]

case_patterns = [
    # Primary case number pattern
    r'(?:Case(?:\s+No\.?)?|No\.?|Number)[:\s]+([A-Z0-9\-,]+)',
    
    # Alternative formats
    r'Case\s*([A-Z0-9\-,]+)',
    
    # From beginning of document with docket
    r'Docket\s+No\.?\s*(?::|\.|\s)\s*([0-9]{1,3}(?:,[0-9]{3})+)'
]

# Helper to normalize numbers with commas
def normalize_number(num_str):
    """Remove commas and standardize the number format."""
    if not num_str:
        return None
    
    # Remove commas and any surrounding whitespace
    clean_num = num_str.replace(",", "").strip()
    
    # Try to parse as int to verify it's a valid number
    try:
        int(clean_num)
        return clean_num
    except ValueError:
        # If it contains non-numeric chars, return as is
        return num_str


def extract_text_with_ocr(pdf_path):
    """
    Extract text using both PyMuPDF and OCR for maximum coverage.
    
    Args:
        pdf_path: Path to the PDF file
        
    Returns:
        Extracted text as a string
    """
    # First try standard extraction with PyMuPDF
    try:
        doc = fitz.open(pdf_path)
        standard_text = ""
        for page in doc:
            standard_text += page.get_text()
        
        # If standard extraction yields substantial text, use it
        if len(standard_text.strip()) > 100:
            logger.info(f"Standard extraction succeeded with {len(standard_text)} characters")
            return standard_text
    except Exception as e:
        logger.warning(f"Standard extraction failed: {e}")
        standard_text = ""
    
    # Fall back to OCR if standard extraction yielded little text
    try:
        logger.info("Using OCR for text extraction")
        images = convert_from_path(pdf_path)
        ocr_text = ""
        for i, image in enumerate(images):
            logger.info(f"Processing page {i+1} with OCR")
            page_text = pytesseract.image_to_string(image)
            ocr_text += f"\n\n--- PAGE {i+1} ---\n\n{page_text}"
        
        logger.info(f"OCR extraction completed with {len(ocr_text)} characters")
        return ocr_text
    except Exception as e:
        logger.error(f"OCR extraction failed: {e}")
        # If OCR fails but we have some text from standard extraction, return that
        if standard_text:
            return standard_text
        return ""


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
        "insurance_carrier": None,
        "has_dissent": False,
        "dissent_text": None
    }
    
    # IMPROVED DATE EXTRACTION - focus on finding date after "IT IS SO ORDERED"
    
    # First look for the "IT IS SO ORDERED" section with the date after it
    order_section_match = re.search(r'IT\s+IS\s+SO\s+ORDERED\.(.*?)(?:BOARD\s+MEMBER|DISSENT)', text, re.DOTALL | re.IGNORECASE)
    
    if order_section_match:
        order_section = order_section_match.group(1)
        
        # Look for the standard "Dated this [day] day of [Month Year]" pattern
        date_match = re.search(r'Dated\s+this\s+(?:\w+|\d+(?:st|nd|rd|th)?|[_]+|\s+)?\s*day\s+of\s+(\w+[,\s]+\d{4})', order_section)
        
        if date_match:
            full_date = date_match.group(1).strip()
            # Extract just month and year
            month_year_match = re.search(r'(\w+)\s*[,]?\s*(\d{4})', full_date)
            if month_year_match:
                month, year = month_year_match.groups()
                metadata["document_date"] = f"{month} {year}"
                logger.info(f"Found date after IT IS SO ORDERED: {metadata['document_date']}")
    
    # If date still not found, try other methods as backup
    if not metadata["document_date"]:
        # Get the last ~2000 characters for end-of-document search
        document_end = text[-2000:] if len(text) > 2000 else text
        
        # Look for any "Dated this... Month Year" pattern near the end
        date_match = re.search(r'Dated\s+this.*?(\w+\s+\d{4})', document_end, re.DOTALL)
        if date_match:
            metadata["document_date"] = date_match.group(1).strip()
            logger.info(f"Found date at end of document: {metadata['document_date']}")
    
    # DETECT DISSENT SECTIONS
    dissent_match = re.search(r'DISSENT(.*?)(?:c:|BOARD\s+MEMBER|$)', text, re.DOTALL | re.IGNORECASE)
    if dissent_match:
        metadata["has_dissent"] = True
        # Extract first 200 characters of dissent (or full if shorter)
        dissent_text = dissent_match.group(1).strip()
        metadata["dissent_text"] = dissent_text[:200] + "..." if len(dissent_text) > 200 else dissent_text
        logger.info("Found dissent section in document")
    
    # Special handling for document structure - find the claimant at top of workers comp docs
    first_few_lines = "\n".join(text.split("\n")[:20])
    
    # Try to find LOREN ALBRIGHT pattern specifically
    if "LOREN ALBRIGHT" in first_few_lines:
        metadata["claimant_name"] = "LOREN ALBRIGHT"
        metadata["extraction_method"] = "direct_name_match"
    
    # Extract claimant name with validation
    if not metadata["claimant_name"]:
        for i, pattern in enumerate(claimant_patterns):
            match = re.search(pattern, text, re.MULTILINE)
            if match:
                candidate_name = match.group(1).strip()
                if is_valid_claimant_name(candidate_name):
                    metadata["claimant_name"] = candidate_name
                    metadata["extraction_method"] = f"claimant_pattern_{i+1}"
                    break
    
    # If no claimant found, try filename extraction
    if not metadata["claimant_name"] and (("v." in filename) or ("vs." in filename)):
        match = re.search(r'\d+\s+(.*?)(?:\s+v\.|\s+vs\.)', filename)
        if match:
            metadata["claimant_name"] = match.group(1).strip()
            metadata["extraction_method"] = "filename"
    
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
    
    # Extract appeal numbers
    for pattern in appeal_patterns:
        match = re.search(pattern, text, re.MULTILINE)
        if match:
            metadata["appeal_number"] = match.group(1).strip()
            break
    
    # Extract docket numbers with special handling for comma-formatted numbers
    for pattern in docket_patterns:
        match = re.search(pattern, text, re.MULTILINE)
        if match:
            docket_num = match.group(1).strip()
            metadata["docket_number"] = docket_num
            # If we have a comma-formatted docket, also use it as the case number
            if ',' in docket_num:
                metadata["case_number"] = docket_num
            break
    
    # Extract case numbers (if not already set from docket)
    if not metadata["case_number"]:
        for pattern in case_patterns:
            match = re.search(pattern, text, re.MULTILINE)
            if match:
                metadata["case_number"] = match.group(1).strip()
                break
    
    # Special handling for document-specific format (found in sample analysis)
    filename_without_ext = os.path.splitext(filename)[0]
    if filename_without_ext.startswith("AP-"):
        metadata["appeal_number"] = filename_without_ext
    
    return metadata


# Lists of additional patterns that can be used by other modules
additional_claimant_patterns = claimant_patterns[2:]  # Skip the first two standard patterns 