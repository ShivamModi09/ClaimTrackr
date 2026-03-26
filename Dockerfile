# STAGE 1: The Builder 
FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim AS builder

WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy config files
COPY pyproject.toml uv.lock ./

# Install dependencies 
# uv will now find the standard Linux wheels for Torch
RUN uv sync --frozen --no-install-project --no-dev


# STAGE 2: The Final Image
FROM python:3.11-slim

WORKDIR /app

# Copy the virtual environment from the builder
COPY --from=builder /app/.venv /app/.venv

# Copy your code
COPY . .

# Ensure the app uses the virtual environment
ENV PATH="/app/.venv/bin:$PATH"

CMD ["python", "main.py"]
