import json

with open('data/bpom_rules.json', 'r') as f:
    data = json.load(f)

# New categories to add
new_categories = {
    "02.1": {
        "category_code": "02.1",
        "category_name": "Unprocessed Fresh Fish and Fish Products",
        "parent_code": "02",
        "description": "Fresh, chilled, or frozen fish, crustaceans, mollusks and other aquatic products",
        "keywords": {
            "product_names": ["fish", "ikan", "salmon", "tuna", "mackerel", "ikan kembung", "shrimp", "udang", "prawn", "crab", "kepiting", "squid", "cumi", "oyster", "kerang", "clam", "mussel", "seafood", "hasil laut"],
            "ingredients": ["fish", "ikan", "shrimp", "udang", "salt", "garam", "ice", "es"],
            "production_methods": ["fresh", "segar", "frozen", "dibekukan", "chilled", "didinginkan", "thawed", "dicairkan"],
            "health_claims": ["fresh", "segar", "high omega 3", "kaya omega 3", "lean protein", "protein tanpa lemak"]
        },
        "parameters": [
            {"id": "02.1_chem_001", "name": "TVB (Total Volatile Bases)", "standard": "Max 30 mg N/100g", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "chemical", "test_method": "Conway microdiffusion", "notes": "Freshness indicator"},
            {"id": "02.1_chem_002", "name": "TMA (Trimethylamine)", "standard": "Max 10 mg N/100g", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "chemical", "test_method": "Picric acid method", "notes": "Bacterial spoilage indicator"},
            {"id": "02.1_chem_003", "name": "Histamine", "standard": "Max 100 mg/kg (scombroid fish)", "regulation": "PerBPOM No. 16/2016 Annex II; Codex Stan 70-1981", "type": "chemical", "test_method": "HPLC-FL", "notes": "Critical for tuna, mackerel, sardine"},
            {"id": "02.1_chem_004", "name": "pH Value", "standard": "6.0-7.0 (fresh fish)", "regulation": "PerBPOM No. 16/2016 Annex", "type": "chemical", "test_method": "Potentiometric", "notes": "Freshness correlation"},
            {"id": "02.1_chem_005", "name": "Salt Content", "standard": "Max 2% (fresh)", "regulation": "SNI 01-2705-1992", "type": "chemical", "test_method": "Mohr titration", "notes": "For brined products"},
            {"id": "02.1_micro_001", "name": "Total Plate Count", "standard": "Max 1x10^5 CFU/g (frozen)", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "microbiological", "test_method": "ISO 4833", "notes": "Hygiene indicator"},
            {"id": "02.1_micro_002", "name": "E. coli", "standard": "Max 10 CFU/g (n=5, c=2)", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "microbiological", "test_method": "ISO 16649", "notes": "Fecal contamination"},
            {"id": "02.1_micro_003", "name": "Salmonella sp.", "standard": "Not detected in 25g", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "microbiological", "test_method": "ISO 6579", "notes": "Zero tolerance"},
            {"id": "02.1_micro_004", "name": "Vibrio sp.", "standard": "Max 100 CFU/g (V. parahaemolyticus)", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "microbiological", "test_method": "ISO 21872", "notes": "Seafood-specific pathogen"},
            {"id": "02.1_micro_005", "name": "Listeria monocytogenes", "standard": "Not detected in 25g (ready-to-eat)", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "microbiological", "test_method": "ISO 11290", "notes": "For RTE seafood"},
            {"id": "02.1_heavy_001", "name": "Methyl Mercury", "standard": "Max 0.5 mg/kg (fish general), Max 1.0 mg/kg (shark)", "regulation": "PerBPOM No. 5/2018 Annex I; Codex Stan 307-1995", "type": "heavy_metal", "test_method": "GC-ECD after alkylation", "notes": "Bioaccumulative neurotoxin"},
            {"id": "02.1_heavy_002", "name": "Lead (Pb)", "standard": "Max 0.3 mg/kg", "regulation": "PerBPOM No. 5/2018 Annex I", "type": "heavy_metal", "test_method": "ICP-OES", "notes": "Environmental contaminant"},
            {"id": "02.1_heavy_003", "name": "Cadmium (Cd)", "standard": "Max 0.05 mg/kg (fish), Max 0.5 mg/kg (crustaceans)", "regulation": "PerBPOM No. 5/2018 Annex I", "type": "heavy_metal", "test_method": "ICP-OES", "notes": "Shellfish accumulator"},
            {"id": "02.1_heavy_004", "name": "Arsenic (As)", "standard": "Max 0.1 mg/kg (inorganic)", "regulation": "PerBPOM No. 5/2018 Annex I", "type": "heavy_metal", "test_method": "ICP-OES/hydride", "notes": "Marine environment source"},
            {"id": "02.1_label_001", "name": "Product Name and Species", "standard": "Must state common name and scientific name", "regulation": "PerBPOM No. 22/2019 Article 6", "type": "labeling", "test_method": "Label review", "notes": "Critical for allergen identification"},
            {"id": "02.1_label_002", "name": "Catch Date/Production Date", "standard": "Must show date of catch or production", "regulation": "PerBPOM No. 22/2019 Article 10", "type": "labeling", "test_method": "Label review", "notes": "Freshness traceability"},
            {"id": "02.1_label_003", "name": "Storage Instructions", "standard": "Must state 'Keep frozen' or 'Keep chilled'", "regulation": "PerBPOM No. 22/2019 Article 11", "type": "labeling", "test_method": "Label review", "notes": "Temperature critical for safety"},
            {"id": "02.1_label_004", "name": "Country of Origin", "standard": "Required for imported seafood", "regulation": "PerBPOM No. 22/2019; Import regulations", "type": "labeling", "test_method": "Label review", "notes": "Mandatory for imports"},
            {"id": "02.1_label_005", "name": "Allergen Declaration", "standard": "Must declare fish, crustaceans, mollusks", "regulation": "PerBPOM No. 22/2019 Article 8", "type": "labeling", "test_method": "Label review", "notes": "Top 8 allergen group"}
        ]
    },
    "03": {
        "category_code": "03",
        "category_name": "Preserved Fish and Seafood Products",
        "parent_code": "03",
        "description": "Canned, dried, salted, smoked fish and fishery products including fish sauce, paste, and concentrates",
        "keywords": {
            "product_names": ["canned fish", "ikan kaleng", "tuna kaleng", "sardine", "dried fish", "ikan asin", "dried shrimp", "ebi", "terasi", "shrimp paste", "belacan", "fish sauce", "kecap ikan", "fish ball", "bakso ikan", "fish stick", "tempura"],
            "ingredients": ["fish", "ikan", "salt", "garam", "preservatives", "pengawet", "oil", "minyak", "sauce", "saus", "soy sauce", "kecap", "sugar", "gula"],
            "production_methods": ["canned", "dikalengkan", "dried", "dikeringkan", "salted", "diasinkan", "smoked", "diasap", "fermented", "difermentasi", "boiled", "direbus", "fried", "digoreng"],
            "health_claims": ["preserved", "awet", "high protein", "protein tinggi", "natural preservation", "pengawetan alami"]
        },
        "parameters": [
            {"id": "03_chem_001", "name": "Moisture Content", "standard": "Max 15% (dried fish)", "regulation": "SNI 01-2721-1992; PerBPOM No. 34/2019", "type": "chemical", "test_method": "Gravimetric 105C", "notes": "Quality and shelf life"},
            {"id": "03_chem_002", "name": "Salt Content", "standard": "Max 10% (dried), Max 25% (salted)", "regulation": "SNI 01-2721-1992", "type": "chemical", "test_method": "Mohr titration", "notes": "Preservation efficacy"},
            {"id": "03_chem_003", "name": "Aw (Water Activity)", "standard": "Max 0.85 (dried); Max 0.90 (salted)", "regulation": "PerBPOM No. 16/2016 Annex", "type": "chemical", "test_method": "HygroLab", "notes": "Microbiological stability"},
            {"id": "03_chem_004", "name": "Histamine", "standard": "Max 200 mg/kg (dried/salted); Max 100 mg/kg (canned)", "regulation": "PerBPOM No. 16/2016 Annex II", "type": "chemical", "test_method": "HPLC-FL", "notes": "Scombroid poisoning risk"},
            {"id": "03_chem_005", "name": "Protein Content", "standard": "Min 20% (dried fish)", "regulation": "SNI 01-2721-1992 Section 3", "type": "chemical", "test_method": "Kjeldahl", "notes": "Nutritional quality"},
            {"id": "03_chem_006", "name": "Fat Content", "standard": "Variable - must match label", "regulation": "PerBPOM No. 22/2019", "type": "chemical", "test_method": "Soxhlet", "notes": "Label declaration compliance"},
            {"id": "03_micro_001", "name": "Total Plate Count", "standard": "Max 1x10^4 CFU/g (canned)", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "microbiological", "test_method": "ISO 4833", "notes": "Sterility indicator for canned"},
            {"id": "03_micro_002", "name": "Clostridium botulinum", "standard": "Not detected (for non-heat treated)", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "microbiological", "test_method": "ISO 7937 enrichment", "notes": "Botulism risk in anaerobic products"},
            {"id": "03_micro_003", "name": "Salmonella sp.", "standard": "Not detected in 25g", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "microbiological", "test_method": "ISO 6579", "notes": "Zero tolerance"},
            {"id": "03_micro_004", "name": "E. coli", "standard": "Max 10 CFU/g (n=5, c=2)", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "microbiological", "test_method": "ISO 16649", "notes": "Hygiene indicator"},
            {"id": "03_micro_005", "name": "Yeast and Mold", "standard": "Max 100 CFU/g", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "microbiological", "test_method": "ISO 21527", "notes": "Spoilage indicator"},
            {"id": "03_heavy_001", "name": "Lead (Pb)", "standard": "Max 0.3 mg/kg", "regulation": "PerBPOM No. 5/2018 Annex I", "type": "heavy_metal", "test_method": "ICP-OES", "notes": "Environmental contaminant"},
            {"id": "03_heavy_002", "name": "Methyl Mercury", "standard": "Max 0.5 mg/kg", "regulation": "PerBPOM No. 5/2018 Annex I", "type": "heavy_metal", "test_method": "GC-ECD", "notes": "Predatory fish accumulate more"},
            {"id": "03_heavy_003", "name": "Cadmium (Cd)", "standard": "Max 0.05 mg/kg", "regulation": "PerBPOM No. 5/2018 Annex I", "type": "heavy_metal", "test_method": "ICP-OES", "notes": "Bioaccumulation risk"},
            {"id": "03_label_001", "name": "Net Weight and Drained Weight", "standard": "Must declare both net and drained weight", "regulation": "PerBPOM No. 22/2019 Article 9", "type": "labeling", "test_method": "Label review", "notes": "Consumer protection"},
            {"id": "03_label_002", "name": "Fish Species Declaration", "standard": "Must state fish species (common and scientific name)", "regulation": "PerBPOM No. 22/2019 Article 6", "type": "labeling", "test_method": "Label review", "notes": "Transparency requirement"},
            {"id": "03_label_003", "name": "Preservation Method", "standard": "Must indicate method (salted, dried, smoked, etc.)", "regulation": "PerBPOM No. 22/2019 Article 6", "type": "labeling", "test_method": "Label review", "notes": "Product identity"},
            {"id": "03_label_004", "name": "Storage Instructions", "standard": "Must indicate storage condition after opening", "regulation": "PerBPOM No. 22/2019 Article 11", "type": "labeling", "test_method": "Label review", "notes": "Post-opening safety"},
            {"id": "03_label_005", "name": "Nutrition Declaration", "standard": "Required per serving", "regulation": "PerBPOM No. 22/2019 Article 5", "type": "labeling", "test_method": "Lab + label review", "notes": "Mandatory for packaged food"}
        ]
    },
    "04.1": {
        "category_code": "04.1",
        "category_name": "Fresh Fruits and Vegetables",
        "parent_code": "04",
        "description": "Fresh, chilled, or frozen whole fruits and vegetables without any processing",
        "keywords": {
            "product_names": ["apple", "apel", "orange", "jeruk", "banana", "pisang", "mango", "mangga", "tomato", "tomat", "carrot", "wortel", "spinach", "bayam", "lettuce", "selada", "fresh fruit", "buah segar", "fresh vegetables", "sayuran segar"],
            "ingredients": [],
            "production_methods": ["fresh", "segar", "frozen", "dibekukan", "chilled", "didinginkan"],
            "health_claims": ["fresh", "segar", "organic", "organik", "no pesticide", "tanpa pestisida", "natural", "alami", "rich in vitamins", "kaya vitamin"]
        },
        "parameters": [
            {"id": "04.1_chem_001", "name": "Pesticide Residues (Multi-residue)", "standard": "Per PerBPOM No. 4/2022 and Codex MRLs", "regulation": "PerBPOM No. 4/2022; Codex Stan 318-2014", "type": "chemical", "test_method": "GC-MS/MS + LC-MS/MS multi-residue", "notes": "100+ pesticides screened"},
            {"id": "04.1_chem_002", "name": "Chlorpyrifos", "standard": "Max 0.01 mg/kg (EU level)", "regulation": "PerBPOM No. 4/2022 Annex", "type": "chemical", "test_method": "GC-NPD", "notes": "Common insecticide in tropical fruits"},
            {"id": "04.1_chem_003", "name": "Carbendazim", "standard": "Max 0.05 mg/kg", "regulation": "PerBPOM No. 4/2022 Annex", "type": "chemical", "test_method": "HPLC-UV", "notes": "Fungicide residue"},
            {"id": "04.1_chem_004", "name": "Brix (for fruits)", "standard": "Min 10Brix (mango), Min 11Brix (orange)", "regulation": "SNI standards; PerBPOM No. 34/2019", "type": "chemical", "test_method": "Refractometer 20C", "notes": "Ripeness and quality indicator"},
            {"id": "04.1_chem_005", "name": "Titratable Acidity", "standard": "Variable by fruit type", "regulation": "SNI standards", "type": "chemical", "test_method": "Titration 0.1N NaOH", "notes": "Maturity indicator"},
            {"id": "04.1_chem_006", "name": "Residual SO2 (for treated)", "standard": "Max 50 mg/kg (fruits)", "regulation": "PerBPOM No. 13/2020 Annex I", "type": "chemical", "test_method": "Monier-Williams distillation", "notes": "Preservative for dried fruits"},
            {"id": "04.1_micro_001", "name": "E. coli", "standard": "Max 100 CFU/g (pre-cut)", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "microbiological", "test_method": "ISO 16649", "notes": "Hygiene indicator for fresh-cut"},
            {"id": "04.1_micro_002", "name": "Salmonella sp.", "standard": "Not detected in 25g (pre-cut ready-to-eat)", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "microbiological", "test_method": "ISO 6579", "notes": "Zero tolerance for RTE"},
            {"id": "04.1_micro_003", "name": "Listeria monocytogenes", "standard": "Not detected in 25g (RTE fresh-cut)", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "microbiological", "test_method": "ISO 11290", "notes": "Critical for RTE fresh produce"},
            {"id": "04.1_heavy_001", "name": "Lead (Pb)", "standard": "Max 0.1 mg/kg", "regulation": "PerBPOM No. 5/2018 Annex I", "type": "heavy_metal", "test_method": "ICP-OES", "notes": "Soil/irrigation contamination"},
            {"id": "04.1_heavy_002", "name": "Cadmium (Cd)", "standard": "Max 0.05 mg/kg (leafy veg), Max 0.2 mg/kg (root veg)", "regulation": "PerBPOM No. 5/2018 Annex I", "type": "heavy_metal", "test_method": "ICP-OES", "notes": "Root crops accumulate more"},
            {"id": "04.1_heavy_003", "name": "Arsenic (As)", "standard": "Max 0.1 mg/kg", "regulation": "PerBPOM No. 5/2018 Annex I", "type": "heavy_metal", "test_method": "ICP-OES/hydride", "notes": "Agricultural land contamination"},
            {"id": "04.1_label_001", "name": "Country of Origin", "standard": "Required for all fresh produce", "regulation": "PerBPOM No. 22/2019; Import regulations", "type": "labeling", "test_method": "Label review", "notes": "Traceability requirement"},
            {"id": "04.1_label_002", "name": "Grade/Class", "standard": "Must indicate quality class if graded", "regulation": "PerBPOM No. 22/2019 Article 6", "type": "labeling", "test_method": "Label review", "notes": "Quality specification"},
            {"id": "04.1_label_003", "name": "Organic Certification Mark", "standard": "Must have organic certification body mark if claimed", "regulation": "PerBPOM organic regulations", "type": "labeling", "test_method": "Certification verification", "notes": "Cannot claim organic without certification"},
            {"id": "04.1_label_004", "name": "Allergen Declaration", "standard": "N/A for plain fresh produce (declare if processed with allergens)", "regulation": "PerBPOM No. 22/2019 Article 8", "type": "labeling", "test_method": "Label review", "notes": "Cross-contact allergens in mixed packs"},
            {"id": "04.1_label_005", "name": "Storage Instructions", "standard": "Must state storage temperature range", "regulation": "PerBPOM No. 22/2019 Article 11", "type": "labeling", "test_method": "Label review", "notes": "Temperature critical for fresh produce"}
        ]
    },
    "04.2": {
        "category_code": "04.2",
        "category_name": "Processed Fruits and Vegetables",
        "parent_code": "04",
        "description": "Canned, dried, frozen, preserved fruits and vegetables including jams, sauces, purees, and concentrates",
        "keywords": {
            "product_names": ["jam", "selai", "canned vegetables", "sayur kaleng", "dried fruit", "buah kering", "fruit puree", "pure buah", "tomato paste", "pasta tomat", "fruit sauce", "saus buah", "pickles", "acar", "fruit juice concentrate", "konsentrat jus buah"],
            "ingredients": ["fruit", "buah", "vegetable", "sayur", "sugar", "gula", "salt", "garam", "preservatives", "pengawet", "citric acid", "asam sitrat"],
            "production_methods": ["canned", "dikalengkan", "dried", "dikeringkan", "pasteurized", "dipasteurisasi", "concentrated", "dikonsentrasikan", "preserved", "di-awetkan", "frozen", "dibekukan", "boiled", "direbus"],
            "health_claims": ["natural", "alami", "no artificial color", "tanpa pewarna", "high fiber", "serat tinggi", "organic", "organik", "preservative free", "tanpa pengawet"]
        },
        "parameters": [
            {"id": "04.2_chem_001", "name": "Brix / Total Soluble Solids", "standard": "Min 20Brix (jam), Min 12Brix (canned fruit)", "regulation": "SNI standards; PerBPOM No. 34/2019", "type": "chemical", "test_method": "Refractometer 20C", "notes": "Quality and sweetness indicator"},
            {"id": "04.2_chem_002", "name": "Total Sugar as Sucrose", "standard": "Max 65% (jam); label declaration required", "regulation": "PerBPOM No. 22/2019", "type": "chemical", "test_method": "Lane-Eynon", "notes": "Sweetness and caloric content"},
            {"id": "04.2_chem_003", "name": "Titratable Acidity", "standard": "0.3-1.0% (varies by product)", "regulation": "SNI standards", "type": "chemical", "test_method": "Titration 0.1N NaOH", "notes": "Flavor and preservation indicator"},
            {"id": "04.2_chem_004", "name": "pH Value", "standard": "3.5-4.5 (canned); 3.0-4.0 (jam)", "regulation": "PerBPOM No. 16/2016 Annex", "type": "chemical", "test_method": "Potentiometric", "notes": "Microbiological stability"},
            {"id": "04.2_chem_005", "name": "Sodium Benzoate / Sorbic Acid", "standard": "Max 200 mg/kg (benzoate); Max 300 mg/kg (sorbate)", "regulation": "PerBPOM No. 13/2020 Annex I", "type": "chemical", "test_method": "HPLC-UV", "notes": "Preservatives in low-acid products"},
            {"id": "04.2_chem_006", "name": "Pectin Content (for jam)", "standard": "Min 0.5% for proper gel structure", "regulation": "SNI 01-4152-1996", "type": "chemical", "test_method": "Gravimetric", "notes": "Jam quality specification"},
            {"id": "04.2_micro_001", "name": "Total Plate Count", "standard": "Max 1x10^3 CFU/g (pasteurized canned)", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "microbiological", "test_method": "ISO 4833", "notes": "Shelf stability indicator"},
            {"id": "04.2_micro_002", "name": "E. coli", "standard": "Max 10 CFU/g (n=5, c=2)", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "microbiological", "test_method": "ISO 16649", "notes": "Hygiene indicator"},
            {"id": "04.2_micro_003", "name": "Yeast and Mold", "standard": "Max 100 CFU/g (fruit products)", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "microbiological", "test_method": "ISO 21527", "notes": "Spoilage indicator especially in jams"},
            {"id": "04.2_micro_004", "name": "Salmonella sp.", "standard": "Not detected in 25g", "regulation": "PerBPOM No. 16/2016 Annex I", "type": "microbiological", "test_method": "ISO 6579", "notes": "Zero tolerance"},
            {"id": "04.2_heavy_001", "name": "Lead (Pb)", "standard": "Max 0.1 mg/kg", "regulation": "PerBPOM No. 5/2018 Annex I", "type": "heavy_metal", "test_method": "ICP-OES", "notes": "Environmental contamination"},
            {"id": "04.2_heavy_002", "name": "Tin (Sn) - Canned", "standard": "Max 250 mg/kg (canned products)", "regulation": "PerBPOM No. 5/2018 Annex II", "type": "heavy_metal", "test_method": "ICP-OES", "notes": "Corrosion from can lining"},
            {"id": "04.2_heavy_003", "name": "Copper (Cu)", "standard": "Max 5 mg/kg", "regulation": "PerBPOM No. 5/2018 Annex II", "type": "heavy_metal", "test_method": "ICP-OES", "notes": "Equipment contamination"},
            {"id": "04.2_label_001", "name": "Fruit/Vegetable Content", "standard": "Must declare % content (min 45% for jam)", "regulation": "SNI 01-4152-1996; PerBPOM No. 34/2019", "type": "labeling", "test_method": "Label review", "notes": "Quality standard"},
            {"id": "04.2_label_002", "name": "Nutrition Declaration", "standard": "Required per 100g or per serving", "regulation": "PerBPOM No. 22/2019 Article 5", "type": "labeling", "test_method": "Lab + label review", "notes": "Mandatory for packaged products"},
            {"id": "04.2_label_003", "name": "Sweetener Declaration", "standard": "Must declare all sweeteners used", "regulation": "PerBPOM No. 13/2020 Annex II", "type": "labeling", "test_method": "Label review", "notes": "Sugar and artificial sweeteners"},
            {"id": "04.2_label_004", "name": "Preservatives Declaration", "standard": "Must declare type and amount in ingredient list", "regulation": "PerBPOM No. 22/2019 Article 7", "type": "labeling", "test_method": "Label review", "notes": "Ingredient transparency"},
            {"id": "04.2_label_005", "name": "Storage Instructions", "standard": "Must indicate after opening storage", "regulation": "PerBPOM No. 22/2019 Article 11", "type": "labeling", "test_method": "Label review", "notes": "Refrigeration after opening for jams"},
            {"id": "04.2_label_006", "name": "Allergen Declaration", "standard": "Must declare sulfites if used as preservative", "regulation": "PerBPOM No. 22/2019 Article 8", "type": "labeling", "test_method": "Label review", "notes": "Sulfites are top allergens"}
        ]
    }
}

# Add new categories
data['categories'].update(new_categories)

# Update last_updated
data['last_updated'] = '2026-05-06'

print(f"Added {len(new_categories)} new categories")
print(f"Total categories now: {len(data['categories'])}")
print(f"Categories: {list(data['categories'].keys())}")

# Save back
with open('data/bpom_rules.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("bpom_rules.json updated successfully!")