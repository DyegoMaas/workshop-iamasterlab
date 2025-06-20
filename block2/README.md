# Workshop: Full-Stack Entity Generation with Cursor

This repository is the starting point for the "Code Surgeon" workshop block. It contains a fully functional full-stack application with one pre-built entity: **Customers**.

- **Frontend**: React (Vite) in `frontend/`
- **Backend**: Node.js (Express) in `backend/`

Your goal is to use this existing `Customers` entity as a reference to build generic Cursor rules that can scaffold a new entity (`Suppliers`) from scratch.

## Setup & Running the Application

### 1. Install Dependencies
You need to install dependencies for both the frontend and the backend.

Open a terminal in the `repo-root/backend` directory:
```bash
cd backend
npm install
```

Open another terminal in the `repo-root/frontend` directory:
```bash
cd frontend
npm install
```

### 2. Run the Application
You need to run both servers concurrently.

**In the `backend` terminal:**
```bash
npm run dev
# Server will start on http://localhost:3001
```

**In the `frontend` terminal:**
```bash
npm run dev
# App will be available at http://localhost:5173
```

Now, open [http://localhost:5173](http://localhost:5173) in your browser. You should see the application running and be able to navigate to the "Customers" page to see the pre-populated data.

### 3. Running Tests

To verify the setup, you can run the existing tests.

**To run backend API tests:**
```bash
# In the backend/ directory
npm test
```

**To run frontend UI tests with Playwright:**
```bash
# In the frontend/ directory
# This will open a browser and run the tests.
npm run test:ui
```

## Cursor IDE: Reindexing Workspace

For the Cursor agent to work effectively with this multi-root workspace, follow these steps:

1. Open both the `frontend/` and `backend/` folders in the Cursor IDE.
2. Open the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`).
3. Run the command **`Cursor: Reindex Workspace`**.
4. Wait for the reindexing to complete for both folders.

You are now ready to start the workshop challenge!