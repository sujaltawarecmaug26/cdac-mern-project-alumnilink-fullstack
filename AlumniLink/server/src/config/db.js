import mysql from "mysql2/promise";
import env from "./env.js";

export const pool = mysql.createPool({
  ...env.mysql,
  waitForConnections: true,
  queueLimit: 0,
  charset: "utf8mb4",
});

export async function connectDb() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    console.log(`MySQL connected: ${env.mysql.database}`);
  } finally {
    conn.release();
  }
}
