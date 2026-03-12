# Technology Stack Specifications 💻

The technical selection for the Policy Alert Engine emphasizes performance, developer velocity, and deployment simplicity.

### 🔙 Backend Stack
- **Languages**: Python 3.9+
- **Frameworks**: FastAPI (Asynchronous IO)
- **Server**: Uvicorn (ASGI)
- **AI/ML**: Custom Heuristics + LLM-ready modules

### 🔜 Frontend Stack
- **Framework**: Next.js 14+ (App Router)
- **State Management**: React Hooks (Server/Client split)
- **Styling**: Tailwind CSS & Framer Motion
- **UI System**: shadcn/ui (Radix primitives)

### 🗄️ Persistence & DevOps
- **Database**: SQLite3
- **Environment**: Virtualenv / NPM
- **CI/CD Logic**: Unified bash-based boot sequence (`start_all.sh`)
