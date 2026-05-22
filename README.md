# Portfolio Management Dashboard

A portfolio dashboard for viewing investments, tracking transaction history, and managing investment positions. 
## Run Locally

The API expects PostgreSQL on `localhost:5432`. 

```bash
docker compose up -d db
```

Install dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

Start the backend from the project root:

```bash
npm run dev:api
```

Start the frontend in another terminal:

```bash
npm run dev:web
```

Open `http://localhost:5173`.

The backend creates the required tables and seeds demo data when it starts. For custom local settings, provide `DATABASE_URL`, `JWT_SECRET`, and the other values from `.env.example`.

## Run with Docker

1. Copy `.env.example` to `.env` and change `JWT_SECRET` for a real local secret.
2. Run `docker compose up --build`.
3. Open `http://localhost:3000`.

Docker starts PostgreSQL, the API, and the frontend together. PostgreSQL data is stored in the `portfolio_db` volume.

## Demo Login

- Email: `demo@portfolio.local`
- Password: `DemoPass123!`
