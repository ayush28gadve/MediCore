# MediCore

MediCore is a premium, enterprise-level Hospital Management System MVP with a scalable monorepo architecture. 
Designed to streamline medical workflows across Admin, Doctor, and Reception roles, MediCore aims to integrate advanced AI-driven features to enhance the quality of care and operational efficiency.

## 🏗 Architecture Overview
This project uses a monorepo structure to keep everything unified and scalable.

```
MediCore/
├── frontend/       # React + Vite + Tailwind CSS User Interface
├── backend/        # Node.js + Express API Backend (Planned)
├── ai-services/    # AI/ML Microservices (Symptom Checker, OCR, Analysis)
└── database/       # Schemas, Diagrams, and DB Seed Data
```

## 🚀 Frontend Quickstart
The frontend is built with React, Vite, Tailwind CSS v4, and React Router DOM.

To run the frontend:
```bash
cd frontend
npm install
npm run dev
```

## 🔮 Future AI Plans
The `ai-services` folder is reserved for integrating Python or Node.js microservices that provide advanced healthcare capabilities:
- **Symptom Checker Chatbot**
- **Lab Report Auto-Analysis**
- **Medical OCR Engine**

See `docs/roadmap.md` for more details.
