"""
ParamAI — Recommendation Router
POST /recommend — Full classification with parameters
GET /recommend/history — Query history
GET /categories — List all categories

Competition: AI Open Innovation Challenge 2026
Team: Kebut Semalam, President University
"""

import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.classifier import classify_and_recommend

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/recommend", tags=["Recommendation"])


# =============================================================================
# Pydantic Models
# =============================================================================

class RecommendRequest(BaseModel):
    """Request schema for /recommend endpoint."""
    product_name: Optional[str] = None
    ingredients: Optional[str] = None
    production_method: Optional[str] = None
    target_consumer: Optional[str] = None
    health_claims: Optional[str] = None

    class Config:
        extra = "allow"  # Allow additional fields


class RecommendResponse(BaseModel):
    """Response schema for /recommend endpoint."""
    category_code: str
    category_name: str
    confidence: float
    review_flag: bool
    candidates: list
    parameters: list
    entities: dict
    disclaimer: str


class HistoryItemResponse(BaseModel):
    """Schema for history list item."""
    timestamp: str
    input_summary: str
    category_code: str
    category_name: str
    confidence: float
    review_flag: bool
    parameters_count: int


# =============================================================================
# Helper Functions
# =============================================================================

def _build_description(request: RecommendRequest) -> str:
    """
    Combine all request fields into a single description string.

    Args:
        request: RecommendRequest with optional fields

    Returns:
        str: Combined description for processing
    """
    parts = []

    if request.product_name:
        parts.append(f"Product name: {request.product_name.strip()}")
    if request.ingredients:
        parts.append(f"Ingredients: {request.ingredients.strip()}")
    if request.production_method:
        parts.append(f"Production method: {request.production_method.strip()}")
    if request.target_consumer:
        parts.append(f"Target consumer: {request.target_consumer.strip()}")
    if request.health_claims:
        parts.append(f"Health claims: {request.health_claims.strip()}")

    if not parts:
        raise HTTPException(
            status_code=400,
            detail="At least one product field must be provided"
        )

    return " | ".join(parts)


def _add_to_history(
    history: list,
    request: RecommendRequest,
    recommendation: dict,
    max_items: int = 20
):
    """
    Add a recommendation to the in-memory history list.

    Args:
        history: The history list from app.state
        request: Original request
        recommendation: Full recommendation response
        max_items: Maximum history items to keep
    """
    input_parts = []
    if request.product_name:
        input_parts.append(request.product_name)
    if request.ingredients:
        input_parts.append(request.ingredients[:50])
    input_summary = " + ".join(input_parts) if input_parts else "Unknown"

    history_item = {
        "timestamp": datetime.utcnow().isoformat(),
        "input_summary": input_summary[:100],
        "category_code": recommendation.get("category_code", "UNKNOWN"),
        "category_name": recommendation.get("category_name", ""),
        "confidence": recommendation.get("confidence", 0.0),
        "review_flag": recommendation.get("review_flag", True),
        "parameters_count": len(recommendation.get("parameters", []))
    }

    history.insert(0, history_item)

    # Keep only max_items
    while len(history) > max_items:
        history.pop()


# =============================================================================
# Endpoints
# =============================================================================

@router.post(
    "",
    response_model=RecommendResponse,
    summary="Classify Product and Get Recommendation",
    description="Full classification pipeline: extract entities, match BPOM category, "
                "and return testing parameters with regulation citations.",
)
async def recommend_product(request: RecommendRequest) -> RecommendResponse:
    """
    Classify product and return full recommendation with testing parameters.

    Request body:
        {
            "product_name": "Chocolate Oat Biscuit" (optional),
            "ingredients": "oat flour, cocoa powder, sugar, butter" (optional),
            "production_method": "baked at 180 degrees celsius" (optional),
            "target_consumer": "children and adults" (optional),
            "health_claims": "high fiber, no preservatives" (optional)
        }

    Response:
        Full recommendation object:
        {
            "category_code": str,
            "category_name": str,
            "confidence": float,
            "review_flag": bool,
            "candidates": [list if review_flag],
            "parameters": [{name, standard, regulation, type}, ...],
            "entities": dict,
            "disclaimer": str
        }
    """
    logger.info("[recommend] Processing new request...")

    # Build description from request fields
    try:
        description = _build_description(request)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[recommend] Error building description: {e}")
        raise HTTPException(
            status_code=400,
            detail=f"Invalid request: {str(e)}"
        )

    logger.info(f"[recommend] Description: {description[:80]}...")

    # Get rules data from app state
    try:
        from main import app
        rules_data = app.state.bpom_rules
    except Exception:
        logger.error("[recommend] Could not access app.state.bpom_rules")
        raise HTTPException(
            status_code=500,
            detail="Internal error: rules data not loaded"
        )

    # Process through classifier
    try:
        recommendation = await classify_and_recommend(
            input_data={"description": description},
            rules_data=rules_data
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[recommend] Classification failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Classification failed: {str(e)}"
        )

    # Add to history
    try:
        from main import app
        if not hasattr(app.state, "history"):
            app.state.history = []
        _add_to_history(
            app.state.history,
            request,
            recommendation
        )
        logger.info(f"[recommend] Added to history. Total: {len(app.state.history)}")
    except Exception as e:
        logger.warning(f"[recommend] Failed to add to history: {e}")
        # Don't fail the request if history fails

    return recommendation


@router.get(
    "/history",
    summary="Get Query History",
    description="Returns the last 20 classification queries from the current session.",
)
async def get_history() -> dict:
    """
    Get classification query history.

    Returns:
        dict: {
            "total": int,
            "history": [
                {
                    "timestamp": ISO string,
                    "input_summary": str,
                    "category_code": str,
                    "category_name": str,
                    "confidence": float,
                    "review_flag": bool,
                    "parameters_count": int
                }
            ]
        }
    """
    try:
        from main import app
        history = getattr(app.state, "history", [])
    except Exception:
        history = []

    return {
        "total": len(history),
        "history": history
    }


@router.delete(
    "/history",
    summary="Clear Query History",
    description="Clear all history entries from the current session.",
)
async def clear_history() -> dict:
    """
    Clear the classification query history.

    Returns:
        dict: {"status": "ok", "message": str}
    """
    try:
        from main import app
        if hasattr(app.state, "history"):
            count = len(app.state.history)
            app.state.history = []
            logger.info(f"[recommend] Cleared {count} history items")
            return {
                "status": "ok",
                "message": f"Cleared {count} history items"
            }
        return {
            "status": "ok",
            "message": "No history to clear"
        }
    except Exception:
        return {
            "status": "ok",
            "message": "No history to clear"
        }


@router.get(
    "/health",
    summary="Check Recommendation Service Health",
    description="Verify the recommendation service is operational.",
)
async def recommend_health():
    """Health check for recommendation service."""
    history_count = 0
    try:
        from main import app
        history_count = len(getattr(app.state, "history", []))
    except Exception:
        pass

    return {
        "status": "ok",
        "service": "recommend",
        "history_count": history_count,
        "timestamp": datetime.utcnow().isoformat()
    }