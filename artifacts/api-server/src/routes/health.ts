import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";

const router: IRouter = Router();

router.get("/healthz", async (_req, res) => {
  const dbUrl = process.env.DATABASE_URL;
  const dbConfigured = !!dbUrl;
  const dbMasked = dbUrl
    ? dbUrl.replace(/:([^:@]+)@/, ":***@")
    : "not set";

  let dbConnected = false;
  let dbError = "";
  let dbCode = "";

  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    dbConnected = true;
  } catch (err: any) {
    dbError = err?.message ?? String(err);
    dbCode = err?.code ?? "";
  }

  res.json({
    status: dbConnected ? "ok" : "degraded",
    db: {
      configured: dbConfigured,
      url: dbMasked,
      connected: dbConnected,
      error: dbError || undefined,
      code: dbCode || undefined,
    },
    env: process.env.NODE_ENV,
    port: process.env.PORT,
  });
});

export default router;
