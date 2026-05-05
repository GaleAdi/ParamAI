"""
ParamAI — Claude API Service
Handles all communication with Anthropic Claude API for entity extraction.

Competition: AI Open Innovation Challenge 2026
Team: Group 1, President University
"""

import json
import logging
import os
import re
from typing import Optional

import anthropic
from dotenv import load_dotenv
from fastapi import HTTPException

# Load environment variables
load_dotenv()

# Configuration from environment
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
MODEL_NAME = os.getenv("MODEL_NAME", "claude-haiku-4-5-20251001")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# System prompt for entity extraction
SYSTEM_PROMPT = """You are a regulatory classification assistant for PT TUV Nord Indonesia.
Extract structured product information from the client's product description.
Return ONLY valid JSON with no markdown, no explanation, just the JSON object.

Required fields:
{
  "product_name": string or null,
  "ingredients": [string] or [],
  "ingredient_categories": [string] or [],
  "production_method": string or null,
  "production_keywords": [string] or [],
  "target_consumer": string or null,
  "health_claims": [string] or [],
  "product_form": string or null
}

ingredient_categories must use these values only:
cereal, dairy, fat, meat, fish, vegetable, fruit, sweetener,
additive, vitamin, mineral, herb, protein, water

production_keywords must use these values only:
baked, fried, boiled, steamed, fermented, pasteurized,
dried, smoked, frozen, raw, blended, concentrated

Only extract what is explicitly stated. Use null if not mentioned."""


class ClaudeService:
    """Service class for Claude API interactions."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        """Initialize Claude service with optional API key and model override."""
        self.api_key = api_key or ANTHROPIC_API_KEY
        self.model = model or MODEL_NAME
        self._client: Optional[anthropic.Anthropic] = None

    @property
    def client(self) -> anthropic.Anthropic:
        """Lazy initialization of Anthropic client."""
        if self._client is None:
            if not self.api_key or self.api_key == "your_key_here":
                raise ValueError(
                    "ANTHROPIC_API_KEY is not set or is still set to placeholder. "
                    "Please configure your API key in .env file."
                )
            self._client = anthropic.Anthropic(api_key=self.api_key)
        return self._client

    async def extract_product_entities(self, description: str) -> dict:
        """
        Call Claude API to extract structured product entities from description.

        Args:
            description: Free-text product description from client

        Returns:
            dict: Structured product information with fields:
                - product_name: string or null
                - ingredients: list of ingredient strings
                - ingredient_categories: list of category values
                - production_method: string or null
                - production_keywords: list of keyword values
                - target_consumer: string or null
                - health_claims: list of health claim strings
                - product_form: string or null

        Raises:
            HTTPException: If API call fails or response cannot be parsed
        """
        if not description or not description.strip():
            raise HTTPException(
                status_code=400,
                detail="Product description cannot be empty"
            )

        if not self.api_key or self.api_key == "your_key_here":
            raise HTTPException(
                status_code=500,
                detail="Claude API key not configured. Please set ANTHROPIC_API_KEY in .env"
            )

        try:
            logger.info(f"Calling Claude API with model: {self.model}")
            logger.info(f"Description length: {len(description)} chars")

            # Call Claude API
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                temperature=0.1,  # Low temperature for consistent extraction
                system=SYSTEM_PROMPT,
                messages=[
                    {
                        "role": "user",
                        "content": f"Extract entities from this product description:\n{description}"
                    }
                ]
            )

            # Extract response text
            response_text = response.content[0].text.strip()
            logger.info(f"Claude response received: {len(response_text)} chars")

            # Parse JSON safely
            entities = self._parse_json_response(response_text)

            # Validate required fields
            self._validate_entities(entities)

            logger.info("Entity extraction successful")
            return entities

        except anthropic.APIError as e:
            logger.error(f"Claude API error: {e}")
            raise HTTPException(
                status_code=502,
                detail=f"Claude API error: {str(e)}"
            )
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error: {e}")
            logger.error(f"Raw response: {response_text[:500]}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse Claude response as JSON: {str(e)}"
            )
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Entity extraction failed: {str(e)}"
            )

    def _parse_json_response(self, response_text: str) -> dict:
        """
        Parse JSON from Claude response, handling various formats.

        Claude sometimes returns JSON with markdown code blocks or with extra text.
        This method handles those cases.

        Args:
            response_text: Raw text from Claude API

        Returns:
            dict: Parsed JSON as dictionary

        Raises:
            JSONDecodeError: If JSON cannot be parsed
        """
        # Remove markdown code blocks if present
        cleaned = response_text.strip()

        # Handle triple backticks with language identifier
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:]

        # Remove closing backticks
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]

        # Remove any leading/trailing whitespace
        cleaned = cleaned.strip()

        # Handle potential text before/after JSON
        # Try to find JSON object boundaries
        json_start = cleaned.find('{')
        json_end = cleaned.rfind('}') + 1

        if json_start != -1 and json_end > json_start:
            cleaned = cleaned[json_start:json_end]

        # Parse the cleaned JSON
        return json.loads(cleaned)

    def _validate_entities(self, entities: dict) -> None:
        """
        Validate that extracted entities have required structure.

        Args:
            entities: Parsed entity dictionary

        Raises:
            HTTPException: If validation fails
        """
        # Define expected fields with their types
        required_fields = {
            "product_name": (str, type(None)),
            "ingredients": list,
            "ingredient_categories": list,
            "production_method": (str, type(None)),
            "production_keywords": list,
            "target_consumer": (str, type(None)),
            "health_claims": list,
            "product_form": (str, type(None)),
        }

        missing_fields = []
        for field, expected_type in required_fields.items():
            if field not in entities:
                missing_fields.append(field)

        if missing_fields:
            raise HTTPException(
                status_code=500,
                detail=f"Claude response missing required fields: {missing_fields}"
            )


# Default service instance for import
default_service = ClaudeService()


async def extract_product_entities(description: str) -> dict:
    """
    Convenience function for entity extraction using default service.

    Args:
        description: Free-text product description

    Returns:
        dict: Extracted product entities

    Raises:
        HTTPException: On extraction failure
    """
    return await default_service.extract_product_entities(description)