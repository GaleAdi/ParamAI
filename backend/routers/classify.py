"""
ParamAI — Classification Router
POST /classify — Entity extraction only (for testing Claude API)

Competition: AI Open Innovation Challenge 2026
Team: Group 1, President University
"""

import logging
from datetime import datetime

from fastapi import APIRouter, HTTPException

from services.claude_service import extract_product_entities

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/classify", tags=["Classification"])


@router.post(
    "",
    summary="Extract Product Entities",
    description="Call Claude API to extract structured entities from product description. "
                "Used for testing the entity extraction step independently.",
    response_model=dict,
)
async def classify_product(request: dict) -> dict:
    """
    Extract product entities from description.

    This endpoint tests the Claude API integration by returning
    the raw entity extraction without BPOM category matching.

    Request body:
        {"description": "product description string"}

    Response:
        Extracted entities from Claude API:
        {
            "product_name": str,
            "ingredients": [str],
            "ingredient_categories": [str],
            "production_method": str,
            "production_keywords": [str],
            "target_consumer": str,
            "health_claims": [str],
            "product_form": str
        }
    """
    # Get description from request
    description = request.get("description", "").strip()

    if not description:
        raise HTTPException(
            status_code=400,
            detail="Product description is required in 'description' field"
        )

    logger.info(f"[classify] Processing: {description[:50]}...")

    try:
        # Call Claude service for entity extraction
        entities = await extract_product_entities(description)

        logger.info(f"[classify] Entities extracted successfully")
        return entities

    except HTTPException:
        # Re-raise HTTPException (already has proper status code and detail)
        raise
    except Exception as e:
        logger.error(f"[classify] Unexpected error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Entity extraction failed: {str(e)}"
        )


@router.get(
    "/health",
    summary="Check Classification Service Health",
    description="Verify the classification service is operational.",
)
async def classify_health():
    """Health check for classification service."""
    return {
        "status": "ok",
        "service": "classify",
        "timestamp": datetime.utcnow().isoformat()
    }