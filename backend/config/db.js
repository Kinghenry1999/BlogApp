import { Pool } from "pg";
import 'dotenv/config'

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
   password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

// Test connection
pool.connect()
  .then(() => console.log("PostgreSQL connected"))
  .catch(err => console.log(err));

export default pool;
