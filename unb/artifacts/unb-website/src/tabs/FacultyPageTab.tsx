import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import type { TabType } from "../types";
import { MediaBanner } from "../components/MediaBanner";

type FacultyId = "faa" | "feb" | "fkl" | "fst" | "pps";

type MediaItem = { type: "image" | "video"; url: string };

type Faculty = {
  id: FacultyId;
  name: string;
  welcomeName: string[];
  ctaName?: string[];
  icon: string;
  accentIcon: string;
  bannerItems: MediaItem[];
  vision: string;
  missions: string[];
  reasons: { title: string; desc: string; icon: string }[];
  gallery: { title: string; items: MediaItem[] }[];
};

type Program = {
  id: string;
  name: string;
  level: "S-1" | "S-2";
  facultyId: FacultyId;
  description: string;
  concentrations?: string[];
  accreditation?: string;
};

const FACULTIES: Faculty[] = [
  {
    id: "feb",
    name: "Fakultas Ekonomi dan Bisnis",
    welcomeName: ["FAKULTAS", "EKONOMI & BISNIS"],
    icon: "📈",
    accentIcon: "💰",
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400" },
      { type: "video", url: "https://v.ftcdn.net/06/08/54/12/700_F_608541243_m33xYF6f22UeO1l6C2uI2G7w4X0E1X2T_ST.mp4" },
      { type: "image", url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1400" },
    ],
    vision:
      "Menjadi Fakultas Ekonomi yang unggul dalam pembelajaran ilmu ekonomi dan bisnis yang berwawasan lingkungan pada tingkat nasional tahun 2025.",
    missions: [
      "Menyelenggarakan pendidikan dan pembelajaran bidang ekonomi dan bisnis serta menghasilkan lulusan sesuai kebutuhan stakeholders.",
      "Melaksanakan penelitian untuk mengembangkan pengetahuan di bidang ekonomi dan bisnis.",
      "Melaksanakan pengabdian kepada masyarakat dalam pengembangan ekonomi dan bisnis berbasis kewirausahaan.",
    ],
    reasons: [
      {
        title: "Kurikulum Relevan",
        desc: "Pembelajaran disusun agar selaras dengan kebutuhan industri, sektor publik, dan dunia usaha.",
        icon: "📚",
      },
      {
        title: "Kompetensi Profesional",
        desc: "Menguatkan kompetensi manajerial, analisis keuangan, dan pengambilan keputusan.",
        icon: "🧩",
      },
      {
        title: "Wawasan Kewirausahaan",
        desc: "Mendorong mindset wirausaha melalui proyek, studi kasus, dan praktik terapan.",
        icon: "🚀",
      },
    ],
    gallery: [
      {
        title: "Kegiatan Akademik",
        items: [
          { type: "image", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400" },
          { type: "video", url: "https://v.ftcdn.net/06/08/54/12/700_F_608541243_m33xYF6f22UeO1l6C2uI2G7w4X0E1X2T_ST.mp4" },
        ],
      },
      {
        title: "Praktik & Studi Kasus",
        items: [
          { type: "image", url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400" },
        ],
      },
      {
        title: "Seminar & Kolaborasi",
        items: [
          { type: "image", url: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400" },
        ],
      },
    ],
  },
  {
    id: "faa",
    name: "Fakultas Agroteknopreneur & Agraria",
    welcomeName: ["FAKULTAS", "AGRO-", "TEKNOPRENEUR"],
    icon: "🌾",
    accentIcon: "🌱",
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1472141521881-95d0e87e2e39?q=80&w=1400" },
    ],
    vision:
      "Menjadi fakultas unggul dalam pengembangan sains pertanian dan agribisnis berbasis kewirausahaan serta pengelolaan lingkungan.",
    missions: [
      "Menyelenggarakan pendidikan di bidang agroteknologi dan agribisnis yang relevan.",
      "Melaksanakan penelitian terapan untuk inovasi pertanian berkelanjutan.",
      "Melaksanakan pengabdian kepada masyarakat melalui pemberdayaan dan kewirausahaan.",
    ],
    reasons: [
      {
        title: "Pertanian Modern",
        desc: "Belajar teknologi budidaya, produksi, dan inovasi pertanian berkelanjutan.",
        icon: "🧪",
      },
      {
        title: "Kewirausahaan Agraria",
        desc: "Mendorong lahirnya wirausaha muda melalui proyek dan studi lapang.",
        icon: "💡",
      },
      {
        title: "Dampak Nyata",
        desc: "Kontribusi langsung ke masyarakat melalui program pengabdian dan pendampingan.",
        icon: "🤝",
      },
    ],
    gallery: [
      {
        title: "Praktikum Lapang",
        items: [
          { type: "image", url: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1524594162443-73c20d06f989?q=80&w=1400" },
        ],
      },
      {
        title: "Kegiatan Mahasiswa",
        items: [
          { type: "image", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400" },
        ],
      },
      {
        title: "Riset & Inovasi",
        items: [
          { type: "image", url: "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1581091215367-59ab6b7b0b3c?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400" },
        ],
      },
    ],
  },
  {
    id: "fkl",
    name: "Fakultas Kehutanan dan Lingkungan",
    welcomeName: ["FAKULTAS", "KEHUTANAN"],
    icon: "🌲",
    accentIcon: "🍃",
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400" },
    ],
    vision:
      "Menjadi fakultas unggul dalam pengelolaan hutan dan lingkungan berbasis konservasi serta pembangunan berkelanjutan.",
    missions: [
      "Menyelenggarakan pendidikan kehutanan dan lingkungan yang bermutu.",
      "Mengembangkan riset konservasi dan pengelolaan sumber daya alam.",
      "Mendorong pengabdian masyarakat untuk peningkatan kualitas lingkungan.",
    ],
    reasons: [
      {
        title: "Konservasi & Ekowisata",
        desc: "Belajar konservasi sumber daya hutan serta pengembangan ekowisata berkelanjutan.",
        icon: "🧭",
      },
      {
        title: "Praktik Lapangan",
        desc: "Pengalaman lapangan melalui praktikum, survei, dan proyek berbasis lingkungan.",
        icon: "🥾",
      },
      {
        title: "Karier Hijau",
        desc: "Kompetensi untuk berkarier di sektor kehutanan, lingkungan, dan pengelolaan SDA.",
        icon: "🌿",
      },
    ],
    gallery: [
      {
        title: "Eksplorasi Lapangan",
        items: [
          { type: "image", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400" },
        ],
      },
      {
        title: "Kegiatan Mahasiswa",
        items: [
          { type: "image", url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400" },
        ],
      },
      {
        title: "Edukasi Lingkungan",
        items: [
          { type: "image", url: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1454165205744-3b78555e5572?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?q=80&w=1400" },
        ],
      },
    ],
  },
  {
    id: "fst",
    name: "Fakultas Sains & Teknologi",
    welcomeName: ["FAKULTAS", "SAINS & TEKNOLOGI"],
    icon: "🔬",
    accentIcon: "🧪",
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1581091215367-59ab6b7b0b3c?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400" },
    ],
    vision:
      "Menjadi fakultas unggul dalam riset dan inovasi sains-teknologi yang bermanfaat bagi masyarakat.",
    missions: [
      "Menyelenggarakan pendidikan sains dan teknologi yang adaptif terhadap perkembangan zaman.",
      "Melaksanakan penelitian untuk menghasilkan inovasi dan publikasi ilmiah.",
      "Mengimplementasikan keilmuan melalui pengabdian dan kolaborasi.",
    ],
    reasons: [
      {
        title: "Berbasis Riset",
        desc: "Pembelajaran menguatkan kemampuan analisis dan riset melalui praktikum dan proyek.",
        icon: "🧠",
      },
      {
        title: "Laboratorium",
        desc: "Fasilitas lab untuk eksplorasi sains dan teknologi terapan.",
        icon: "⚗️",
      },
      {
        title: "Skill Masa Depan",
        desc: "Membangun kompetensi analitik data, eksperimen, dan inovasi teknologi.",
        icon: "📊",
      },
    ],
    gallery: [
      {
        title: "Praktikum Laboratorium",
        items: [
          { type: "image", url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1581091215367-59ab6b7b0b3c?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400" },
        ],
      },
      {
        title: "Riset & Publikasi",
        items: [
          { type: "image", url: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1559757175-5700dde67548?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400" },
        ],
      },
      {
        title: "Kegiatan Mahasiswa",
        items: [
          { type: "image", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400" },
        ],
      },
    ],
  },
  {
    id: "pps",
    name: "Sekolah Pascasarjana",
    welcomeName: ["SEKOLAH", "PASCASARJANA"],
    ctaName: ["PASCA", "SARJANA"],
    icon: "🎓",
    accentIcon: "🏛️",
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1523050853064-8521a3998af7?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400" },
    ],
    vision:
      "Menjadi sekolah pascasarjana unggul dalam pengembangan ilmu terapan berbasis riset dan pengelolaan lingkungan.",
    missions: [
      "Menyelenggarakan pendidikan magister yang berkualitas dan relevan.",
      "Mengembangkan penelitian terapan untuk solusi persoalan pembangunan.",
      "Mendorong publikasi dan pengabdian berbasis hasil riset.",
    ],
    reasons: [
      {
        title: "Penguatan Kompetensi",
        desc: "Memperdalam keahlian profesional dan akademik untuk karier lanjutan.",
        icon: "📚",
      },
      {
        title: "Berbasis Riset",
        desc: "Pendekatan pembelajaran berbasis studi kasus, riset, dan publikasi ilmiah.",
        icon: "🔍",
      },
      {
        title: "Jaringan Kolaborasi",
        desc: "Peluang kolaborasi dengan praktisi dan akademisi untuk dampak nyata.",
        icon: "🤝",
      },
    ],
    gallery: [
      {
        title: "Kelas Pascasarjana",
        items: [
          { type: "image", url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400" },
        ],
      },
      {
        title: "Riset & Diskusi",
        items: [
          { type: "image", url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400" },
        ],
      },
      {
        title: "Seminar",
        items: [
          { type: "image", url: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1400" },
          { type: "image", url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400" },
        ],
      },
    ],
  },
];

const PROGRAMS: Program[] = [
  {
    id: "agroteknologi-s1",
    name: "Agroteknologi",
    level: "S-1",
    facultyId: "faa",
    description:
      "Ilmu budidaya tanaman, teknologi produksi, dan inovasi pertanian berkelanjutan.",
  },
  {
    id: "agribisnis-s1",
    name: "Agribisnis",
    level: "S-1",
    facultyId: "faa",
    description:
      "Manajemen usaha pertanian, pemasaran, dan penguatan rantai nilai agribisnis.",
  },
  {
    id: "manajemen-s1",
    name: "Manajemen",
    level: "S-1",
    facultyId: "feb",
    description:
      "Konsentrasi SDM, Keuangan, Pemasaran, dan Operasi/Produksi untuk karier profesional.",
    concentrations: [
      "Manajemen SDM",
      "Manajemen Keuangan",
      "Manajemen Pemasaran",
      "Manajemen Operasi/Produksi",
    ],
  },
  {
    id: "akuntansi-s1",
    name: "Akuntansi",
    level: "S-1",
    facultyId: "feb",
    description:
      "Kompetensi akuntansi, audit, perpajakan, dan sistem informasi akuntansi untuk karier profesional.",
    accreditation:
      "Terakreditasi Baik Sekali (LAMEMBA) – 25 Maret 2025.",
  },
  {
    id: "kehutanan-s1",
    name: "Kehutanan",
    level: "S-1",
    facultyId: "fkl",
    description:
      "Konservasi, ekowisata, dan pengelolaan hutan untuk keberlanjutan sumber daya alam.",
  },
  {
    id: "biologi-s1",
    name: "Biologi",
    level: "S-1",
    facultyId: "fst",
    description:
      "Biologi modern, bioteknologi, dan penerapannya di kesehatan, lingkungan, dan pangan.",
  },
  {
    id: "kimia-s1",
    name: "Kimia",
    level: "S-1",
    facultyId: "fst",
    description:
      "Kimia analitik, organik, dan terapan dengan dukungan praktikum laboratorium.",
  },
  {
    id: "data-sains-s1",
    name: "Data Sains",
    level: "S-1",
    facultyId: "fst",
    description:
      "Pengolahan data, statistika, dan machine learning untuk solusi berbasis data.",
  },
  {
    id: "magister-manajemen-s2",
    name: "Magister Manajemen",
    level: "S-2",
    facultyId: "pps",
    description:
      "Penguatan kompetensi manajerial, riset, dan pengambilan keputusan strategis.",
  },
  {
    id: "magister-agribisnis-s2",
    name: "Magister Agribisnis",
    level: "S-2",
    facultyId: "pps",
    description:
      "Pengembangan agribisnis berbasis analisis, riset, dan inovasi rantai nilai.",
  },
  {
    id: "magister-ekonomi-pembangunan-s2",
    name: "Magister Ekonomi Pembangunan",
    level: "S-2",
    facultyId: "pps",
    description:
      "Fokus ekonomi pembangunan dan perencanaan, diselenggarakan melalui sistem daring dan luring.",
    accreditation: "Terakreditasi LAMEMBA – 19 Juli 2024.",
    concentrations: [
      "Ekonomi Pembangunan Sumber Daya (EPSD)",
      "Perencanaan Pembangunan Wilayah dan Pedesaan (PPWP)",
      "Manajemen Keuangan dan Aset Daerah (MKAD)",
    ],
  },
];

function getProgramTabId(programId: string): TabType | null {
  if (programId === "agroteknologi-s1") return "prodi_agroteknologi";
  if (programId === "agribisnis-s1") return "prodi_agribisnis";
  if (programId === "manajemen-s1") return "prodi_manajemen";
  if (programId === "akuntansi-s1") return "prodi_akuntansi";
  if (programId === "kehutanan-s1") return "prodi_kehutanan";
  if (programId === "biologi-s1") return "prodi_biologi";
  if (programId === "kimia-s1") return "prodi_kimia";
  if (programId === "data-sains-s1") return "prodi_data_sains";
  if (programId === "magister-manajemen-s2") return "prodi_magister_manajemen";
  if (programId === "magister-agribisnis-s2") return "prodi_magister_agribisnis";
  if (programId === "magister-ekonomi-pembangunan-s2") return "prodi_magister_ekonomi_pembangunan";
  return null;
}

function splitHeadingLines(lines: string[]) {
  return (
    <>
      {lines.map((line, idx) => (
        <span key={line} className="text-black dark:text-white transition-colors duration-500">
          {line}
          {idx < lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}

interface FacultyPageTabProps {
  setActiveTab: (tab: TabType) => void;
  facultyId: FacultyId;
}

export function FacultyPageTab({ setActiveTab, facultyId }: FacultyPageTabProps) {
  const { t } = useLanguage();
  const { settings } = useSettings();

  const faculty = useMemo(() => {
    const base = FACULTIES.find((f) => f.id === facultyId) ?? FACULTIES[0];
    const saved = (settings as any).fakultasContent?.[facultyId];
    if (!saved) return base;
    return {
      ...base,
      name: saved.name ?? base.name,
      vision: saved.vision ?? base.vision,
      missions: saved.missions ?? base.missions,
      reasons: saved.reasons ?? base.reasons,
      bannerItems: (saved.bannerItems && saved.bannerItems.length > 0) ? saved.bannerItems : base.bannerItems,
      gallery: (saved.gallery && saved.gallery.length > 0) ? saved.gallery : base.gallery,
    };
  }, [facultyId, settings]);

  const programs = useMemo(
    () => PROGRAMS.filter((p) => p.facultyId === faculty.id),
    [faculty.id],
  );
  const ctaLines = faculty.ctaName ?? [faculty.welcomeName[faculty.welcomeName.length - 1]];

  return (
    <div className="animate-fade-in">
      <section className="px-4 md:px-6 pt-12 md:pt-20 pb-12 relative flex flex-col items-center">
        <div className="w-full text-center relative z-10 px-4">
          <div className="absolute -top-10 left-[5%] md:left-[15%] z-20 animate-float">
            <div className="glass-element w-12 h-12 md:w-16 md:h-16 bg-emerald-500/25 flex items-center justify-center text-2xl md:text-4xl shadow-xl">
              {faculty.icon}
            </div>
          </div>
          <div className="absolute top-0 right-[8%] md:right-[18%] z-20 animate-float-slow">
            <div className="glass-element w-10 h-10 md:w-14 md:h-14 bg-white/10 flex items-center justify-center text-xl md:text-3xl shadow-xl">
              {faculty.accentIcon}
            </div>
          </div>

          <h1 className="hero-heading font-black uppercase italic relative z-10 px-2 transition-colors duration-500">
            <span className="text-outline block mb-2 md:mb-4">#WELCOMETO</span>
            {splitHeadingLines(faculty.welcomeName)}
          </h1>

          <div className="mt-10 md:mt-16 flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl mx-auto gap-8 md:gap-10 transition-colors duration-500">
            <div className="text-[8px] md:text-[9px] uppercase font-bold tracking-[0.2em] text-gray-500 dark:text-gray-400 leading-relaxed text-center sm:text-left transition-colors duration-500">
              UNIVERSITAS NUSA BANGSA — BOGOR, INDONESIA<br />
              <span className="text-black dark:text-white text-[10px] md:text-xs transition-colors duration-500">
                {faculty.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("pendaftaran")}
              className="w-full sm:w-auto bg-transparent border border-black/20 dark:border-white/30 rounded-full px-8 md:px-10 py-3 md:py-4 flex items-center justify-center gap-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-black dark:text-white hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all group duration-500"
            >
              Daftar Sekarang
              <div className="bg-black dark:bg-white text-white dark:text-black rounded-full p-1 md:p-1.5 group-hover:bg-white dark:group-hover:bg-black group-hover:text-black dark:group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
            </button>
          </div>

          <div className="max-w-5xl mx-auto w-full px-2 md:px-4">
            <MediaBanner items={faculty.bannerItems} className="mt-14 md:mt-20" />
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card border border-white/10 rounded-[35px] p-8 shadow-2xl transition-colors duration-500">
            <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white transition-colors duration-500">
              Visi
            </h2>
            <p className="text-[10px] text-gray-300 font-bold leading-relaxed mt-4 transition-colors duration-500">
              {faculty.vision}
            </p>
          </div>
          <div className="bg-card border border-white/10 rounded-[35px] p-8 shadow-2xl transition-colors duration-500">
            <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white transition-colors duration-500">
              Misi
            </h2>
            <ul className="mt-4 text-[10px] text-gray-300 font-bold leading-relaxed space-y-2 transition-colors duration-500">
              {faculty.missions.map((m) => (
                <li key={m}>• {m}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500">
              Program Studi
            </h2>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-2 transition-colors duration-500">
              Pilih program studi sesuai minat dan tujuan karier.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((p) => (
            <div key={p.id} className="new-package-card shadow-lg hover:-translate-y-2 transition-all duration-500">
              <div className="flex justify-between items-start mb-6">
                <div className="min-w-0">
                  <h3 className="text-2xl font-black italic uppercase leading-none text-white">
                    {p.name}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mt-2">
                    {faculty.name} · {p.level}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl transition-colors duration-500">
                  {faculty.icon}
                </div>
              </div>
              <p className="text-[10px] text-gray-300 font-bold leading-relaxed transition-colors duration-500">
                {p.description}
              </p>
              {p.accreditation ? (
                <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 p-4 transition-colors duration-500">
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
                    Akreditasi
                  </p>
                  <p className="text-[10px] text-gray-200 font-bold mt-2 leading-relaxed transition-colors duration-500">
                    {p.accreditation}
                  </p>
                </div>
              ) : null}
              {p.concentrations?.length ? (
                <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 p-4 transition-colors duration-500">
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
                    Konsentrasi
                  </p>
                  <ul className="mt-2 text-[10px] text-gray-200 font-bold leading-relaxed space-y-1 transition-colors duration-500">
                    {p.concentrations.map((c) => (
                      <li key={c}>• {c}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  const tab = getProgramTabId(p.id);
                  if (tab) setActiveTab(tab);
                }}
                className="w-full py-3 mt-6 border-2 border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white hover:text-emerald-900 transition-all duration-500"
              >
                Lihat Detail
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start bg-card p-8 md:p-12 rounded-[40px] border border-border shadow-2xl relative overflow-hidden transition-colors duration-500">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6">
              <span className="text-outline block mb-2">ALASAN</span>
              <span className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] block">
                MEMILIH
              </span>
              {ctaLines.map((line, idx) => (
                <span key={line} className="text-white block transition-colors duration-500">
                  {line}
                  {idx < ctaLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h2>
            <p className="text-[9px] md:text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-8 leading-relaxed">
              {t.cta.desc}
            </p>

            <div className="space-y-5 mb-8">
              {faculty.reasons.map((r) => (
                <div key={r.title} className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-500">
                    {r.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black italic uppercase text-white mb-1 transition-colors duration-500">{r.title}</h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase leading-relaxed transition-colors duration-500">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("pendaftaran")}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-3"
            >
              {t.cta.btn}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>

          <div className="relative w-full mx-auto mt-4 lg:mt-0" style={{ maxWidth: 380 }}>
            <div className="w-full aspect-square rounded-[40px] overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#0d0d0d] shadow-2xl transition-colors duration-500">
              <img
                src={faculty.bannerItems[0]?.url}
                className="w-full h-full object-cover opacity-70 mix-blend-multiply dark:mix-blend-lighten transition duration-700"
                alt={faculty.name}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent mix-blend-overlay pointer-events-none"></div>
            </div>

            <div className="absolute top-4 left-4 glass-element bg-white/70 dark:bg-black/70 border border-black/10 dark:border-white/10 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl animate-float transition-colors duration-500">
              <h4 className="text-2xl md:text-3xl font-black italic text-emerald-500 tracking-tighter drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                {programs.length}
              </h4>
              <p className="text-[8px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest mt-0.5 transition-colors duration-500">
                PROGRAM STUDI
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500">
            Galeri Kegiatan
          </h2>
          <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">
            Foto &amp; Video Kegiatan Fakultas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {faculty.gallery.map((g) => (
            <div key={g.title} className="bg-card border border-white/10 rounded-[35px] p-5 shadow-2xl transition-colors duration-500">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4 transition-colors duration-500">
                {g.title}
              </p>
              <MediaBanner items={g.items} className="h-[220px] md:h-[280px]" />
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500">
            Blog · News · Jurnal
          </h2>
          <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">
            Update Informasi Fakultas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("blog")}
            className="bg-card border border-white/10 rounded-[35px] p-8 text-left hover:border-emerald-500/30 hover:shadow-[0_0_50px_rgba(16,185,129,0.2)] transition-all duration-500"
          >
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4 transition-colors duration-500">
              Berita Fakultas
            </p>
            <h3 className="text-xl font-black italic uppercase text-white transition-colors duration-500">
              Agenda &amp; Kegiatan Terbaru
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed mt-3 transition-colors duration-500">
              Baca update kegiatan, pengumuman, dan informasi penting dari fakultas.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ejournal")}
            className="bg-card border border-white/10 rounded-[35px] p-8 text-left hover:border-emerald-500/30 hover:shadow-[0_0_50px_rgba(16,185,129,0.2)] transition-all duration-500"
          >
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4 transition-colors duration-500">
              Jurnal &amp; Publikasi
            </p>
            <h3 className="text-xl font-black italic uppercase text-white transition-colors duration-500">
              Riset, Artikel, &amp; Paper
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed mt-3 transition-colors duration-500">
              Akses publikasi ilmiah, jurnal, dan karya akademik terkait program studi.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pendaftaran")}
            className="bg-card border border-white/10 rounded-[35px] p-8 text-left hover:border-emerald-500/30 hover:shadow-[0_0_50px_rgba(16,185,129,0.2)] transition-all duration-500"
          >
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4 transition-colors duration-500">
              Informasi Pendaftaran
            </p>
            <h3 className="text-xl font-black italic uppercase text-white transition-colors duration-500">
              Siap Bergabung?
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed mt-3 transition-colors duration-500">
              Lihat jalur masuk, biaya pendidikan, dan form pendaftaran mahasiswa baru.
            </p>
          </button>
        </div>
      </section>
    </div>
  );
}
