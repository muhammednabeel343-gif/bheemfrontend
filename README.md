# Project Bheem Frontend

This is the Phase 1 React + Vite frontend for Project Bheem.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and update the API URL if needed.

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open the app at `http://localhost:5173`.

5. Make sure the backend is running on `http://127.0.0.1:8000` and CORS is enabled for `http://localhost:5173`.

## Functionality

- Login page
- Registration page
- Protected home page
- JWT token storage in `localStorage`
- Axios API service to communicate with backend
