🚀 TalentFlow – Modern Hiring & Assessment Platform (Front-End)

📋 Overview

TalentFlow is a front-end-only React application that simulates a modern hiring management platform for HR teams.
It provides tools to manage jobs, track candidates, build assessments, and visualize hiring metrics – all with a realistic mock backend powered by MSW and persistent local storage via IndexedDB.

This project was built as a technical assignment with a strong emphasis on:

High-quality user experience 🎨

Robust state management ⚡

Scalable, modular architecture 🏗️

✨ Features
🏠 Home & Dashboard

🎥 Animated 3D Landing Page showcasing the hiring journey

📊 Data-driven dashboard with interactive charts (Recharts)

🔐 Authentication & Protected Routes with hardcoded HR credentials

💼 Jobs Board

🔎 Filter & Paginate jobs with debounced search

➕ Create / Edit Jobs in smooth modal forms (with validation)

📦 Archive / Unarchive jobs in collapsible sections

🎯 Drag-and-Drop Reordering with optimistic UI + error rollback

🔗 Deep Linking: each job accessible via /jobs/:id

👥 Candidates Pipeline

🗂️ Dual Views: Kanban board & high-performance virtualized list

🔍 Instant Search & Filter for 1000+ candidates

📄 Detailed Candidate Profiles with timeline & linked job info

📝 Notes with @mentions to simulate collaboration

🧑‍🎨 Randomized Avatars for realism

📝 Assessments

🏗️ Dynamic Form Builder: add sections, multiple question types

👀 Live Preview: real-time form rendering while editing

✅ Validation & Conditional Logic

💾 Local Persistence with IndexedDB

🛠️ Tech Stack

Framework: React (CRA)

State Management: React Query + Zustand

Routing: React Router v6

Mock API: MSW (Mock Service Worker)

Local DB: Dexie.js (IndexedDB)

Styling: CSS with variables (Light & Dark modes)

Drag & Drop: @hello-pangea/dnd

Virtualization: react-window

Data Viz: Recharts

Data Generation: @faker-js/faker

📂 Project Structure
src/
├── api/ # MSW handlers & Dexie.js DB setup
├── auth/ # Authentication context & logic
├── components/ # Reusable UI (Modal, Loader, etc.)
├── features/ # Jobs, Candidates, Assessments, Dashboard
├── hooks/ # Custom hooks (e.g., useDebounce)
├── store/ # Zustand state stores
└── App.js # Main layout & routing

🔄 Data Flow
graph TB
subgraph Browser
UI[React Components]
IndexedDB[(Dexie.js DB)]
end

    subgraph State Management
        RQ[React Query]
        Zustand[Zustand Stores]
    end

    subgraph Mock Backend
        MSW[Mock Service Worker]
    end

    UI -- "Render & Trigger Actions" --> RQ
    UI -- "Global UI State (modals, theme)" --> Zustand
    RQ -- "Fetch & Cache Data" --> MSW
    MSW -- "Reads/Writes" --> IndexedDB

🤔 Why These Choices?

React Query > Redux
Optimized for server state, caching, optimistic updates & retries → no boilerplate.

Zustand > Redux/Context
Lightweight store for global UI state (theme, modals) → minimal & fast.

MSW > JSON Server
No extra server needed, intercepts requests in-browser → realistic mock API.

Dexie.js > LocalStorage
IndexedDB wrapper: handles complex objects & scales to 1000+ records efficiently.

🚀 Getting Started

Clone & install:

git clone <your-repo-link>
cd talentflow
npm install

Run locally:

npm start

Open in browser → https://talentflow-zeta.vercel.app/

🔑 Login Credentials

Username: hr

Password: password123

🌍 Live Demo → TalentFlow on Vercel

🐛 Known Issues

Initial Data Loading: Candidate list queries all jobs (could be optimized with better backend design).

Error Handling: Simple error boundary → would need Sentry/LogRocket in production.

Single User Only: Local storage → no real-time collaboration yet.

🚧 Future Improvements

Real-time multi-user backend (e.g., Firebase, WebSocket)

Cloud persistence (replace Dexie.js with real DB)

Richer analytics & dashboard widgets

Better role-based access & HR team collaboration

📜 License

This project is licensed under the MIT License.
