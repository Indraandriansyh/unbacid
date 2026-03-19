-- ============================================================
--  DATABASE SETUP — Universitas Nusa Bangsa (UNB) Website
--  Jalankan file ini sekali di PostgreSQL untuk inisialisasi
--  database dari awal.
--
--  Cara menjalankan:
--    psql -U postgres -d unb_db -f database.sql
--  Atau via pgAdmin: buka Query Tool → paste isi file ini → Run
-- ============================================================

-- ============================================================
--  BERSIHKAN TABEL LAMA (jika ada)
-- ============================================================
DROP TABLE IF EXISTS registrations  CASCADE;
DROP TABLE IF EXISTS site_settings  CASCADE;
DROP TABLE IF EXISTS facilities     CASCADE;

-- ============================================================
--  TABEL: site_settings
--  Key-value store untuk semua konten dan pengaturan website
-- ============================================================
CREATE TABLE site_settings (
    key        TEXT                     PRIMARY KEY,
    value      JSONB                    NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================
--  TABEL: registrations
--  Data calon mahasiswa yang mendaftar secara online
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS registrations_id_seq;

CREATE TABLE registrations (
    id                   INTEGER   NOT NULL DEFAULT nextval('registrations_id_seq') PRIMARY KEY,
    full_name            TEXT      NOT NULL,
    email                TEXT      NOT NULL,
    phone                TEXT,
    birth_date           TEXT      NOT NULL DEFAULT '',
    address              TEXT      NOT NULL DEFAULT '',
    faculty              TEXT      NOT NULL DEFAULT '',
    program              TEXT,
    registration_type    TEXT      NOT NULL DEFAULT 'reguler',
    message              TEXT,
    status               TEXT      NOT NULL DEFAULT 'pending',
    payment_method       TEXT,
    payment_status       TEXT      NOT NULL DEFAULT 'unpaid',
    midtrans_order_id    TEXT,
    midtrans_payment_type TEXT,
    created_at           TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

ALTER SEQUENCE registrations_id_seq OWNED BY registrations.id;

-- ============================================================
--  TABEL: facilities
--  Data fasilitas kampus (dikelola lewat Admin Panel)
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS facilities_id_seq;

CREATE TABLE facilities (
    id          INTEGER  NOT NULL DEFAULT nextval('facilities_id_seq') PRIMARY KEY,
    name        TEXT     NOT NULL,
    description TEXT,
    image_url   TEXT,
    created_at  TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

ALTER SEQUENCE facilities_id_seq OWNED BY facilities.id;

-- ============================================================
--  SEED DATA: paymentSettings
--  Pengaturan pembayaran awal — GANTI nilai Midtrans sesuai
--  akun Anda di https://dashboard.midtrans.com
-- ============================================================
INSERT INTO site_settings (key, value, updated_at) VALUES (
    'paymentSettings',
    '{
        "midtransEnabled": false,
        "midtransClientKey": "",
        "midtransIsProduction": false,
        "bankName": "BJB Syariah",
        "bankAccountNumber": "0040102001205",
        "bankAccountName": "Universitas Nusa Bangsa",
        "registrationFee": 200000
    }'::jsonb,
    now()
);

-- ============================================================
--  SEED DATA: registrationContent
--  Nomor WhatsApp dan URL formulir pendaftaran awal
-- ============================================================
INSERT INTO site_settings (key, value, updated_at) VALUES (
    'registrationContent',
    '{
        "whatsappNumber": "6281234567890",
        "formUrl": "",
        "brochureUrl": ""
    }'::jsonb,
    now()
);

-- ============================================================
--  TABEL: admin_users
--  Akun admin untuk dashboard (master, fakultas, prodi)
-- ============================================================
CREATE TABLE admin_users (
    id           SERIAL PRIMARY KEY,
    username     TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role         TEXT NOT NULL,
    scope_id     TEXT,
    display_name TEXT NOT NULL,
    created_by   TEXT,
    created_at   TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================
--  SEED DATA: admin_users
--  Untuk generate hash baru setelah restore:
--    cd unb/artifacts/api-server
--    pnpm exec tsx seed-admins.ts
--  (jalankan dari folder api-server setelah install deps)
-- ============================================================

-- CATATAN: Jalankan perintah ini dari folder api-server setelah
-- menjalankan database.sql untuk mengisi admin users dengan hash bcrypt:
--
--   cd unb/artifacts/api-server
--   DATABASE_URL="postgresql://..." pnpm exec tsx seed-admins.ts

-- ============================================================
--  SELESAI
--  Setelah menjalankan file ini, buka Admin Panel di /admin
--  untuk melengkapi konten website (beranda, profil, berita, dll.)
-- ============================================================
