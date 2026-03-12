# Policy Alert Engine - Next.js Frontend 🎨

The visual command center of the Policy Alert Engine. Built for speed, responsiveness, and clarity, this Next.js application translates complex legislative data into actionable insights for advocacy teams.

---

## 🏗️ Visual Stack
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix Primitives)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typeface**: Inter (Optimized for readability)

---

## 📂 Design System & Components

### 1. Atomic UI (`components/ui/`)
We use a "Copy-and-Paste" component model via `shadcn/ui`. Key assets include:
- **DataTable**: A customized `shadcn` table with search and filtering logic.
- **Badge**: Dynamic status indicators that change color based on `impact_score`.
- **Card**: Used for high-level statistics on the overview dashboard.

### 2. Dashboard Architecture
The app uses a layout-first approach:
- `/dashboard`: Aggregate views and high-level KPIs.
- `/bills`: The primary data grid with real-time text searching.
- `/alerts`: High-contrast view for critical legislation.
- `/analysis`: Contextual view for AI-generated drafting.

---

## 🎨 Theming & Brand
The UI leverages a **Professional & Urgent** color palette:
- **Primary**: Slate (Professionalism)
- **Accents**: 
  - 🔴 `destructive` (Critical Alerts)
  - 🟠 `warning` (High Priority)
  - 🔵 `info` (Medium Priority)

---

## 🚦 Integration Pipeline

The frontend communicates with the FastAPI layer via standard fetch requests. 
- **Environment**: Currently hardcoded to `http://localhost:8000`.
- **CORS**: The backend is configured to accept requests from the frontend origin.

---

## 🚀 Independent Launch

```bash
# In the policy_alert_frontend directory
npm install
npm run dev
```
Open `http://localhost:3000` to view the dashboard.
