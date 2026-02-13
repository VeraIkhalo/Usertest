## Task Manager – React + TypeScript

Lightweight task manager where you can create, view, update, filter, and delete tasks with local persistence in the browser.

Data is stored in `localStorage`, so it survives refreshes per browser/device.

---

## Features

- **Create tasks**: title (required) and description (optional)
- **View tasks**: tasks are listed with status pill and created-at timestamp
- **Update status**: change between `Todo`, `In progress`, and `Done`
- **Delete tasks**: remove tasks from the list
- **Filter & search**:
  - Filter by status (All, Todo, In progress, Done)
  - Free-text search across title and description
- **Persistence**: tasks are stored in `localStorage` under the key `task-manager-tasks`

---

## Tech Stack

- **React** (via Vite)
- **TypeScript**
- **Vite** as the build tool and dev server

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app locally

```bash
npm run dev
```

Then open the URL shown in the terminal (by default `http://localhost:5173`).

---

## Build for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Deployment

You can deploy the production build to any static hosting provider. Common options:

- **Vercel**: import the GitHub repo, it auto-detects Vite + React
- **Netlify**: set build command to `npm run build` and publish directory to `dist`

Once deployed, share:

1. **GitHub repository URL**
2. **Deployed app URL**

---

## Notes

- All state is client-side only; there is no backend/API.
- If you want to clear all tasks, clear `localStorage` for the site in your browser dev tools.
