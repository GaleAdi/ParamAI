"""
ParamAI — Snifox AI Service
Handles all communication with Snifox AI via OpenAI-compatible API for entity extraction.

Competition: AI Open Innovation Challenge 2026
Team: Group 1, President University
"""

import json
import logging
import os
from typing import Optional

from dotenv import load_dotenv
from fastapi import HTTPException
from openai import OpenAI

# Load environment variables
load_dotenv()

# Configuration from environment
SNIFOX_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
SNIFOX_BASE_URL = os.getenv("SNIFOX_BASE_URL", "https://core.snifoxai.com/v1")
MODEL_NAME = os.getenv("MODEL_NAME", "gpt-4o-mini")

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


class SnifoxService:
    """Service class for Snifox AI interactions (OpenAI-compatible)."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        """Initialize Snifox service with optional API key and model override."""
        self.api_key = api_key or SNIFOX_API_KEY
        self.model = model or MODEL_NAME
        self.base_url = SNIFOX_BASE_URL
        self._client: Optional[OpenAI] = None

    @property
    def client(self) -> OpenAI:
        """Lazy initialization of OpenAI client pointing to Snifox."""
        if self._client is None:
            if not self.api_key or self.api_key == "your_key_here":
                raise ValueError(
                    "ANTHROPIC_API_KEY is not set or is still set to placeholder. "
                    "Please configure your Snifox API key in .env file."
                )
            self._client = OpenAI(
                api_key=self.api_key,
                base_url=self.base_url,
            )
        return self._client

    async def extract_product_entities(self, description: str) -> dict:
        """
        Call Snifox AI to extract structured product entities from description.

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
                detail="Snifox API key not configured. Please set ANTHROPIC_API_KEY in .env"
            )

        try:
            logger.info(f"Calling Snifox AI with model: {self.model}")
            logger.info(f"Base URL: {self.base_url}")
            logger.info(f"Description length: {len(description)} chars")

            # Call Snifox AI via OpenAI-compatible endpoint
            response = self.client.chat.completions.create(
                model=self.model,
                max_tokens=1024,
                temperature=0.1,  # Low temperature for consistent extraction
                messages=[
                    {
                        "role": "system",
                        "content": SYSTEM_PROMPT
                    },
                    {
                        "role": "user",
                        "content": f"Extract entities from this product description:\n{description}"
                    }
                ]
            )

            # Extract response text
            response_text = response.choices[0].message.content.strip()
            logger.info(f"Snifox response received: {len(response_text)} chars")

            # Parse JSON safely
            entities = self._parse_json_response(response_text)

            # Validate required fields
            self._validate_entities(entities)

            logger.info("Entity extraction successful")
            return entities

        except Exception as e:
            logger.error(f"Snifox API error: {e}")
            raise HTTPException(
                status_code=502,
                detail=f"Snifox API error: {str(e)}"
            )

    def _parse_json_response(self, response_text: str) -> dict:
        """
        Parse JSON from Snifox response, handling various formats.
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
        json_start = cleaned.find('{')
        json_end = cleaned.rfind('}') + 1

        if json_start != -1 and json_end > json_start:
            cleaned = cleaned[json_start:json_end]

        return json.loads(cleaned)

    def _validate_entities(self, entities: dict) -> None:
        """
        Validate that extracted entities have required structure.
        """
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
                detail=f"Snifox response missing required fields: {missing_fields}"
            )


# Default service instance for import
default_service = SnifoxService()


async def extract_product_entities(description: str) -> dict:
    """
    Convenience function for entity extraction using default service.
    """
    return await default_service.extract_product_entities(description)
