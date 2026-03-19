import { db, pool } from "@workspace/db";
import { registrationsTable, siteSettingsTable, facilitiesTable } from "@workspace/db/schema";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Setting up database...");

  // Create site_settings table if not exists
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);

  // Create registrations table if not exists
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      birth_date TEXT NOT NULL,
      address TEXT NOT NULL,
      faculty TEXT NOT NULL,
      program TEXT NOT NULL,
      registration_type TEXT NOT NULL,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);

  // Create facilities table if not exists
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS facilities (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);

  console.log("Seeding database...");

  // Seed Home Content from JSON
  const homeContent = {
    hero: {
      welcome: "#WELCOMETO",
      title: "NUSA BANGSA UNIVERSITY",
      subtitle1: "UNIVERSITAS NUSA BANGSA — BOGOR, INDONESIA",
      subtitle2: "AKREDITASI & PROGRAM STUDI TERBAIK",
      accreditation: "TERAKREDITASI BAN-PT",
      programs: "5 FAKULTAS · 8 PROGRAM STUDI",
      buttonText: "JELAJAHI PROGRAM"
    },
    banners: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200' },
      { type: 'video', url: 'https://v.ftcdn.net/06/08/54/12/700_F_608541243_m33xYF6f22UeO1l6C2I2G7w4X0E1X2T_ST.mp4' }
    ],
    gridItems: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=400' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=400' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400' }
    ],
    cta: {
      heading1: "PENERIMAAN",
      heading2: "MAHASISWA",
      heading3: "BARU",
      description: "DAFTARKAN DIRIMU SEKARANG DAN WUJUDKAN MIMPIMU BERSAMA UNB BOGOR",
      features: [
        { title: "PROGRAM UNGGULAN", desc: "BERBAGAI PILIHAN PROGRAM STUDI TERAKREDITASI SESUAI MINAT DAN BAKATMU." },
        { title: "FASILITAS LENGKAP", desc: "KAMPUS DILENGKAPI LABORATORIUM, PERPUSTAKAAN, DAN SISTEM INFORMASI TERKINI." },
        { title: "JALUR MASUK BERAGAM", desc: "TERSEDIA JALUR REGULER, JALUR PRESTASI, DAN JALUR MANDIRI UNTUK SEMUA SISWA." }
      ],
      cardImage: "https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=800",
      statStudents: "15,000+ MAHASISWA AKTIF",
      statCampus: "KAMPUS UNGGULAN"
    }
  };

  // Seed Profile Content
  const profileContent = {
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

  await db.insert(siteSettingsTable).values([
    { key: 'homeContent', value: homeContent },
    { key: 'profileContent', value: profileContent }
  ]).onConflictDoUpdate({
    target: siteSettingsTable.key,
    set: { value: sql`EXCLUDED.value`, updatedAt: new Date() }
  });

  // Seed Facilities
  const facilities = [
    { title: "Laboratorium Terpadu", description: "Fasilitas riset modern untuk mendukung kegiatan praktikum mahasiswa.", imageUrl: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=400" },
    { title: "Perpustakaan Digital", description: "Akses ke ribuan jurnal dan buku digital dari seluruh dunia.", imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400" },
    { title: "Gedung Olahraga", description: "Fasilitas olahraga lengkap untuk menjaga kebugaran mahasiswa.", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400" }
  ];

  for (const facility of facilities) {
    await db.insert(facilitiesTable).values(facility).onConflictDoNothing();
  }

  const registrations = [
    {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "081234567890",
      birthDate: "1990-01-01",
      address: "Jl. Merdeka No. 123, Jakarta",
      faculty: "Fakultas Teknik",
      program: "Teknik Informatika",
      registrationType: "S1 Reguler",
      message: "I am interested in this program.",
      status: "pending",
    },
    {
      fullName: "Jane Smith",
      email: "jane@example.com",
      phone: "089876543210",
      birthDate: "1995-05-15",
      address: "Jl. Sudirman No. 456, Bandung",
      faculty: "Fakultas Ekonomi",
      program: "Manajemen",
      registrationType: "S1 Reguler",
      message: "Looking forward to joining.",
      status: "pending",
    },
  ];

  for (const item of registrations) {
    await db.insert(registrationsTable).values(item).onConflictDoNothing();
  }

  console.log("Seeding completed!");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });

