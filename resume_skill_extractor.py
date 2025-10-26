""" 
 Resume Skill Extractor using BERT-based NER + Custom Skill Set Filter 
 --------------------------------------------------------------------- 
 Usage: 
     python resume_skill_extractor.py /path/to/resume.pdf 
 
 Dependencies: 
     pip install transformers torch pdfminer.six spacy 
     python -m spacy download en_core_web_sm 
 """ 
 
import sys 
import os 
import json
from collections import Counter 
 
# ----------------------------- 
# IMPORTS 
# ----------------------------- 
try: 
    from pdfminer.high_level import extract_text 
except Exception: 
    raise ImportError("pdfminer.six is required. Install with: pip install pdfminer.six") 
 
try: 
    from transformers import pipeline 
except Exception: 
    raise ImportError("transformers is required. Install with: pip install transformers torch") 
 
try: 
    import spacy 
except Exception: 
    raise ImportError("spaCy is required. Install with: pip install spacy") 
 
 
# ----------------------------- 
# CUSTOM SKILL SET 
# ----------------------------- 
# Skills categorized by type for better organization
SKILL_CATEGORIES = {
    "Python": [
        "python", "pandas", "numpy", "matplotlib", "seaborn", "plotly", 
        "tensorflow", "pytorch", "keras", "scikit-learn", "flask", "django", 
        "fastapi", "machine learning", "deep learning", "data science", 
        "data analysis", "data engineering", "ai", "nlp", "computer vision"
    ],
    "TypeScript": [
        "typescript", "javascript", "react", "nextjs", "nodejs", "express"
    ],
    "Java": [
        "java", "spring boot"
    ],
    "Database": [
        "sql", "mysql", "postgresql", "mongodb", "redis"
    ],
    "Web": [
        "html", "css", "react", "nextjs", "rest api", "graphql"
    ],
    "DevOps": [
        "docker", "kubernetes", "devops", "git", "github actions", 
        "linux", "bash", "aws", "azure", "gcp", "cloud"
    ],
    "Other": [
        "c++", "c", "power bi", "tableau", "excel", "blockchain", 
        "cybersecurity", "microservices", "firebase"
    ]
}

# Flatten the categories for skill detection
CUSTOM_SKILLS = set()
for skills in SKILL_CATEGORIES.values():
    CUSTOM_SKILLS.update(skills)
 
 
# ----------------------------- 
# HELPERS 
# ----------------------------- 
def extract_text_from_pdf(path: str) -> str: 
    """Extracts raw text from a PDF file.""" 
    if not os.path.exists(path): 
        raise FileNotFoundError(f"File not found: {path}") 
    text = extract_text(path) 
    return text 
 
 
def load_ner_pipeline(model_name: str = "dslim/bert-base-NER"): 
    """Loads a pre-trained BERT-based NER pipeline.""" 
    return pipeline("ner", model=model_name, aggregation_strategy="simple") 
 
 
def load_spacy_model(name: str = "en_core_web_sm"): 
    """Loads or installs spaCy English model.""" 
    try: 
        nlp = spacy.load(name) 
    except OSError: 
        import subprocess 
        subprocess.check_call([sys.executable, "-m", "spacy", "download", name]) 
        nlp = spacy.load(name) 
    return nlp 
 
 
def prettify_phrase(phrase: str) -> str: 
    """Cleans up and normalizes extracted phrases.""" 
    p = phrase.strip() 
    p = " ".join(p.split()) 
    p = p.strip(" \n\r\t,;:-–—()[]{}") 
    return p 
 
 
def extract_candidates(text: str, ner_pipeline, nlp): 
    """Extracts potential skill candidates using NER and noun phrases.""" 
    ner_results = ner_pipeline(text) 
    ner_phrases = [ 
        prettify_phrase(ent.get("word", ent.get("entity_group", ""))) 
        for ent in ner_results 
    ] 
 
    doc = nlp(text) 
    noun_phrases = [ 
        prettify_phrase(chunk.text) 
        for chunk in doc.noun_chunks 
        if 1 <= len(chunk.text.split()) <= 4 
    ] 
 
    all_candidates = [p.lower() for p in ner_phrases + noun_phrases if p] 
    freq = Counter(all_candidates) 
    return freq 
 
 
def filter_by_custom_skills(candidate_freq: Counter): 
    """Filters extracted phrases using the predefined CUSTOM_SKILLS set.""" 
    matched_skills = [] 
    for phrase, _ in candidate_freq.items(): 
        for skill in CUSTOM_SKILLS: 
            if skill in phrase: 
                matched_skills.append(skill) 
                break 
    return sorted(set(matched_skills)) 


def categorize_skills(skills):
    """Categorizes skills based on predefined categories."""
    categorized = {}
    
    # Initialize all categories with empty lists
    for category in SKILL_CATEGORIES:
        categorized[category] = []
    
    # Assign skills to their categories
    for skill in skills:
        for category, category_skills in SKILL_CATEGORIES.items():
            if skill in category_skills:
                # Add confidence score (can be adjusted based on your needs)
                confidence = 100  # Default high confidence for exact matches
                categorized[category].append({"name": skill, "confidence": confidence})
    
    # Remove empty categories
    return {k: v for k, v in categorized.items() if v}


def extract_skills_from_pdf(pdf_path: str, model_name: str = "dslim/bert-base-NER"): 
    """Main pipeline: Extracts text, identifies entities, filters skills.""" 
    text = extract_text_from_pdf(pdf_path) 
    ner_pipeline = load_ner_pipeline(model_name) 
    nlp = load_spacy_model() 
    candidates = extract_candidates(text, ner_pipeline, nlp) 
    skills = filter_by_custom_skills(candidates) 
    categorized_skills = categorize_skills(skills)
    return skills, categorized_skills 
 
 
# ----------------------------- 
# MAIN EXECUTION 
# ----------------------------- 
if __name__ == "__main__": 
    if len(sys.argv) < 2: 
        print("Usage: python resume_skill_extractor.py /path/to/resume.pdf") 
        sys.exit(1) 
 
    pdf_path = sys.argv[1] 
    try: 
        skills, categorized_skills = extract_skills_from_pdf(pdf_path) 
        if skills: 
            print("\nExtracted skills found in resume:\n") 
            for s in skills: 
                print("-", s.title()) 
            
            # Count total skills and categories
            total_skills = len(skills)
            total_categories = len(categorized_skills)
            
            # Create output JSON with more detailed information
            output = {
                "skills": skills,
                "categorized_skills": categorized_skills,
                "total_skills": total_skills,
                "total_categories": total_categories
            }
            
            print("\nJSON output:")
            print(json.dumps(output))
        else: 
            print("No matching skills found in the resume. Try expanding CUSTOM_SKILLS.") 
    except Exception as e: 
        print("Error:", e)