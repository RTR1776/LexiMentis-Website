"""
Verify and correct extraction results.
"""
import json
import os
from pathlib import Path

def load_processed_data(results_file):
    """Load processed data from results file."""
    with open(results_file, 'r') as f:
        return json.load(f)

def identify_missing_data(results):
    """Identify documents with missing critical data."""
    missing_claimant = []
    missing_case_number = []
    missing_date = []
    
    for doc in results:
        metadata = doc["metadata"]
        if not metadata.get("claimant_name"):
            missing_claimant.append(doc)
        if not metadata.get("case_number") and not metadata.get("docket_number"):
            missing_case_number.append(doc)
        if not metadata.get("document_date"):
            missing_date.append(doc)
    
    return {
        "missing_claimant": missing_claimant,
        "missing_case_number": missing_case_number,
        "missing_date": missing_date
    }

def main():
    """Review extraction results and identify documents needing review."""
    # Load processed documents
    data_dir = Path("processed_data")
    results_file = data_dir / "all_processed_documents_improved.json"
    
    if not results_file.exists():
        print(f"Results file not found: {results_file}")
        return
    
    results = load_processed_data(results_file)
    print(f"Loaded {len(results)} processed documents")
    
    # Identify documents with missing data
    missing_data = identify_missing_data(results)
    
    # Report findings
    print("\nDocuments needing review:")
    print(f"Missing claimant name: {len(missing_data['missing_claimant'])}")
    print(f"Missing case/docket number: {len(missing_data['missing_case_number'])}")
    print(f"Missing document date: {len(missing_data['missing_date'])}")
    
    # Output files needing manual review
    if any(len(docs) > 0 for docs in missing_data.values()):
        review_dir = data_dir / "needs_review"
        os.makedirs(review_dir, exist_ok=True)
        
        # Save list of files needing review
        with open(review_dir / "files_needing_review.json", 'w') as f:
            json.dump({
                "missing_claimant": [doc["metadata"]["filename"] for doc in missing_data["missing_claimant"]],
                "missing_case_number": [doc["metadata"]["filename"] for doc in missing_data["missing_case_number"]],
                "missing_date": [doc["metadata"]["filename"] for doc in missing_data["missing_date"]]
            }, f, indent=2)
        
        print(f"\nList of files needing review saved to {review_dir / 'files_needing_review.json'}")

if __name__ == "__main__":
    main() 