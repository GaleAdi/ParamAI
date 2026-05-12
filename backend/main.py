"""
ParamAI Backend — FastAPI Entry Point
AI-Powered BPOM Food Testing Parameter Recommendation System

Competition: AI Open Innovation Challenge 2026
Team: Kebut Semalam, President University
"""

import json
import os
from contextlib import asynccontextmanager
from datetime import datetime
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
MODEL_NAME = os.getenv("MODEL_NAME", "claude-haiku-4-20250514")
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.80"))
MAX_CANDIDATES = int(os.getenv("MAX_CANDIDATES", "3"))

# API Cost pricing (per 1M tokens) — Claude Sonnet 4 via Snifox
COST_PER_1M_INPUT_TOKENS = 3.0   # $3.00 / 1M input tokens
COST_PER_1M_OUTPUT_TOKENS = 15.0  # $15.00 / 1M output tokens


def load_bpom_rules() -> dict:
    """Load BPOM rules knowledge base from JSON file."""
    rules_path = Path(__file__).parent / "data" / "bpom_rules.json"
    with open(rules_path, "r", encoding="utf-8") as f:
        return json.load(f)


def init_usage_stats() -> dict:
    """Initialize usage statistics tracker."""
    return {
        "total_requests": 0,
        "total_input_tokens": 0,
        "total_output_tokens": 0,
        "total_cost_usd": 0.0,
        "last_request_at": None,
        "server_started_at": datetime.utcnow().isoformat(),
        # Pricing used for calculation
        "pricing_per_1m_input": COST_PER_1M_INPUT_TOKENS,
        "pricing_per_1m_output": COST_PER_1M_OUTPUT_TOKENS,
    }


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load BPOM rules on startup and store in app.state."""
    # Load knowledge base on startup
    bpom_rules = load_bpom_rules()
    app.state.bpom_rules = bpom_rules
    print(f"[OK] Loaded BPOM knowledge base: {len(bpom_rules['categories'])} categories")

    # Initialize usage statistics
    app.state.usage_stats = init_usage_stats()
    print("[OK] Usage statistics tracker initialized")

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


@app.get("/regulations", tags=["Regulations"])
async def get_regulations():
    """
    Get list of BPOM regulations used in the knowledge base.
    Returns source regulations and their last update date.
    """
    rules = app.state.bpom_rules
    return {
        "version": rules.get("version", "1.0.0"),
        "last_updated": rules.get("last_updated", ""),
        "source_regulations": rules.get("source_regulations", []),
        "categories_count": len(rules.get("categories", {})),
        "metadata": rules.get("metadata", {}),
    }


@app.get("/stats", tags=["Stats"])
async def get_stats():
    """
    Get API usage statistics and cost metrics.
    For admin dashboard visibility.
    """
    stats = getattr(app.state, "usage_stats", init_usage_stats())

    # Get history count
    history_count = 0
    try:
        from main import app as main_app
        history_count = len(getattr(main_app.state, "history", []))
    except Exception:
        pass

    return {
        "total_requests": stats["total_requests"],
        "total_input_tokens": stats["total_input_tokens"],
        "total_output_tokens": stats["total_output_tokens"],
        "total_cost_usd": round(stats["total_cost_usd"], 6),
        "average_cost_per_request": round(stats["total_cost_usd"] / stats["total_requests"], 6)
            if stats["total_requests"] > 0 else 0.0,
        "last_request_at": stats["last_request_at"],
        "server_started_at": stats["server_started_at"],
        "history_count": history_count,
        "pricing_model": {
            "model": MODEL_NAME,
            "per_1m_input_usd": COST_PER_1M_INPUT_TOKENS,
            "per_1m_output_usd": COST_PER_1M_OUTPUT_TOKENS,
        },
    }


@app.post("/stats/reset", tags=["Stats"])
async def reset_stats():
    """
    Reset usage statistics (admin action).
    Returns confirmation with previous stats before reset.
    """
    old_stats = getattr(app.state, "usage_stats", init_usage_stats())

    # Reset to fresh state
    app.state.usage_stats = init_usage_stats()

    return {
        "status": "ok",
        "message": "Stats reset successfully",
        "previous_total_requests": old_stats["total_requests"],
        "previous_total_cost_usd": round(old_stats["total_cost_usd"], 6),
    }


def record_api_usage(input_tokens: int, output_tokens: int) -> float:
    """
    Record API usage and calculate cost.
    Call this after every Claude API request.
    Returns the cost of this specific request in USD.
    """
    from main import app
    stats = getattr(app.state, "usage_stats", None)
    if stats is None:
        return 0.0

    # Calculate cost for this request
    input_cost = (input_tokens / 1_000_000) * COST_PER_1M_INPUT_TOKENS
    output_cost = (output_tokens / 1_000_000) * COST_PER_1M_OUTPUT_TOKENS
    request_cost = input_cost + output_cost

    # Update cumulative stats
    stats["total_requests"] += 1
    stats["total_input_tokens"] += input_tokens
    stats["total_output_tokens"] += output_tokens
    stats["total_cost_usd"] += request_cost
    stats["last_request_at"] = datetime.utcnow().isoformat()

    return request_cost


# Export settings for use in other modules
__all__ = [
    "app", "MODEL_NAME", "CONFIDENCE_THRESHOLD", "MAX_CANDIDATES",
    "COST_PER_1M_INPUT_TOKENS", "COST_PER_1M_OUTPUT_TOKENS",
    "record_api_usage",
]
