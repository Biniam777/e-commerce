# E-commerce Backend

Node.js and Express REST API foundation for the e-commerce application.

## Requirements

- Node.js 20 or newer
- npm
- MySQL

## Setup

1. Copy `.env.example` to `.env` and set local values.
2. Install dependencies with `npm install`.
3. Start the development server with `npm run dev`.

The backend currently contains only application and server bootstrapping. Domain features and the Prisma schema will be added in later tasks.

## Scripts

- `npm run dev`: Start with automatic restart on file changes.
- `npm start`: Start the server.
- `npm run check`: Run basic JavaScript syntax checks.
- `npm run prisma:generate`: Generate the Prisma client after a schema exists.
- `npm run prisma:migrate`: Run Prisma development migrations after a schema exists.