import express from "express";
import cors from "cors";
import { readAnalytics } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/dashboard", async (_req, res) => {
  try {
    const data = await readAnalytics();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load analytics data" });
  }
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
