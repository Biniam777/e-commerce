# E-commerce Frontend

React and Vite frontend foundation for the e-commerce application.

## Stack

- React
- Vite
- JavaScript
- React Router
- Native `fetch` API

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` to the backend API path, for example:

```text
VITE_API_BASE_URL=/api
```

During development, Vite proxies `/api` to `http://localhost:5000`. The backend must be running separately. The current pages are routing placeholders; feature workflows will be added in later checkpoints.