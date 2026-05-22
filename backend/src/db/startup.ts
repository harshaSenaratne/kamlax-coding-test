import { pool } from "./pool";
import { createSchema } from "./schema";
import { seedDemoData } from "./seed";

async function waitForDatabase(attempts = 12) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await pool.query("SELECT 1");
      return;
    } catch (error) {
      if (attempt === attempts) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }
}

export async function initializeDatabase() {
  await waitForDatabase();
  await createSchema();
  await seedDemoData();
}

