# Policy Alert Engine

AI-powered policy monitoring system that detects legislative bills,
analyzes impact, and generates advocacy comment drafts.

## Features

- Automated bill detection
- Impact scoring engine
- AI-generated advocacy comment drafts
- Policy alert system
- Interactive monitoring dashboard
- Policy analytics charts
- Report generator

## Tech Stack

Backend
- FastAPI
- Python
- SQLite

Frontend
- Next.js
- Tailwind
- Recharts

AI
- Custom draft generator

## Architecture

Frontend (Next.js Dashboard)
↓
Backend API (FastAPI)
↓
SQLite Database
↓
Scraper + AI draft generator

## Run Locally

Install backend dependencies

pip install -r requirements.txt

Start backend

uvicorn api:app --reload

Run scraper

python scraper.py

Start frontend

npm run dev

## Author

Gayatri Yadav  
MBA Tech Computer Engineering