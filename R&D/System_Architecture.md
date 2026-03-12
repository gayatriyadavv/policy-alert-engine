# System Architecture 🏗️

The Policy Alert Engine follows a modular, decoupled architecture optimized for low-latency operations and high data integrity.

### 1. Data Processing Layer (Python/FastAPI)
The backend acts as the "Engine," responsible for:
- **Heuristic Evaluation**: Real-time category detection and impact scoring.
- **AI Synthesis**: Generative logic for legislative drafting.
- **Persistence**: Managed access to the SQLite storage matrix.

### 2. Interface Layer (Next.js/React)
A reactive, dashboard-driven frontend that provides:
- **Real-Time Data Visualization**: Interactive tables and high-contrast alert feeds.
- **Administrative Control**: User-driven AI tone selection and data filtering.
- **Atomic Components**: Built on `shadcn/ui` for high accessibility and premium UX.

### 3. Storage Layer (SQLite/Edge)
A localized, file-based database architecture ensures:
- **Zero Configuration**: No complex DB server management.
- **High Portability**: The entire project state resides within the repository.
- **Speed**: Millisecond-level read access for API serialization.
