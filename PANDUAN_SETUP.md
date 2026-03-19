# Panduan Setup — Website Universitas Nusa Bangsa

Panduan ini menjelaskan cara menjalankan project dari awal di server/komputer baru setelah mengunduh dan mengekstrak file zip.

---

## Prasyarat

Pastikan sudah terinstal:

| Software | Versi minimal | Keterangan |
|---|---|---|
| Node.js | 18+ | https://nodejs.org |
| pnpm | 8+ | `npm install -g pnpm` |
| PostgreSQL | 14+ | https://www.postgresql.org |

---

## Langkah 1 — Install Dependensi

Buka terminal di folder hasil ekstrak zip, lalu jalankan:

```bash
pnpm install
```

---

## Langkah 2 — Siapkan Database

1. Buat database PostgreSQL kosong, contoh:
   ```sql
   CREATE DATABASE unb_db;
   ```

2. Catat **connection string** database Anda, formatnya:
   ```
   postgresql://USERNAME:PASSWORD@localhost:5432/unb_db
   ```

---

## Langkah 3 — Atur Environment Variables

Buat file `.env` di folder `unb/artifacts/api-server/` dengan isi berikut:

```env
# Wajib — koneksi database
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/unb_db

# Wajib untuk fitur pembayaran Midtrans
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxxxxxxxxxx

# Opsional — ganti ke "true" jika sudah production (bukan sandbox)
MIDTRANS_IS_PRODUCTION=false
```

> **Catatan:** Server key Midtrans diperoleh dari dashboard Midtrans Anda di https://dashboard.midtrans.com

---

## Langkah 4 — Inisialisasi Skema Database

**Pilihan A — Menggunakan file SQL (direkomendasikan untuk setup awal):**

File `database.sql` sudah tersedia di root project. Jalankan via terminal:

```bash
psql -U postgres -d unb_db -f database.sql
```

Atau buka file `database.sql` di pgAdmin → Query Tool → Run.

File ini akan membuat semua tabel dan mengisi data awal (pengaturan pembayaran, nomor WhatsApp, dll.).

---

**Pilihan B — Menggunakan perintah Drizzle (hanya skema, tanpa seed):**

```bash
pnpm --filter @workspace/db run db:push
```

Jika ada peringatan, tambahkan flag force:

```bash
pnpm --filter @workspace/db run db:push --force
```

---

## Langkah 5 — Jalankan Aplikasi

Buka **dua terminal** secara terpisah:

**Terminal 1 — Backend API (port 8080):**
```bash
pnpm --filter @workspace/api-server run dev
```

**Terminal 2 — Frontend Website (port 25692):**
```bash
pnpm --filter @workspace/unb-website run dev
```

Buka browser ke: **http://localhost:25692**

---

## Langkah 6 — Konfigurasi Awal via Admin Panel

1. Buka: **http://localhost:25692/admin**
2. Masuk dengan password admin (default: `admin123`)
3. Masuk ke menu **Pendaftaran → Pengaturan Bayar**
4. Isi **Midtrans Client Key** dari dashboard Midtrans Anda
5. Simpan pengaturan

> Semua konten halaman (teks, banner, berita, dll.) bisa diedit langsung dari Admin Panel — data tersimpan ke database.

---

## Struktur Folder Penting

```
unb/
├── artifacts/
│   ├── unb-website/      ← Frontend React/Vite
│   └── api-server/       ← Backend Express API
│       └── .env          ← File env dibuat di sini
└── lib/
    └── db/               ← Schema database (Drizzle ORM)
```

---

## Data & Konten Default

- **Konten halaman** (LPPM, LPM, BKK, Profil, Beranda, dll.) sudah ada sebagai data default di dalam kode — langsung muncul tanpa perlu diisi ulang.
- **Data pendaftar** dan **pengaturan yang disimpan admin** tersimpan di database — tidak ikut di dalam zip dan perlu diisi ulang melalui Admin Panel.

---

## Catatan Pembayaran Midtrans

| Mode | Server Key | Keterangan |
|---|---|---|
| Sandbox (uji coba) | Dimulai dengan `SB-Mid-server-...` | Transaksi tidak nyata |
| Production | Dimulai dengan `Mid-server-...` | Transaksi nyata |

Pastikan `MIDTRANS_IS_PRODUCTION` sesuai dengan mode key yang digunakan.

---

## Troubleshooting

| Masalah | Solusi |
|---|---|
| `Cannot connect to database` | Periksa `DATABASE_URL` di file `.env` |
| Halaman kosong / API error | Pastikan kedua server (frontend + backend) berjalan |
| Pembayaran Midtrans gagal | Periksa Server Key dan Client Key sudah sesuai |
| Tabel tidak ditemukan | Jalankan ulang `db:push` |
