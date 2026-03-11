# Policy Alert Engine - Backend API

This directory houses the robust Python backend that physically powers the Policy Alert Engine, including generative data extraction, SQL storage wrappers, and AI logic implementations.

---

## 🏗️ Architecture Stack
* **Web Framework**: [FastAPI](https://fastapi.tiangolo.com/) (High-performance Async Python)
* **Data Storage**: SQLite (`/backend/bills.db`)
* **AI Generative Subsystem**: Core ML scripts mapped in `/backend/ai/generate_draft.py`
* **Local Server Runtime**: Uvicorn

---

## 🗄️ Database Schema

The API leverages SQLite extensively to guarantee localized speeds and high portability. It maps strictly to the `backend/bills.db` file.

### Table: `bills`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY | Unique identifier mapped universally across endpoints. |
| `title` | TEXT | NOT NULL | The core legislative text block. |
| `status` | TEXT | default 'Pending' | Triage states (`Active`, `Pending`, `Review`) |

---

## 🔌 API Endpoints
All endpoints natively serialize data structures back to HTTP JSON payloads.

### Server Checks
| Method | Route | Description | Expected Output |
|---|---|---|---|
| **GET** | `/` | Standard Health check ping. | `{"status": "healthy"}` |

### Bill Engine
| Method | Route | Description |
|---|---|---|
| **GET** | `/bills` | The master retrieval function. Pulls the entire SQLite matrix and dynamically executes environmental impact parsing to compute scores and categories. Returns raw counts alongside computed structures. |
| **GET** | `/alerts` | A tightly scoped proxy logic of `GET /bills` utilizing an impact floor constraint (Impact $\ge$ `25`). Specifically engineered for the Alerts Dashboard, sorting urgent priority items natively via FastAPI logic. |

### Generative AI Integration
| Method | Route | Description |
|---|---|---|
| **GET** | `/analyze/{bill_id}?tone=formal` | Extracts deeply isolated insights. Triggers the generative AI pipeline bound inside the `/backend/ai/` directory to automatically draft legislative statements spanning targeted tones (`formal` / `informal`). |

### CLI / Simulated Bots
| Method | Route | Description |
|---|---|---|
| **POST** | `/scan` | Primarily an operational endpoint. Safely scans and introduces simulated test legislation (such as "Marine Fisheries Conservation Bill") strictly if it doesn't already exist in the database constraints. | 

---

## 🚀 Running the API Locally 

To run the API on a local development node independently of the overarching React interface:

```bash
# Move into the targeted directory
cd api

# Mount the virtual environment boundary
source ../venv/bin/activate

# Execute the threaded Uvicorn server runtime
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```
You can safely query `http://127.0.0.1:8000/bills` using `curl` or Postman to verify operations.
