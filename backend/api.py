from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from ai.generate_draft import generate_draft

app = FastAPI()

# Allow frontend (Next.js) to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# ROOT
# -----------------------------
@app.get("/")
def root():
    return {"message": "Policy Alert Engine running"}


# -----------------------------
# CATEGORY DETECTION
# -----------------------------
def detect_category(title: str):

    title = title.lower()

    if "wildlife" in title or "animal" in title:
        return "Wildlife"
    elif "marine" in title or "ocean" in title:
        return "Marine"
    elif "forest" in title:
        return "Forest"
    elif "biodiversity" in title or "habitat" in title:
        return "Habitat"
    elif "climate" in title:
        return "Climate"
    else:
        return "Policy"


# -----------------------------
# IMPACT SCORING
# -----------------------------
def calculate_impact(title: str):

    title = title.lower()

    keywords = {
        "wildlife": 8,
        "animal": 8,
        "environment": 7,
        "climate": 9,
        "forest": 7,
        "marine": 7,
        "ocean": 7,
        "biodiversity": 8,
        "pollution": 6,
        "energy": 5
    }

    score = 0

    for k, v in keywords.items():
        if k in title:
            score = max(score, v)

    if score >= 7:
        priority = "High"
    elif score >= 4:
        priority = "Medium"
    else:
        priority = "Low"

    return score, priority


# -----------------------------
# ROW CONVERTER
# -----------------------------
def row_to_dict(row: sqlite3.Row):

    d = dict(row)
    title = d.get("title", "")

    impact, priority = calculate_impact(title)
    impact = impact * 10

    category = detect_category(title)

    if impact >= 70:
        status = "Watch"
    else:
        status = "Active"

    return {
        "id": d.get("id"),
        "title": title,
        "category": category,
        "impact_score": impact,
        "priority": priority,
        "status": status
    }


# -----------------------------
# GET BILLS
# -----------------------------
@app.get("/bills")
def get_bills():

    conn = sqlite3.connect("bills.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM bills")
        rows = cursor.fetchall()
    except sqlite3.OperationalError:
        conn.close()
        return {"bills": []}

    bills = [row_to_dict(r) for r in rows]

    conn.close()

    return {"bills": bills}


# -----------------------------
# ALERTS
# -----------------------------
@app.get("/alerts")
def get_alerts():

    conn = sqlite3.connect("bills.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM bills")
    rows = cursor.fetchall()

    alerts = []

    for r in rows:

        d = dict(r)
        score, priority = calculate_impact(d.get("title", ""))

        if score >= 7:
            alerts.append({
                "bill_id": d.get("id"),
                "title": d.get("title"),
                "impact_score": score,
                "alert_level": "High"
            })

    conn.close()

    return {"alerts": alerts}


# -----------------------------
# ANALYZE BILL
# -----------------------------
@app.get("/analyze/{bill_id}")
def analyze_bill(bill_id: int, tone: str = "formal"):

    conn = sqlite3.connect("bills.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM bills WHERE id=?", (bill_id,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return {"error": "Bill not found"}

    bill = dict(row)

    impact, priority = calculate_impact(bill["title"])
    category = detect_category(bill["title"])

    draft = generate_draft(bill["title"], tone)

    conn.close()

    return {
        "bill_id": bill_id,
        "title": bill["title"],
        "category": category,
        "impact_score": impact,
        "priority": priority,
        "draft_comment": draft
    }