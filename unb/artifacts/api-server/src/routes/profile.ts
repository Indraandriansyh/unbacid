import { Router, type IRouter, type Request } from "express";
import { db, siteSettingsTable, facilitiesTable } from "@workspace/db";
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
    cb(null, `profile-side-${base}${ext}`);
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

const defaultProfileContent = {
  about: {
    title: "TENTANG KAMI",
    subtitle: "MENJADI UNIVERSITAS UNGGUL DALAM PENGEMBANGAN ILMU PENGETAHUAN, TEKNOLOGI DAN SENI YANG BERWAWASAN LINGKUNGAN"
  },
  history: {
    subtitle: "BERDIRI SEJAK TAHUN 1987, UNIVERSITAS NUSA BANGSA TELAH MENCETAK RIBUAN LULUSAN BERKUALITAS"
  },
  visionMission: {
    vision: "MENJADI UNIVERSITAS YANG UNGGUL DALAM PENGEMBANGAN IPTEKS BERWAWASAN LINGKUNGAN PADA TAHUN 2035",
    missions: [
      "MENYELENGGARAKAN PENDIDIKAN TINGGI YANG BERKUALITAS DAN BERWAWASAN LINGKUNGAN",
      "MELAKSANAKAN PENELITIAN UNTUK MENGEMBANGKAN IPTEKS YANG BERMANFAAT BAGI MASYARAKAT",
      "MENYELENGGARAKAN PENGABDIAN KEPADA MASYARAKAT BERBASIS HASIL PENELITIAN",
      "MENJALIN KERJASAMA STRATEGIS DENGAN BERBAGAI PIHAK DI DALAM DAN LUAR NEGERI"
    ],
    sideImage: "https://images.unsplash.com/photo-1523050853064-8521a303001f?q=80&w=800",
    sideTitle: "KAMPUS UNB BOGOR",
    sideSubtitle: "LINGKUNGAN BELAJAR YANG ASRI DAN KONDUSIF"
  }
};

// Get profile settings
router.get("/profile", async (_req, res) => {
  try {
    let result = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, "profileContent")).limit(1);
    if (result.length === 0) {
      await db.insert(siteSettingsTable).values({ key: 'profileContent', value: defaultProfileContent });
      result = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, "profileContent")).limit(1);
    }
    res.json(result[0].value);
  } catch (err) {
    console.error("Get profile settings error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update profile settings
router.post("/profile", async (req, res) => {
  try {
    const value = req.body;
    await db.insert(siteSettingsTable).values({
      key: "profileContent",
      value: value,
    }).onConflictDoUpdate({
      target: siteSettingsTable.key,
      set: { value: value, updatedAt: new Date() }
    });
    res.json(value);
  } catch (err) {
    console.error("Update profile settings error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/profile/side-image", upload.single("file"), async (req, res) => {
  try {
    const file = (req as Request & { file?: MulterFile }).file;
    if (!file) {
      res.status(400).json({ error: "File is required" });
      return;
    }
    res.json({ url: `/api/uploads/${file.filename}` });
  } catch (err) {
    console.error("Upload side image error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Facilities CRUD ---

// Get all facilities
router.get("/facilities", async (_req, res) => {
  try {
    const result = await db.select().from(facilitiesTable);
    res.json(result);
  } catch (err) {
    console.error("Get facilities error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add facility
router.post("/facilities", async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const result = await db.insert(facilitiesTable).values({
      title,
      description,
      imageUrl,
    }).returning();
    res.json(result[0]);
  } catch (err) {
    console.error("Add facility error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update facility
router.put("/facilities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl } = req.body;
    const result = await db.update(facilitiesTable).set({
      title,
      description,
      imageUrl,
    }).where(eq(facilitiesTable.id, parseInt(id))).returning();
    res.json(result[0]);
  } catch (err) {
    console.error("Update facility error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete facility
router.delete("/facilities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(facilitiesTable).where(eq(facilitiesTable.id, parseInt(id)));
    res.json({ message: "Facility deleted successfully" });
  } catch (err) {
    console.error("Delete facility error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
