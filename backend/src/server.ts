import { app } from "./app";
import { env } from "./config/env";
import { pool } from "./db/pool";
import { initializeDatabase } from "./db/startup";

async function startServer() {
  await initializeDatabase();

  const server = app.listen(env.PORT, () => {
    console.log(`Portfolio API listening on port ${env.PORT}`);
  });

  const shutdown = () => {
    server.close(() => {
      void pool.end().finally(() => process.exit(0));
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

void startServer().catch(async (error) => {
  console.error("Unable to start portfolio API.", error);
  await pool.end();
  process.exit(1);
});

