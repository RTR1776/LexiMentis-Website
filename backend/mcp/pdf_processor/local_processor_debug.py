"""
OCR-enhanced local PDF processor for improved extraction.
This script processes local PDF files with OCR capabilities and enhanced metadata extraction,
including support for multiple claimants, respondents, and carriers.
"""

import os
import re
import json
import logging
from datetime import datetime
from enhanced_extraction_patterns import extract_text_with_ocr, extract_metadata_with_patterns

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class LocalPDFProcessorWithOCR:
    """Process local PDF files with OCR and enhanced extraction patterns."""
    
    def __init__(self, output_dir="processed_data/ocr_extraction"):
        """Initialize processor with output directories."""
        self.output_dir = output_dir
        self.debug_dir = os.path.join(output_dir, "debug")
        
        # Create output directories if they don't exist
        os.makedirs(self.output_dir, exist_ok=True)
        os.makedirs(self.debug_dir, exist_ok=True)
        
        # Initialize counters for validation report
        self.success_counts = {
            "claimant_name": 0,
            "claimants": 0,  # New multi-entity field
            "docket_number": 0,
            "appeal_number": 0,
            "case_number": 0,
            "document_date": 0,
            "respondent": 0,
            "respondents": 0,  # New multi-entity field
            "insurance_carrier": 0,
            "insurance_carriers": 0,  # New multi-entity field
            "has_dissent": 0
        }
        self.extraction_methods = {}
        self.files_processed = 0
        self.detailed_results = []
    
    def process_local_files(self):
        """Process all PDF files in the current directory."""
        # Get all PDF files in the current directory
        pdf_files = [f for f in os.listdir() if f.lower().endswith('.pdf')]
        logger.info(f"Found {len(pdf_files)} PDF files to process")
        
        all_documents = []
        
        for pdf_file in pdf_files:
            logger.info(f"Processing {pdf_file}")
            self.files_processed += 1
            
            # Extract text using OCR if needed
            try:
                extracted_text = extract_text_with_ocr(pdf_file)
                
                # Save raw text for debugging
                with open(os.path.join(self.debug_dir, f"{os.path.splitext(pdf_file)[0]}_text.txt"), 'w', encoding='utf-8') as f:
                    f.write(extracted_text)
                
                # Extract metadata using enhanced patterns
                metadata = extract_metadata_with_patterns(pdf_file, extracted_text)
                
                # Create debug information for extraction attempts
                debug_info = self._create_debug_info(pdf_file, extracted_text, metadata)
                
                # Save debug information
                with open(os.path.join(self.debug_dir, f"{os.path.splitext(pdf_file)[0]}_debug.json"), 'w', encoding='utf-8') as f:
                    json.dump(debug_info, f, indent=2)
                
                # Create document record with metadata
                document = {
                    "metadata": {
                        "filename": pdf_file,
                        "docket_number": metadata.get("docket_number"),
                        "appeal_number": metadata.get("appeal_number"),
                        "case_number": metadata.get("case_number"),
                        "claimant_name": metadata.get("claimant_name"),
                        "claimants": metadata.get("claimants", []),  # Add multi-claimant field
                        "document_title": None,
                        "document_date": metadata.get("document_date"),
                        "document_type": "Order",
                        "respondent": metadata.get("respondent"),
                        "respondents": metadata.get("respondents", []),  # Add multi-respondent field
                        "insurance_carrier": metadata.get("insurance_carrier"),
                        "insurance_carriers": metadata.get("insurance_carriers", []),  # Add multi-carrier field
                        "has_dissent": metadata.get("has_dissent", False),
                        "dissent_text": metadata.get("dissent_text")
                    },
                    "full_text": extracted_text,
                    "sections": self._extract_sections(extracted_text),
                    "embedding": [0.001] * 768  # Placeholder embedding
                }
                
                if metadata.get("extraction_method"):
                    document["extraction_method"] = metadata["extraction_method"]
                
                # Save individual document
                with open(os.path.join(self.output_dir, f"{os.path.splitext(pdf_file)[0]}.json"), 'w', encoding='utf-8') as f:
                    json.dump(document, f, indent=2)
                
                all_documents.append(document)
                
                # Update success counts for validation report
                result_detail = {
                    "filename": pdf_file,
                    "claimant_found": metadata.get("claimant_name") is not None,
                    "extraction_method": metadata.get("extraction_method"),
                    "fields_found": {
                        "docket_number": metadata.get("docket_number") is not None,
                        "appeal_number": metadata.get("appeal_number") is not None,
                        "case_number": metadata.get("case_number") is not None,
                        "document_date": metadata.get("document_date") is not None,
                        "respondent": metadata.get("respondent") is not None,
                        "respondents": len(metadata.get("respondents", [])) > 0,  # Track multi-entity success
                        "insurance_carrier": metadata.get("insurance_carrier") is not None,
                        "insurance_carriers": len(metadata.get("insurance_carriers", [])) > 0,  # Track multi-entity success
                        "has_dissent": metadata.get("has_dissent") is not None,
                        "multi_entity_found": {
                            "claimants_count": len(metadata.get("claimants", [])),
                            "respondents_count": len(metadata.get("respondents", [])),
                            "carriers_count": len(metadata.get("insurance_carriers", []))
                        }
                    }
                }
                self.detailed_results.append(result_detail)
                
                # Update success counts
                if metadata.get("claimant_name"):
                    self.success_counts["claimant_name"] += 1
                if metadata.get("claimants") and len(metadata.get("claimants", [])) > 0:
                    self.success_counts["claimants"] += 1
                if metadata.get("docket_number"):
                    self.success_counts["docket_number"] += 1
                if metadata.get("appeal_number"):
                    self.success_counts["appeal_number"] += 1
                if metadata.get("case_number"):
                    self.success_counts["case_number"] += 1
                if metadata.get("document_date"):
                    self.success_counts["document_date"] += 1
                if metadata.get("respondent"):
                    self.success_counts["respondent"] += 1
                if metadata.get("respondents") and len(metadata.get("respondents", [])) > 0:
                    self.success_counts["respondents"] += 1
                if metadata.get("insurance_carrier"):
                    self.success_counts["insurance_carrier"] += 1
                if metadata.get("insurance_carriers") and len(metadata.get("insurance_carriers", [])) > 0:
                    self.success_counts["insurance_carriers"] += 1
                if metadata.get("has_dissent"):
                    self.success_counts["has_dissent"] += 1
                
                # Track extraction methods
                if metadata.get("extraction_method"):
                    method = metadata["extraction_method"]
                    if method in self.extraction_methods:
                        self.extraction_methods[method] += 1
                    else:
                        self.extraction_methods[method] = 1
                
                logger.info(f"Successfully processed {pdf_file}")
            
            except Exception as e:
                logger.error(f"Error processing {pdf_file}: {e}")
        
        # Save combined documents
        with open(os.path.join(self.output_dir, "all_processed_documents_ocr.json"), 'w', encoding='utf-8') as f:
            json.dump(all_documents, f, indent=2)
        
        # Generate validation report
        self._generate_validation_report()
        
        return all_documents
    
    def _create_debug_info(self, filename, text, metadata):
        """Create debug information for extraction attempts."""
        # Import patterns from enhanced_extraction_patterns for debugging
        from enhanced_extraction_patterns import (
            claimant_patterns, date_patterns, appeal_patterns, 
            docket_patterns, case_patterns, respondent_patterns,
            insurance_carrier_patterns, extract_header_entities
        )
        
        # First get header entities directly
        header_entities = extract_header_entities(text)
        
        debug_info = {
            "filename": filename,
            "text_length": len(text),
            "header_extraction": {
                "claimants": header_entities["claimants"],
                "respondents": header_entities["respondents"],
                "carriers": header_entities["carriers"]
            },
            "extraction_attempts": {
                "claimant_patterns": [],
                "date_patterns": [],
                "appeal_patterns": [],
                "docket_patterns": [],
                "case_patterns": [],
                "respondent_patterns": [],
                "insurance_carrier_patterns": []
            },
            "final_results": {
                "claimant_name": metadata.get("claimant_name"),
                "claimants": metadata.get("claimants", []),  # Include claimants list
                "extraction_method": metadata.get("extraction_method"),
                "docket_number": metadata.get("docket_number"),
                "appeal_number": metadata.get("appeal_number"),
                "case_number": metadata.get("case_number"),
                "document_date": metadata.get("document_date"),
                "respondent": metadata.get("respondent"),
                "respondents": metadata.get("respondents", []),  # Include respondents list
                "insurance_carrier": metadata.get("insurance_carrier"),
                "insurance_carriers": metadata.get("insurance_carriers", []),  # Include carriers list
                "has_dissent": metadata.get("has_dissent", False),
                "dissent_text": metadata.get("dissent_text")
            }
        }
        
        # Record claimant pattern attempts
        for i, pattern in enumerate(claimant_patterns):
            match = re.search(pattern, text, re.MULTILINE)
            attempt = {
                "pattern_index": i,
                "pattern": pattern,
                "matched": match is not None,
                "result": match.group(1).strip() if match else None
            }
            debug_info["extraction_attempts"]["claimant_patterns"].append(attempt)
        
        # Record date pattern attempts
        for i, pattern in enumerate(date_patterns):
            match = re.search(pattern, text, re.MULTILINE)
            attempt = {
                "pattern_index": i,
                "pattern": pattern,
                "matched": match is not None,
                "result": match.group(1).strip() if match else None
            }
            debug_info["extraction_attempts"]["date_patterns"].append(attempt)
        
        # Record appeal pattern attempts
        for i, pattern in enumerate(appeal_patterns):
            match = re.search(pattern, text, re.MULTILINE)
            attempt = {
                "pattern_index": i,
                "pattern": pattern,
                "matched": match is not None,
                "result": match.group(1).strip() if match else None
            }
            debug_info["extraction_attempts"]["appeal_patterns"].append(attempt)
        
        # Record docket pattern attempts
        for i, pattern in enumerate(docket_patterns):
            match = re.search(pattern, text, re.MULTILINE)
            attempt = {
                "pattern_index": i,
                "pattern": pattern,
                "matched": match is not None,
                "result": match.group(1).strip() if match else None
            }
            debug_info["extraction_attempts"]["docket_patterns"].append(attempt)
        
        # Record case pattern attempts
        for i, pattern in enumerate(case_patterns):
            match = re.search(pattern, text, re.MULTILINE)
            attempt = {
                "pattern_index": i,
                "pattern": pattern,
                "matched": match is not None,
                "result": match.group(1).strip() if match else None
            }
            debug_info["extraction_attempts"]["case_patterns"].append(attempt)
        
        # Record respondent pattern attempts
        for i, pattern in enumerate(respondent_patterns):
            match = re.search(pattern, text, re.MULTILINE)
            attempt = {
                "pattern_index": i,
                "pattern": pattern,
                "matched": match is not None,
                "result": match.group(1).strip() if match else None
            }
            debug_info["extraction_attempts"]["respondent_patterns"].append(attempt)
        
        # Record insurance carrier pattern attempts
        for i, pattern in enumerate(insurance_carrier_patterns):
            match = re.search(pattern, text, re.MULTILINE)
            attempt = {
                "pattern_index": i,
                "pattern": pattern,
                "matched": match is not None,
                "result": match.group(1).strip() if match else None
            }
            debug_info["extraction_attempts"]["insurance_carrier_patterns"].append(attempt)
        
        return debug_info
    
    def _extract_sections(self, text):
        """Extract document sections for easier navigation."""
        sections = {}
        lines = text.split('\n')
        current_section = None
        section_content = []
        
        for i, line in enumerate(lines):
            line = line.strip()
            if line and line.isupper() and len(line) > 3:
                # Potential section header
                if current_section:
                    # Save previous section
                    sections[current_section] = '\n'.join(section_content)
                
                # Start new section
                current_section = line
                section_content = [line]
            elif current_section:
                # Continue current section
                section_content.append(line)
        
        # Save final section
        if current_section:
            sections[current_section] = '\n'.join(section_content)
        
        return sections
    
    def _generate_validation_report(self):
        """Generate a validation report of extraction success rates."""
        report = {
            "files_processed": self.files_processed,
            "success_rates": {
                field: {
                    "count": count,
                    "percentage": (count / self.files_processed * 100) if self.files_processed > 0 else 0
                }
                for field, count in self.success_counts.items()
            },
            "extraction_methods": {
                method: {
                    "count": count,
                    "percentage": (count / self.files_processed * 100) if self.files_processed > 0 else 0
                }
                for method, count in self.extraction_methods.items()
            },
            "multi_entity_summary": {
                "documents_with_multiple_claimants": sum(1 for detail in self.detailed_results 
                    if detail["fields_found"].get("multi_entity_found", {}).get("claimants_count", 0) > 1),
                "documents_with_multiple_respondents": sum(1 for detail in self.detailed_results 
                    if detail["fields_found"].get("multi_entity_found", {}).get("respondents_count", 0) > 1),
                "documents_with_multiple_carriers": sum(1 for detail in self.detailed_results 
                    if detail["fields_found"].get("multi_entity_found", {}).get("carriers_count", 0) > 1),
            },
            "detailed_results": self.detailed_results
        }
        
        # Calculate average entities per document
        if self.files_processed > 0:
            claimants_counts = [detail["fields_found"].get("multi_entity_found", {}).get("claimants_count", 0) 
                               for detail in self.detailed_results]
            respondents_counts = [detail["fields_found"].get("multi_entity_found", {}).get("respondents_count", 0) 
                                 for detail in self.detailed_results]
            carriers_counts = [detail["fields_found"].get("multi_entity_found", {}).get("carriers_count", 0) 
                              for detail in self.detailed_results]
            
            report["multi_entity_summary"]["avg_claimants_per_doc"] = sum(claimants_counts) / self.files_processed
            report["multi_entity_summary"]["avg_respondents_per_doc"] = sum(respondents_counts) / self.files_processed
            report["multi_entity_summary"]["avg_carriers_per_doc"] = sum(carriers_counts) / self.files_processed
        
        # Save validation report
        with open(os.path.join(self.output_dir, "ocr_validation_report.json"), 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"Generated validation report in {self.output_dir}/ocr_validation_report.json")
        
        # Also log a summary of the multi-entity extraction
        logger.info("Multi-entity extraction summary:")
        if self.files_processed > 0:
            logger.info(f"Documents with multiple claimants: {report['multi_entity_summary']['documents_with_multiple_claimants']} ({report['multi_entity_summary']['documents_with_multiple_claimants']/self.files_processed*100:.1f}%)")
            logger.info(f"Documents with multiple respondents: {report['multi_entity_summary']['documents_with_multiple_respondents']} ({report['multi_entity_summary']['documents_with_multiple_respondents']/self.files_processed*100:.1f}%)")
            logger.info(f"Documents with multiple carriers: {report['multi_entity_summary']['documents_with_multiple_carriers']} ({report['multi_entity_summary']['documents_with_multiple_carriers']/self.files_processed*100:.1f}%)")
            logger.info(f"Avg. claimants per document: {report['multi_entity_summary']['avg_claimants_per_doc']:.2f}")
            logger.info(f"Avg. respondents per document: {report['multi_entity_summary']['avg_respondents_per_doc']:.2f}")
            logger.info(f"Avg. carriers per document: {report['multi_entity_summary']['avg_carriers_per_doc']:.2f}")

def main():
    """Process PDF files with OCR-enhanced extraction and collect metrics."""
    processor = LocalPDFProcessorWithOCR()
    processor.process_local_files()
    logger.info("OCR-enhanced processing complete with multi-entity support!")

if __name__ == "__main__":
    main() 