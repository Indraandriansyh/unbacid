import { useState, useMemo } from "react";
import { MediaBanner } from "../components/MediaBanner";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, ExternalLink, Tag, Calendar, Briefcase, MapPin, Clock } from "lucide-react";

export type LpmCard = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  detail?: string;
  icon?: string;
  date?: string;
  tags?: string[];
  downloadUrl?: string;
  downloadLabel?: string;
  linkUrl?: string;
  linkLabel?: string;
  badgeText?: string;
  badgeColor?: "emerald" | "blue" | "yellow" | "red" | "purple";
  // jobs-specific
  location?: string;
  deadline?: string;
  type?: string;
};

export type LpmPageContent = {
  banner: { type: "image" | "video"; url: string }[];
  description: string;
  cards: LpmCard[];
};

export type LpmContent = {
  pages: {
    sop: LpmPageContent;
    jobs: LpmPageContent;
    performance: LpmPageContent;
    tracer: LpmPageContent;
    spmi: LpmPageContent;
  };
};

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());

export const DEFAULT_LPM_CONTENT: LpmContent = {
  pages: {
    sop: {
      banner: [
        { type: "image", url: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1400" },
        { type: "image", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1400" },
      ],
      description:
        "Lembaga Penjaminan Mutu (LPM) Universitas Nusa Bangsa menyusun dan mengelola Prosedur Kerja (Standard Operating Procedure) untuk memastikan seluruh proses akademik dan non-akademik berjalan secara terstandar, efisien, dan akuntabel sesuai ketentuan yang berlaku.",
      cards: [
        {
          id: makeId(),
          title: "SOP Proses Belajar Mengajar",
          subtitle: "Dokumen: SOP-LPM-001",
          description: "Prosedur standar penyelenggaraan perkuliahan, mulai dari perencanaan pembelajaran, pelaksanaan perkuliahan, hingga evaluasi hasil belajar mahasiswa.",
          detail: "SOP ini mengatur seluruh alur proses belajar mengajar di UNB, mencakup: (1) Penyusunan Rencana Pembelajaran Semester (RPS) oleh dosen; (2) Pelaksanaan perkuliahan tatap muka dan daring; (3) Penilaian dan evaluasi pembelajaran; (4) Pengisian nilai di SIMAK; (5) Pemantauan kehadiran dosen dan mahasiswa. SOP ini wajib diikuti oleh seluruh civitas akademika UNB.",
          icon: "📚",
          date: "Revisi: Januari 2024",
          tags: ["Akademik", "Pembelajaran", "Evaluasi"],
          downloadUrl: "#",
          downloadLabel: "Unduh SOP",
          badgeText: "Berlaku",
          badgeColor: "emerald",
        },
        {
          id: makeId(),
          title: "SOP Penerimaan Mahasiswa Baru",
          subtitle: "Dokumen: SOP-LPM-002",
          description: "Prosedur standar penerimaan dan registrasi mahasiswa baru jalur reguler, beasiswa, dan jalur khusus di Universitas Nusa Bangsa.",
          detail: "Prosedur penerimaan mahasiswa baru meliputi: (1) Pengumuman penerimaan mahasiswa baru; (2) Pendaftaran online via portal resmi; (3) Seleksi berkas dan tes masuk; (4) Pengumuman hasil seleksi; (5) Registrasi dan pembayaran UKT; (6) Orientasi mahasiswa baru. Prosedur ini berlaku untuk seluruh jalur penerimaan yang dibuka UNB.",
          icon: "🎓",
          date: "Revisi: Maret 2024",
          tags: ["PMB", "Registrasi", "Seleksi"],
          downloadUrl: "#",
          downloadLabel: "Unduh SOP",
          badgeText: "Berlaku",
          badgeColor: "emerald",
        },
        {
          id: makeId(),
          title: "SOP Penelitian Dosen",
          subtitle: "Dokumen: SOP-LPM-003",
          description: "Prosedur standar pengajuan, pelaksanaan, monitoring, dan pelaporan kegiatan penelitian dosen baik internal maupun eksternal.",
          detail: "SOP ini mengatur alur penelitian dosen dari tahap pengajuan proposal hingga publikasi hasil penelitian: (1) Pengajuan proposal penelitian; (2) Review dan seleksi proposal oleh komite; (3) Penandatanganan kontrak penelitian; (4) Pelaksanaan dan monitoring kemajuan; (5) Pelaporan akhir dan publikasi. Seluruh penelitian wajib terdaftar di SINTA dan dilaporkan ke LPPM.",
          icon: "🔬",
          date: "Revisi: Februari 2024",
          tags: ["Penelitian", "LPPM", "Publikasi"],
          downloadUrl: "#",
          downloadLabel: "Unduh SOP",
          badgeText: "Berlaku",
          badgeColor: "emerald",
        },
        {
          id: makeId(),
          title: "SOP Wisuda",
          subtitle: "Dokumen: SOP-LPM-004",
          description: "Prosedur standar penyelenggaraan wisuda, mulai dari pendaftaran wisuda, verifikasi kelulusan, hingga pelaksanaan upacara wisuda.",
          detail: "SOP Wisuda mencakup: (1) Verifikasi kelulusan mahasiswa oleh BAA; (2) Pendaftaran wisuda online; (3) Pembayaran biaya wisuda; (4) Fitting toga dan pengambilan dokumen; (5) Gladi bersih dan pelaksanaan wisuda; (6) Penerbitan ijazah dan transkrip akademik. Wisuda UNB diselenggarakan dua kali dalam setahun.",
          icon: "🏛️",
          date: "Revisi: April 2024",
          tags: ["Wisuda", "Kelulusan", "Ijazah"],
          downloadUrl: "#",
          downloadLabel: "Unduh SOP",
          badgeText: "Berlaku",
          badgeColor: "emerald",
        },
        {
          id: makeId(),
          title: "SOP Pengaduan dan Layanan Mahasiswa",
          subtitle: "Dokumen: SOP-LPM-005",
          description: "Prosedur standar penanganan pengaduan, keluhan, dan layanan khusus mahasiswa oleh unit-unit terkait di lingkungan UNB.",
          detail: "Prosedur penanganan pengaduan: (1) Mahasiswa mengajukan pengaduan melalui portal SIMAK atau datang langsung ke BAA; (2) Petugas mencatat dan mengklasifikasikan pengaduan; (3) Koordinasi dengan unit terkait; (4) Penyelesaian maksimal 14 hari kerja; (5) Konfirmasi penyelesaian kepada mahasiswa; (6) Dokumentasi dan pelaporan.",
          icon: "📋",
          date: "Revisi: Mei 2024",
          tags: ["Pengaduan", "Layanan", "Mahasiswa"],
          downloadUrl: "#",
          downloadLabel: "Unduh SOP",
          badgeText: "Berlaku",
          badgeColor: "blue",
        },
        {
          id: makeId(),
          title: "SOP Audit Mutu Internal",
          subtitle: "Dokumen: SOP-LPM-006",
          description: "Prosedur standar pelaksanaan Audit Mutu Internal (AMI) di seluruh unit kerja dan program studi Universitas Nusa Bangsa.",
          detail: "Audit Mutu Internal dilaksanakan satu kali per semester oleh tim auditor terlatih LPM: (1) Perencanaan audit dan pembentukan tim; (2) Penyusunan instrumen audit berbasis standar SPMI; (3) Pelaksanaan audit lapangan; (4) Penyusunan laporan temuan; (5) Tindak lanjut temuan oleh unit teraudit; (6) Verifikasi perbaikan dan penutupan temuan.",
          icon: "✅",
          date: "Revisi: Juni 2024",
          tags: ["Audit", "Mutu", "AMI"],
          downloadUrl: "#",
          downloadLabel: "Unduh SOP",
          badgeText: "Berlaku",
          badgeColor: "purple",
        },
      ],
    },
    jobs: {
      banner: [
        { type: "image", url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400" },
        { type: "image", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1400" },
      ],
      description:
        "Universitas Nusa Bangsa membuka kesempatan bagi tenaga profesional, akademisi, dan staf administrasi yang berdedikasi untuk bergabung dan berkontribusi dalam mewujudkan visi UNB sebagai perguruan tinggi unggul. Temukan peluang karier terbaik Anda di sini.",
      cards: [
        {
          id: makeId(),
          title: "Dosen Tetap Prodi Agribisnis",
          subtitle: "Fakultas Pertanian dan Agroteknologi",
          description: "Dibutuhkan Dosen Tetap untuk mengampu mata kuliah bidang Agribisnis, Manajemen Usaha Tani, dan Ekonomi Pertanian. Kualifikasi minimal S3 bidang terkait.",
          detail: "Persyaratan: (1) Pendidikan S3 bidang Agribisnis/Ekonomi Pertanian/Manajemen; (2) Memiliki jabatan akademik minimal Lektor; (3) Memiliki publikasi internasional terindeks Scopus minimal 2 artikel; (4) Berpengalaman mengajar minimal 3 tahun; (5) Usia maksimal 45 tahun. Benefit: gaji kompetitif, tunjangan kinerja, BPJS Kesehatan & Ketenagakerjaan, dana penelitian tahunan.",
          icon: "👨‍🏫",
          date: "Dibuka: 1 Oktober 2024",
          tags: ["Dosen Tetap", "Agribisnis", "Pertanian"],
          linkUrl: "#",
          linkLabel: "Daftar Sekarang",
          badgeText: "Buka",
          badgeColor: "emerald",
          location: "Bogor, Jawa Barat",
          deadline: "31 Oktober 2024",
          type: "Full-time",
        },
        {
          id: makeId(),
          title: "Dosen Tetap Prodi Ilmu Komputer / Data Sains",
          subtitle: "Fakultas Matematika dan Ilmu Pengetahuan Alam",
          description: "Dicari Dosen berpengalaman di bidang Data Science, Machine Learning, atau Artificial Intelligence untuk mengembangkan kurikulum dan penelitian di Prodi Data Sains UNB.",
          detail: "Kualifikasi: (1) S3 bidang Ilmu Komputer/Data Science/Informatika atau bidang terkait; (2) Pengalaman industri di bidang data science minimal 2 tahun (diutamakan); (3) Memiliki portofolio penelitian atau proyek AI/ML; (4) Kemampuan mengajar dan membimbing mahasiswa; (5) Mampu berkomunikasi dalam Bahasa Inggris. Fasilitas: laboratorium komputer modern, akses cloud computing, dan dana riset.",
          icon: "💻",
          date: "Dibuka: 15 Oktober 2024",
          tags: ["Dosen Tetap", "Data Sains", "AI/ML"],
          linkUrl: "#",
          linkLabel: "Daftar Sekarang",
          badgeText: "Buka",
          badgeColor: "emerald",
          location: "Bogor, Jawa Barat",
          deadline: "15 November 2024",
          type: "Full-time",
        },
        {
          id: makeId(),
          title: "Staf Administrasi Keuangan",
          subtitle: "Biro Keuangan dan Akuntansi",
          description: "Dibutuhkan staf administrasi keuangan yang teliti dan berpengalaman dalam pengelolaan keuangan lembaga pendidikan tinggi.",
          detail: "Persyaratan: (1) Pendidikan S1 Akuntansi/Keuangan; (2) Pengalaman kerja minimal 2 tahun di bidang keuangan; (3) Menguasai software akuntansi (SAP/MYOB/Zahir); (4) Memahami peraturan keuangan pendidikan tinggi; (5) Jujur, teliti, dan mampu bekerja di bawah tekanan. Jam kerja: Senin-Jumat 08.00-16.00 WIB.",
          icon: "💰",
          date: "Dibuka: 20 Oktober 2024",
          tags: ["Staf", "Keuangan", "Akuntansi"],
          linkUrl: "#",
          linkLabel: "Lamar Sekarang",
          badgeText: "Buka",
          badgeColor: "blue",
          location: "Bogor, Jawa Barat",
          deadline: "20 November 2024",
          type: "Full-time",
        },
        {
          id: makeId(),
          title: "Tenaga IT & Pengembang Sistem",
          subtitle: "Unit Teknologi Informasi dan Komunikasi",
          description: "Dibutuhkan pengembang sistem informasi untuk mendukung pengembangan dan pemeliharaan SIMAK, portal website, dan sistem informasi internal UNB.",
          detail: "Kualifikasi teknis: (1) S1 Teknik Informatika/Ilmu Komputer; (2) Menguasai PHP, Laravel, atau Node.js; (3) Pengalaman dengan MySQL/PostgreSQL; (4) Memahami REST API dan integrasi sistem; (5) Pengalaman kerja minimal 1 tahun. Diutamakan yang berpengalaman dengan sistem akademik perguruan tinggi.",
          icon: "🖥️",
          date: "Dibuka: 25 Oktober 2024",
          tags: ["IT", "Programmer", "Web Dev"],
          linkUrl: "#",
          linkLabel: "Lamar Sekarang",
          badgeText: "Buka",
          badgeColor: "blue",
          location: "Bogor, Jawa Barat",
          deadline: "30 November 2024",
          type: "Full-time",
        },
        {
          id: makeId(),
          title: "Koordinator Kemahasiswaan",
          subtitle: "Biro Kemahasiswaan dan Alumni",
          description: "Dibutuhkan koordinator kemahasiswaan yang energik dan berdedikasi untuk membina dan mengembangkan kegiatan kemahasiswaan di UNB.",
          detail: "Tugas utama: (1) Koordinasi kegiatan organisasi kemahasiswaan (BEM, UKM, Himpunan); (2) Pengelolaan beasiswa mahasiswa; (3) Pembimbingan kegiatan kewirausahaan mahasiswa; (4) Koordinasi program pertukaran pelajar; (5) Pengelolaan data kemahasiswaan. Kualifikasi: S2 bidang pendidikan/manajemen, pengalaman pembinaan mahasiswa minimal 2 tahun.",
          icon: "🎓",
          date: "Dibuka: 1 November 2024",
          tags: ["Kemahasiswaan", "Koordinator", "Alumni"],
          linkUrl: "#",
          linkLabel: "Lamar Sekarang",
          badgeText: "Segera",
          badgeColor: "yellow",
          location: "Bogor, Jawa Barat",
          deadline: "1 Desember 2024",
          type: "Full-time",
        },
        {
          id: makeId(),
          title: "Laboran Laboratorium Kimia",
          subtitle: "Fakultas Matematika dan Ilmu Pengetahuan Alam",
          description: "Dibutuhkan tenaga laboran berpengalaman untuk mendukung kegiatan praktikum dan penelitian di Laboratorium Kimia FMIPA UNB.",
          detail: "Persyaratan: (1) Minimal D3/S1 Kimia atau bidang terkait; (2) Berpengalaman sebagai laboran minimal 1 tahun; (3) Menguasai K3 Laboratorium dan prosedur keselamatan bahan kimia; (4) Mampu mengoperasikan peralatan laboratorium (spektrofotometer, GC-MS, AAS); (5) Teliti dan bertanggung jawab.",
          icon: "⚗️",
          date: "Dibuka: 5 November 2024",
          tags: ["Laboran", "Kimia", "Laboratorium"],
          linkUrl: "#",
          linkLabel: "Lamar Sekarang",
          badgeText: "Buka",
          badgeColor: "emerald",
          location: "Bogor, Jawa Barat",
          deadline: "5 Desember 2024",
          type: "Full-time",
        },
      ],
    },
    performance: {
      banner: [
        { type: "image", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400" },
        { type: "image", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400" },
      ],
      description:
        "Data Kinerja Perguruan Tinggi Universitas Nusa Bangsa disajikan secara transparan sebagai bentuk akuntabilitas publik dan komitmen terhadap peningkatan mutu berkelanjutan. Data ini mencakup capaian akademik, penelitian, pengabdian masyarakat, dan indikator kinerja utama sesuai standar PDDikti.",
      cards: [
        {
          id: makeId(),
          title: "Rasio Dosen : Mahasiswa",
          subtitle: "Tahun Akademik 2023/2024",
          description: "Rasio dosen terhadap mahasiswa UNB mencapai 1:22 untuk program S1 dan 1:8 untuk program Pascasarjana, memenuhi standar nasional yang ditetapkan BAN-PT.",
          detail: "Rincian rasio per fakultas: Pertanian & Agroteknologi 1:18, Ekonomi & Bisnis 1:25, Kehutanan & Lingkungan 1:15, MIPA 1:20, Pascasarjana 1:8. Total dosen tetap: 87 orang (66 bergelar doktor, 21 bergelar magister). Total mahasiswa aktif: 1.918 orang. Rasio ini terus membaik dari tahun ke tahun seiring peningkatan rekrutmen dosen.",
          icon: "👥",
          date: "Update: Oktober 2024",
          tags: ["SDM", "Dosen", "Mahasiswa"],
          badgeText: "Memenuhi Standar",
          badgeColor: "emerald",
        },
        {
          id: makeId(),
          title: "Akreditasi Program Studi",
          subtitle: "Status Akreditasi BAN-PT & LAM",
          description: "Seluruh program studi UNB telah terakreditasi oleh BAN-PT. 3 prodi meraih akreditasi Unggul, 6 prodi Baik Sekali, dan 4 prodi Baik.",
          detail: "Rincian akreditasi: Agroteknologi (Unggul), Agribisnis (Baik Sekali), Manajemen (Unggul), Akuntansi (Baik Sekali), Kehutanan (Baik Sekali), Biologi (Baik), Kimia (Baik), Data Sains (Baik - baru dibuka 2022), Magister Manajemen (Unggul), Magister Agribisnis (Baik Sekali), Magister Ekonomi Pembangunan (Baik). UNB menargetkan seluruh prodi terakreditasi Unggul pada 2026.",
          icon: "🏆",
          date: "Update: September 2024",
          tags: ["Akreditasi", "BAN-PT", "Mutu"],
          badgeText: "3 Prodi Unggul",
          badgeColor: "emerald",
        },
        {
          id: makeId(),
          title: "Capaian Penelitian Dosen",
          subtitle: "Tahun 2023 — Sumber: SINTA",
          description: "Dosen UNB menghasilkan 142 publikasi ilmiah pada tahun 2023, termasuk 38 artikel terindeks Scopus dan 12 paten yang telah terdaftar di DJKI.",
          detail: "Rincian publikasi 2023: Jurnal Scopus Q1: 8, Scopus Q2: 17, Scopus Q3/Q4: 13, Jurnal Nasional Terakreditasi Sinta 1-2: 47, Sinta 3-6: 57. Paten terdaftar: 8 paten sederhana, 4 paten biasa. Dana penelitian: Rp 2,8 miliar (eksternal: Rp 1,9 miliar, internal: Rp 900 juta). SINTA Score UNB: 2.847 (meningkat 18% dari 2022).",
          icon: "📊",
          date: "Update: Januari 2024",
          tags: ["Penelitian", "Publikasi", "SINTA"],
          downloadUrl: "#",
          downloadLabel: "Unduh Laporan",
          badgeText: "142 Publikasi",
          badgeColor: "blue",
        },
        {
          id: makeId(),
          title: "Tingkat Kelulusan Tepat Waktu",
          subtitle: "Tahun Akademik 2022/2023",
          description: "78% mahasiswa S1 UNB berhasil menyelesaikan studi tepat waktu (≤4 tahun), meningkat dari 71% pada tahun sebelumnya.",
          detail: "Data kelulusan per fakultas: Pertanian & Agroteknologi 81%, Ekonomi & Bisnis 76%, Kehutanan 73%, MIPA 79%, Pascasarjana S2 85% tepat waktu ≤2 tahun. Rata-rata IPK lulusan: 3,42. Faktor peningkatan: implementasi sistem bimbingan akademik intensif, klinik skripsi, dan program percepatan studi.",
          icon: "📈",
          date: "Update: Agustus 2024",
          tags: ["Kelulusan", "IPK", "Prestasi"],
          badgeText: "78% Tepat Waktu",
          badgeColor: "emerald",
        },
        {
          id: makeId(),
          title: "Penyerapan Lulusan di Dunia Kerja",
          subtitle: "Tracer Study 2023 — 6 Bulan Pasca Wisuda",
          description: "92,3% lulusan UNB tahun 2022 telah bekerja/berwirausaha dalam kurun waktu 6 bulan setelah wisuda, dengan rata-rata gaji pertama Rp 4,2 juta/bulan.",
          detail: "Distribusi kerja lulusan: bekerja di sektor swasta 58%, bekerja di instansi pemerintah 19%, wirausaha mandiri 15,3%, melanjutkan studi 8,7%. Bidang pekerjaan: pertanian/agribisnis 34%, keuangan/bisnis 26%, pemerintahan 19%, pendidikan 13%, lainnya 8%. Survei dilakukan terhadap 387 dari 419 lulusan (response rate 92,4%).",
          icon: "💼",
          date: "Update: November 2024",
          tags: ["Tracer Study", "Lulusan", "Karir"],
          downloadUrl: "#",
          downloadLabel: "Lihat Laporan",
          badgeText: "92.3% Terserap",
          badgeColor: "emerald",
        },
        {
          id: makeId(),
          title: "Kerjasama Institusional",
          subtitle: "MoU Aktif Tahun 2024",
          description: "UNB memiliki 47 MoU aktif dengan instansi pemerintah, BUMN, dan swasta untuk mendukung Tri Dharma Perguruan Tinggi.",
          detail: "Rincian kerjasama aktif: instansi pemerintah pusat 8, pemda provinsi/kabupaten/kota 12, BUMN 6, perusahaan swasta nasional 14, lembaga riset 4, perguruan tinggi luar negeri 3. Kerjasama mencakup: magang mahasiswa, penelitian bersama, pengabdian masyarakat, beasiswa, dan perekrutan lulusan. Nilai kontrak kerjasama: Rp 3,6 miliar/tahun.",
          icon: "🤝",
          date: "Update: Oktober 2024",
          tags: ["Kerjasama", "MoU", "Industri"],
          badgeText: "47 MoU Aktif",
          badgeColor: "blue",
        },
      ],
    },
    tracer: {
      banner: [
        { type: "image", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400" },
        { type: "image", url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1400" },
      ],
      description:
        "Program Alumni dan Tracer Study Universitas Nusa Bangsa bertujuan untuk mempererat hubungan antara almamater dengan para lulusan sekaligus mengumpulkan data strategis tentang perjalanan karier alumni. Informasi ini digunakan untuk meningkatkan relevansi kurikulum dan kualitas pendidikan UNB.",
      cards: [
        {
          id: makeId(),
          title: "Tracer Study Angkatan 2019 (Wisuda 2023)",
          subtitle: "Periode Survei: Agustus — Oktober 2024",
          description: "Hasil tracer study lulusan angkatan 2019 menunjukkan 91,8% telah bekerja atau berwirausaha. Kepuasan pengguna terhadap kompetensi lulusan UNB mencapai 87%.",
          detail: "Metodologi: survei online via Google Form dan wawancara langsung. Responden: 412 dari 447 lulusan (response rate 92,2%). Temuan utama: (1) Rata-rata masa tunggu kerja: 3,2 bulan; (2) Kesesuaian bidang kerja dengan prodi: 68%; (3) Rata-rata gaji pertama: Rp 4,1 juta/bulan; (4) Kepuasan alumni terhadap pengalaman kuliah: 84%; (5) Saran alumni: perkuat bahasa Inggris dan kemampuan digital.",
          icon: "📋",
          date: "Oktober 2024",
          tags: ["Tracer Study", "2019", "Karir"],
          downloadUrl: "#",
          downloadLabel: "Unduh Laporan",
          badgeText: "Selesai",
          badgeColor: "emerald",
        },
        {
          id: makeId(),
          title: "Database Alumni UNB",
          subtitle: "Platform: alumni.unb.ac.id",
          description: "Portal khusus alumni UNB untuk memperbarui data, berjejaring dengan sesama alumni, dan mendapatkan informasi karir serta kegiatan kampus terkini.",
          detail: "Fitur portal alumni: (1) Pembaruan biodata dan riwayat karir; (2) Forum diskusi dan networking alumni; (3) Job board khusus alumni; (4) Informasi program beasiswa pascasarjana; (5) Kalender reuni dan kegiatan alumni; (6) Akses e-library dan repositori kampus. Per Oktober 2024, sudah terdaftar 2.847 alumni dari total 4.210 lulusan (67,6% coverage).",
          icon: "🌐",
          date: "Update: Oktober 2024",
          tags: ["Database", "Portal Alumni", "Networking"],
          linkUrl: "#",
          linkLabel: "Kunjungi Portal",
          badgeText: "Aktif",
          badgeColor: "blue",
        },
        {
          id: makeId(),
          title: "Alumni Award UNB 2024",
          subtitle: "Penghargaan Alumni Berprestasi",
          description: "UNB menganugerahkan penghargaan kepada alumni yang telah memberikan kontribusi luar biasa di bidang profesi, wirausaha, dan pelayanan masyarakat.",
          detail: "Kategori penghargaan: (1) Alumni Berprestasi Bidang Karir — diberikan kepada alumni yang menduduki posisi manajerial/direksi dalam 10 tahun terakhir; (2) Alumni Wirausaha Terbaik — untuk alumni yang membangun usaha dengan minimal 10 karyawan; (3) Alumni Pengabdi Masyarakat — untuk kontribusi sosial nyata; (4) Alumni Muda Berprestasi (usia <30 tahun). Nominasi dibuka untuk umum hingga 30 November 2024.",
          icon: "🏆",
          date: "Desember 2024",
          tags: ["Award", "Prestasi", "Alumni"],
          linkUrl: "#",
          linkLabel: "Ajukan Nominasi",
          badgeText: "Buka Nominasi",
          badgeColor: "yellow",
        },
        {
          id: makeId(),
          title: "Program Mentorship Alumni",
          subtitle: "Alumni Membimbing Mahasiswa Aktif",
          description: "Program mentorship menghubungkan mahasiswa tingkat akhir UNB dengan alumni berpengalaman untuk bimbingan karir, persiapan kerja, dan pengembangan diri.",
          detail: "Program mentorship berjalan selama 4 bulan per periode. Setiap mahasiswa dibimbing oleh 1-2 alumni. Topik mentoring: penyusunan CV, persiapan wawancara kerja, pengembangan soft skill, eksplorasi karir, dan kewirausahaan. Periode berikutnya: Januari — April 2025. Pendaftaran dibuka untuk mahasiswa semester 7 ke atas dan alumni dengan pengalaman kerja minimal 3 tahun.",
          icon: "🤝",
          date: "Pendaftaran: November 2024",
          tags: ["Mentorship", "Karir", "Mahasiswa"],
          linkUrl: "#",
          linkLabel: "Daftar sebagai Mentor",
          badgeText: "Buka",
          badgeColor: "emerald",
        },
        {
          id: makeId(),
          title: "Reuni Akbar UNB 2024",
          subtitle: "25 Tahun Universitas Nusa Bangsa",
          description: "Peringatan 25 tahun UNB dirayakan dengan Reuni Akbar yang dihadiri lebih dari 1.500 alumni dari seluruh Indonesia dan mancanegara.",
          detail: "Reuni Akbar UNB 2024 diselenggarakan pada 15-16 November 2024 di Kampus UNB Bogor. Rangkaian acara: (1) Upacara akademik dan penganugerahan alumni award; (2) Panel diskusi 'Kontribusi Alumni UNB untuk Indonesia'; (3) Campus tour dan pameran prestasi; (4) Gala dinner dan hiburan alumni; (5) Pertandingan olahraga antar angkatan. Registrasi online tersedia di portal alumni.",
          icon: "🎉",
          date: "15-16 November 2024",
          tags: ["Reuni", "25 Tahun UNB", "Alumni"],
          linkUrl: "#",
          linkLabel: "Daftar Reuni",
          badgeText: "Segera",
          badgeColor: "yellow",
        },
        {
          id: makeId(),
          title: "Beasiswa S2 untuk Alumni UNB",
          subtitle: "Program Pascasarjana UNB",
          description: "UNB membuka program beasiswa khusus alumni untuk melanjutkan studi S2 di Program Pascasarjana UNB dengan potongan biaya hingga 50%.",
          detail: "Syarat pendaftaran beasiswa alumni S2: (1) Lulusan UNB dengan IPK minimal 3,25; (2) Mendaftar maksimal 3 tahun setelah wisuda; (3) Memiliki pengalaman kerja minimal 1 tahun; (4) Lulus tes masuk pascasarjana; (5) Rekomendasi dari dua dosen UNB. Program studi yang tersedia: Magister Manajemen, Magister Agribisnis, Magister Ekonomi Pembangunan. Pendaftaran setiap semester.",
          icon: "📚",
          date: "Pendaftaran: Desember 2024",
          tags: ["Beasiswa", "S2", "Pascasarjana"],
          linkUrl: "#",
          linkLabel: "Info Beasiswa",
          badgeText: "Tersedia",
          badgeColor: "purple",
        },
      ],
    },
    spmi: {
      banner: [
        { type: "image", url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1400" },
        { type: "image", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1400" },
      ],
      description:
        "Sistem Penjaminan Mutu Internal (SPMI) Universitas Nusa Bangsa merupakan kegiatan sistemik untuk meningkatkan mutu pendidikan tinggi secara berencana dan berkelanjutan melalui siklus PPEPP (Penetapan, Pelaksanaan, Evaluasi, Pengendalian, dan Peningkatan).",
      cards: [
        {
          id: makeId(),
          title: "Kebijakan Mutu UNB 2024—2028",
          subtitle: "Dokumen: SPMI-POL-001 | Rev. 3",
          description: "Kebijakan Mutu UNB menjadi landasan dalam penyelenggaraan pendidikan tinggi yang bermutu, relevan, dan berkelanjutan sesuai visi-misi universitas.",
          detail: "Kebijakan Mutu UNB mencakup: (1) Komitmen pimpinan terhadap mutu; (2) Ruang lingkup penerapan SPMI; (3) Strategi pencapaian standar mutu; (4) Mekanisme PPEPP; (5) Peran dan tanggung jawab unit kerja; (6) Pengelolaan dokumen SPMI. Kebijakan ini direvisi setiap 4 tahun atau sewaktu-waktu jika ada perubahan regulasi. Berlaku mulai 1 Januari 2024.",
          icon: "📋",
          date: "Berlaku: 1 Januari 2024",
          tags: ["Kebijakan", "SPMI", "Mutu"],
          downloadUrl: "#",
          downloadLabel: "Unduh Dokumen",
          badgeText: "Berlaku",
          badgeColor: "emerald",
        },
        {
          id: makeId(),
          title: "Standar Mutu Pendidikan",
          subtitle: "Dokumen: SPMI-STD-001 s.d. 024 | Rev. 2",
          description: "24 standar mutu pendidikan UNB yang melampaui Standar Nasional Pendidikan Tinggi (SN-Dikti) sesuai amanat Permenristekdikti No. 53 Tahun 2023.",
          detail: "24 standar mutu UNB meliputi: 8 standar dari SN-Dikti (Kompetensi Lulusan, Isi Pembelajaran, Proses Pembelajaran, Penilaian, Dosen, Sarpras, Pengelolaan, Pembiayaan) ditambah 16 standar tambahan yang ditetapkan UNB (Visi Misi, Tata Pamong, Mahasiswa, Penelitian, Pengabdian, Kerjasama, Sistem Informasi, Alumni, Keuangan, dll). Setiap standar dilengkapi dengan indikator kinerja dan target capaian.",
          icon: "📊",
          date: "Revisi: Maret 2024",
          tags: ["Standar", "SN-Dikti", "Pendidikan"],
          downloadUrl: "#",
          downloadLabel: "Unduh Standar",
          badgeText: "24 Standar",
          badgeColor: "blue",
        },
        {
          id: makeId(),
          title: "Manual Mutu SPMI",
          subtitle: "Dokumen: SPMI-MAN-001 | Rev. 2",
          description: "Manual mutu menjelaskan cara penyusunan, penetapan, pelaksanaan, evaluasi, pengendalian, dan peningkatan standar mutu di UNB.",
          detail: "Manual mutu terdiri dari 5 bagian sesuai siklus PPEPP: (1) Manual Penetapan Standar: prosedur penyusunan dan pengesahan standar baru; (2) Manual Pelaksanaan Standar: panduan implementasi standar oleh unit kerja; (3) Manual Evaluasi Standar: prosedur audit mutu internal dan eksternal; (4) Manual Pengendalian Standar: tindak lanjut hasil evaluasi; (5) Manual Peningkatan Standar: prosedur revisi dan peningkatan standar.",
          icon: "📖",
          date: "Revisi: April 2024",
          tags: ["Manual", "PPEPP", "Prosedur"],
          downloadUrl: "#",
          downloadLabel: "Unduh Manual",
          badgeText: "Rev. 2",
          badgeColor: "blue",
        },
        {
          id: makeId(),
          title: "Laporan Audit Mutu Internal (AMI) 2024",
          subtitle: "Semester Genap 2023/2024",
          description: "AMI semester Genap 2023/2024 telah dilaksanakan pada April—Mei 2024 terhadap 13 program studi dan 8 unit layanan. Temuan mayor: 3, temuan minor: 27, observasi: 41.",
          detail: "Ringkasan hasil AMI: (1) Program Studi: 8 prodi mendapat penilaian sangat baik, 3 prodi baik, 2 prodi cukup; (2) Unit Layanan: BAA, BAUK, Perpustakaan, IT, dan Kemahasiswaan mendapat penilaian baik-sangat baik; (3) Temuan mayor: ketidaksesuaian kurikulum dengan KKNI (2 prodi), keterlambatan input nilai SIMAK (1 prodi); (4) Tindak lanjut: sudah diselesaikan 28 dari 30 temuan (93,3%). Laporan lengkap tersedia untuk civitas akademika UNB.",
          icon: "🔍",
          date: "Mei 2024",
          tags: ["AMI", "Audit", "2024"],
          downloadUrl: "#",
          downloadLabel: "Unduh Laporan AMI",
          badgeText: "Selesai",
          badgeColor: "emerald",
        },
        {
          id: makeId(),
          title: "Borang Akreditasi Institusi (IAPT 3.0)",
          subtitle: "Persiapan Akreditasi BAN-PT 2025",
          description: "UNB sedang mempersiapkan borang akreditasi institusi menggunakan instrumen IAPT 3.0 dengan target meraih akreditasi Unggul pada 2025.",
          detail: "Persiapan akreditasi institusi meliputi: (1) Pembentukan tim task force akreditasi; (2) Pengumpulan data dan dokumen pendukung; (3) Penyusunan Laporan Kinerja Perguruan Tinggi (LKPT); (4) Penyusunan Laporan Evaluasi Diri (LED); (5) Simulasi visitasi dan uji petik dokumen; (6) Perbaikan dan kelengkapan data di PDDikti. Timeline: pengajuan borang Februari 2025, visitasi diperkirakan April 2025.",
          icon: "🎯",
          date: "Target: 2025",
          tags: ["Akreditasi", "IAPT 3.0", "BAN-PT"],
          badgeText: "Persiapan",
          badgeColor: "yellow",
        },
        {
          id: makeId(),
          title: "Rencana Strategis Mutu 2024—2028",
          subtitle: "Renstra LPM UNB",
          description: "Rencana Strategis LPM UNB 2024—2028 menetapkan target dan program kerja penjaminan mutu untuk mendukung visi UNB menjadi universitas unggul pada 2028.",
          detail: "Target strategis mutu 2028: (1) 100% program studi terakreditasi Unggul; (2) Akreditasi institusi Unggul; (3) Indeks Kepuasan Mahasiswa (IKM) minimal 4,0/5,0; (4) Tingkat kelulusan tepat waktu 85%; (5) Penyerapan lulusan dalam 6 bulan 95%; (6) SINTA Score institusi 5.000+. Program kerja: penguatan SDM penjaminan mutu, digitalisasi dokumen SPMI, pelatihan auditor mutu internal bersertifikat.",
          icon: "🗺️",
          date: "2024 — 2028",
          tags: ["Renstra", "Target", "Mutu 2028"],
          downloadUrl: "#",
          downloadLabel: "Unduh Renstra",
          badgeText: "2024–2028",
          badgeColor: "purple",
        },
      ],
    },
  },
};

const PAGE_CONFIG: Record<string, { label: string; icon: string; color: string; org: string }> = {
  sop: { label: "Prosedur Kerja (SOP)", icon: "📋", color: "from-blue-900/40", org: "LPM" },
  jobs: { label: "Lowongan Kerja", icon: "💼", color: "from-emerald-900/40", org: "LPM" },
  performance: { label: "Data Kinerja Perguruan Tinggi", icon: "📊", color: "from-yellow-900/40", org: "LPM" },
  tracer: { label: "Alumni & Tracer Study", icon: "🎓", color: "from-purple-900/40", org: "LPM" },
  spmi: { label: "Dokumen SPMI", icon: "✅", color: "from-red-900/40", org: "LPM" },
};

const BADGE_COLORS: Record<string, string> = {
  emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  red: "bg-red-500/20 text-red-400 border-red-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

interface LpmPageTabProps {
  pageId: "sop" | "jobs" | "performance" | "tracer" | "spmi";
}

export function LpmPageTab({ pageId }: LpmPageTabProps) {
  const { settings } = useSettings();
  const [selectedCard, setSelectedCard] = useState<LpmCard | null>(null);

  const config = PAGE_CONFIG[pageId];

  const content = useMemo<LpmPageContent>(() => {
    const saved = (settings as any).lpmContent?.pages?.[pageId];
    if (saved) return saved;
    return DEFAULT_LPM_CONTENT.pages[pageId];
  }, [settings, pageId]);

  const isJobsPage = pageId === "jobs";

  return (
    <div className="animate-fade-in bg-white dark:bg-[#151515] transition-colors duration-500">
      <section className="px-6 md:px-12 pt-10 pb-0">
        <MediaBanner items={content.banner.length > 0 ? content.banner : DEFAULT_LPM_CONTENT.pages[pageId].banner} />

        <div className="mt-10 text-center">
          <p className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em]">
            LPM — Universitas Nusa Bangsa
          </p>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500 mt-3">
            {config.label}
          </h2>
        </div>

        <div className="mt-10 max-w-3xl mx-auto">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-center font-medium">
            {content.description}
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.cards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className="bg-card border border-white/10 rounded-[30px] p-7 shadow-2xl cursor-pointer hover:border-emerald-500/40 hover:shadow-emerald-500/10 transition-all duration-300 group flex flex-col"
            >
              <div className="flex items-start gap-4 mb-4">
                {card.icon && (
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl shrink-0">
                    {card.icon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {card.badgeText && (
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${BADGE_COLORS[card.badgeColor ?? "emerald"]}`}>
                        {card.badgeText}
                      </span>
                    )}
                    {card.date && (
                      <span className="flex items-center gap-1 text-[9px] text-gray-400 font-bold">
                        <Calendar size={10} />
                        {card.date}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-black italic uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-300 leading-snug">
                    {card.title}
                  </h3>
                  {card.subtitle && (
                    <p className="text-[10px] text-gray-400 font-bold mt-1">{card.subtitle}</p>
                  )}
                </div>
              </div>

              {isJobsPage && (card.location || card.type || card.deadline) && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {card.location && (
                    <span className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                      <MapPin size={10} /> {card.location}
                    </span>
                  )}
                  {card.type && (
                    <span className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                      <Briefcase size={10} /> {card.type}
                    </span>
                  )}
                  {card.deadline && (
                    <span className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                      <Clock size={10} /> Deadline: {card.deadline}
                    </span>
                  )}
                </div>
              )}

              <p className="text-[11px] text-gray-300 font-medium leading-relaxed flex-1 mb-4">
                {card.description}
              </p>

              {card.tags && card.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {card.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-[9px] text-gray-400 font-bold bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                      <Tag size={8} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap mt-auto">
                {card.downloadUrl && (
                  <a
                    href={card.downloadUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download size={12} strokeWidth={3} />
                    {card.downloadLabel ?? "Unduh"}
                  </a>
                )}
                {card.linkUrl && (
                  <a
                    href={card.linkUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={12} strokeWidth={3} />
                    {card.linkLabel ?? "Lihat"}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detail Modal */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#111] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-lg font-black italic uppercase text-white leading-snug">
              {selectedCard?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4 mt-2">
              {selectedCard.subtitle && (
                <p className="text-xs text-emerald-400 font-bold">{selectedCard.subtitle}</p>
              )}
              {isJobsPage && (selectedCard.location || selectedCard.type || selectedCard.deadline) && (
                <div className="flex flex-wrap gap-4 py-2 border-y border-white/10">
                  {selectedCard.location && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-300 font-semibold">
                      <MapPin size={13} className="text-emerald-400" /> {selectedCard.location}
                    </span>
                  )}
                  {selectedCard.type && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-300 font-semibold">
                      <Briefcase size={13} className="text-emerald-400" /> {selectedCard.type}
                    </span>
                  )}
                  {selectedCard.deadline && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-300 font-semibold">
                      <Clock size={13} className="text-yellow-400" /> Deadline: {selectedCard.deadline}
                    </span>
                  )}
                </div>
              )}
              <p className="text-sm text-gray-300 leading-relaxed">
                {selectedCard.detail ?? selectedCard.description}
              </p>
              {selectedCard.tags && selectedCard.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedCard.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-[9px] text-gray-400 font-bold bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                      <Tag size={8} /> {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-4 flex-wrap pt-2">
                {selectedCard.downloadUrl && (
                  <a href={selectedCard.downloadUrl} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors" target="_blank" rel="noopener noreferrer">
                    <Download size={13} strokeWidth={3} /> {selectedCard.downloadLabel ?? "Unduh"}
                  </a>
                )}
                {selectedCard.linkUrl && (
                  <a href={selectedCard.linkUrl} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={13} strokeWidth={3} /> {selectedCard.linkLabel ?? "Lihat"}
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
