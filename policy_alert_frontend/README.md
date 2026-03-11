# Policy Alert Engine - Next.js Operations

Welcome to the client-facing frontend layer of the Policy Alert Engine. This Next.js application serves as the primary visual interface, transforming background ecological scores into a responsive, interactive administrative dashboard.

---

## 🏗️ Tech Stack
* **Core Framework**: [Next.js 14+](https://nextjs.org/) (Utilizing the App Router paradigm)
* **CSS Ecosystem**: [Tailwind CSS v3](https://tailwindcss.com/)
* **Component Library**: [shadcn/ui](https://ui.shadcn.com/) (Accessible, customizable Radix primitives)
* **Iconography**: [Lucide React](https://lucide.dev/)
* **Data Fetching**: Native React Server & Client Hooks dynamically resolving against localhost endpoints.

---

## 📂 Application Architecture

The frontend maps cleanly to standard Next.js conventions. The core views are heavily guarded under the `(dashboard)` route group:

| Route Path | File Location | Purpose |
|---|---|---|
| `/` | `app/(dashboard)/page.tsx` | The root **Overview Dashboard**. Fetches aggregate statistics detailing active bills versus critical alerts. |
| `/bills` | `app/(dashboard)/bills/page.tsx` | The primary **Bill Monitor**. Features a heavily interactive data table supporting real-time text filtering, category sorting, and dynamic `shadcn/ui` status badges. |
| `/alerts` | `app/(dashboard)/alerts/page.tsx` | **Urgent Dispatch Terminal**. Filters specifically to high-impact legislation natively leveraging `destructive` UI accents. |
| `/analysis` | `app/(dashboard)/analysis/page.tsx` | **AI Drafting Suite**. Integrates closely with the backend `/analyze` endpoint to generate on-the-fly legislative commentary based on sliding tone scales. |

---

## 🧩 Component Design

We utilize `shadcn/ui` to build out complex interfaces rapidly.

* **UI Sandbox**: Core interactive modules like `<Badge>`, `<Select>`, and `<Table>` are wholly physically isolated inside the `components/ui/` directory.
* **Styling Tweaks**: Due to shadcn's atomic nature, variants like the dynamic color-coding logic seen in the Bill Monitor are handled via direct prop mappings (e.g. `variant="destructive"` against `bill.impact >= 65`).

---

## 🔌 API Integration Constraints
By design, all Next.js fetch pipelines currently expect the Python FastAPI backend to resolve successfully at either `http://127.0.0.1:8000` or `http://localhost:8000`.

> **⚠️ CRITICAL**: Prioritize booting the Python API server *(or executing the `start_all.sh` universal script)* before attempting Next.js navigations to prevent `ECONNREFUSED` layout crashes.

---

## 🚀 Running the Frontend Independently

If you are developing Next.js components entirely separated from the unified boot script, perform standard npm operational chains:

```bash
# Verify directory scope
cd policy_alert_frontend

# Install node_modules footprint
npm install

# Launch Next.js Hot Reload
npm run dev
```

The node environment will spin up typically securely on `http://localhost:3000`.
