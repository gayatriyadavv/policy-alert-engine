from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from ai.generate_draft import generate_draft

app = FastAPI()

# ---------------------------------
# CORS CONFIG
# ---------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------
# ROOT
# ---------------------------------
@app.get("/")
def root():
    return {
        "message": "Policy Alert Engine API running",
        "status": "healthy"
    }

# ---------------------------------
# CATEGORY DETECTION
# ---------------------------------
def detect_category(title: str):

    title = title.lower()

    keywords = {
        "Wildlife": ["wildlife", "animal", "species", "poaching", "endangered"],
        "Marine": ["marine", "ocean", "fisheries", "coral"],
        "Habitat": ["habitat", "ecosystem", "biodiversity"],
        "Forest": ["forest", "deforestation", "timber"],
        "Agriculture": ["livestock", "farming", "agriculture"],
        "Climate": ["climate", "carbon", "emissions"]
    }

    for category, words in keywords.items():
        for w in words:
            if w in title:
                return category

    return "Other"

# ---------------------------------
# IMPACT SCORING
# ---------------------------------
def compute_impact_score(title: str):

    category = detect_category(title)
    text = title.lower()

    base_scores = {
        "Wildlife": 50,
        "Marine": 40,
        "Habitat": 38,
        "Forest": 35,
        "Climate": 32,
        "Agriculture": 28,
        "Other": 20
    }

    score = base_scores.get(category, 20)

    keywords = {
        "animal": 10,
        "wildlife": 12,
        "endangered": 10,
        "species": 8,
        "habitat": 8,
        "conservation": 8,
        "marine": 9,
        "ocean": 8,
        "forest": 7,
        "climate": 6,
        "emissions": 5,
        "pollution": 5
    }

    for k, v in keywords.items():
        if k in text:
            score += v

    impact = max(0, min(score, 100))

    if impact >= 85:
        priority = "Critical"
    elif impact >= 65:
        priority = "High"
    elif impact >= 45:
        priority = "Medium"
    else:
        priority = "Low"

    return impact, priority

# ---------------------------------
# GET BILLS
# ---------------------------------
@app.get("/bills")
def get_bills():

    conn = sqlite3.connect("bills.db")
    cursor = conn.cursor()

    cursor.execute("SELECT id, title FROM bills")
    rows = cursor.fetchall()

    conn.close()

    bills = []

    for r in rows:

        impact, priority = compute_impact_score(r[1])

        bills.append({
            "id": r[0],
            "title": r[1],
            "category": detect_category(r[1]),
            "impact_score": impact,
            "priority": priority
        })

    return {
        "count": len(bills),
        "bills": bills
    }

# ---------------------------------
# ANALYZE BILL
# ---------------------------------
@app.get("/analyze/{bill_id}")
def analyze_bill(bill_id: int, tone: str = Query("formal")):

    conn = sqlite3.connect("bills.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT title FROM bills WHERE id=?",
        (bill_id,)
    )

    result = cursor.fetchone()

    conn.close()

    if not result:
        return {"error": "Bill not found"}

    title = result[0]

    impact, priority = compute_impact_score(title)

    draft = generate_draft(title, tone)

    return {
        "bill": title,
        "category": detect_category(title),
        "impact_score": impact,
        "priority": priority,
        "tone": tone,
        "draft_comment": draft
    }

# ---------------------------------
# ALERTS ENGINE
# ---------------------------------
@app.get("/alerts")
def get_alerts():

    conn = sqlite3.connect("bills.db")
    cursor = conn.cursor()

    cursor.execute("SELECT id, title FROM bills")
    rows = cursor.fetchall()

    conn.close()

    alerts = []

    for r in rows:

        impact, priority = compute_impact_score(r[1])

        # LOWER threshold so alerts actually appear
        if impact < 25:
            continue

        level = (
            "URGENT" if priority == "Critical"
            else "HIGH" if priority == "High"
            else "WATCH"
        )

        alerts.append({
            "bill_id": r[0],
            "title": r[1],
            "category": detect_category(r[1]),
            "impact_score": impact,
            "priority": priority,
            "alert_level": level,
            "alert_message": f"{level} impact legislation detected"
        })

    alerts.sort(key=lambda x: x["impact_score"], reverse=True)

    return {
        "alerts": alerts,
        "total_alerts": len(alerts)
    }

# ---------------------------------
# SCAN SIMULATION (SAFE)
# ---------------------------------
@app.post("/scan")
def scan():

    conn = sqlite3.connect("bills.db")
    cursor = conn.cursor()

    samples = [
        "Wildlife Habitat Protection Act",
        "Marine Fisheries Conservation Bill",
        "Forest Biodiversity Expansion Act",
        "Animal Welfare Improvement Bill"
    ]

    for s in samples:

        cursor.execute(
            "SELECT id FROM bills WHERE title=?",
            (s,)
        )

        exists = cursor.fetchone()

        if not exists:
            cursor.execute(
                "INSERT INTO bills(title) VALUES(?)",
                (s,)
            )

    conn.commit()
    conn.close()

    return {"message": "New bills added"} 