import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

model = None

if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")


def generate_draft(bill_title: str, tone: str = "formal") -> str:

    if model is None:
        return "AI draft unavailable (Gemini API key not configured)"

    tone_instructions = {
        "passionate": "Write with urgency and emotional appeal using persuasive language.",
        "concise": "Be brief and direct. Maximum 3 short paragraphs.",
        "formal": "Use professional policy-oriented language.",
    }

    tone_guide = tone_instructions.get(tone, tone_instructions["formal"])

    prompt = f"""
You are a policy advocate specializing in animal welfare and environmental protection.

Write a public comment letter for the following bill:

"{bill_title}"

Tone: {tone_guide}

Structure:
1. Opening: State your concern or support
2. Impact: Explain effects on animals, wildlife, or ecosystems
3. Suggested Action: One clear recommendation

Limit to 200 words.
Sign off as "Concerned Advocate".
"""

    try:
        response = model.generate_content(prompt)

        if response and hasattr(response, "text"):
            return response.text.strip()

        return "AI response empty."

    except Exception as e:
        return f"""Dear Committee,

I am writing regarding the bill: "{bill_title}"

This legislation requires careful review to ensure it protects animals and ecosystems.

Suggested Action:
Please strengthen protections for wildlife and environmental sustainability.

Sincerely,
Concerned Advocate

[AI draft unavailable — {str(e)}]
"""