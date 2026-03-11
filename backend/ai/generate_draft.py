import os
import google.generativeai as genai
from dotenv import load_dotenv

# -----------------------------
# LOAD ENVIRONMENT VARIABLES
# -----------------------------
load_dotenv()

# -----------------------------
# TONE INSTRUCTIONS
# -----------------------------
TONE_INSTRUCTIONS = {
    "passionate": "Write with urgency and emotional appeal using persuasive language.",
    "concise": "Be brief and direct. Maximum 3 short paragraphs.",
    "formal": "Use professional policy-oriented language.",
}

# -----------------------------
# FALLBACK TEMPLATE
# -----------------------------
FALLBACK_TEMPLATE = """Dear Committee,

I am writing regarding the bill: "{bill_title}"

This legislation requires careful review to ensure it protects animals and ecosystems.

Suggested Action:
Please strengthen protections for wildlife and environmental sustainability.

Sincerely,
Concerned Advocate
"""

# -----------------------------
# PROMPT TEMPLATE
# -----------------------------
PROMPT_TEMPLATE = """You are a policy advocate specializing in animal welfare and environmental protection.

Write a public comment letter for the following bill:

"{bill_title}"

Tone instruction:
{tone_guide}

Structure:
1. Opening: State your concern or support
2. Impact: Explain effects on animals, wildlife, or ecosystems
3. Suggested Action: One clear recommendation

Limit to 200 words.
Sign off as "Concerned Advocate".
"""


# -----------------------------
# INITIALIZE GEMINI MODEL
# -----------------------------
def _init_model():
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        print("⚠️ GEMINI_API_KEY not found in .env")
        return None

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash")
        print("✅ Gemini model initialized")
        return model
    except Exception as e:
        print("❌ Gemini initialization error:", e)
        return None


_model = _init_model()


# -----------------------------
# GENERATE DRAFT
# -----------------------------
def generate_draft(bill_title: str, tone: str = "formal") -> str:

    if _model is None:
        return "AI draft unavailable (Gemini API key not configured)"

    tone_guide = TONE_INSTRUCTIONS.get(tone, TONE_INSTRUCTIONS["formal"])

    prompt = PROMPT_TEMPLATE.format(
        bill_title=bill_title,
        tone_guide=tone_guide
    )

    try:
        response = _model.generate_content(prompt)

        if response and hasattr(response, "text"):
            return response.text.strip()

        print("⚠️ Gemini returned empty response")
        return FALLBACK_TEMPLATE.format(bill_title=bill_title)

    except Exception as e:
        print("❌ Gemini error:", e)
        return FALLBACK_TEMPLATE.format(bill_title=bill_title)