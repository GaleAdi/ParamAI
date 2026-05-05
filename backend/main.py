"""
ParamAI Backend — FastAPI Entry Point
AI-Powered BPOM Food Testing Parameter Recommendation System

Competition: AI Open Innovation Challenge 2026
Team: Group 1, President University
"""

import json
import os
from contextlib import asynccontextmanager
from pathlib import Path

import anthropic
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import classify, recommend

# Load environment variables from .env
load_dotenv()

# Get API key and config from environment
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
MODEL_NAME = os.getenv("MODEL_NAME", "claude-haiku-4-5-20251001")
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.80"))
MAX_CANDIDATES = int(os.getenv("MAX_CANDIDATES", "3"))


def load_bpom_rules() -> dict:
    """Load BPOM rules knowledge base from JSON file."""
    rules_path = Path(__file__).parent / "data" / "bpom_rules.json"
    with open(rules_path, "r", encoding="utf-8") as f:
        return json.load(f)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load BPOM rules on startup and store in app.state."""
    # Load knowledge base on startup
    bpom_rules = load_bpom_rules()
    app.state.bpom_rules = bpom_rules
    print(f"[OK] Loaded BPOM knowledge base: {len(bpom_rules['categories'])} categories")

    # Initialize Claude client if API key is available
    if ANTHROPIC_API_KEY and ANTHROPIC_API_KEY != "your_key_here":
        app.state.claude_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        print(f"[OK] Claude client initialized with model: {MODEL_NAME}")
    else:
        print("[WARN] ANTHROPIC_API_KEY not set -- Claude API calls will fail")

    yield

    # Cleanup on shutdown
    print("[BYE] Shutting down ParamAI backend...")


# Create FastAPI app
app = FastAPI(
    title="ParamAI API",
    description="AI-Powered BPOM Food Testing Parameter Recommendation System",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware — allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(classify.router)
app.include_router(recommend.router)


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint — API info."""
    return {
        "service": "ParamAI",
        "version": "1.0.0",
        "description": "AI-Powered BPOM Food Testing Parameter Recommendation",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "ParamAI"}


@app.get("/categories", tags=["Info"])
async def list_categories():
    """List all available BPOM categories."""
    rules = app.state.bpom_rules
    categories = []
    for code, cat in rules["categories"].items():
        categories.append({
            "code": code,
            "name": cat["category_name"],
            "description": cat.get("description", ""),
            "parameter_count": len(cat.get("parameters", [])),
        })
    return {"categories": categories, "total": len(categories)}


# Export settings for use in other modules
__all__ = ["app", "MODEL_NAME", "CONFIDENCE_THRESHOLD", "MAX_CANDIDATES"]