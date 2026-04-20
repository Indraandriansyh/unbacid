# Panduan Build & Deploy ke Niagahoster

Panduan ini menjelaskan cara membuat file deploy (`index.cjs` + `public/`) untuk diupload ke Niagahoster dari mana saja — bukan hanya dari Replit.

---

## Prasyarat di Komputer / Server Build

Install tool berikut sebelum memulai:

| Tool | Versi | Link |
|------|-------|------|
| Node.js | 20 atau lebih | https://nodejs.org |
| pnpm | 9 atau lebih | `npm install -g pnpm` |
| Git | Bebas | https://git-scm.com |

---

## Langkah 1 — Clone Repository

```bash
git clone https://github.com/Indraandriansyh/unbacid.git
cd unbacid
```

---

## Langkah 2 — Install Dependencies

```bash
pnpm install
```

> Kalau muncul error "use pnpm instead", itu sudah benar — project ini memang harus pakai pnpm.

---

## Langkah 3 — Build Frontend (React/Vite)

```bash
pnpm --filter @workspace/unb-website run build
```

Hasil build ada di:
```
unb/artifacts/unb-website/dist/public/
├── index.html
└── assets/
    ├── index-xxxx.js
    └── index-xxxx.css
```

---

## Langkah 4 — Build API Server (Express → .cjs)

```bash
pnpm --filter @workspace/api-server run build
```

Hasil build ada di:
```
unb/artifacts/api-server/dist/
└── index.cjs   ← ini file startup untuk Node.js App di Niagahoster
```

---

## Langkah 5 — Kemas Jadi Satu Package

Jalankan script ini (sudah tersedia di repo):

```bash
bash unb/deploy.sh
```

Script tersebut otomatis:
1. Build frontend
2. Build API
3. Menggabungkan hasilnya ke folder `unb/deploy_package/`
4. Mengompres jadi `unb/deploy.tar.gz`

Struktur isi `deploy.tar.gz`:
```
./
├── index.cjs        ← server Express (startup file)
└── public/
    ├── index.html
    └── assets/
```

---

## Langkah 6 — Upload ke Niagahoster

### Di cPanel Niagahoster:

1. Buka **File Manager** → masuk ke folder `public_html/deploy_niagahoster/`
2. Hapus file lama: `index.cjs` dan folder `public/`  
   _(jangan hapus folder `uploads/` kalau ada — itu berisi file yang diupload admin)_
3. Klik **Upload** → pilih `deploy.tar.gz`
4. Setelah upload selesai, klik kanan `deploy.tar.gz` → **Extract**
5. Hapus file `deploy.tar.gz` setelah diekstrak (opsional, hemat space)

### Restart Node.js App:

1. Di cPanel → **Setup Node.js App**
2. Cari app yang sudah ada (Application root: `public_html/deploy_niagahoster`)
3. Klik **Restart**

---

## Environment Variables di Niagahoster

Di **Setup Node.js App → Environment Variables**, pastikan ada:

| Variable | Keterangan |
|----------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL (Supabase/Neon/dll) |
| `MIDTRANS_SERVER_KEY` | Server key dari dashboard Midtrans |
| `PORT` | Biasanya diisi otomatis oleh Niagahoster |

> `PORT` tidak perlu diisi manual — Niagahoster mengisinya sendiri.

---

## Konfigurasi Node.js App di Niagahoster

Jika perlu buat ulang dari awal:

| Setting | Value |
|---------|-------|
| Node.js version | 20 atau 18 |
| Application mode | Production |
| Application root | `public_html/deploy_niagahoster` |
| Application startup file | `index.cjs` |

---

## Menjalankan deploy.sh Secara Manual (tanpa script)

Jika `deploy.sh` tidak bisa dijalankan, lakukan manual:

```bash
# 1. Build frontend
pnpm --filter @workspace/unb-website run build

# 2. Build API
pnpm --filter @workspace/api-server run build

# 3. Buat folder package
mkdir -p unb/deploy_package

# 4. Copy file
cp unb/artifacts/api-server/dist/index.cjs unb/deploy_package/index.cjs
cp -r unb/artifacts/unb-website/dist/public unb/deploy_package/public

# 5. Compress
cd unb && tar -czf deploy.tar.gz -C deploy_package .
```

---

## Database — Opsi yang Bisa Dipakai

| Layanan | Gratis | Auto-pause | Link |
|---------|--------|-----------|------|
| **Supabase** | ✅ 500 MB | ⚠️ 7 hari tidak aktif | supabase.com |
| **Neon** | ✅ 512 MB | ❌ Tidak auto-pause | neon.tech |
| **Replit PostgreSQL** | ✅ (tergantung plan) | ❌ Tidak auto-pause | replit.com |

Untuk Supabase: cegah auto-pause dengan membuat cron job ping ke website setiap beberapa hari.

---

## Troubleshooting

**Website error setelah restart:**
- Cek log di cPanel → **Errors** atau terminal Node.js App
- Pastikan `DATABASE_URL` sudah benar di environment variables

**Halaman putih / tidak bisa load:**
- Pastikan folder `public/` dan file `index.html` ada di dalam `deploy_niagahoster/`
- Pastikan startup file di Node.js App adalah `index.cjs` (bukan `index.js`)

**Database tidak konek:**
- Coba akses `https://unb.ac.id/api/site-settings` — kalau error muncul detail koneksi DB
- Pastikan IP Niagahoster tidak diblokir di Supabase (Settings → Network → Allow all)

---

_Dokumen ini berlaku untuk struktur monorepo pnpm workspace dengan konfigurasi yang ada di repo `Indraandriansyh/unbacid`._
