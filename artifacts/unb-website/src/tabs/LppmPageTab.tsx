import { useState, useMemo } from "react";
import { MediaBanner } from "../components/MediaBanner";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, ExternalLink, Tag, Calendar, ChevronRight } from "lucide-react";

export type LppmCard = {
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
};

export type LppmPageContent = {
  banner: { type: "image" | "video"; url: string }[];
  description: string;
  cards: LppmCard[];
};

export type LppmContent = {
  pages: {
    penelitian: LppmPageContent;
    pengabdian: LppmPageContent;
    inovasi: LppmPageContent;
    haki: LppmPageContent;
    seminar: LppmPageContent;
  };
  books: BookItem[];
};

export type BookItem = {
  id: string;
  title: string;
  author: string;
  year?: string;
  coverUrl?: string;
  description?: string;
  downloadUrl?: string;
  previewUrl?: string;
  isbn?: string;
  publisher?: string;
  tags?: string[];
};

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());

export const DEFAULT_LPPM_CONTENT: LppmContent = {
  pages: {
    penelitian: {
      banner: [
        { type: "image", url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1400" },
        { type: "image", url: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1400" },
      ],
      description:
        "Lembaga Penelitian dan Pengabdian kepada Masyarakat (LPPM) Universitas Nusa Bangsa mengelola dan mengkoordinasikan kegiatan penelitian sivitas akademika. Kami berkomitmen menghasilkan karya ilmiah berkualitas yang berdampak bagi pengembangan ilmu pengetahuan dan masyarakat.",
      cards: [
        {
          id: makeId(),
          title: "Hibah Penelitian Nasional 2024",
          subtitle: "Sumber Dana: DRPM Kemdikbudristek",
          description: "Program penelitian kompetitif nasional yang diikuti oleh 3 tim dosen UNB dengan topik ketahanan pangan, pengelolaan hutan, dan inovasi teknologi pertanian.",
          detail: "Penelitian ini melibatkan 3 tim peneliti dari tiga fakultas berbeda dengan total anggaran Rp 450 juta. Topik utama meliputi: (1) Strategi Peningkatan Produktivitas Padi Organik di Lahan Marginal; (2) Model Pengelolaan Hutan Berbasis Masyarakat; dan (3) Sistem Deteksi Hama Tanaman Menggunakan Computer Vision. Seluruh penelitian diharapkan selesai pada Desember 2024 dengan luaran publikasi di jurnal terindeks Scopus.",
          icon: "🔬",
          date: "2024",
          tags: ["Kompetitif Nasional", "Ketahanan Pangan", "Teknologi"],
          downloadUrl: "#",
          downloadLabel: "Unduh Proposal",
          badgeText: "Aktif",
          badgeColor: "emerald",
        },
        {
          id: makeId(),
          title: "Studi Manajemen Rantai Pasok Kopi Bogor",
          subtitle: "Kolaborasi: Pemkab Bogor & Petani Lokal",
          description: "Penelitian mendalam tentang rantai nilai komoditas kopi di wilayah Bogor Barat yang melibatkan 150 petani kopi dan 12 koperasi agribisnis.",
          detail: "Penelitian ini bertujuan memetakan rantai pasok kopi dari kebun ke konsumen di wilayah Bogor Barat. Metode campuran (mixed-method) digunakan: survei kuantitatif pada 150 petani dan wawancara mendalam dengan pelaku usaha. Temuan menunjukkan adanya inefisiensi pada tahap pengolahan pasca panen yang menyebabkan kehilangan nilai tambah hingga 35%. Rekomendasi kebijakan telah diserahkan kepada Dinas Pertanian Kabupaten Bogor.",
          icon: "☕",
          date: "2023",
          tags: ["Agribisnis", "Rantai Nilai", "Kopi"],
          downloadUrl: "#",
          downloadLabel: "Unduh Laporan",
          linkUrl: "#",
          linkLabel: "Lihat Jurnal",
          badgeText: "Selesai",
          badgeColor: "blue",
        },
        {
          id: makeId(),
          title: "Teknologi Budidaya Padi Organik Lahan Kering",
          subtitle: "Tim: Dr. Andi Masnang, Ir., MS (Ketua)",
          description: "Penelitian inovatif pengembangan teknik budidaya padi organik pada lahan kering menggunakan kombinasi pupuk hayati dan mulsa organik.",
          detail: "Penelitian dilaksanakan di lahan percobaan Kampus UNB seluas 2 hektare selama dua musim tanam (2022-2023). Hasil uji coba menunjukkan produktivitas padi mencapai 6,2 ton/ha dengan penggunaan air berkurang 40% dibanding metode konvensional. Inovasi ini berpotensi diterapkan di 12.000 ha lahan kering di Kabupaten Bogor. Sudah dipresentasikan di 2 seminar internasional.",
          icon: "🌾",
          date: "2022-2023",
          tags: ["Padi Organik", "Lahan Kering", "Inovasi"],
          downloadUrl: "#",
          downloadLabel: "Unduh Laporan Akhir",
          badgeText: "Selesai",
          badgeColor: "blue",
        },
        {
          id: makeId(),
          title: "Analisis Stok Karbon Kawasan Hutan Konservasi",
          subtitle: "Kolaborasi: KLHK & UNB",
          description: "Studi pengukuran cadangan karbon tersimpan pada kawasan hutan konservasi di Bogor menggunakan metode IPCC Tier 2 yang diakui secara internasional.",
          detail: "Penelitian dilaksanakan di kawasan Hutan Lindung Bogor seluas 3.200 ha menggunakan metode plot sampling dengan 120 titik pengukuran. Stok karbon total terhitung 285.000 ton CO2e. Data ini akan menjadi baseline untuk program REDD+ (Reducing Emissions from Deforestation and Forest Degradation) di tingkat nasional. Kerjasama dengan KLHK dan Pemerintah Jepang melalui skema GCF.",
          icon: "🌳",
          date: "2024",
          tags: ["Karbon", "Hutan Konservasi", "Iklim"],
          downloadUrl: "#",
          downloadLabel: "Unduh Laporan Teknis",
          badgeText: "Berlangsung",
          badgeColor: "yellow",
        },
      ],
    },
    pengabdian: {
      banner: [
        { type: "image", url: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1400" },
        { type: "image", url: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=1400" },
      ],
      description:
        "Program Pengabdian kepada Masyarakat UNB menerjemahkan hasil riset dan keahlian akademisi menjadi solusi nyata bagi komunitas. Kami aktif bermitra dengan pemerintah daerah, desa, sekolah, dan komunitas untuk memberikan dampak positif yang berkelanjutan.",
      cards: [
        {
          id: makeId(),
          title: "Pemberdayaan Petani Milenial Desa Ciampea",
          subtitle: "Mitra: Desa Ciampea, Kab. Bogor · 2024",
          description: "Program pelatihan dan pendampingan intensif bagi 80 pemuda tani usia 18-35 tahun dalam penerapan teknologi pertanian modern berbasis digital.",
          detail: "Program berlangsung 6 bulan (Januari-Juni 2024) dengan 3 modul: (1) Dasar-dasar Smart Farming menggunakan sensor IoT; (2) Manajemen Usaha Tani Digital menggunakan aplikasi SiPetani; dan (3) Pemasaran Produk Pertanian via E-Commerce. Sebanyak 80 peserta berhasil mendirikan 12 kelompok tani digital. Omzet rata-rata meningkat 45% pasca program. Program ini didanai DRPM Kemdikbudristek.",
          icon: "👨‍🌾",
          date: "Januari–Juni 2024",
          tags: ["Smart Farming", "Milenial", "Pemberdayaan"],
          downloadUrl: "#",
          downloadLabel: "Unduh Laporan",
          badgeText: "Selesai",
          badgeColor: "blue",
        },
        {
          id: makeId(),
          title: "Pelatihan Kewirausahaan Digital untuk SMK",
          subtitle: "Mitra: 5 SMK di Bogor · 2023",
          description: "Pelatihan kewirausahaan digital bagi 200 siswa SMK kejuruan pertanian dan bisnis di Kabupaten Bogor untuk menghadapi era industri 4.0.",
          detail: "Pelaksanaan pelatihan dilakukan dalam format bootcamp 3 hari di masing-masing sekolah mitra. Materi meliputi: business model canvas, digital marketing, pembuatan toko online, dan manajemen keuangan dasar. Sebanyak 45 kelompok usaha siswa berhasil dibentuk, 12 di antaranya aktif berjualan online. Program mendapat penghargaan dari Dinas Pendidikan Provinsi Jawa Barat sebagai Program Pengabdian Terbaik 2023.",
          icon: "💻",
          date: "2023",
          tags: ["Kewirausahaan", "Digital", "SMK"],
          downloadUrl: "#",
          downloadLabel: "Unduh Laporan",
          badgeText: "Selesai",
          badgeColor: "blue",
        },
        {
          id: makeId(),
          title: "Klinik Kesehatan Gratis Masyarakat Sekitar Kampus",
          subtitle: "Mitra: Puskesmas Tanah Sareal · Rutin Tahunan",
          description: "Program kesehatan gratis berupa pemeriksaan umum, konseling gizi, dan penyuluhan kesehatan lingkungan bagi masyarakat sekitar kampus UNB.",
          detail: "Klinik kesehatan diselenggarakan setiap 3 bulan sekali bekerjasama dengan Puskesmas Tanah Sareal. Setiap penyelenggaraan melayani rata-rata 250 pasien. Layanan meliputi: pemeriksaan tekanan darah, gula darah, kolesterol, konseling gizi, dan distribusi obat gratis. Sejak 2021, total lebih dari 3.000 warga telah mendapatkan layanan kesehatan gratis dari program ini.",
          icon: "🏥",
          date: "Rutin 4x/tahun",
          tags: ["Kesehatan", "Komunitas", "Gratis"],
          downloadUrl: "#",
          downloadLabel: "Unduh Laporan Tahunan",
          badgeText: "Berkelanjutan",
          badgeColor: "emerald",
        },
        {
          id: makeId(),
          title: "Rehabilitasi Mangrove Pesisir Teluk Banten",
          subtitle: "Mitra: Dinas Kelautan & KKP · 2023-2024",
          description: "Program penanaman dan pemulihan ekosistem mangrove di pesisir Teluk Banten seluas 15 hektar yang melibatkan komunitas nelayan setempat.",
          detail: "Program ini merupakan respons atas degradasi ekosistem mangrove akibat alih fungsi lahan dan abrasi. Melibatkan 120 nelayan lokal sebagai tenaga kerja dan penjaga kawasan. Total 45.000 bibit mangrove jenis Rhizophora mucronata dan Avicennia marina ditanam. Ekosistem yang pulih diharapkan meningkatkan hasil tangkapan nelayan dan menjadi zona penyangga gelombang. Monitoring berkala dilakukan setiap 6 bulan.",
          icon: "🌊",
          date: "2023-2024",
          tags: ["Mangrove", "Konservasi", "Pesisir"],
          downloadUrl: "#",
          downloadLabel: "Unduh Laporan Kegiatan",
          badgeText: "Berlangsung",
          badgeColor: "yellow",
        },
      ],
    },
    inovasi: {
      banner: [
        { type: "image", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400" },
        { type: "image", url: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=1400" },
      ],
      description:
        "UNB mendorong ekosistem inovasi yang menghubungkan penelitian akademik dengan solusi teknologi nyata. Pusat Inovasi LPPM UNB memfasilitasi pengembangan prototipe, uji coba, dan hilirisasi teknologi hasil riset sivitas akademika menuju produk yang siap guna.",
      cards: [
        {
          id: makeId(),
          title: "Sistem Irigasi Cerdas Berbasis IoT",
          subtitle: "Status: Prototipe Tahap 2 — Uji Lapang",
          description: "Sistem irigasi otomatis berbasis sensor kelembaban tanah dan cuaca yang terhubung ke platform cloud untuk pengelolaan air pertanian yang efisien.",
          detail: "Inovasi ini dikembangkan oleh tim Prodi Agroteknologi dan Data Sains selama 18 bulan. Sistem terdiri dari: sensor kelembaban tanah (custom hardware), unit kontrol pompa berbasis ESP32, platform monitoring berbasis web, dan aplikasi mobile. Uji lapang di 3 lokasi (Ciampea, Leuwiliang, Dramaga) menunjukkan penghematan air 42% dan peningkatan produktivitas tanaman 28%. Sedang dalam proses penjajakan lisensi dengan PT Petrokimia Gresik.",
          icon: "💧",
          date: "2023-2024",
          tags: ["IoT", "Pertanian Cerdas", "Efisiensi Air"],
          downloadUrl: "#",
          downloadLabel: "Unduh Whitepaper",
          badgeText: "Uji Lapang",
          badgeColor: "yellow",
        },
        {
          id: makeId(),
          title: "Aplikasi SiPetani – Manajemen Usaha Tani Digital",
          subtitle: "Platform: Android & iOS · 2024",
          description: "Aplikasi manajemen usaha tani terintegrasi yang membantu petani mencatat aktivitas, memantau keuangan, dan mengakses informasi pasar komoditas secara real-time.",
          detail: "SiPetani dikembangkan sebagai solusi digitalisasi pertanian yang terjangkau. Fitur utama: pencatatan aktivitas budidaya, kalkulasi HPP dan keuntungan, rekomendasi harga pasar komoditas (terintegrasi data Kementan), forum tani, dan modul edukasi pertanian. Saat ini memiliki 1.200 pengguna aktif di Bogor, Sukabumi, dan Cianjur. Tersedia gratis di Play Store. Menang juara 1 Kompetisi Startup Agri-tech Jawa Barat 2024.",
          icon: "📱",
          date: "2024",
          tags: ["Aplikasi Mobile", "Digital Farming", "Startup"],
          downloadUrl: "#",
          downloadLabel: "Unduh APK",
          linkUrl: "#",
          linkLabel: "Lihat di Play Store",
          badgeText: "Diluncurkan",
          badgeColor: "emerald",
        },
        {
          id: makeId(),
          title: "Bioreaktor Fermentasi Skala Laboratorium",
          subtitle: "Tim: Dr. Lany Nurhayati (Biologi) & Nina Ariesta (Kimia)",
          description: "Desain bioreaktor fermentasi skala 50 liter untuk produksi pupuk hayati dan biopestisida menggunakan bahan baku limbah pertanian lokal.",
          detail: "Bioreaktor ini dirancang untuk memudahkan produksi agen hayati (Trichoderma, Bacillus subtilis, Pseudomonas fluorescens) dalam skala kelompok tani. Biaya produksi ditekan hingga 60% dibanding produk komersial. Desain modular memungkinkan petani merakit sendiri menggunakan komponen yang tersedia di toko pertanian. Teknologi ini sudah diuji coba di 5 kelompok tani dan sedang dalam proses pengajuan paten sederhana.",
          icon: "⚗️",
          date: "2023",
          tags: ["Bioteknologi", "Pupuk Hayati", "Lingkungan"],
          downloadUrl: "#",
          downloadLabel: "Unduh Spesifikasi Teknis",
          badgeText: "Prototipe",
          badgeColor: "purple",
        },
        {
          id: makeId(),
          title: "Model Prediksi Hasil Panen dengan Machine Learning",
          subtitle: "Tim: Koordinator Program Data Sains",
          description: "Model prediktif menggunakan algoritma Random Forest dan LSTM untuk memprediksi hasil panen berdasarkan data cuaca, tanah, dan riwayat budidaya.",
          detail: "Model ini dilatih menggunakan dataset 5 tahun dari 120 petak sawah di Bogor dan sekitarnya. Akurasi prediksi mencapai 87% (RMSE 0.42 ton/ha) untuk komoditas padi dan jagung. Model telah diintegrasikan ke dalam aplikasi SiPetani sebagai fitur 'Prediksi Panen'. Paper ilmiah tentang model ini sedang dalam proses review di Journal of Agricultural Informatics (terindeks Scopus Q2).",
          icon: "🤖",
          date: "2024",
          tags: ["Machine Learning", "Prediksi Panen", "Data Science"],
          downloadUrl: "#",
          downloadLabel: "Unduh Paper Draft",
          badgeText: "Publikasi",
          badgeColor: "blue",
        },
      ],
    },
    haki: {
      banner: [
        { type: "image", url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1400" },
        { type: "image", url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1400" },
      ],
      description:
        "LPPM UNB aktif mendukung sivitas akademika dalam perlindungan kekayaan intelektual hasil riset dan inovasi. Kami memfasilitasi proses pengajuan paten, hak cipta, merek, dan desain industri kepada Direktorat Jenderal Kekayaan Intelektual (DJKI) Kementerian Hukum dan HAM.",
      cards: [
        {
          id: makeId(),
          title: "Paten: Metode Fermentasi Bakteri Pelarut Fosfat",
          subtitle: "No. Paten: P00202400145 · Terdaftar 2024",
          description: "Paten atas metode fermentasi inovatif untuk memproduksi bakteri pelarut fosfat (BPF) sebagai komponen pupuk hayati ramah lingkungan.",
          detail: "Invensi ini merupakan metode fermentasi dua tahap menggunakan medium berbasis limbah industri tapioka yang difermentasi oleh konsorsium bakteri BPF (Bacillus megaterium, Pseudomonas putida). Metode ini menghasilkan konsentrasi BPF 10x lebih tinggi dibanding metode konvensional dengan biaya bahan baku 65% lebih murah. Penemu: Dr. Lany Nurhayati, S.Si., M.Si dan tim. Masa perlindungan 20 tahun sejak tanggal pendaftaran.",
          icon: "📜",
          date: "2024",
          tags: ["Paten", "Pupuk Hayati", "Bioteknologi"],
          downloadUrl: "#",
          downloadLabel: "Unduh Sertifikat",
          badgeText: "Paten Terdaftar",
          badgeColor: "emerald",
        },
        {
          id: makeId(),
          title: "Hak Cipta: Modul Ajar Kewirausahaan Berbasis Teknologi",
          subtitle: "No. EC00202400234 · Terdaftar 2024",
          description: "Hak cipta atas modul ajar kewirausahaan digital 12 sesi yang menggabungkan studi kasus lokal, simulasi bisnis, dan platform e-learning.",
          detail: "Modul ini dikembangkan oleh tim dosen Prodi Manajemen dan Agribisnis selama 1 tahun. Terdiri dari 12 unit pembelajaran dengan total 180 halaman, dilengkapi video tutorial, kuis interaktif, dan proyek bisnis nyata. Modul sudah digunakan di 3 perguruan tinggi mitra dan 5 SMK di Bogor. Tersedia dalam format cetak dan digital. Diciptakan oleh: Iis Anisa Yulia, SE., MM dan tim dosen kewirausahaan UNB.",
          icon: "©️",
          date: "2024",
          tags: ["Hak Cipta", "Modul Ajar", "Kewirausahaan"],
          downloadUrl: "#",
          downloadLabel: "Unduh Sertifikat",
          badgeText: "Hak Cipta",
          badgeColor: "blue",
        },
        {
          id: makeId(),
          title: "Paten Sederhana: Alat Ukur Kadar Air Tanah Portabel",
          subtitle: "No. S00202400089 · Terdaftar 2024",
          description: "Paten sederhana atas alat ukur kadar air tanah portabel berbiaya rendah untuk digunakan petani kecil tanpa keahlian teknis khusus.",
          detail: "Alat ini menggunakan prinsip konduktivitas listrik tanah dengan elektroda stainless steel yang dimasukkan ke tanah. Pembacaan digital ditampilkan pada layar LCD. Komponen utama: sensor resistansi tanah, Arduino Nano, baterai AA (2 buah), casing ABS. Total biaya produksi Rp 85.000/unit, jauh lebih murah dari alat serupa di pasaran (Rp 500.000-2.000.000). Penemu: Tim Agroteknologi UNB. Sedang dalam tahap komersialisasi.",
          icon: "🔧",
          date: "2024",
          tags: ["Paten Sederhana", "Alat Ukur", "IoT Terjangkau"],
          downloadUrl: "#",
          downloadLabel: "Unduh Sertifikat",
          badgeText: "Paten Sederhana",
          badgeColor: "purple",
        },
        {
          id: makeId(),
          title: "Merek: UNB Organik",
          subtitle: "No. IDM001234567 · Terdaftar 2023",
          description: "Merek dagang 'UNB Organik' untuk produk-produk pertanian organik yang dikembangkan dan disertifikasi oleh Universitas Nusa Bangsa.",
          detail: "Merek 'UNB Organik' mencakup lini produk pertanian organik yang dihasilkan dari lahan percobaan dan binaan UNB. Produk yang menggunakan merek ini harus memenuhi standar organik internal UNB dan SNI 6729:2016. Saat ini sudah ada 4 produk yang menggunakan merek UNB Organik: beras organik, pupuk hayati, pestisida nabati, dan sayuran segar. Merek ini juga digunakan untuk program sertifikasi petani organik binaan UNB.",
          icon: "™️",
          date: "2023",
          tags: ["Merek Dagang", "Organik", "Pertanian"],
          downloadUrl: "#",
          downloadLabel: "Unduh Sertifikat Merek",
          badgeText: "Merek Terdaftar",
          badgeColor: "yellow",
        },
      ],
    },
    seminar: {
      banner: [
        { type: "image", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1400" },
        { type: "image", url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1400" },
      ],
      description:
        "LPPM UNB secara aktif menyelenggarakan dan berpartisipasi dalam forum ilmiah nasional dan internasional. Kegiatan seminar, konferensi, dan workshop menjadi ajang diseminasi hasil penelitian, pertukaran gagasan, dan penguatan jaringan kolaborasi akademik.",
      cards: [
        {
          id: makeId(),
          title: "Seminar Internasional: Sustainable Agriculture 2024",
          subtitle: "Bogor, 15-16 Oktober 2024 · 200+ Peserta",
          description: "Seminar internasional dua hari yang mempertemukan peneliti dari 8 negara untuk membahas inovasi dan kebijakan pertanian berkelanjutan di kawasan Asia Tenggara.",
          detail: "Seminar dihadiri 235 peserta dari 8 negara (Indonesia, Malaysia, Thailand, Vietnam, Filipina, Jepang, Korea Selatan, dan Australia). Menampilkan 3 keynote speaker internasional dan 45 presenter oral dari berbagai perguruan tinggi dan lembaga penelitian. Topik utama: precision agriculture, agroforestry, food security policy, dan climate-smart farming. Prosiding terindeks Google Scholar. Dua paper terbaik direkomendasikan untuk publikasi di International Journal of Agricultural Sustainability.",
          icon: "🌏",
          date: "15-16 Oktober 2024",
          tags: ["Internasional", "Pertanian Berkelanjutan", "Seminar"],
          downloadUrl: "#",
          downloadLabel: "Unduh Prosiding",
          badgeText: "Selesai",
          badgeColor: "blue",
        },
        {
          id: makeId(),
          title: "Workshop Penulisan Artikel Ilmiah Terindeks Scopus",
          subtitle: "Kampus UNB, 22-23 Agustus 2024 · 80 Peserta",
          description: "Workshop intensif 2 hari bagi dosen dan mahasiswa pascasarjana UNB untuk meningkatkan kemampuan penulisan dan publikasi artikel ilmiah di jurnal internasional.",
          detail: "Workshop dibimbing oleh 2 narasumber berpengalaman: Prof. Dr. Ahmad Fauzi (reviewer Scopus Q1, IPB) dan Dr. Sarah Johnson (managing editor, Springer Nature). Materi meliputi: struktur artikel ilmiah, strategi pemilihan jurnal, penggunaan Mendeley, tips menghadapi reviewer, dan etika publikasi. Sebanyak 80 peserta (60 dosen, 20 mahasiswa S2/S3) berhasil menyelesaikan draft artikel. 15 artikel sudah submit ke jurnal internasional pasca workshop.",
          icon: "✍️",
          date: "22-23 Agustus 2024",
          tags: ["Workshop", "Publikasi Ilmiah", "Scopus"],
          downloadUrl: "#",
          downloadLabel: "Unduh Materi Workshop",
          badgeText: "Selesai",
          badgeColor: "blue",
        },
        {
          id: makeId(),
          title: "Konferensi Nasional LPPM: Inovasi untuk Indonesia",
          subtitle: "Jakarta, 5 November 2024 · 300+ Peserta",
          description: "Konferensi nasional LPPM se-Indonesia yang membahas peran perguruan tinggi dalam akselerasi inovasi untuk pembangunan berkelanjutan.",
          detail: "UNB menjadi co-host konferensi nasional LPPM yang diikuti 42 perguruan tinggi dari seluruh Indonesia. Tema: 'Inovasi Perguruan Tinggi untuk Kemandirian Bangsa'. UNB mengirimkan 8 paper dan 1 poster, dengan 3 paper masuk 10 besar terbaik. Tim UNB menerima penghargaan 'LPPM Berprestasi 2024' kategori perguruan tinggi swasta. Prosiding diterbitkan oleh Kemendikbudristek.",
          icon: "🏛️",
          date: "5 November 2024",
          tags: ["Konferensi Nasional", "LPPM", "Inovasi"],
          downloadUrl: "#",
          downloadLabel: "Unduh Prosiding",
          badgeText: "Selesai",
          badgeColor: "blue",
        },
        {
          id: makeId(),
          title: "Webinar: Hilirisasi Riset ke Industri",
          subtitle: "Online, 20 September 2024 · 450 Peserta",
          description: "Webinar nasional yang membahas strategi dan tantangan transfer teknologi hasil riset perguruan tinggi ke dunia industri dan UMKM.",
          detail: "Webinar diselenggarakan secara hybrid (20 peserta onsite, 430 online) via Zoom dan disiarkan langsung di YouTube. Narasumber: Dirut PT Pupuk Indonesia, VP R&D Unilever Indonesia, dan Kepala BRIN. Topik: model TTO (Technology Transfer Office), intellectual property management, dan success story hilirisasi riset. Rekaman sudah ditonton lebih dari 2.800 kali di YouTube. Materi presentasi tersedia untuk diunduh.",
          icon: "💡",
          date: "20 September 2024",
          tags: ["Webinar", "Hilirisasi", "Industri"],
          downloadUrl: "#",
          downloadLabel: "Unduh Materi",
          linkUrl: "#",
          linkLabel: "Tonton Rekaman",
          badgeText: "Selesai",
          badgeColor: "blue",
        },
      ],
    },
  },
  books: [
    {
      id: makeId(),
      title: "Manajemen Agribisnis Modern",
      author: "Dr. Andi Masnang, Ir., MS",
      year: "2023",
      coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400",
      description: "Buku teks komprehensif yang membahas manajemen usaha agribisnis dari hulu ke hilir, mencakup analisis pasar, manajemen rantai pasok, dan strategi pengembangan bisnis pertanian.",
      isbn: "978-623-97850-1-2",
      publisher: "UNB Press",
      tags: ["Agribisnis", "Manajemen", "Teks Kuliah"],
      downloadUrl: "#",
      previewUrl: "#",
    },
    {
      id: makeId(),
      title: "Ekologi Hutan Tropis Indonesia",
      author: "Dr. Ratna Sari Hasibuan, S.Hut., M.Si",
      year: "2022",
      coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
      description: "Panduan ilmiah tentang ekologi hutan hujan tropis Indonesia, termasuk keanekaragaman hayati, fungsi ekosistem, ancaman, dan strategi konservasi.",
      isbn: "978-623-97850-2-9",
      publisher: "UNB Press",
      tags: ["Kehutanan", "Ekologi", "Konservasi"],
      downloadUrl: "#",
      previewUrl: "#",
    },
    {
      id: makeId(),
      title: "Pengantar Data Sains untuk Pertanian",
      author: "Nina Ariesta, S.Pd., M.Si",
      year: "2024",
      coverUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400",
      description: "Buku pertama di Indonesia yang mengintegrasikan dasar-dasar data science (Python, statistik, machine learning) dengan aplikasi nyata di bidang pertanian dan agribisnis.",
      isbn: "978-623-97850-3-6",
      publisher: "UNB Press",
      tags: ["Data Science", "Python", "Pertanian Digital"],
      downloadUrl: "#",
      previewUrl: "#",
    },
    {
      id: makeId(),
      title: "Kimia Lingkungan Terapan",
      author: "Dr. Lany Nurhayati, S.Si., M.Si",
      year: "2023",
      coverUrl: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=400",
      description: "Membahas kimia polutan lingkungan, mekanisme pencemaran air dan tanah, serta teknologi remediasi berbasis prinsip kimia hijau yang ramah lingkungan.",
      isbn: "978-623-97850-4-3",
      publisher: "UNB Press",
      tags: ["Kimia", "Lingkungan", "Remediasi"],
      downloadUrl: "#",
      previewUrl: "#",
    },
    {
      id: makeId(),
      title: "Kewirausahaan Agraris",
      author: "Linar Humaira, Ir., MS",
      year: "2022",
      coverUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=400",
      description: "Panduan praktis kewirausahaan di sektor pertanian dan agribisnis, dilengkapi studi kasus sukses dari pelaku usaha pertanian Indonesia.",
      isbn: "978-623-97850-5-0",
      publisher: "UNB Press",
      tags: ["Kewirausahaan", "Pertanian", "Bisnis"],
      downloadUrl: "#",
      previewUrl: "#",
    },
    {
      id: makeId(),
      title: "Ekonomi Pertanian dan Pembangunan",
      author: "Feni Marnilin, SE., M.Akt",
      year: "2023",
      coverUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400",
      description: "Analisis mendalam tentang ekonomi sektor pertanian Indonesia dalam konteks pembangunan nasional, kebijakan harga, subsidi, dan pasar komoditas global.",
      isbn: "978-623-97850-6-7",
      publisher: "UNB Press",
      tags: ["Ekonomi Pertanian", "Pembangunan", "Kebijakan"],
      downloadUrl: "#",
      previewUrl: "#",
    },
  ],
};

const PAGE_CONFIG: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  penelitian: { label: "Penelitian", icon: "🔬", color: "from-blue-900/40" },
  pengabdian: { label: "Pengabdian kepada Masyarakat", icon: "🤝", color: "from-emerald-900/40" },
  inovasi: { label: "Inovasi", icon: "💡", color: "from-yellow-900/40" },
  haki: { label: "Kekayaan Intelektual (HAKI)", icon: "📜", color: "from-purple-900/40" },
  seminar: { label: "Seminar Nasional", icon: "🏛️", color: "from-red-900/40" },
};

const BADGE_COLORS: Record<string, string> = {
  emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  red: "bg-red-500/20 text-red-400 border-red-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

interface LppmPageTabProps {
  pageId: "penelitian" | "pengabdian" | "inovasi" | "haki" | "seminar";
}

export function LppmPageTab({ pageId }: LppmPageTabProps) {
  const { settings } = useSettings();
  const [selectedCard, setSelectedCard] = useState<LppmCard | null>(null);

  const config = PAGE_CONFIG[pageId];

  const content = useMemo<LppmPageContent>(() => {
    const saved = (settings as any).lppmContent?.pages?.[pageId];
    if (saved) return saved;
    return DEFAULT_LPPM_CONTENT.pages[pageId];
  }, [settings, pageId]);

  return (
    <div className="animate-fade-in bg-white dark:bg-[#151515] transition-colors duration-500">
      <section className="px-6 md:px-12 pt-10 pb-0">
        <MediaBanner items={content.banner.length > 0 ? content.banner : DEFAULT_LPPM_CONTENT.pages[pageId].banner} />

        <div className="mt-10 text-center">
          <p className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em]">
            LPPM — Universitas Nusa Bangsa
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
                <button
                  type="button"
                  className="ml-auto flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                >
                  Detail
                  <ChevronRight size={12} strokeWidth={3} />
                </button>
              </div>
            </div>
          ))}

          {content.cards.length === 0 && (
            <div className="md:col-span-2 rounded-[30px] border border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center py-20 px-8 text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">Belum ada data</p>
              <p className="text-[10px] text-gray-500 font-bold mt-2">Tambahkan konten melalui halaman admin.</p>
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selectedCard} onOpenChange={(o) => !o && setSelectedCard(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#1a1a1a] border border-white/10 text-white">
          {selectedCard && (
            <>
              <DialogHeader className="mb-2">
                <div className="flex items-center gap-3 mb-3">
                  {selectedCard.icon && (
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl shrink-0">
                      {selectedCard.icon}
                    </div>
                  )}
                  <div>
                    {selectedCard.badgeText && (
                      <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border mb-2 ${BADGE_COLORS[selectedCard.badgeColor ?? "emerald"]}`}>
                        {selectedCard.badgeText}
                      </span>
                    )}
                    <DialogTitle className="text-lg font-black italic uppercase leading-snug text-white">
                      {selectedCard.title}
                    </DialogTitle>
                  </div>
                </div>
              </DialogHeader>

              {selectedCard.subtitle && (
                <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-widest mb-3">{selectedCard.subtitle}</p>
              )}

              {selectedCard.date && (
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mb-4">
                  <Calendar size={12} />
                  {selectedCard.date}
                </div>
              )}

              <p className="text-sm text-gray-200 leading-relaxed font-medium mb-4">
                {selectedCard.detail ?? selectedCard.description}
              </p>

              {selectedCard.tags && selectedCard.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCard.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-[9px] text-gray-400 font-bold bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                      <Tag size={8} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                {selectedCard.downloadUrl && (
                  <a
                    href={selectedCard.downloadUrl}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download size={14} strokeWidth={3} />
                    {selectedCard.downloadLabel ?? "Unduh"}
                  </a>
                )}
                {selectedCard.linkUrl && (
                  <a
                    href={selectedCard.linkUrl}
                    className="flex items-center gap-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 text-blue-300 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={14} strokeWidth={3} />
                    {selectedCard.linkLabel ?? "Lihat"}
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
