# Multiagent Predictive Risk Analysis and Governance Management Assistant for Smart Cities Using Digital Twin (PRAGMA)

**AI-Powered Urban Simulation & Predictive Governance Framework.**

Empowers smart states and municipal leaders with predictive AI, multi-agent simulation, and explainable insights to proactively manage crises and allocate resources using digital twin technology.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.10+
- Ollama (running Llama 3.1 locally)

### 1. Start Infrastructure (DB, Redis)
```bash
docker-compose up -d db redis
```

### 2. Start Backend API (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Start Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```

### 4. Run AI Simulation Engine
```bash
cd agents
python engine.py
```

## 📚 Tech Stack Highlights
- **Frontend**: React, TypeScript, Tailwind CSS, Vite, Framer Motion
- **Backend**: FastAPI, PostgreSQL, Redis, WebSockets
- **AI Core**: CrewAI, LangGraph, Ollama (Llama 3.1)
