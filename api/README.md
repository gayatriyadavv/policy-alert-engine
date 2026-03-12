# Policy Alert Engine - Backend API 🔌

This is the central intelligence node of the system. It handles data persistence, legislative scoring, and generative AI integrations through a high-performance FastAPI framework.

---

## 🏗️ Technical Stack
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Async Python)
- **Database**: SQLite (Optimized for edge storage)
- **AI Core**: Custom keyword heuristics + GPT-powered generative logic
- **Middleware**: Built-in CORS handler for Next.js interoperability

---

## 🚦 Endpoint Specifications

### 1. Global & Diagnostics
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check and server status. |

### 2. Legislation Management
#### `GET /bills`
Returns a paginated list of all legislative items stored in the system.
- **Processing**: Each bill's title is scanned in real-time to compute `impact_score` and `priority`.
- **Response Shape**:
```json
{
  "count": 5,
  "bills": [
    {
      "id": 1,
      "title": "Wildlife Protection Act",
      "category": "Wildlife",
      "impact_score": 88,
      "priority": "Critical"
    }
  ]
}
```

#### `GET /alerts`
A filtered version of the bill feed, returning only items with a high enough impact threshold.
- **Threshold**: Currently set at $\ge$ 25 to ensure visibility of important legislation.

### 3. Intelligence & AI
#### `GET /analyze/{bill_id}`
Triggers the generative AI pipeline to create a draft legislative statement.
- **Parameters**: `tone` (Options: `formal`, `informal`, `urgent`)
- **Action**: Queries the `backend/ai` module to synthesize a response based on bill content.

### 4. System Operations
#### `POST /scan`
Simulates a web scraper "ingesting" new data into the database. Use this to populate a fresh environment.

---

## 🛠️ Developer Setup

1. **Virtual Environment**:
```bash
python3 -m venv venv
source venv/bin/activate
```

2. **Run Server**:
```bash
# Execute from 'api' directory
uvicorn app:app --port 8000 --reload
```

---

## 🔍 Scoring Logic Deep Dive

The `compute_impact_score` function in `app.py` is the heart of the system. It uses a hybrid approach:
1. **Base Score**: Assigned by category (e.g., Wildlife = 50, Climate = 32).
2. **Keyword Bonuses**: Incremental points added for critical terms (e.g., "endangered" +12, "conservation" +8).
3. **Normalization**: Final scores are clamped between 0 and 100 before being mapped to a priority level.
