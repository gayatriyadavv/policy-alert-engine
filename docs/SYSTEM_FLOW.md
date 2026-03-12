# System Sequence Flow 🔄

This document outlines the detailed sequence of operations for the primary features of the Policy Alert Engine.

## 1. Bill Discovery & Scoring
When a user views the Bill Monitor or when the system "scans" for data.

```mermaid
sequenceDiagram
    participant U as User / Frontend
    participant A as FastAPI (api/app.py)
    participant E as Heuristics Engine
    participant D as SQLite (bills.db)

    U->>A: GET /bills
    A->>D: SELECT * FROM bills
    D-->>A: Raw Bill Data
    loop For each Bill
        A->>E: detect_category(title)
        E-->>A: "Wildlife" / "Marine" / etc.
        A->>E: compute_impact_score(title)
        E-->>A: impact_score, priority
    end
    A-->>U: Combined JSON Payload
```

## 2. AI Drafting Workflow
Triggered when a user requests a legislative statement for a specific bill.

```mermaid
sequenceDiagram
    participant U as User / Frontend
    participant A as FastAPI (api/app.py)
    participant AI as AI Module (backend/ai)
    participant D as SQLite (bills.db)

    U->>A: GET /analyze/{id}?tone=urgent
    A->>D: SELECT title FROM bills WHERE id={id}
    D-->>A: "Act to Protect Marine Fisheries"
    A->>AI: generate_draft(title, "urgent")
    Note over AI: Synthesizing legislative<br/>commentary based on<br/>historical patterns.
    AI-->>A: Generated Draft Content
    A-->>U: JSON (Draft + Meta-data)
```

## 3. Data Ingestion (Simulated Scrape)
How new legislation enters the localized environment.

```mermaid
sequenceDiagram
    participant C as CLI / Cron / User
    participant A as FastAPI (api/app.py)
    participant D as SQLite (bills.db)

    C->>A: POST /scan
    Note over A: Iterating through sample<br/>legislative list.
    loop For each sample
        A->>D: SELECT id FROM bills WHERE title={title}
        alt Bill exists
            D-->>A: Record Found
        else Bill new
            D-->>A: NULL
            A->>D: INSERT INTO bills (title)
        end
    end
    D-->>A: COMMIT
    A-->>C: {"message": "New bills added"}
```
