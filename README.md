# 🛡️ ClaimTrackr

**AI-Powered Health Insurance Claim Evaluation**

![ClaimTrackr Demo](demo.gif)

ClaimTrackr is an LLM-powered RAG system for evaluating health insurance claims against policy documents, exclusions, and supporting records. It combines semantic retrieval, FastAPI, Pinecone, and Docker to deliver a reproducible, deployment-ready workflow.

---

## What it does

ClaimTrackr automates claim evaluation by retrieving relevant policy context and using an LLM to generate a verdict with supporting reasoning.

---

## Tech Stack

| Component        | Technology                |
| ---------------- | ------------------------- |
| Language         | Python 3.11               |
| Backend          | FastAPI, Uvicorn          |
| Frontend         | React, Vite, Tailwind CSS |
| Package Manager  | `uv`                      |
| Vector Database  | Pinecone                  |
| Embeddings       | SentenceTransformers      |
| Containerization | Docker, Docker Compose    |

---

## High-Level Flow

1. **Ingest** policy documents and claim-related files.
2. **Embed** document text using `sentence-transformers/all-mpnet-base-v2`.
3. **Store and retrieve** context from Pinecone.
4. **Evaluate** the claim with an LLM.
5. **Return** a verdict, summary, and rejection reasons if applicable.

---

## Project Structure

```text
ClaimTrackr/
├── main.py
├── src/
├── frontend/
├── documents/
├── bills/
├── pyproject.toml
├── uv.lock
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── .dockerignore
```

---

## How to run

### Option 1: Run with Docker image

Use this if you just want to start the app quickly.

```bash
git clone https://github.com/yourusername/claimtrackr.git
cd claimtrackr
cp .env.example .env
docker compose up -d
```

Open:

```text
http://localhost:8000
```

### Option 2: Run locally for development

Use this if you want to edit the code and test changes.

```bash
uv sync
cd frontend
npm install
npm run dev
```

Then run the backend in another terminal:

```bash
python main.py
```

### After making changes

```bash
docker compose up -d --build
```

### Stop the app

```bash
docker compose down
```

---

## Docker / Deployment Highlights

ClaimTrackr uses a **multi-stage Dockerfile** so dependencies are installed in a builder stage and only the final runtime files are copied into the production image.

* Smaller runtime image
* Faster deployment
* Cleaner production container
* Reduced image content size from **919MB** to **455MB** in this setup

---


## Author

**Shivam Modi**

Software Developer
