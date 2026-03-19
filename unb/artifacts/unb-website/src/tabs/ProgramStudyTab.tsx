import { useMemo, useState } from "react";
import { MediaBanner } from "../components/MediaBanner";
import { useSettings } from "@/contexts/SettingsContext";
import type { TabType } from "../types";
import { PIMPINAN_DOSEN } from "./AboutTab";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type MediaItem = { type: "image" | "video"; url: string };

type ProgramId =
  | "agroteknologi-s1"
  | "agribisnis-s1"
  | "manajemen-s1"
  | "akuntansi-s1"
  | "kehutanan-s1"
  | "biologi-s1"
  | "kimia-s1"
  | "data-sains-s1"
  | "magister-manajemen-s2"
  | "magister-agribisnis-s2"
  | "magister-ekonomi-pembangunan-s2";

type ProgramPage = {
  id: ProgramId;
  name: string;
  level: "S-1" | "S-2";
  facultyName: string;
  bannerItems: MediaItem[];
  vision: string;
  missions: string[];
  org: { jabatan: string; nama: string; icon: string }[];
  curriculum: { title: string; items: string[] }[];
  accreditation?: { title: string; summary: string; detail: string };
  dosenFilter: { fakultasIncludes: string; prodiIncludes: string[] };
};

const PROGRAM_PAGES: ProgramPage[] = [
  {
    id: "agroteknologi-s1",
    name: "Agroteknologi",
    level: "S-1",
    facultyName: "Fakultas Agroteknopreneur & Agraria",
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1472141521881-95d0e87e2e39?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?q=80&w=1400" },
    ],
    vision:
      "Menjadi program studi unggul di bidang agroteknologi berbasis inovasi dan kewirausahaan pertanian.",
    missions: [
      "Menyelenggarakan pendidikan agroteknologi yang aplikatif dan berbasis praktik.",
      "Mengembangkan riset budidaya dan teknologi produksi pertanian berkelanjutan.",
      "Menerapkan hasil keilmuan untuk pemberdayaan petani dan masyarakat.",
    ],
    org: [
      { jabatan: "Dekan", nama: "Dr. Faizal Maad, Ir., M.Si", icon: "🎓" },
      { jabatan: "Kaprodi Agroteknologi", nama: "Dr. Andi Masnang, Ir., MS", icon: "🌱" },
    ],
    curriculum: [
      { title: "Fokus Kurikulum", items: ["Budidaya & Produksi", "Teknologi Pertanian", "Agroekologi & Lingkungan", "Kewirausahaan"] },
      { title: "Struktur", items: ["Mata Kuliah Dasar", "Mata Kuliah Keahlian", "Praktikum/Lapangan", "Tugas Akhir"] },
    ],
    dosenFilter: { fakultasIncludes: "Agroenterpreneur", prodiIncludes: ["Agroteknologi"] },
  },
  {
    id: "agribisnis-s1",
    name: "Agribisnis",
    level: "S-1",
    facultyName: "Fakultas Agroteknopreneur & Agraria",
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1400" },
    ],
    vision:
      "Menjadi program studi unggul dalam pengembangan agribisnis yang inovatif dan berdaya saing.",
    missions: [
      "Menyelenggarakan pendidikan agribisnis berbasis kewirausahaan.",
      "Melaksanakan riset ekonomi pertanian dan pengembangan usaha agribisnis.",
      "Melaksanakan pengabdian untuk peningkatan kapasitas pelaku usaha pertanian.",
    ],
    org: [
      { jabatan: "Dekan", nama: "Dr. Faizal Maad, Ir., M.Si", icon: "🎓" },
      { jabatan: "Kaprodi Agribisnis", nama: "Linar Humaira, Ir., MS", icon: "🧺" },
    ],
    curriculum: [
      { title: "Fokus Kurikulum", items: ["Manajemen Agribisnis", "Pemasaran", "Kewirausahaan", "Rantai Nilai"] },
      { title: "Struktur", items: ["Mata Kuliah Dasar", "Mata Kuliah Keahlian", "Studi Kasus", "Tugas Akhir"] },
    ],
    dosenFilter: { fakultasIncludes: "Agroenterpreneur", prodiIncludes: ["Agribisnis"] },
  },
  {
    id: "manajemen-s1",
    name: "Manajemen",
    level: "S-1",
    facultyName: "Fakultas Ekonomi dan Bisnis",
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1400" },
    ],
    vision:
      "Menjadi program studi manajemen yang unggul dan berdaya saing dalam menghasilkan lulusan profesional dan berjiwa wirausaha.",
    missions: [
      "Menyelenggarakan pendidikan manajemen yang relevan dengan kebutuhan dunia usaha.",
      "Melaksanakan penelitian dan kajian bidang manajemen untuk pengembangan keilmuan.",
      "Melaksanakan pengabdian masyarakat dalam bentuk pelatihan dan pendampingan bisnis.",
    ],
    org: [
      { jabatan: "Dekan", nama: "Dr. Isbandriyati Mutmainah, SE., M.SE", icon: "🎓" },
      { jabatan: "Kaprodi Manajemen", nama: "Iis Anisa Yulia, SE., MM", icon: "📊" },
    ],
    curriculum: [
      { title: "Konsentrasi", items: ["Manajemen SDM", "Manajemen Keuangan", "Manajemen Pemasaran", "Manajemen Operasi/Produksi"] },
      { title: "Struktur", items: ["Mata Kuliah Inti", "Mata Kuliah Pilihan", "Studi Kasus", "Skripsi"] },
    ],
    dosenFilter: { fakultasIncludes: "Ekonomi", prodiIncludes: ["Manajemen"] },
  },
  {
    id: "akuntansi-s1",
    name: "Akuntansi",
    level: "S-1",
    facultyName: "Fakultas Ekonomi dan Bisnis",
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1454165205744-3b78555e5572?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1400" },
    ],
    vision:
      "Menjadi program studi akuntansi unggul dalam menghasilkan akuntan profesional yang berintegritas dan adaptif.",
    missions: [
      "Menyelenggarakan pendidikan akuntansi yang berbasis standar dan praktik profesional.",
      "Mengembangkan penelitian di bidang akuntansi, keuangan, audit, dan perpajakan.",
      "Melaksanakan pengabdian kepada masyarakat melalui literasi dan pendampingan keuangan.",
    ],
    org: [
      { jabatan: "Dekan", nama: "Dr. Isbandriyati Mutmainah, SE., M.SE", icon: "🎓" },
      { jabatan: "Kaprodi Akuntansi", nama: "Feni Marnilin, SE., M.Akt", icon: "🧾" },
    ],
    curriculum: [
      { title: "Fokus Kurikulum", items: ["Akuntansi Keuangan", "Audit", "Perpajakan", "Sistem Informasi Akuntansi"] },
      { title: "Struktur", items: ["Mata Kuliah Inti", "Praktikum", "Studi Kasus", "Skripsi"] },
    ],
    accreditation: {
      title: "Akreditasi",
      summary: "Terakreditasi Baik Sekali (LAMEMBA) – 25 Maret 2025.",
      detail:
        "Akreditasi menunjukkan pengakuan mutu program studi berdasarkan standar penjaminan mutu eksternal. Dokumen resmi dan rincian masa berlaku dapat ditambahkan dari brosur/sertifikat program studi.",
    },
    dosenFilter: { fakultasIncludes: "Ekonomi", prodiIncludes: ["Akuntansi"] },
  },
  {
    id: "kehutanan-s1",
    name: "Kehutanan",
    level: "S-1",
    facultyName: "Fakultas Kehutanan dan Lingkungan",
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=1400" },
    ],
    vision:
      "Menjadi program studi kehutanan unggul dalam konservasi dan pengelolaan hutan berkelanjutan.",
    missions: [
      "Menyelenggarakan pendidikan kehutanan yang kuat pada aspek konservasi dan pengelolaan.",
      "Melaksanakan penelitian kehutanan dan lingkungan berbasis lapangan.",
      "Mengabdi kepada masyarakat melalui program rehabilitasi dan edukasi lingkungan.",
    ],
    org: [
      { jabatan: "Dekan", nama: "Prof. Dr. Ir. Luluk Setyaningsih, M.Si. IPU.", icon: "🎓" },
      { jabatan: "Kaprodi Kehutanan", nama: "Dr. Ratna Sari Hasibuan, S.Hut., M.Si", icon: "🌳" },
    ],
    curriculum: [
      { title: "Fokus Kurikulum", items: ["Konservasi", "Pengelolaan Hutan", "Ekowisata", "Lingkungan"] },
      { title: "Struktur", items: ["Mata Kuliah Dasar", "Praktikum Lapang", "Proyek", "Skripsi"] },
    ],
    dosenFilter: { fakultasIncludes: "Kehutanan", prodiIncludes: ["Kehutanan"] },
  },
  {
    id: "biologi-s1",
    name: "Biologi",
    level: "S-1",
    facultyName: "Fakultas Sains & Teknologi",
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1581091215367-59ab6b7b0b3c?q=80&w=1400" },
    ],
    vision:
      "Menjadi program studi biologi unggul dalam riset dan inovasi biologi terapan.",
    missions: [
      "Menyelenggarakan pendidikan biologi yang kuat pada konsep dan praktik laboratorium.",
      "Melaksanakan riset biologi dan bioteknologi untuk kebutuhan masyarakat.",
      "Menyebarluaskan hasil riset melalui pengabdian dan kolaborasi.",
    ],
    org: [
      { jabatan: "Dekan", nama: "Dr. Lany Nurhayati, S.Si., M.Si", icon: "🎓" },
      { jabatan: "Kaprodi Biologi", nama: "Srikandi, S.Si., M.Si", icon: "🧬" },
    ],
    curriculum: [
      { title: "Fokus Kurikulum", items: ["Biologi Sel", "Genetika", "Ekologi", "Bioteknologi"] },
      { title: "Struktur", items: ["Praktikum", "Riset", "Publikasi", "Skripsi"] },
    ],
    dosenFilter: { fakultasIncludes: "Sains", prodiIncludes: ["Biologi"] },
  },
  {
    id: "kimia-s1",
    name: "Kimia",
    level: "S-1",
    facultyName: "Fakultas Sains & Teknologi",
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1559757175-5700dde67548?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1581091215367-59ab6b7b0b3c?q=80&w=1400" },
    ],
    vision:
      "Menjadi program studi kimia unggul dalam analisis dan inovasi kimia terapan.",
    missions: [
      "Menyelenggarakan pendidikan kimia berbasis praktikum dan analisis.",
      "Mengembangkan riset kimia terapan untuk industri dan lingkungan.",
      "Melaksanakan pengabdian melalui layanan analisis dan edukasi kimia.",
    ],
    org: [
      { jabatan: "Dekan", nama: "Dr. Lany Nurhayati, S.Si., M.Si", icon: "🎓" },
      { jabatan: "Kaprodi Kimia", nama: "Nina Ariesta, S.Pd., M.Si", icon: "⚗️" },
    ],
    curriculum: [
      { title: "Fokus Kurikulum", items: ["Kimia Analitik", "Kimia Organik", "Kimia Fisik", "Kimia Terapan"] },
      { title: "Struktur", items: ["Praktikum", "Proyek", "Riset", "Skripsi"] },
    ],
    dosenFilter: { fakultasIncludes: "Sains", prodiIncludes: ["Kimia"] },
  },
  {
    id: "data-sains-s1",
    name: "Data Sains",
    level: "S-1",
    facultyName: "Fakultas Sains & Teknologi",
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400" },
    ],
    vision:
      "Menjadi program studi data sains unggul dalam analitik dan pemodelan data untuk mendukung pengambilan keputusan.",
    missions: [
      "Menyelenggarakan pendidikan data sains yang kuat pada fondasi statistika dan komputasi.",
      "Melaksanakan penelitian di bidang analitik data dan kecerdasan buatan terapan.",
      "Menerapkan solusi berbasis data melalui kolaborasi dan pengabdian masyarakat.",
    ],
    org: [
      { jabatan: "Dekan", nama: "Dr. Lany Nurhayati, S.Si., M.Si", icon: "🎓" },
      { jabatan: "Koordinator Program", nama: "—", icon: "📊" },
    ],
    curriculum: [
      { title: "Fokus Kurikulum", items: ["Statistika", "Pemrograman", "Machine Learning", "Data Engineering"] },
      { title: "Struktur", items: ["Mata Kuliah Dasar", "Mata Kuliah Keahlian", "Proyek", "Tugas Akhir"] },
    ],
    dosenFilter: { fakultasIncludes: "Sains", prodiIncludes: ["Data", "Sains Data"] },
  },
  {
    id: "magister-manajemen-s2",
    name: "Magister Manajemen",
    level: "S-2",
    facultyName: "Sekolah Pascasarjana",
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400" },
    ],
    vision:
      "Menjadi program magister unggul dalam pengembangan ilmu manajemen berbasis riset dan praktik.",
    missions: [
      "Menyelenggarakan pendidikan magister manajemen yang berkualitas dan relevan.",
      "Melaksanakan penelitian manajemen untuk solusi persoalan organisasi dan bisnis.",
      "Mendorong publikasi ilmiah serta pengabdian berbasis hasil riset.",
    ],
    org: [
      { jabatan: "Direktur/Koordinator", nama: "—", icon: "🎓" },
      { jabatan: "Kaprodi", nama: "—", icon: "📚" },
    ],
    curriculum: [
      { title: "Fokus Kurikulum", items: ["Manajemen Strategis", "Riset Manajemen", "Kepemimpinan", "Analisis Keputusan"] },
      { title: "Struktur", items: ["Mata Kuliah Inti", "Mata Kuliah Pilihan", "Seminar", "Tesis"] },
    ],
    dosenFilter: { fakultasIncludes: "Ekonomi", prodiIncludes: ["Manajemen"] },
  },
  {
    id: "magister-agribisnis-s2",
    name: "Magister Agribisnis",
    level: "S-2",
    facultyName: "Sekolah Pascasarjana",
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1524594162443-73c20d06f989?q=80&w=1400" },
    ],
    vision:
      "Menjadi program magister agribisnis unggul dalam pengembangan agribisnis berkelanjutan dan berdaya saing.",
    missions: [
      "Menyelenggarakan pendidikan magister agribisnis yang berkualitas.",
      "Melaksanakan penelitian agribisnis untuk inovasi dan penguatan daya saing.",
      "Mengimplementasikan hasil riset melalui pengabdian dan kemitraan.",
    ],
    org: [
      { jabatan: "Direktur/Koordinator", nama: "—", icon: "🎓" },
      { jabatan: "Kaprodi", nama: "—", icon: "🌾" },
    ],
    curriculum: [
      { title: "Fokus Kurikulum", items: ["Ekonomi Agribisnis", "Rantai Nilai", "Riset Terapan", "Kebijakan"] },
      { title: "Struktur", items: ["Mata Kuliah Inti", "Mata Kuliah Pilihan", "Seminar", "Tesis"] },
    ],
    dosenFilter: { fakultasIncludes: "Agro", prodiIncludes: ["Agribisnis"] },
  },
  {
    id: "magister-ekonomi-pembangunan-s2",
    name: "Magister Ekonomi Pembangunan",
    level: "S-2",
    facultyName: "Sekolah Pascasarjana",
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400" },
    ],
    vision:
      "Menjadi program magister ekonomi pembangunan unggul dalam analisis kebijakan dan perencanaan pembangunan yang berkelanjutan.",
    missions: [
      "Menyelenggarakan pendidikan magister berbasis kompetensi dan riset.",
      "Mengembangkan kajian kebijakan publik dan perencanaan pembangunan.",
      "Mendorong publikasi, kolaborasi, dan pengabdian untuk pembangunan daerah.",
    ],
    org: [
      { jabatan: "Direktur/Koordinator", nama: "—", icon: "🎓" },
      { jabatan: "Kaprodi", nama: "—", icon: "🏗️" },
    ],
    curriculum: [
      { title: "Konsentrasi", items: ["EPSD", "PPWP", "MKAD"] },
      { title: "Struktur", items: ["Mata Kuliah Inti", "Mata Kuliah Pilihan", "Seminar", "Tesis"] },
    ],
    accreditation: {
      title: "Akreditasi",
      summary: "Terakreditasi LAMEMBA – 19 Juli 2024.",
      detail:
        "Akreditasi program studi ditetapkan berdasarkan asesmen mutu eksternal. Rincian nomor keputusan dan masa berlaku dapat ditambahkan sesuai dokumen resmi program studi.",
    },
    dosenFilter: { fakultasIncludes: "Ekonomi", prodiIncludes: ["Pembangunan", "Manajemen Pembangunan"] },
  },
];

function avatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=ffffff&size=512&bold=true`;
}

interface ProgramStudyTabProps {
  setActiveTab: (tab: TabType) => void;
  programId: ProgramId;
}

export function ProgramStudyTab({ setActiveTab, programId }: ProgramStudyTabProps) {
  const [openAccred, setOpenAccred] = useState(false);
  const { settings } = useSettings();

  const page = useMemo(() => {
    const base = PROGRAM_PAGES.find((p) => p.id === programId) ?? PROGRAM_PAGES[0];
    const saved = (settings as any).prodiContent?.[programId];
    if (!saved) return base;
    return {
      ...base,
      name: saved.name ?? base.name,
      level: saved.level ?? base.level,
      facultyName: saved.facultyName ?? base.facultyName,
      vision: saved.vision ?? base.vision,
      missions: saved.missions ?? base.missions,
      org: saved.org ?? base.org,
      curriculum: saved.curriculum ?? base.curriculum,
      bannerItems: (saved.bannerItems && saved.bannerItems.length > 0) ? saved.bannerItems : base.bannerItems,
    };
  }, [programId, settings]);

  const dosen = useMemo(() => {
    const fakultasKey = page.dosenFilter.fakultasIncludes.toLowerCase();
    const prodiKeys = page.dosenFilter.prodiIncludes.map((p) => p.toLowerCase());

    return PIMPINAN_DOSEN.filter((d) => {
      const fk = d.fakultas.toLowerCase();
      const pr = d.prodi.toLowerCase();
      return fk.includes(fakultasKey) && prodiKeys.some((k) => pr.includes(k));
    });
  }, [page.dosenFilter.fakultasIncludes, page.dosenFilter.prodiIncludes]);

  return (
    <div className="animate-fade-in bg-white dark:bg-[#151515] transition-colors duration-500">
      <section className="px-6 md:px-12 pt-10 pb-16">
        <MediaBanner items={page.bannerItems} />

        <div className="mt-10 text-center">
          <p className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em]">{page.facultyName}</p>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500 mt-3">
            {page.name}
          </h2>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-3 transition-colors duration-500">
            Program Studi {page.level}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card border border-white/10 rounded-[35px] p-8 shadow-2xl transition-colors duration-500">
            <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white transition-colors duration-500">
              Visi
            </h3>
            <p className="text-[10px] text-gray-300 font-bold leading-relaxed mt-4 transition-colors duration-500">
              {page.vision}
            </p>
          </div>
          <div className="bg-card border border-white/10 rounded-[35px] p-8 shadow-2xl transition-colors duration-500">
            <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white transition-colors duration-500">
              Misi
            </h3>
            <ul className="mt-4 text-[10px] text-gray-300 font-bold leading-relaxed space-y-2 transition-colors duration-500">
              {page.missions.map((m) => (
                <li key={m}>• {m}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-3xl font-black italic uppercase mb-6 text-center text-black dark:text-white transition-colors duration-500">
            Struktur Organisasi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {page.org.map((p) => (
              <div key={p.jabatan} className="bg-card border border-white/10 rounded-[30px] p-6 shadow-2xl transition-colors duration-500">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl mb-4 transition-colors duration-500">
                  {p.icon}
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 transition-colors duration-500">
                  {p.jabatan}
                </p>
                <p className="text-sm font-black italic uppercase text-white mt-2 transition-colors duration-500">
                  {p.nama}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-3xl font-black italic uppercase mb-6 text-center text-black dark:text-white transition-colors duration-500">
            Kurikulum
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card border border-white/10 rounded-[35px] p-8 shadow-2xl transition-colors duration-500">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 transition-colors duration-500">
                Ringkasan Kurikulum
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {page.curriculum.map((c) => (
                  <div key={c.title} className="rounded-[28px] bg-white/5 border border-white/10 p-6 transition-colors duration-500">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 transition-colors duration-500">
                      {c.title}
                    </p>
                    <ul className="mt-3 text-[10px] text-gray-200 font-bold leading-relaxed space-y-1 transition-colors duration-500">
                      {c.items.map((it) => (
                        <li key={it}>• {it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-white/10 rounded-[35px] p-8 shadow-2xl transition-colors duration-500">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 transition-colors duration-500">
                Akreditasi
              </p>
              <p className="text-[10px] text-gray-200 font-bold leading-relaxed mt-4 transition-colors duration-500">
                {page.accreditation?.summary ?? "—"}
              </p>
              <button
                type="button"
                onClick={() => setOpenAccred(true)}
                className="mt-6 w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                disabled={!page.accreditation}
              >
                Lihat Detail
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500">
                Dosen Pengajar
              </h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-2 transition-colors duration-500">
                Profil dosen yang mengajar di program studi ini.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("profil")}
              className="text-emerald-500 font-black uppercase tracking-widest text-[10px] hover:text-emerald-400 transition-colors whitespace-nowrap"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(dosen.length ? dosen : [{ nama: "—", fakultas: page.facultyName, prodi: page.name, role: "Dosen", nidn: "-" }]).map((d) => (
              <div key={`${d.nama}-${d.role}-${d.nidn}`} className="bg-card border border-white/10 rounded-[30px] p-6 shadow-2xl transition-colors duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 bg-white/5 shrink-0">
                    <img src={avatarUrl(d.nama)} alt={d.nama} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 transition-colors duration-500">
                      {d.role}
                    </p>
                    <p className="text-sm font-black italic uppercase text-white mt-1 transition-colors duration-500 break-words">
                      {d.nama}
                    </p>
                    <p className="text-[10px] text-gray-300 font-bold mt-2 transition-colors duration-500">
                      NIDN: {d.nidn}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={openAccred} onOpenChange={setOpenAccred}>
        <DialogContent className="max-w-lg bg-white dark:bg-[#111] border-black/10 dark:border-white/10 rounded-[30px] p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-8 text-center">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-white">
                {page.accreditation?.title ?? "Akreditasi"}
              </DialogTitle>
            </DialogHeader>
            <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest mt-3">
              {page.name} · {page.level}
            </p>
          </div>

          <div className="px-8 py-8">
            <div className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[22px] p-6 transition-colors duration-500">
              <p className="text-[11px] text-gray-700 dark:text-gray-200 font-bold leading-relaxed transition-colors duration-500">
                {page.accreditation?.detail ?? "—"}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

