import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";
import fs from "fs";
import path from "path";

const app: Express = express();
const uploadsDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/uploads", express.static(uploadsDir));
app.use("/api", router);

export default app;
