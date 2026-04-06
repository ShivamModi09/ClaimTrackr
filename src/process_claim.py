import re
import numpy as np
import pdfplumber
from sklearn.metrics.pairwise import cosine_similarity
from langchain_core.messages import SystemMessage, HumanMessage
from src.prompts import PROMPT, REJECTED_PROMPT
from src.embeddings import get_embeddings


# Extract Text from bill pdf
def get_file_content(file):
    all_text = []
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            page_content = page.extract_text(layout=True)
            if page_content:
                all_text.append(page_content)
    
    return "\n".join(all_text)

# Extract Disease + Expense using LLM
def get_bill_info(data, bill_llm):

    prompt = """
Extract the primary diagnosis (disease name) and the total expense from the medical invoice.
If multiple symptoms/diseases are listed, combine them into a single descriptive string.

Return output ONLY in this format:
Disease: <consolidated disease name>
Expense: <amount>

Example:
Disease: Viral Upper Respiratory Infection (Fever and Cold)
Expense: 3500
"""

    messages = [
        SystemMessage(content=prompt),
        HumanMessage(content=data)
    ]

    response = bill_llm.invoke(messages)
    text = response.content.strip()

    # Parse fields safely
    disease_match = re.search(r"Disease:\s*(.*)", text)
    expense_match = re.search(r"Expense:\s*(.*)", text)

    diseases = ""
    if disease_match:
        diseases = disease_match.group(1).strip()

    expense = ""
    if expense_match:
        raw_expense = expense_match.group(1).strip()
        # Remove anything that isn't a digit (like ₹, commas, or decimals)
        clean_expense = re.sub(r'[^\d]', '', raw_expense)
        expense = int(clean_expense) if clean_expense else 0

    answer = {
        "disease": diseases,
        "expense": int(expense)
    }

    return answer

## MULTI-LAYERED VALIDATION PIPELINE 

embeddings = get_embeddings()

general_exclusion_list = [
    "HIV/AIDS", "Parkinson's disease", "Alzheimer's disease",
    "pregnancy", "substance abuse", "self-inflicted injuries",
    "sexually transmitted diseases(std)", "pre-existing conditions"
]
excl_vecs = np.array(embeddings.embed_documents(general_exclusion_list))

def process_claim(disease, prompt_template = PROMPT, threshold=0.5):
    
    claim_vec = np.array(embeddings.embed_query(disease)).reshape(1, -1)
    sims = cosine_similarity(claim_vec, excl_vecs)
    
    if sims.max() > threshold:
        return False, REJECTED_PROMPT
    return True, prompt_template


def get_claim_report(llm_chain, max_amount, medical_bill_info, patient_info, disease, claim_context, exclusion_context):

    output = llm_chain.invoke({
        "claim_approval_context": claim_context,
        "general_exclusion_context": exclusion_context,
        "patient_info": patient_info,
        "max_amount": max_amount,
        "medical_bill_info": medical_bill_info,
        "disease": disease
        })

    return output['text']