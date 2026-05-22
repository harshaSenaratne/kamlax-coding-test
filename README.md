# Portfolio Management Dashboard

A portfolio dashboard for viewing investments, tracking transaction history, and managing investment positions. 

## Screenshots

<img width="1416" height="729" alt="Screenshot 2026-05-22 at 10 29 41 AM" src="https://github.com/user-attachments/assets/fb38a474-1e19-4da1-8ef7-cf347f1ff0dd" />
<img width="1423" height="732" alt="Screenshot 2026-05-22 at 10 29 55 AM" src="https://github.com/user-attachments/assets/054d9b16-28ab-4dd3-aebb-4a2e9234cf13" />
<img width="1428" height="681" alt="Screenshot 2026-05-22 at 10 30 09 AM" src="https://github.com/user-attachments/assets/b9536a94-a4df-4432-8c28-ed6ead10d37a" />
<img width="1423" height="732" alt="Screenshot 2026-05-22 at 10 30 31 AM" src="https://github.com/user-attachments/assets/0c399ca7-1ae4-473d-89e3-fb79b95c086b" />



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
