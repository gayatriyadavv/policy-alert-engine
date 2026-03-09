def generate_draft(bill_title: str, tone: str = "formal"):

    if tone == "passionate":

        draft = f"""
Dear Committee,

I strongly urge you to take immediate action regarding the bill:

"{bill_title}"

Animal welfare and environmental protection are critical responsibilities. This legislation may have significant consequences for wildlife, ecosystems, and vulnerable species.

Advocacy organizations and policymakers must ensure that this bill prioritizes ethical treatment of animals and the preservation of biodiversity.

Suggested Action:
Strengthen protections for wildlife, habitats, and ecosystems before advancing this legislation.

Sincerely,
Concerned Advocate
"""

    elif tone == "concise":

        draft = f"""
Dear Committee,

I am writing regarding the bill:

"{bill_title}"

This legislation should be carefully reviewed to ensure it protects animals and ecosystems.

Suggested Action:
Ensure strong safeguards for wildlife and environmental sustainability.

Sincerely,
Concerned Advocate
"""

    else:  # formal tone

        draft = f"""
Dear Committee,

I am writing to express concern regarding the bill:

"{bill_title}"

Policies affecting animal welfare and environmental protection require careful evaluation. Advocacy organizations should review the potential impact of this legislation and ensure it aligns with ethical and sustainable policy goals.

Suggested Action:
Please carefully review the bill and consider strengthening protections for wildlife and ecosystems.

Sincerely,
Concerned Advocate
"""

    return draft