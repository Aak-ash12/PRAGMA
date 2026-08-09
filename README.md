# Multiagent Predictive Risk Analysis and Governance Management Assistant for Smart Cities Using Digital Twin (PRAGMA)

**Multiagent Predictive Risk Analysis and Governance Management Assistant for Smart Cities Using Digital Twin (PRAGMA)** is an advanced AI-powered governance simulation platform designed to model city infrastructure, predict potential crises, and evaluate policies using Multi-Agent Systems, Machine Learning, and Explainable AI (XAI).

This is a comprehensive, production-ready final year Artificial Intelligence project.

---

## Key Features & Modules
1. **City Digital Twin**: Edit virtual structures (Hospitals, Schools, Roads, Utilities) with capacity, loads, and priorities.
2. **Multi-Agent Simulation**: Mesa ABM models Citizens interacting, walking in grid paths, consuming resources, getting sick, and commuting.
3. **Crisis Prediction Engine**: Scikit-Learn/XGBoost classifiers predicting probability and expected dates of 10 types of crises (e.g. Hospital Overload, Water Shortage).
4. **Policy Sandbox & Scenarios**: Split testing comparing baseline scores with new policy proposals (budget boosts, road repairs, tax reductions).
5. **AI Advisor & Chatbot**: Swappable Gemini / OpenAI recommendations with interactive conversational panels (with Speech Synthesis voice output).
6. **Explainable AI (XAI)**: SHAP-based feature importance breakdown showing what telemetry vectors influenced risk classifications.
7. **Resource Optimizer**: Solves doctor, police, and material distribution under constraints based on current demand indicators.
8. **Real Data Import**: Drag-and-drop CSV validator and auto-cleaner.
9. **Report Generator**: Exports PDF briefs and Excel telemetry spreadsheets.

---

## Tech Stack
* **Frontend**: React, Next.js, TypeScript, Tailwind CSS, Framer Motion, Chart.js, Leaflet Maps.
* **Backend**: FastAPI, SQLite/PostgreSQL (SQLAlchemy ORM).
* **AI & ABM**: Mesa Agent Framework, XGBoost, Scikit-Learn, Gemini/OpenAI API.
* **Explainability**: SHAP value estimations.
* **Deployment**: Docker & Docker Compose.

---

## Seed Accounts (RBAC Logins)
The application automatically database-seeds the following roles on startup:
* **Admin**: `admin` / `admin123`
* **Government Officer**: `officer` / `officer123`
* **Research Analyst**: `analyst` / `analyst123`

---

## Execution Guide

### Option 1: Fast Start Local Serve (Highly Recommended)
Since NodeJS/npm may not be installed locally on the host, the FastAPI backend automatically serves the full-fidelity React dashboard at `/`. You only need python to run the entire app!

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```
2. **Install all dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Start the FastAPI App**:
   ```bash
   python app/main.py
   ```
4. **Access the Dashboard**:
   Open browser at [http://localhost:8000](http://localhost:8000)
   Open Swagger API Docs at [http://localhost:8000/docs](http://localhost:8000/docs)

### Option 2: Docker Compose (Builds both Next.js and FastAPI)
Ensure Docker Desktop is running, then execute at the root directory:
```bash
docker-compose up --build
```
* **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
* **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Verification & Testing
Execute the pytest suite from the backend directory to check authorization, CRUD digital twin, simulation step engines, and predictions:
```bash
cd backend
pytest
```
All tests should compile and pass successfully.
