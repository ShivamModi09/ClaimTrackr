from langchain_pinecone import PineconeVectorStore
from src.embeddings import get_embeddings

index_name = "claimtrackr-py"


def load_vector_db():
    # load vector database
    return PineconeVectorStore(
        index_name=index_name,
        embedding=get_embeddings()
        )

def get_claim_approval_context(vector_db):
  context = vector_db.similarity_search(
      "What are the documents required for claim approval?"
      )
  
  claim_approval_context = ""

  for x in context:
    claim_approval_context += x.page_content

  return claim_approval_context

def get_general_exclusion_context(vector_db):
    context = vector_db.similarity_search(
        "Give a list of all general exclusions"
    )

    general_exclusion_context = ""

    for x in context:
        general_exclusion_context += x.page_content

    return general_exclusion_context