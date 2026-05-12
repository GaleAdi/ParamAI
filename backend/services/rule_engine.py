"""
ParamAI — BPOM Rule Engine
Core matching algorithm that scores BPOM categories against extracted product entities.

Competition: AI Open Innovation Challenge 2026
Team: Kebut Semalam, President University
"""

import logging
import os
from typing import Optional

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Default threshold from environment
DEFAULT_CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.80"))
DEFAULT_MAX_CANDIDATES = int(os.getenv("MAX_CANDIDATES", "3"))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BPOMRuleEngine:
    """
    Rule engine for matching extracted product entities against BPOM categories.

    Scoring algorithm:
    - ingredient_overlap × 0.40 (weighted ingredient category matching)
    - production_method × 0.30 (binary: method matches category)
    - health_claim_match × 0.30 (binary: any claim matches category)
    """

    # Valid ingredient categories from Claude service
    VALID_INGREDIENT_CATEGORIES = {
        "cereal", "dairy", "fat", "meat", "fish", "vegetable",
        "fruit", "sweetener", "additive", "vitamin", "mineral",
        "herb", "protein", "water"
    }

    # Valid production keywords from Claude service
    VALID_PRODUCTION_KEYWORDS = {
        "baked", "fried", "boiled", "steamed", "fermented",
        "pasteurized", "dried", "smoked", "frozen", "raw",
        "blended", "concentrated"
    }

    def __init__(self, rules_data: dict):
        """
        Initialize the rule engine with BPOM rules data.

        Args:
            rules_data: Complete bpom_rules.json data containing categories
        """
        self.rules_data = rules_data
        self.categories = rules_data.get("categories", {})
        self.confidence_threshold = float(
            rules_data.get("confidence_threshold", DEFAULT_CONFIDENCE_THRESHOLD)
        )
        self.max_candidates = DEFAULT_MAX_CANDIDATES
        self.scoring_weights = rules_data.get("scoring_weights", {
            "ingredient_overlap": 0.40,
            "production_method": 0.30,
            "health_claim_match": 0.30
        })

        logger.info(f"BPOM Rule Engine initialized with {len(self.categories)} categories")
        logger.info(f"Confidence threshold: {self.confidence_threshold}")

    def score_category(self, category_code: str, entities: dict) -> float:
        """
        Calculate match score for a category against extracted entities.

        Args:
            category_code: BPOM category code (e.g., "07.1", "supplement")
            entities: Extracted entity dictionary from Claude service

        Returns:
            float: Score between 0.0 and 1.0
        """
        if category_code not in self.categories:
            logger.warning(f"Category {category_code} not found in rules")
            return 0.0

        category = self.categories[category_code]
        keywords = category.get("keywords", {})

        # Calculate individual score components
        ingredient_score = self._calculate_ingredient_score(entities, keywords)
        production_score = self._calculate_production_score(entities, keywords)
        claim_score = self._calculate_health_claim_score(entities, keywords)

        # Apply weights
        weights = self.scoring_weights
        total_score = (
            ingredient_score * weights.get("ingredient_overlap", 0.40) +
            production_score * weights.get("production_method", 0.30) +
            claim_score * weights.get("claim_keywords", 0.30)
        )

        # Clamp to valid range
        total_score = min(max(total_score, 0.0), 1.0)

        logger.debug(
            f"Category {category_code}: "
            f"ing={ingredient_score:.2f}, prod={production_score:.2f}, "
            f"claim={claim_score:.2f}, total={total_score:.2f}"
        )

        return total_score

    def _calculate_ingredient_score(
        self, entities: dict, keywords: dict
    ) -> float:
        """
        Calculate ingredient overlap score.

        Compares extracted ingredient_categories against category's ingredient keywords.
        Score = (matched keywords / total category keywords)

        Args:
            entities: Extracted entities from Claude
            keywords: Category keywords dict

        Returns:
            float: Ingredient match ratio (0.0 to 1.0)
        """
        # Get extracted ingredient categories (Claude outputs these)
        extracted_categories = entities.get("ingredient_categories", [])
        if not extracted_categories:
            # Fallback: check ingredients list for keyword matches
            extracted_ingredients = entities.get("ingredients", [])
            if not extracted_ingredients:
                return 0.0

            category_ingredient_keywords = keywords.get("ingredients", [])
            if not category_ingredient_keywords:
                return 0.0

            # Count how many extracted ingredients match category keywords
            matches = 0
            for ingredient in extracted_ingredients:
                ingredient_lower = ingredient.lower()
                for keyword in category_ingredient_keywords:
                    if keyword.lower() in ingredient_lower or ingredient_lower in keyword.lower():
                        matches += 1
                        break

            return min(matches / len(category_ingredient_keywords), 1.0)

        # Use ingredient_categories for scoring
        category_ingredient_keywords = keywords.get("ingredients", [])
        if not category_ingredient_keywords:
            return 0.0

        # Count matches (case-insensitive)
        matches = 0
        for extracted_cat in extracted_categories:
            if extracted_cat.lower() in category_ingredient_keywords:
                matches += 1
            else:
                # Check if any keyword is in the extracted category
                for keyword in category_ingredient_keywords:
                    if keyword.lower() in extracted_cat.lower():
                        matches += 1
                        break

        # Calculate ratio (capped at 1.0)
        return min(matches / len(category_ingredient_keywords), 1.0)

    def _calculate_production_score(
        self, entities: dict, keywords: dict
    ) -> float:
        """
        Calculate production method match score.

        Binary scoring: 1.0 if any production keyword matches, 0.0 otherwise.

        Args:
            entities: Extracted entities from Claude
            keywords: Category keywords dict

        Returns:
            float: 1.0 if match, 0.0 if no match
        """
        # Get extracted production keywords
        extracted_production_keywords = entities.get("production_keywords", [])
        if not extracted_production_keywords:
            # Fallback: check production_method string
            production_method = entities.get("production_method", "")
            if not production_method:
                return 0.0

            category_production_methods = keywords.get("production_methods", [])
            if not category_production_methods:
                return 0.0

            # Check if any category method is in the production string
            method_lower = production_method.lower()
            for method in category_production_methods:
                if method.lower() in method_lower:
                    return 1.0

            return 0.0

        # Check against category production methods
        category_production_methods = keywords.get("production_methods", [])
        if not category_production_methods:
            return 0.0

        # Binary match: any keyword matches
        for extracted_kw in extracted_production_keywords:
            if extracted_kw.lower() in category_production_methods:
                return 1.0
            # Also check reverse (category keyword in extracted)
            for category_method in category_production_methods:
                if category_method.lower() in extracted_kw.lower():
                    return 1.0

        return 0.0

    def _calculate_health_claim_score(
        self, entities: dict, keywords: dict
    ) -> float:
        """
        Calculate health claim match score.

        Binary scoring: 1.0 if any health claim matches, 0.0 otherwise.

        Args:
            entities: Extracted entities from Claude
            keywords: Category keywords dict

        Returns:
            float: 1.0 if match, 0.0 if no match
        """
        extracted_claims = entities.get("health_claims", [])
        if not extracted_claims:
            return 0.0

        category_claims = keywords.get("health_claims", [])
        if not category_claims:
            return 0.0

        # Binary match: any claim keyword matches
        for extracted_claim in extracted_claims:
            claim_lower = extracted_claim.lower()
            for category_claim in category_claims:
                if category_claim.lower() in claim_lower or claim_lower in category_claim.lower():
                    return 1.0

        return 0.0

    def match(self, entities: dict) -> dict:
        """
        Match extracted entities against all BPOM categories.

        Args:
            entities: Extracted entity dictionary from Claude service

        Returns:
            dict: Match result containing:
                - primary: Primary category dict or None
                - confidence: Confidence score (0.0 to 1.0)
                - candidates: List of top N candidates with scores
                - review_flag: True if confidence < threshold (needs expert review)
        """
        if not entities:
            return {
                "primary": None,
                "confidence": 0.0,
                "candidates": [],
                "review_flag": True
            }

        # Score all categories
        scores = []
        for category_code in self.categories:
            score = self.score_category(category_code, entities)
            category_data = self.categories[category_code]

            scores.append({
                "code": category_code,
                "name": category_data.get("category_name", ""),
                "confidence": score,
                "parameters": category_data.get("parameters", [])
            })

        # Sort by confidence (descending)
        scores.sort(key=lambda x: x["confidence"], reverse=True)

        # Get primary recommendation
        if scores and scores[0]["confidence"] > 0:
            primary = scores[0]
            confidence = scores[0]["confidence"]
            candidates = scores[: self.max_candidates]
            review_flag = confidence < self.confidence_threshold
        else:
            primary = None
            confidence = 0.0
            candidates = []
            review_flag = True

        result = {
            "primary": primary,
            "confidence": confidence,
            "candidates": candidates,
            "review_flag": review_flag
        }

        logger.info(
            f"Match complete: primary={primary['code'] if primary else 'None'}, "
            f"confidence={confidence:.2f}, review_flag={review_flag}"
        )

        return result

    def get_category_parameters(self, category_code: str) -> list:
        """
        Get all testing parameters for a category.

        Args:
            category_code: BPOM category code

        Returns:
            list: List of parameter dictionaries
        """
        if category_code not in self.categories:
            return []

        return self.categories[category_code].get("parameters", [])

    def get_all_categories(self) -> list:
        """
        Get list of all available category codes.

        Returns:
            list: List of category codes
        """
        return list(self.categories.keys())