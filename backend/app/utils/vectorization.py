import json
import os
from google.cloud import storage
import torch
from transformers import AutoTokenizer, AutoModel
import numpy as np
from tqdm.notebook import tqdm  # For Jupyter notebook progress bars

# Configuration
PROJECT_NAME = "POC Project"  # Your GCP project name
BUCKET_NAME = "leximentis_mvp"  # Your GCS bucket name
INPUT_FOLDER = "leximentis_mvp/"  # Path to your JSON files
OUTPUT_FOLDER = "leximentis_mvp/embeddings"  # Where to save embeddings

# Initialize BGE model
def initialize_model():
    model_name = "BAAI/bge-large-en-v1.5"
    print(f"Loading model: {model_name}...")
    
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModel.from_pretrained(model_name)
    
    # Your VM doesn't have a GPU, so we'll use CPU
    device = torch.device("cpu")
    print(f"Using device: {device}")
    
    model = model.to(device)
    return model, tokenizer, device

# Function to generate embeddings
def get_embeddings(texts, model, tokenizer, device):
    print(f"Generating embeddings for {len(texts)} documents...")
    embeddings = []
    
    # Process each document individually to avoid memory issues
    for text in tqdm(texts):
        # Tokenize and truncate to model's max length
        encoded_input = tokenizer(
            text, 
            padding=True, 
            truncation=True, 
            max_length=512,  # BGE max length
            return_tensors='pt'
        ).to(device)
        
        # Generate embedding
        with torch.no_grad():
            model_output = model(**encoded_input)
            # Use CLS token embedding as document embedding
            embedding = model_output.last_hidden_state[:, 0, :].cpu().numpy()[0]
            embeddings.append(embedding)
    
    return np.array(embeddings)

# Load JSON files from GCS
def load_json_files():
    client = storage.Client()
    bucket = client.get_bucket(BUCKET_NAME)
    
    json_data = []
    file_names = []
    
    # List all JSON files in the folder
    blobs = list(bucket.list_blobs(prefix=INPUT_FOLDER))
    json_blobs = [blob for blob in blobs if blob.name.endswith('.json')]
    
    print(f"Found {len(json_blobs)} JSON files in {INPUT_FOLDER}")
    
    for blob in json_blobs:
        try:
            content = blob.download_as_text()
            data = json.loads(content)
            json_data.append(data)
            file_names.append(os.path.basename(blob.name))
            print(f"Loaded: {blob.name}")
        except Exception as e:
            print(f"Error loading {blob.name}: {e}")
    
    return json_data, file_names

# Extract text and metadata from JSON files
def extract_text_from_json(json_data):
    texts = []
    metadata = []
    
    for document in json_data:
        # Extract metadata
        meta = {
            'filename': document.get('metadata', {}).get('filename', ''),
            'docket_numbers': document.get('metadata', {}).get('docket_numbers', []),
            'claimant': document.get('metadata', {}).get('claimant', ''),
            'respondent': document.get('metadata', {}).get('respondent', ''),
            'date': document.get('metadata', {}).get('date', ''),
            'decision_type': document.get('metadata', {}).get('decision_type', '')
        }
        
        # Extract text from chunks
        document_text = ""
        chunks = document.get('chunks', [])
        for chunk in chunks:
            chunk_text = chunk.get('text', '')
            if chunk_text:
                document_text += chunk_text + " "
        
        # Also extract citations for legal-specific metadata
        citations = document.get('citations', [])
        meta['citations'] = citations
        
        texts.append(document_text.strip())
        metadata.append(meta)
    
    return texts, metadata

# Save embeddings to GCS
def save_embeddings(embeddings, texts, metadata, file_names):
    client = storage.Client()
    bucket = client.get_bucket(BUCKET_NAME)
    
    # Create output directory if it doesn't exist
    if not any(blob.name.startswith(OUTPUT_FOLDER) for blob in bucket.list_blobs()):
        print(f"Creating output directory: {OUTPUT_FOLDER}")
        bucket.blob(f"{OUTPUT_FOLDER}/").upload_from_string('')
    
    # Save each document's embedding individually
    for i, (embedding, text, meta, file_name) in enumerate(zip(embeddings, texts, metadata, file_names)):
        # Create a document with embedding and metadata
        doc = {
            "filename": file_name,
            "embedding": embedding.tolist(),  # Convert numpy array to list
            "metadata": meta,
            "text_snippet": text[:500] + "..." if len(text) > 500 else text  # Add a preview
        }
        
        # Save as JSON
        output_path = f"{OUTPUT_FOLDER}/{file_name.replace('.json', '_embedding.json')}"
        blob = bucket.blob(output_path)
        blob.upload_from_string(json.dumps(doc, indent=2))
        print(f"Saved embedding for {file_name} to {output_path}")
    
    # Also save a manifest file with all document references
    manifest = {
        "total_documents": len(embeddings),
        "documents": [
            {
                "filename": file_name,
                "embedding_path": f"{OUTPUT_FOLDER}/{file_name.replace('.json', '_embedding.json')}",
                "metadata": meta
            }
            for file_name, meta in zip(file_names, metadata)
        ]
    }
    
    manifest_blob = bucket.blob(f"{OUTPUT_FOLDER}/manifest.json")
    manifest_blob.upload_from_string(json.dumps(manifest, indent=2))
    print(f"Saved manifest to {OUTPUT_FOLDER}/manifest.json")

# Main function
def main():
    # Load model
    model, tokenizer, device = initialize_model()
    
    # Load JSON files
    json_data, file_names = load_json_files()
    
    # Extract text and metadata
    texts, metadata = extract_text_from_json(json_data)
    
    # Generate embeddings
    embeddings = get_embeddings(texts, model, tokenizer, device)
    
    # Save embeddings
    save_embeddings(embeddings, texts, metadata, file_names)
    
    print("Embedding generation complete!")

# Run the main function
if __name__ == "__main__":
    main()