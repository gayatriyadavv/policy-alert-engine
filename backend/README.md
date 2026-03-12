# Policy Alert Engine - Data & Logic Core 🧠

This folder contains the "Brains" of the Policy Alert Engine. It encompasses the physical data storage, the AI generation logic, and the core scripts for legislative processing.

---

## 🗄️ Persistence (SQLite)
The system uses **SQLite** for high portability and zero-config deployment.
- **File**: `bills.db`
- **Tables**:
  - `bills`: Stores raw legislative text, status, and IDs.
- **Performance**: Optimized for localized reads; the FastAPI layer interacts with this file via the `contextmanager` pattern in `api/app.py`.

---

## 🤖 AI & Generative Modules (`ai/`)
The `ai/` directory contains the logic for synthesizing legislative commentary.
- **`generate_draft.py`**: The primary entry point. It takes a bill's title and a desired "tone" (Formal, Informal, Urgent) and constructs a structured response.
- **Integration**: While currently simulated/heuristics-based, it is designed to be swapped with a live Large Language Model (LLM) provider (e.g., OpenAI, Gemini) with minimal refactoring.

---

## 📊 Keyword Heuristics
The backend defines the rules for environmental impact:
- **Wildlife**: Keywords like `poaching`, `species`, `endangered`.
- **Marine**: Keywords like `coral`, `fisheries`, `ocean`.
- **Climate**: Keywords like `emissions`, `carbon`, `warming`.

Any bill title containing these terms is automatically flagged and scored according to the weights defined in the `api` layer.

---

## 🛡️ Operational Integrity
To ensure the system stays populated, the `backend` scripts work in tandem with the `/scan` API endpoint to verify that no duplicate legislation is introduced during ingestion.
