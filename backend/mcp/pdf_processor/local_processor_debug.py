"""
Local PDF Processor with Enhanced Extraction and OCR
---------------------------------------------------
This script processes local PDF files with OCR-enhanced text extraction
and comprehensive pattern matching.
"""

import os
import re
import json
import logging
from pathlib import Path
from dataclasses import asdict

from pdf_processor import PDFProcessor
from enhanced_extraction_patterns import (
    extract_text_with_ocr,
    extract_metadata_with_patterns,
    claimant_patterns,
    date_patterns,
    appeal_patterns,
    docket_patterns,
    case_patterns
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class LocalPDFProcessorWithOCR:
    """Local PDF processor with OCR and enhanced pattern matching."""
    
    def __init__(self, output_dir="processed_data/ocr_extraction"):
        self.output_dir = Path(output_dir)
        self.debug_dir = self.output_dir / "debug"
        os.makedirs(self.output_dir, exist_ok=True)
        os.makedirs(self.debug_dir, exist_ok=True)
        
        self.processor = PDFProcessor(
            gcs_bucket_name="leximentis_mvp",
            local_data_dir=str(self.output_dir),
            use_bge=True
        )
    
    def process_local_files(self):
        """Process all PDF files in the current directory using OCR."""
        # Get all PDF files in current directory
        current_dir = Path(os.path.dirname(os.path.abspath(__file__)))
        pdf_files = list(current_dir.glob("*.pdf"))
        
        logger.info(f"Found {len(pdf_files)} PDF files in current directory")
        if not pdf_files:
            logger.error("No PDF files found to process!")
            return []
        
        results = []
        all_debug_info = []
        
        # Process each file
        for pdf_path in pdf_files:
            filename = pdf_path.name
            logger.info(f"Processing {filename}...")
            
            # Extract text with OCR if needed
            text = extract_text_with_ocr(str(pdf_path))
            logger.info(f"  - Extracted {len(text)} characters")
            
            # Save raw text for debugging
            text_file = self.debug_dir / f"{filename.replace('.pdf', '')}_text.txt"
            with open(text_file, 'w', encoding='utf-8') as f:
                f.write(text)
            
            # Process document using standard processor for sections
            doc_processor = self.processor.doc_processor
            processed_doc = doc_processor.process_document(filename, text)
            
            # Extract metadata with our enhanced patterns
            metadata = extract_metadata_with_patterns(filename, text)
            
            # Create debug info with all pattern attempts
            debug_info = self._create_debug_info(filename, text, metadata)
            
            # Update the document metadata
            if metadata["claimant_name"]:
                processed_doc.metadata.claimant_name = metadata["claimant_name"]
                logger.info(f"  - Claimant found: {metadata['claimant_name']} (method: {metadata['extraction_method']})")
            else:
                logger.warning(f"  - No claimant found for {filename}")
            
            if metadata["document_date"]:
                processed_doc.metadata.document_date = metadata["document_date"]
                logger.info(f"  - Document date found: {metadata['document_date']}")
            
            if metadata["appeal_number"]:
                processed_doc.metadata.appeal_number = metadata["appeal_number"]
                logger.info(f"  - Appeal number found: {metadata['appeal_number']}")
            
            if metadata["docket_number"]:
                processed_doc.metadata.docket_number = metadata["docket_number"]
                logger.info(f"  - Docket number found: {metadata['docket_number']}")
            
            if metadata["case_number"]:
                processed_doc.metadata.case_number = metadata["case_number"]
                logger.info(f"  - Case number found: {metadata['case_number']}")
            
            # Generate embeddings if needed
            if self.processor.use_bge:
                logger.info(f"  - Generating embeddings...")
                processed_doc = self.processor.embedder.embed_document(processed_doc)
            
            # Add extraction method to document
            doc_dict = {
                "metadata": asdict(processed_doc.metadata),
                "full_text": processed_doc.full_text,
                "sections": processed_doc.sections,
                "embedding": processed_doc.embedding,
                "extraction_method": metadata["extraction_method"]
            }
            
            # Save individual output
            output_file = self.output_dir / f"{filename.replace('.pdf', '')}.json"
            with open(output_file, 'w') as f:
                json.dump(doc_dict, f, indent=2)
            
            # Save detailed debug info
            debug_file = self.debug_dir / f"{filename.replace('.pdf', '')}_debug.json"
            with open(debug_file, 'w') as f:
                json.dump(debug_info, f, indent=2)
            
            results.append(doc_dict)
            all_debug_info.append(debug_info)
            
            # Print extraction summary
            print(f"\nExtraction Summary for {filename}:")
            print(f"  Claimant: {metadata['claimant_name'] or 'NOT FOUND'} (method: {metadata['extraction_method'] or 'N/A'})")
            print(f"  Docket #: {metadata['docket_number'] or 'NOT FOUND'}")
            print(f"  Appeal #: {metadata['appeal_number'] or 'NOT FOUND'}")
            print(f"  Case #: {metadata['case_number'] or 'NOT FOUND'}")
            print(f"  Date: {metadata['document_date'] or 'NOT FOUND'}")
            print(f"  See {debug_file} for detailed extraction info")
        
        # Save all results
        all_results_file = self.output_dir / "all_processed_documents_ocr.json"
        with open(all_results_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        # Generate validation report
        self._generate_validation_report(results, all_debug_info)
        
        return results
    
    def _create_debug_info(self, filename, text, metadata):
        """Create detailed debug info with all pattern attempts."""
        debug_info = {
            "filename": filename,
            "text_length": len(text),
            "extraction_attempts": {
                "claimant_patterns": [],
                "date_patterns": [],
                "appeal_patterns": [],
                "docket_patterns": [],
                "case_patterns": []
            },
            "final_results": metadata
        }
        
        # Log all claimant pattern attempts
        for i, pattern in enumerate(claimant_patterns):
            match = re.search(pattern, text, re.MULTILINE)
            debug_info["extraction_attempts"]["claimant_patterns"].append({
                "pattern_index": i,
                "pattern": pattern,
                "matched": bool(match),
                "result": match.group(1).strip() if match else None
            })
        
        # Log all date pattern attempts
        for i, pattern in enumerate(date_patterns):
            match = re.search(pattern, text, re.MULTILINE)
            debug_info["extraction_attempts"]["date_patterns"].append({
                "pattern_index": i,
                "pattern": pattern,
                "matched": bool(match),
                "result": match.group(1).strip() if match else None
            })
        
        # Log all appeal pattern attempts
        for i, pattern in enumerate(appeal_patterns):
            match = re.search(pattern, text, re.MULTILINE)
            debug_info["extraction_attempts"]["appeal_patterns"].append({
                "pattern_index": i,
                "pattern": pattern,
                "matched": bool(match),
                "result": match.group(1).strip() if match else None
            })
        
        # Log all docket pattern attempts
        for i, pattern in enumerate(docket_patterns):
            match = re.search(pattern, text, re.MULTILINE)
            debug_info["extraction_attempts"]["docket_patterns"].append({
                "pattern_index": i,
                "pattern": pattern,
                "matched": bool(match),
                "result": match.group(1).strip() if match else None
            })
        
        # Log all case pattern attempts
        for i, pattern in enumerate(case_patterns):
            match = re.search(pattern, text, re.MULTILINE)
            debug_info["extraction_attempts"]["case_patterns"].append({
                "pattern_index": i,
                "pattern": pattern,
                "matched": bool(match),
                "result": match.group(1).strip() if match else None
            })
        
        return debug_info
    
    def _generate_validation_report(self, results, debug_info):
        """Generate a detailed validation report."""
        total = len(results)
        if total == 0:
            return
        
        # Calculate success rates
        metrics = {
            "claimant_name": sum(1 for r in results if r["metadata"]["claimant_name"]),
            "docket_number": sum(1 for r in results if r["metadata"]["docket_number"]),
            "appeal_number": sum(1 for r in results if r["metadata"]["appeal_number"]),
            "case_number": sum(1 for r in results if r["metadata"]["case_number"]),
            "document_date": sum(1 for r in results if r["metadata"]["document_date"])
        }
        
        # Track extraction methods
        extraction_methods = {}
        for r in results:
            method = r.get("extraction_method")
            extraction_methods[method] = extraction_methods.get(method, 0) + 1
        
        # Generate report
        report = {
            "files_processed": total,
            "success_rates": {
                field: {
                    "count": count, 
                    "percentage": round(count/total*100, 1)
                } for field, count in metrics.items()
            },
            "extraction_methods": {
                method: {
                    "count": count,
                    "percentage": round(count/total*100, 1)
                } for method, count in extraction_methods.items() if method
            },
            "detailed_results": [{
                "filename": r["metadata"]["filename"],
                "claimant_found": bool(r["metadata"]["claimant_name"]),
                "extraction_method": r.get("extraction_method"),
                "fields_found": {
                    "docket_number": bool(r["metadata"]["docket_number"]),
                    "appeal_number": bool(r["metadata"]["appeal_number"]),
                    "case_number": bool(r["metadata"]["case_number"]),
                    "document_date": bool(r["metadata"]["document_date"])
                }
            } for r in results]
        }
        
        # Save report
        report_file = self.output_dir / "ocr_validation_report.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        # Print summary to console
        print("\n==== OCR Extraction Validation Report ====")
        print(f"Files processed: {total}")
        print("\nSuccess rates:")
        for field, data in report["success_rates"].items():
            print(f"  - {field.replace('_', ' ').title()}: {data['count']}/{total} ({data['percentage']}%)")
        
        print("\nExtraction methods:")
        for method, data in report["extraction_methods"].items():
            if method:
                print(f"  - {method}: {data['count']}/{total} ({data['percentage']}%)")
        
        print(f"\nDetailed report saved to {report_file}")


def main():
    """Process local PDF files with OCR and enhanced pattern matching."""
    processor = LocalPDFProcessorWithOCR(output_dir="processed_data/ocr_extraction")
    results = processor.process_local_files()
    
    print(f"\nProcessing complete. {len(results)} documents processed.")
    print("\nCheck the processed_data/ocr_extraction directory for results and debug information.")


if __name__ == "__main__":
    main() 