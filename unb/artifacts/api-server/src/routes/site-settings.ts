import { Router, type IRouter, type Request } from "express";
import { db, siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import multer, { type FileFilterCallback } from "multer";
import path from "path";

const router: IRouter = Router();

type MulterFile = { originalname: string; mimetype: string; filename: string };

const uploadsDir = path.resolve(process.cwd(), "uploads");
const storage = multer.diskStorage({
  destination: (_req: Request, _file: MulterFile, cb: (error: Error | null, destination: string) => void) => cb(null, uploadsDir),
  filename: (_req: Request, file: MulterFile, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".bin";
    const base = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    cb(null, `upload-${base}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req: Request, file: MulterFile, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image uploads are allowed"));
  },
});

// Get all site settings
router.get("/site-settings", async (_req, res) => {
  try {
    const result = await db.select().from(siteSettingsTable);
    const settingsMap = result.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, any>);
    res.json(settingsMap);
  } catch (err) {
    console.error("Get site settings error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/site-settings/upload", upload.single("file"), async (req, res) => {
  try {
    const file = (req as Request & { file?: MulterFile }).file;
    if (!file) {
      res.status(400).json({ error: "File is required" });
      return;
    }
    res.json({ url: `/api/uploads/${file.filename}` });
  } catch (err) {
    console.error("Upload site image error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get site setting by key
router.get("/site-settings/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const result = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key)).limit(1);
    
    if (result.length === 0) {
      res.status(404).json({ error: "Setting not found" });
      return;
    }
    res.json(result[0].value);
  } catch (err) {
    console.error(`Get site setting ${req.params.key} error:`, err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update or create site setting
router.post("/site-settings", async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      res.status(400).json({ error: "Key and value are required" });
      return;
    }

    await db.insert(siteSettingsTable).values({
      key: key,
      value: value,
    }).onConflictDoUpdate({
      target: siteSettingsTable.key,
      set: { value: value, updatedAt: new Date() }
    });

    res.json(value);
  } catch (err) {
    console.error("Update site setting error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
