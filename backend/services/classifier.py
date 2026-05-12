"""
ParamAI — Classifier Service
Orchestrates the full classification pipeline:
Claude API → Rule Engine → Parameters

Competition: AI Open Innovation Challenge 2026
Team: Kebut Semalam, President University
"""

import logging
import os
from typing import Optional

from dotenv import load_dotenv

from .claude_service import extract_product_entities
from .rule_engine import BPOMRuleEngine

# Load environment variables
load_dotenv()

# Default max candidates
DEFAULT_MAX_CANDIDATES = int(os.getenv("MAX_CANDIDATES", "3"))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Disclaimer text for recommendations
EXPERT_REVIEW_DISCLAIMER = (
    "This recommendation requires final verification by a laboratory expert "
    "before client communication."
)


async def classify_and_recommend(
    input_data: dict,
    rules_data: dict
) -> dict:
    """
    Full classification and recommendation pipeline.

    Pipeline steps:
    1. Extract product entities via Claude API
    2. Match entities against BPOM categories via Rule Engine
    3. Retrieve parameters for matched category
    4. Build final recommendation response

    Args:
        input_data: Dict containing "description" (product description string)
        rules_data: Complete bpom_rules.json data

    Returns:
        dict: Recommendation object matching the required schema:
            {
                "category_code": str,
                "category_name": str,
                "confidence": float (2 decimal places),
                "review_flag": bool,
                "candidates": list (empty if high confidence, list if review_flag)
                "parameters": list of {name, standard, regulation, type},
                "entities": dict (extracted entities),
                "disclaimer": str
            }

    Raises:
        HTTPException: On validation error or processing failure
    """
    from fastapi import HTTPException

    # Validate input
    description = input_data.get("description", "").strip()
    if not description:
        raise HTTPException(
            status_code=400,
            detail="Product description is required in 'description' field"
        )

    logger.info(f"Processing classification request: '{description[:50]}...'")

    # === Step 1: Extract entities via Claude ===
    logger.info("Step 1: Extracting product entities via Claude API...")
    try:
        entities = await extract_product_entities(description)
        logger.info(f"Entities extracted successfully: {list(entities.keys())}")
    except Exception as e:
        logger.error(f"Entity extraction failed: {e}")
        raise HTTPException(
            status_code=502,
            detail=f"Failed to extract product entities: {str(e)}"
        )

    # === Step 2: Match against BPOM categories ===
    logger.info("Step 2: Matching entities against BPOM categories...")
    rule_engine = BPOMRuleEngine(rules_data)
    match_result = rule_engine.match(entities)

    primary = match_result.get("primary")
    confidence = match_result.get("confidence", 0.0)
    review_flag = match_result.get("review_flag", True)
    candidates = match_result.get("candidates", [])

    logger.info(
        f"Match result: primary={primary['code'] if primary else 'None'}, "
        f"confidence={confidence:.2f}, review_flag={review_flag}"
    )

    # === Step 3: Get parameters for matched category ===
    logger.info("Step 3: Retrieving testing parameters...")
    parameters = []

    if primary:
        category_code = primary["code"]
        parameters = _build_parameters_list(primary.get("parameters", []))
        category_name = primary.get("name", "")
    elif candidates:
        # Use top candidate even if low confidence
        primary = candidates[0]
        category_code = primary["code"]
        category_name = primary.get("name", "")
        parameters = _build_parameters_list(primary.get("parameters", []))
    else:
        # No match found - return empty recommendation
        logger.warning("No category match found for product description")
        category_code = "UNKNOWN"
        category_name = "Unclassified Product"
        parameters = []

    # === Step 4: Build final recommendation ===
    logger.info("Step 4: Building final recommendation response...")

    # Build candidates list (only include if review_flag is True or no primary)
    if review_flag or not primary:
        candidates_list = [
            {
                "code": c["code"],
                "name": c["name"],
                "confidence": round(c["confidence"], 2)
            }
            for c in candidates[:DEFAULT_MAX_CANDIDATES]
        ]
    else:
        candidates_list = []

    recommendation = {
        "category_code": category_code,
        "category_name": category_name,
        "confidence": round(confidence, 2),
        "review_flag": review_flag,
        "candidates": candidates_list,
        "parameters": parameters,
        "entities": entities,
        "disclaimer": EXPERT_REVIEW_DISCLAIMER
    }

    logger.info(
        f"Recommendation complete: {category_code} ({category_name}), "
        f"confidence={recommendation['confidence']}, "
        f"parameters={len(parameters)}"
    )

    return recommendation


def _build_parameters_list(category_parameters: list) -> list:
    """
    Build parameters list from category parameters.

    Extracts only the required fields: name, standard, regulation, type.

    Args:
        category_parameters: List of parameter dicts from bpom_rules.json

    Returns:
        list: List of dicts with required fields
    """
    required_fields = ["name", "standard", "regulation", "type"]

    result = []
    for param in category_parameters:
        param_dict = {
            "name": param.get("name", ""),
            "standard": param.get("standard", ""),
            "regulation": param.get("regulation", ""),
            "type": param.get("type", "")
        }
        # Only include if name is present
        if param_dict["name"]:
            result.append(param_dict)

    return result


def build_classify_response(recommendation: dict) -> dict:
    """
    Build the /classify endpoint response (without parameters).

    This is used for the lighter /classify endpoint that only returns
    the category match without full parameter list.

    Args:
        recommendation: Full recommendation from classify_and_recommend

    Returns:
        dict: Classification response (subset of recommendation)
    """
    return {
        "category_code": recommendation.get("category_code"),
        "category_name": recommendation.get("category_name"),
        "confidence": recommendation.get("confidence"),
        "review_flag": recommendation.get("review_flag"),
        "candidates": recommendation.get("candidates", []),
        "entities": recommendation.get("entities", {}),
        "disclaimer": recommendation.get("disclaimer")
    }


def build_recommend_response(recommendation: dict) -> dict:
    """
    Build the /recommend endpoint response (with parameters).

    This is used for the full /recommend endpoint that includes
    the complete parameter list for the matched category.

    Args:
        recommendation: Full recommendation from classify_and_recommend

    Returns:
        dict: Full recommendation response
    """
    return recommendation