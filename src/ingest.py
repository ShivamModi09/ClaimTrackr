## READ INSURANCE POLICY DOCUMENTS
import os
from dotenv import load_dotenv
from embeddings import get_embeddings
from langchain_community.document_loaders import PDFPlumberLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore

load_dotenv()

# get documents directory
curr_dir = os.path.dirname(os.path.abspath(__file__))
doc_loc = os.path.join(curr_dir, "..", "documents")

index_name = "claimtrackr-py"

def run_ingestion():
    # 1. Load Documents
    loader = DirectoryLoader(
        doc_loc,
        glob="*.pdf",
        loader_cls=PDFPlumberLoader
    )
    docs = loader.load()
    
    # 2. Chunking
    text_splitter = RecursiveCharacterTextSplitter(
          chunk_size=1000,
          chunk_overlap=200
      )
    chunks = text_splitter.split_documents(docs)
    
    # 3. Pinecone Reset & Initialization
    pc = Pinecone() 
    if pc.has_index(index_name):
        pc.delete_index(index_name)
    
    pc.create_index(
        name=index_name,
        dimension=768,
        metric='cosine',
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )

    # 4. Store in Vector DB
    PineconeVectorStore.from_documents(
        documents=chunks, 
        embedding=get_embeddings(), 
        index_name=index_name
    )
    print("🎉 SUCCESS: Vector Database is Ready!")


if __name__ == "__main__":
    run_ingestion()