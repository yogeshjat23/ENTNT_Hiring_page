# TalentFlow - A Mini Hiring Platform

This is a front-end-only React application built to simulate a hiring management platform for an HR team. It features job management, candidate tracking through a Kanban pipeline, and a dynamic assessment builder.

**Live Deployed App:** [Link to your deployed app on Vercel/Netlify]

**GitHub Repository:** [Link to your GitHub repo]

## Features

* **Jobs Board:** Create, edit, archive, and reorder jobs via drag-and-drop with optimistic UI updates and error rollback.
* **Candidate Pipeline:** Manage candidates in a Kanban board, moving them between stages like Applied, Screen, Tech, and Offer.
* **Assessment Builder:** Dynamically create job-specific quizzes with multiple question types and a live preview pane.
* **Local Persistence:** All data is persisted locally in your browser using IndexedDB, so your state is saved on refresh.
* **Mock API:** A simulated REST API using Mock Service Worker (MSW) provides realistic network latency and occasional errors to test robustness.

## Tech Stack

* **Framework:** React
* **State Management:** React Query (for server state) & Zustand (for global UI state)
* **Routing:** React Router v6
* **Drag & Drop:** React Beautiful DnD
* **Virtualization:** React Window
* **API Mocking:** Mock Service Worker (MSW)
* **Local Database:** Dexie.js (IndexedDB Wrapper)
* **Styling:** Plain CSS with a component-based methodology.

## Getting Started

### Prerequisites

* Node.js (v16 or later)
* npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [your-repo-link]
    cd talentflow
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`. The MSW mock server will start automatically in development mode.

## Architectural Decisions

* **State Management:** I chose **React Query** to manage all interactions with the mock API. Its caching, automatic refetching, and mutation helpers (like `onMutate` for optimistic updates) are perfect for handling asynchronous server state. For simple, global UI state (like a modal's open/close status), a lightweight library like **Zustand** would be ideal to avoid prop drilling without the boilerplate of Redux.
* **API Mocking & Persistence:** **MSW** was chosen because it intercepts requests at the network level, making the application code completely unaware that it's talking to a mock server. This makes transitioning to a real API seamless. **Dexie.js** provides a friendly, promise-based API on top of the verbose IndexedDB, making client-side storage clean and easy to manage. MSW handlers write through to the Dexie database to ensure persistence.
* **Component Structure:** The code is organized by features (`/features`) and further broken down into reusable `components`. This makes the codebase modular and scalable. Custom hooks (`/hooks`) are used to encapsulate and reuse logic (e.g., `useJobs`, `useCandidates`).