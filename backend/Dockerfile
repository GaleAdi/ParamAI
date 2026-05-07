# syntax=docker/dockerfile:1
# ParamAI Backend — Dockerfile for Railway/Render/Fly.io
# Multi-stage build for smaller final image

# === Stage 1: Builder ===
FROM python:3.11-slim as builder

WORKDIR /app

# Install pip tools
RUN pip install --no-cache-dir --upgrade pip

# Copy requirements first (for caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# === Stage 2: Production ===
FROM python:3.11-slim as production

# Install curl for healthcheck only
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN useradd -m -u 1000 appuser

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY --chown=appuser:appuser . .

# Switch to non-root user
USER appuser

# Expose port (Railway uses PORT env var, default to 8000)
ENV PORT=8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# Run the application — Railway passes PORT env var
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
