import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";
import fs from "fs";
import path from "path";

const app: Express = express();

const _dirname = typeof __dirname !== "undefined"
  ? __dirname
  : path.dirname(new URL(import.meta.url).pathname);
const uploadsDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/uploads", express.static(uploadsDir));
app.use("/api", router);

const publicDir = path.resolve(_dirname, "public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

export default app;
