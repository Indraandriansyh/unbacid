import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@workspace/db";
import { adminUsersTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "unb-admin-secret-2025";
const JWT_EXPIRES = "8h";

function makeToken(user: { id: number; username: string; role: string; scopeId: string | null; displayName: string }) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role, scopeId: user.scopeId, displayName: user.displayName },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { id: number; username: string; role: string; scopeId: string | null; displayName: string };
}

export function authMiddleware(req: any, res: any, next: any) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    req.user = verifyToken(auth.slice(7));
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// POST /api/auth/login
router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username dan password wajib diisi" });
  }

  const [user] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.username, username))
    .limit(1);

  if (!user) {
    return res.status(401).json({ error: "Username atau password salah" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Username atau password salah" });
  }

  const token = makeToken(user);
  return res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role, scopeId: user.scopeId, displayName: user.displayName },
  });
});

// GET /api/auth/me
router.get("/auth/me", authMiddleware, (req: any, res) => {
  return res.json({ user: req.user });
});

// GET /api/auth/users — daftar user yang dibuat oleh akun ini
router.get("/auth/users", authMiddleware, async (req: any, res) => {
  const me = req.user;
  const users = await db
    .select({
      id: adminUsersTable.id,
      username: adminUsersTable.username,
      role: adminUsersTable.role,
      scopeId: adminUsersTable.scopeId,
      displayName: adminUsersTable.displayName,
      createdBy: adminUsersTable.createdBy,
      createdAt: adminUsersTable.createdAt,
    })
    .from(adminUsersTable)
    .where(eq(adminUsersTable.createdBy, me.username));
  return res.json(users);
});

// POST /api/auth/users — buat user baru
router.post("/auth/users", authMiddleware, async (req: any, res) => {
  const me = req.user;
  const { username, password, displayName, role, scopeId } = req.body;

  if (!username || !password || !displayName) {
    return res.status(400).json({ error: "username, password, dan displayName wajib diisi" });
  }

  // Validasi role
  if (me.role === "prodi") {
    // Prodi admin hanya bisa membuat user prodi dengan scope sama
    if (role && role !== "prodi") {
      return res.status(403).json({ error: "Admin prodi hanya dapat membuat user prodi" });
    }
  }
  if (me.role === "fakultas") {
    if (role && role !== "prodi" && role !== "fakultas") {
      return res.status(403).json({ error: "Admin fakultas hanya dapat membuat admin prodi atau admin fakultas" });
    }
  }

  const hash = await bcrypt.hash(password, 10);
  try {
    const [created] = await db
      .insert(adminUsersTable)
      .values({ username, passwordHash: hash, role: role || "prodi", scopeId: scopeId || null, displayName, createdBy: me.username })
      .returning({ id: adminUsersTable.id, username: adminUsersTable.username, role: adminUsersTable.role, scopeId: adminUsersTable.scopeId, displayName: adminUsersTable.displayName });
    return res.status(201).json(created);
  } catch (e: any) {
    if (e.code === "23505") return res.status(409).json({ error: "Username sudah digunakan" });
    throw e;
  }
});

// DELETE /api/auth/users/:id — hapus user
router.delete("/auth/users/:id", authMiddleware, async (req: any, res) => {
  const me = req.user;
  const id = parseInt(req.params.id);

  const [target] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.id, id)).limit(1);
  if (!target) return res.status(404).json({ error: "User tidak ditemukan" });

  // Hanya bisa hapus user yang dibuat oleh diri sendiri, dan tidak bisa hapus diri sendiri
  if (target.createdBy !== me.username) {
    return res.status(403).json({ error: "Tidak diizinkan menghapus user ini" });
  }
  if (target.id === me.id) {
    return res.status(403).json({ error: "Tidak dapat menghapus akun sendiri" });
  }

  await db.delete(adminUsersTable).where(eq(adminUsersTable.id, id));
  return res.json({ success: true });
});

// PATCH /api/auth/users/:id/password — ganti password user
router.patch("/auth/users/:id/password", authMiddleware, async (req: any, res) => {
  const me = req.user;
  const id = parseInt(req.params.id);
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "Password baru wajib diisi" });

  const [target] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.id, id)).limit(1);
  if (!target) return res.status(404).json({ error: "User tidak ditemukan" });
  if (target.createdBy !== me.username && target.id !== me.id) {
    return res.status(403).json({ error: "Tidak diizinkan mengubah password user ini" });
  }

  const hash = await bcrypt.hash(password, 10);
  await db.update(adminUsersTable).set({ passwordHash: hash }).where(eq(adminUsersTable.id, id));
  return res.json({ success: true });
});

export default router;
