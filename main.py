import os
from fastapi import FastAPI, Form, UploadFile, File, HTTPException
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_classic.chains import LLMChain
from langchain_core.prompts import PromptTemplate
# import functions from code files
from src.retrieve import load_vector_db, get_claim_approval_context, get_general_exclusion_context
from src.process_claim import process_claim, get_claim_report, get_bill_info, get_file_content

load_dotenv()

app = FastAPI(title="ClaimTrackr API")

# CORS for local development (Front & Back on different ports)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- STARTUP LOGIC ---
vector_db = load_vector_db()
CLAIM_CTX = get_claim_approval_context(vector_db)
EXCL_CTX = get_general_exclusion_context(vector_db)
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)

# http://localhost:8000/docs to test your POST requests
@app.post("/submit-claim", response_class=PlainTextResponse)
async def submit_claim(
    name: str = Form(...),
    address: str = Form(...),
    claim_type: str = Form(...),
    claim_reason: str = Form(...),
    date: str = Form(),
    medical_facility: str = Form(...),
    medical_bill: UploadFile = File(...),
    total_claim_amount : int = Form(...),
    description: str = Form(None),
):
    """
    Accepts a claim form and returns the LLM's report as plain text.
    """
    try:
        
        # Build patient_info string similar to your original structure
        patient_info = (
            f"Name: {name}\nAddress: {address}\nClaim Type: {claim_type}\n"
            f"Claim Reason: {claim_reason}\nDate of Service: {date}\nMedical Facility: {medical_facility}\n"
            f"Total Claim Amount: {total_claim_amount}\nDescription: {description or ''}\n"
        )

        # COST-OPTIMIZATION: Initial semantic check on the user-provided reason
        # (Saves 2 LLM calls and PDF processing time)
        if not process_claim(claim_reason)[0]:
            return PlainTextResponse(
                "Claim Rejected.\n\n"
                f"The reason provided ('{claim_reason}') falls under general policy exclusions. "
                "According to policy guidelines, this category is not eligible for reimbursement."
            )

        # EXTRACTION: Only executed if the initial reason passes (LLM Call #1)
        extracted_data = get_file_content(medical_bill.file)
        medical_bill_data = get_bill_info(extracted_data, llm)
        
        bill_expense = medical_bill_data.get('expense')
        bill_disease = medical_bill_data.get('disease')

        if not bill_expense or not bill_disease:
            return PlainTextResponse(
                "Claim Processing Failed.\n\n"
                "The system was unable to extract the required billing information from the uploaded medical receipt." 
                "This usually occurs when the document is unclear, incomplete, or does not contain recognizable billing details such as the total expense or treatment summary."
                "Please upload a clear and valid consultation receipt or medical invoice and try submitting the claim again."
            )

        if bill_expense < total_claim_amount:
            return PlainTextResponse(
                "Claim Rejected.\n\n"
                "The submitted claim amount exceeds the total expense found in the medical invoice. "
                f"Invoiced Total: {bill_expense}, Claimed Amount: {total_claim_amount}. "
                "Please verify the amounts and resubmit your claim."
            )

        _, prompt_template = process_claim(bill_disease)

        llm_chain = LLMChain(
            llm=llm,
            prompt=PromptTemplate.from_template(prompt_template)
        )

        max_amount = 1000  # Internal policy limit
        
        result = get_claim_report(
            max_amount=max_amount,
            llm_chain=llm_chain,
            medical_bill_info=extracted_data,
            patient_info=patient_info, 
            disease=bill_disease,
            claim_context=CLAIM_CTX,
            exclusion_context=EXCL_CTX
            )
        
        return PlainTextResponse(result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {"status":"ok"}

if os.path.exists("frontend/dist"):
    app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="frontend")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)