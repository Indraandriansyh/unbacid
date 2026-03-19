import { Router } from "express";
import { pool } from "@workspace/db";

const router = Router();

// GET /api/mahasiswa?prodiId=...&q=...
router.get("/mahasiswa", async (req, res) => {
  const { prodiId, q } = req.query as Record<string, string>;
  let query = "SELECT * FROM mahasiswa";
  const params: any[] = [];
  const conditions: string[] = [];

  if (prodiId) {
    params.push(prodiId);
    conditions.push(`prodi_id = $${params.length}`);
  }
  if (q) {
    params.push(`%${q}%`);
    conditions.push(`(nama ILIKE $${params.length} OR nim ILIKE $${params.length} OR email ILIKE $${params.length})`);
  }
  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY angkatan DESC, nim ASC LIMIT 200";

  const { rows } = await pool.query(query, params);
  return res.json(rows);
});

// GET /api/mahasiswa/:id
router.get("/mahasiswa/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM mahasiswa WHERE id = $1", [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  return res.json(rows[0]);
});

// POST /api/mahasiswa
router.post("/mahasiswa", async (req, res) => {
  const { nim, nama, prodi_id, angkatan, semester, status, jenis_kelamin, tempat_lahir, tanggal_lahir, alamat, email, telepon, foto_url } = req.body;
  if (!nim || !nama || !prodi_id) return res.status(400).json({ error: "nim, nama, prodi_id wajib diisi" });
  try {
    const { rows } = await pool.query(
      `INSERT INTO mahasiswa (nim, nama, prodi_id, angkatan, semester, status, jenis_kelamin, tempat_lahir, tanggal_lahir, alamat, email, telepon, foto_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [nim, nama, prodi_id, angkatan ?? new Date().getFullYear(), semester ?? 1, status ?? "aktif", jenis_kelamin ?? "L", tempat_lahir, tanggal_lahir, alamat, email, telepon, foto_url]
    );
    return res.status(201).json(rows[0]);
  } catch (e: any) {
    if (e.code === "23505") return res.status(409).json({ error: "NIM sudah terdaftar" });
    throw e;
  }
});

// PATCH /api/mahasiswa/:id
router.patch("/mahasiswa/:id", async (req, res) => {
  const fields = ["nama", "prodi_id", "angkatan", "semester", "status", "jenis_kelamin", "tempat_lahir", "tanggal_lahir", "alamat", "email", "telepon", "foto_url"];
  const updates: string[] = [];
  const params: any[] = [];
  for (const f of fields) {
    if (req.body[f] !== undefined) {
      params.push(req.body[f]);
      updates.push(`${f} = $${params.length}`);
    }
  }
  if (!updates.length) return res.status(400).json({ error: "Tidak ada field yang diperbarui" });
  params.push(req.params.id);
  const { rows } = await pool.query(
    `UPDATE mahasiswa SET ${updates.join(", ")} WHERE id = $${params.length} RETURNING *`,
    params
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  return res.json(rows[0]);
});

// DELETE /api/mahasiswa/:id
router.delete("/mahasiswa/:id", async (req, res) => {
  const { rowCount } = await pool.query("DELETE FROM mahasiswa WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: "Not found" });
  return res.json({ success: true });
});

export default router;
