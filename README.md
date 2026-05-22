# Portfolio Management Dashboard

A small full-stack investment dashboard built with React, TypeScript, Express, PostgreSQL, JWT authentication, and Docker Compose.

## Architecture

- The Vite React client renders the login page, protected portfolio routes, investment create/edit forms, and transaction history.
- The Express API validates requests with Zod, signs JWT access tokens after password verification, and derives portfolio values from PostgreSQL positions.
- API startup creates the schema and seeds one demo user with holdings and buy/sell history if the demo account has no positions.
- Docker serves the built React app with Nginx and proxies `/api` requests to the API container.

## Run with Docker

1. Copy `.env.example` to `.env` and change `JWT_SECRET` for a real local secret.
2. Run `docker compose up --build`.
3. Open `http://localhost:3000`.
4. Sign in with `demo@portfolio.local` and `DemoPass123!`.

PostgreSQL data persists in the `portfolio_db` Docker volume. The API health endpoint is available at `http://localhost:4000/api/health`.

## Commit History Plan

1. `chore: scaffold full stack portfolio workspace`
2. `feat(api): add postgres schema bootstrap and demo portfolio seed`
3. `feat(api): implement jwt auth and protected portfolio endpoints`
4. `feat(web): add authenticated dashboard and portfolio summary`
5. `feat(web): add transaction history and investment editor`
6. `chore(docker): containerize api web and postgres services`
7. `docs: add local run instructions and demo credentials`

