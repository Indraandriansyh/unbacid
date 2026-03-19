# Daftar Akun Admin — Website Universitas Nusa Bangsa

> **PENTING**: Simpan file ini di tempat yang aman. Jangan dibagikan sembarangan.
> Setelah setup production, segera ganti password default melalui Admin Panel → Kelola Pengguna.

---

## Admin Master

| Peran | Username | Password | Akses |
|---|---|---|---|
| Admin Master | `admin` | `Admin@UNB2025` | Seluruh website |

URL Login: **http://localhost:25692/admin**

---

## Admin Fakultas

| Fakultas | Username | Password | Scope ID |
|---|---|---|---|
| Agroteknopreneur & Agraria | `admin_faa` | `Admin@FAA2025` | `faa` |
| Ekonomi dan Bisnis | `admin_feb` | `Admin@FEB2025` | `feb` |
| Kehutanan dan Lingkungan | `admin_fkl` | `Admin@FKL2025` | `fkl` |
| Sains dan Teknologi | `admin_fst` | `Admin@FST2025` | `fst` |
| Sekolah Pascasarjana | `admin_pps` | `Admin@PPS2025` | `pps` |

---

## Admin Program Studi

### Fakultas Agroteknopreneur & Agraria (FAA)

| Program Studi | Username | Password | Scope ID |
|---|---|---|---|
| Agroteknologi S-1 | `admin_agroteknologi` | `Prodi@Agroteknologi2025` | `agroteknologi-s1` |
| Agribisnis S-1 | `admin_agribisnis` | `Prodi@Agribisnis2025` | `agribisnis-s1` |

### Fakultas Ekonomi dan Bisnis (FEB)

| Program Studi | Username | Password | Scope ID |
|---|---|---|---|
| Manajemen S-1 | `admin_manajemen` | `Prodi@Manajemen2025` | `manajemen-s1` |
| Akuntansi S-1 | `admin_akuntansi` | `Prodi@Akuntansi2025` | `akuntansi-s1` |

### Fakultas Kehutanan dan Lingkungan (FKL)

| Program Studi | Username | Password | Scope ID |
|---|---|---|---|
| Kehutanan S-1 | `admin_kehutanan` | `Prodi@Kehutanan2025` | `kehutanan-s1` |

### Fakultas Sains dan Teknologi (FST)

| Program Studi | Username | Password | Scope ID |
|---|---|---|---|
| Biologi S-1 | `admin_biologi` | `Prodi@Biologi2025` | `biologi-s1` |
| Kimia S-1 | `admin_kimia` | `Prodi@Kimia2025` | `kimia-s1` |
| Data Sains S-1 | `admin_datasains` | `Prodi@DataSains2025` | `data-sains-s1` |

### Sekolah Pascasarjana (PPS)

| Program Studi | Username | Password | Scope ID |
|---|---|---|---|
| Magister Manajemen S-2 | `admin_magmanajemen` | `Prodi@MagManajemen2025` | `magister-manajemen-s2` |
| Magister Agribisnis S-2 | `admin_magagribisnis` | `Prodi@MagAgribisnis2025` | `magister-agribisnis-s2` |
| Magister Ekonomi Pembangunan S-2 | `admin_magekpem` | `Prodi@MagEkPem2025` | `magister-ekonomi-pembangunan-s2` |

---

## Aturan Akses

| Role | Dapat Mengakses | Dapat Tambah User |
|---|---|---|
| **Master** | Semua menu website (beranda, profil, LPPM, LPM, BKK, pendaftaran, berita, semua fakultas & prodi) | Semua role |
| **Fakultas** | Hanya konten fakultas miliknya | Admin prodi di bawah fakultasnya |
| **Prodi** | Hanya konten prodi miliknya | Admin prodi dengan scope sama |

---

## Cara Reset Password

Jika lupa password, admin bisa di-reset melalui:
1. Login sebagai admin yang membuatnya (created_by)
2. Masuk ke menu **Kelola Pengguna** → klik ikon hapus → buat ulang akun
3. Atau jalankan ulang seed script: `cd unb/artifacts/api-server && pnpm exec tsx seed-admins.ts`
