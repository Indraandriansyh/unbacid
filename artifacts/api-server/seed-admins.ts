import bcrypt from "bcryptjs";
import { pool } from "@workspace/db";

const SALT_ROUNDS = 10;

const admins = [
  { username: "admin", password: "Admin@UNB2025", role: "master", scopeId: null, displayName: "Admin Master UNB", createdBy: null },
  { username: "admin_faa", password: "Admin@FAA2025", role: "fakultas", scopeId: "faa", displayName: "Admin Fakultas Agroteknopreneur & Agraria", createdBy: "admin" },
  { username: "admin_feb", password: "Admin@FEB2025", role: "fakultas", scopeId: "feb", displayName: "Admin Fakultas Ekonomi dan Bisnis", createdBy: "admin" },
  { username: "admin_fkl", password: "Admin@FKL2025", role: "fakultas", scopeId: "fkl", displayName: "Admin Fakultas Kehutanan dan Lingkungan", createdBy: "admin" },
  { username: "admin_fst", password: "Admin@FST2025", role: "fakultas", scopeId: "fst", displayName: "Admin Fakultas Sains dan Teknologi", createdBy: "admin" },
  { username: "admin_pps", password: "Admin@PPS2025", role: "fakultas", scopeId: "pps", displayName: "Admin Sekolah Pascasarjana", createdBy: "admin" },
  { username: "admin_agroteknologi", password: "Prodi@Agroteknologi2025", role: "prodi", scopeId: "agroteknologi-s1", displayName: "Admin Prodi Agroteknologi", createdBy: "admin_faa" },
  { username: "admin_agribisnis", password: "Prodi@Agribisnis2025", role: "prodi", scopeId: "agribisnis-s1", displayName: "Admin Prodi Agribisnis S1", createdBy: "admin_faa" },
  { username: "admin_manajemen", password: "Prodi@Manajemen2025", role: "prodi", scopeId: "manajemen-s1", displayName: "Admin Prodi Manajemen", createdBy: "admin_feb" },
  { username: "admin_akuntansi", password: "Prodi@Akuntansi2025", role: "prodi", scopeId: "akuntansi-s1", displayName: "Admin Prodi Akuntansi", createdBy: "admin_feb" },
  { username: "admin_kehutanan", password: "Prodi@Kehutanan2025", role: "prodi", scopeId: "kehutanan-s1", displayName: "Admin Prodi Kehutanan", createdBy: "admin_fkl" },
  { username: "admin_biologi", password: "Prodi@Biologi2025", role: "prodi", scopeId: "biologi-s1", displayName: "Admin Prodi Biologi", createdBy: "admin_fst" },
  { username: "admin_kimia", password: "Prodi@Kimia2025", role: "prodi", scopeId: "kimia-s1", displayName: "Admin Prodi Kimia", createdBy: "admin_fst" },
  { username: "admin_datasains", password: "Prodi@DataSains2025", role: "prodi", scopeId: "data-sains-s1", displayName: "Admin Prodi Data Sains", createdBy: "admin_fst" },
  { username: "admin_magmanajemen", password: "Prodi@MagManajemen2025", role: "prodi", scopeId: "magister-manajemen-s2", displayName: "Admin Prodi Magister Manajemen", createdBy: "admin_pps" },
  { username: "admin_magagribisnis", password: "Prodi@MagAgribisnis2025", role: "prodi", scopeId: "magister-agribisnis-s2", displayName: "Admin Prodi Magister Agribisnis", createdBy: "admin_pps" },
  { username: "admin_magekpem", password: "Prodi@MagEkPem2025", role: "prodi", scopeId: "magister-ekonomi-pembangunan-s2", displayName: "Admin Prodi Magister Ekonomi Pembangunan", createdBy: "admin_pps" },
];

for (const admin of admins) {
  const hash = await bcrypt.hash(admin.password, SALT_ROUNDS);
  await pool.query(
    `INSERT INTO admin_users (username, password_hash, role, scope_id, display_name, created_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (username) DO UPDATE SET
       password_hash = EXCLUDED.password_hash,
       role = EXCLUDED.role,
       scope_id = EXCLUDED.scope_id,
       display_name = EXCLUDED.display_name`,
    [admin.username, hash, admin.role, admin.scopeId, admin.displayName, admin.createdBy]
  );
  console.log(`✓ ${admin.username}`);
}
await pool.end();
console.log("Done seeding admin users!");
