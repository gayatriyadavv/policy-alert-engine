# Technical Requirements 📋

## ⚙️ Runtime Requirements
- **Python Runtime**: Version 3.9 or higher is required for async features.
- **Node Environment**: v18+ (LTS recommended) for Next.js App Router stability.
- **Memory Footprint**: Designed to run efficiently on <1GB RAM for edge/cloud-free deployments.

## 🔌 Integration Standards
- **RESTful API**: Must adhere to JSON:API standards.
- **CORS Policy**: Must support cross-origin requests from front-end administrative nodes.
- **AI Scalability**: All generative modules must support pluggable LLM backends (OpenAI/Gemini/Local).

## 🔒 Security & Data
- **Asset Isolation**: The `bills.db` file must remain physically isolated inside the `backend/` directory.
- **Input Validation**: All POST requests to the `/scan` or future endpoints must be sanitized to prevent injection.
