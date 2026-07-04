import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const { DATABASE_URL } = process.env;

const client = new pg.Client({
  connectionString: DATABASE_URL,
});

await client.connect();

export default client;
