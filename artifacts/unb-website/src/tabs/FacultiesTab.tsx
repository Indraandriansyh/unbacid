import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TabType } from "../types";

interface FacultiesTabProps {
  setActiveTab: (tab: TabType) => void;
  preset?: {
    section: "fakultas" | "prodi";
    selected: { kind: "faculty" | "program"; id: string };
    title?: string;
    subtitle?: string;
  };
}

type Faculty = {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  vision: string;
  missions: string[];
};

type Program = {
  id: string;
  name: string;
  level: "S-1" | "S-2";
  facultyId: string;
  icon: string;
  description: string;
  vision: string;
  missions: string[];
  accreditation?: string;
  concentrations?: string[];
};

const FACULTIES: Faculty[] = [
  {
    id: "faa",
    name: "Fakultas Agroteknopreneur & Agraria",
    shortName: "Agroteknopreneur",
    icon: "🌾",
    description:
      "Mengintegrasikan sains pertanian modern dengan kewirausahaan untuk menghasilkan lulusan inovatif dan mandiri.",
    vision:
      "Menjadi fakultas unggul dalam pengembangan sains pertanian dan agribisnis berbasis kewirausahaan serta pengelolaan lingkungan.",
    missions: [
      "Menyelenggarakan pendidikan di bidang agroteknologi dan agribisnis yang relevan.",
      "Melaksanakan penelitian terapan untuk inovasi pertanian berkelanjutan.",
      "Melaksanakan pengabdian kepada masyarakat melalui pemberdayaan dan kewirausahaan.",
    ],
  },
  {
    id: "feb",
    name: "Fakultas Ekonomi dan Bisnis",
    shortName: "Ekonomi & Bisnis",
    icon: "📈",
    description:
      "Mencetak profesional ekonomi dan bisnis yang adaptif, berintegritas, dan siap bersaing di dunia kerja.",
    vision:
      "Menjadi Fakultas Ekonomi yang unggul dalam pembelajaran ilmu ekonomi dan bisnis yang berwawasan lingkungan pada tingkat nasional tahun 2025.",
    missions: [
      "Menyelenggarakan pendidikan dan pembelajaran bidang ekonomi dan bisnis serta menghasilkan lulusan sesuai kebutuhan stakeholders.",
      "Melaksanakan penelitian untuk mengembangkan pengetahuan di bidang ekonomi dan bisnis.",
      "Melaksanakan pengabdian kepada masyarakat dalam pengembangan ekonomi dan bisnis berbasis kewirausahaan.",
    ],
  },
  {
    id: "fkl",
    name: "Fakultas Kehutanan dan Lingkungan",
    shortName: "Kehutanan",
    icon: "🌲",
    description:
      "Mendidik ahli kehutanan yang berkomitmen pada pelestarian lingkungan dan pengelolaan sumber daya hutan secara berkelanjutan.",
    vision:
      "Menjadi fakultas unggul dalam pengelolaan hutan dan lingkungan berbasis konservasi serta pembangunan berkelanjutan.",
    missions: [
      "Menyelenggarakan pendidikan kehutanan dan lingkungan yang bermutu.",
      "Mengembangkan riset konservasi dan pengelolaan sumber daya alam.",
      "Mendorong pengabdian masyarakat untuk peningkatan kualitas lingkungan.",
    ],
  },
  {
    id: "fst",
    name: "Fakultas Sains dan Teknologi",
    shortName: "Sains & Teknologi",
    icon: "🔬",
    description:
      "Program studi berbasis riset dengan fasilitas laboratorium untuk eksplorasi sains dan teknologi terapan.",
    vision:
      "Menjadi fakultas unggul dalam riset dan inovasi sains-teknologi yang bermanfaat bagi masyarakat.",
    missions: [
      "Menyelenggarakan pendidikan sains dan teknologi yang adaptif terhadap perkembangan zaman.",
      "Melaksanakan penelitian untuk menghasilkan inovasi dan publikasi ilmiah.",
      "Mengimplementasikan keilmuan melalui pengabdian dan kolaborasi.",
    ],
  },
  {
    id: "pps",
    name: "Sekolah Pascasarjana",
    shortName: "Pascasarjana",
    icon: "🎓",
    description:
      "Program magister yang memperkuat kompetensi profesional dan akademik berbasis penelitian ilmiah.",
    vision:
      "Menjadi sekolah pascasarjana unggul dalam pengembangan ilmu terapan berbasis riset dan pengelolaan lingkungan.",
    missions: [
      "Menyelenggarakan pendidikan magister yang berkualitas dan relevan.",
      "Mengembangkan penelitian terapan untuk solusi persoalan pembangunan.",
      "Mendorong publikasi dan pengabdian berbasis hasil riset.",
    ],
  },
];

const PROGRAMS: Program[] = [
  {
    id: "agroteknologi-s1",
    name: "Agroteknologi",
    level: "S-1",
    facultyId: "faa",
    icon: "🌱",
    description:
      "Mempelajari ilmu budidaya tanaman, teknologi produksi, dan inovasi pertanian berkelanjutan.",
    vision:
      "Menjadi program studi unggul di bidang agroteknologi berbasis inovasi dan kewirausahaan pertanian.",
    missions: [
      "Menyelenggarakan pendidikan agroteknologi yang aplikatif dan berbasis praktik.",
      "Mengembangkan riset budidaya dan teknologi produksi pertanian berkelanjutan.",
      "Menerapkan hasil keilmuan untuk pemberdayaan petani dan masyarakat.",
    ],
  },
  {
    id: "agribisnis-s1",
    name: "Agribisnis",
    level: "S-1",
    facultyId: "faa",
    icon: "🧺",
    description:
      "Fokus pada manajemen usaha pertanian, pemasaran, dan penguatan rantai nilai agribisnis.",
    vision:
      "Menjadi program studi unggul dalam pengembangan agribisnis yang inovatif dan berdaya saing.",
    missions: [
      "Menyelenggarakan pendidikan agribisnis berbasis kewirausahaan.",
      "Melaksanakan riset ekonomi pertanian dan pengembangan usaha agribisnis.",
      "Melaksanakan pengabdian untuk peningkatan kapasitas pelaku usaha pertanian.",
    ],
  },
  {
    id: "manajemen-s1",
    name: "Manajemen",
    level: "S-1",
    facultyId: "feb",
    icon: "📊",
    description:
      "Prodi manajemen dengan konsentrasi SDM, Keuangan, Pemasaran, dan Operasi/Produksi.",
    vision:
      "Menjadi program studi manajemen yang unggul dan berdaya saing dalam menghasilkan lulusan profesional dan berjiwa wirausaha.",
    missions: [
      "Menyelenggarakan pendidikan manajemen yang relevan dengan kebutuhan dunia usaha.",
      "Melaksanakan penelitian dan kajian bidang manajemen untuk pengembangan keilmuan.",
      "Melaksanakan pengabdian masyarakat dalam bentuk pelatihan dan pendampingan bisnis.",
    ],
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
    icon: "🧾",
    description:
      "Membekali kompetensi akuntansi, audit, perpajakan, dan sistem informasi akuntansi untuk karier profesional.",
    vision:
      "Menjadi program studi akuntansi unggul dalam menghasilkan akuntan profesional yang berintegritas dan adaptif.",
    missions: [
      "Menyelenggarakan pendidikan akuntansi yang berbasis standar dan praktik profesional.",
      "Mengembangkan penelitian di bidang akuntansi, keuangan, audit, dan perpajakan.",
      "Melaksanakan pengabdian kepada masyarakat melalui literasi dan pendampingan keuangan.",
    ],
    accreditation:
      "Terakreditasi Baik Sekali (LAMEMBA) – 25 Maret 2025.",
  },
  {
    id: "kehutanan-s1",
    name: "Kehutanan",
    level: "S-1",
    facultyId: "fkl",
    icon: "🌳",
    description:
      "Mempelajari konservasi, ekowisata, dan pengelolaan hutan untuk keberlanjutan sumber daya alam.",
    vision:
      "Menjadi program studi kehutanan unggul dalam konservasi dan pengelolaan hutan berkelanjutan.",
    missions: [
      "Menyelenggarakan pendidikan kehutanan yang kuat pada aspek konservasi dan pengelolaan.",
      "Melaksanakan penelitian kehutanan dan lingkungan berbasis lapangan.",
      "Mengabdi kepada masyarakat melalui program rehabilitasi dan edukasi lingkungan.",
    ],
  },
  {
    id: "biologi-s1",
    name: "Biologi",
    level: "S-1",
    facultyId: "fst",
    icon: "🧬",
    description:
      "Mempelajari biologi modern, bioteknologi, dan penerapannya di bidang kesehatan, lingkungan, dan pangan.",
    vision:
      "Menjadi program studi biologi unggul dalam riset dan inovasi biologi terapan.",
    missions: [
      "Menyelenggarakan pendidikan biologi yang kuat pada konsep dan praktik laboratorium.",
      "Melaksanakan riset biologi dan bioteknologi untuk kebutuhan masyarakat.",
      "Menyebarluaskan hasil riset melalui pengabdian dan kolaborasi.",
    ],
  },
  {
    id: "kimia-s1",
    name: "Kimia",
    level: "S-1",
    facultyId: "fst",
    icon: "⚗️",
    description:
      "Fokus pada kimia analitik, organik, dan terapan dengan dukungan praktikum laboratorium.",
    vision:
      "Menjadi program studi kimia unggul dalam analisis dan inovasi kimia terapan.",
    missions: [
      "Menyelenggarakan pendidikan kimia berbasis praktikum dan analisis.",
      "Mengembangkan riset kimia terapan untuk industri dan lingkungan.",
      "Melaksanakan pengabdian melalui layanan analisis dan edukasi kimia.",
    ],
  },
  {
    id: "data-sains-s1",
    name: "Data Sains",
    level: "S-1",
    facultyId: "fst",
    icon: "📊",
    description:
      "Mempelajari pengolahan data, statistika, dan machine learning untuk menghasilkan insight dan solusi berbasis data.",
    vision:
      "Menjadi program studi data sains unggul dalam analitik dan pemodelan data untuk mendukung pengambilan keputusan.",
    missions: [
      "Menyelenggarakan pendidikan data sains yang kuat pada fondasi statistika dan komputasi.",
      "Melaksanakan penelitian di bidang analitik data dan kecerdasan buatan terapan.",
      "Menerapkan solusi berbasis data melalui kolaborasi dan pengabdian masyarakat.",
    ],
  },
  {
    id: "magister-manajemen-s2",
    name: "Magister Manajemen",
    level: "S-2",
    facultyId: "pps",
    icon: "🎓",
    description:
      "Program magister untuk penguatan kompetensi manajerial, riset, dan pengambilan keputusan strategis.",
    vision:
      "Menjadi program magister unggul dalam pengembangan ilmu manajemen berbasis riset dan praktik.",
    missions: [
      "Menyelenggarakan pendidikan magister manajemen yang berkualitas dan relevan.",
      "Melaksanakan penelitian manajemen untuk solusi persoalan organisasi dan bisnis.",
      "Mendorong publikasi ilmiah serta pengabdian berbasis hasil riset.",
    ],
  },
  {
    id: "magister-agribisnis-s2",
    name: "Magister Agribisnis",
    level: "S-2",
    facultyId: "pps",
    icon: "🌾",
    description:
      "Program magister untuk pengembangan agribisnis berbasis analisis, riset, dan inovasi rantai nilai.",
    vision:
      "Menjadi program magister agribisnis unggul dalam pengembangan agribisnis berkelanjutan dan berdaya saing.",
    missions: [
      "Menyelenggarakan pendidikan magister agribisnis yang berkualitas.",
      "Melaksanakan penelitian agribisnis untuk inovasi dan penguatan daya saing.",
      "Mengimplementasikan hasil riset melalui pengabdian dan kemitraan.",
    ],
  },
  {
    id: "magister-ekonomi-pembangunan-s2",
    name: "Magister Ekonomi Pembangunan",
    level: "S-2",
    facultyId: "pps",
    icon: "🏗️",
    description:
      "Program magister dengan fokus ekonomi pembangunan dan perencanaan, diselenggarakan melalui sistem daring dan luring.",
    vision:
      "Menjadi program magister ekonomi pembangunan unggul dalam analisis kebijakan dan perencanaan pembangunan yang berkelanjutan.",
    missions: [
      "Menyelenggarakan pendidikan magister berbasis kompetensi dan riset.",
      "Mengembangkan kajian kebijakan publik dan perencanaan pembangunan.",
      "Mendorong publikasi, kolaborasi, dan pengabdian untuk pembangunan daerah.",
    ],
    accreditation:
      "Terakreditasi LAMEMBA – 19 Juli 2024.",
    concentrations: [
      "Ekonomi Pembangunan Sumber Daya (EPSD)",
      "Perencanaan Pembangunan Wilayah dan Pedesaan (PPWP)",
      "Manajemen Keuangan dan Aset Daerah (MKAD)",
    ],
  },
];

export function FacultiesTab({ setActiveTab, preset }: FacultiesTabProps) {
  const { t } = useLanguage();
  const [section, setSection] = useState<"fakultas" | "prodi">(
    preset?.section ?? "fakultas",
  );
  const [selected, setSelected] = useState<
    | { kind: "faculty"; id: string }
    | { kind: "program"; id: string }
    | null
  >(
    preset?.selected ??
      (preset?.section === "prodi"
        ? { kind: "program", id: PROGRAMS[0].id }
        : { kind: "faculty", id: FACULTIES[0].id }),
  );

  const activeFacultyId = preset
    ? preset.selected.kind === "faculty"
      ? preset.selected.id
      : PROGRAMS.find((p) => p.id === preset.selected.id)?.facultyId ?? null
    : null;
  const facultyCards = activeFacultyId
    ? FACULTIES.filter((f) => f.id === activeFacultyId)
    : FACULTIES;
  const programCards = activeFacultyId
    ? PROGRAMS.filter((p) => p.facultyId === activeFacultyId)
    : PROGRAMS;
  const baseFaculty = activeFacultyId
    ? FACULTIES.find((f) => f.id === activeFacultyId) ?? null
    : null;

  const selectedFaculty =
    selected?.kind === "faculty"
      ? FACULTIES.find((f) => f.id === selected.id) ?? null
      : null;
  const selectedProgram =
    selected?.kind === "program"
      ? PROGRAMS.find((p) => p.id === selected.id) ?? null
      : null;
  const selectedTitle = selectedFaculty?.name ?? selectedProgram?.name ?? "";
  const selectedSubtitle =
    selectedProgram
      ? `${FACULTIES.find((f) => f.id === selectedProgram.facultyId)?.shortName ?? "Fakultas"} · ${selectedProgram.level}`
      : selectedFaculty
        ? selectedFaculty.shortName
        : "";
  const selectedDescription =
    selectedFaculty?.description ?? selectedProgram?.description ?? "";
  const selectedVision = selectedFaculty?.vision ?? selectedProgram?.vision ?? "";
  const selectedMissions =
    selectedFaculty?.missions ?? selectedProgram?.missions ?? [];
  const headerTitle = preset?.title ?? t.faculties.title;
  const headerSubtitle = preset?.subtitle ?? t.faculties.subtitle;
  const headerDesc = preset ? (baseFaculty?.description ?? t.faculties.desc) : t.faculties.desc;

  return (
    <div className="animate-fade-in bg-white dark:bg-[#151515] transition-colors duration-500">
      <section className="px-6 md:px-12 py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500">{headerTitle}</h2>
            <p className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em] mt-2">{headerSubtitle}</p>
          </div>
          <p className="max-w-[350px] text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-[0.1em] leading-relaxed transition-colors duration-500">
            {headerDesc}
          </p>
        </div>

        {/* Tab info */}
        <div className="mb-10">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 max-w-2xl leading-relaxed transition-colors duration-500">{t.faculties.info}</p>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar">
            <button
              type="button"
              onClick={() => {
                setSection("fakultas");
                setSelected({
                  kind: "faculty",
                  id: activeFacultyId ?? FACULTIES[0].id,
                });
              }}
              className={section === "fakultas" ? "px-6 py-2 rounded-full bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-widest shrink-0 transition-all duration-500" : "px-6 py-2 rounded-full border border-black/10 dark:border-white/20 text-gray-500 dark:text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-500 dark:hover:text-white transition-all shrink-0 duration-500"}
            >
              Fakultas
            </button>
            <button
              type="button"
              onClick={() => {
                setSection("prodi");
                const defaultProgramId = programCards[0]?.id;
                setSelected(defaultProgramId ? { kind: "program", id: defaultProgramId } : null);
              }}
              className={section === "prodi" ? "px-6 py-2 rounded-full bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-widest shrink-0 transition-all duration-500" : "px-6 py-2 rounded-full border border-black/10 dark:border-white/20 text-gray-500 dark:text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-500 dark:hover:text-white transition-all shrink-0 duration-500"}
            >
              Program Studi
            </button>
          </div>
        </div>

        {/* Faculty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {section === "fakultas"
            ? facultyCards.map((f) => (
                <div key={f.id} className="new-package-card shadow-lg hover:-translate-y-4 transition-all duration-500">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black italic uppercase leading-none text-white">{f.shortName}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mt-2">{f.name}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl transition-colors duration-500">{f.icon}</div>
                  </div>
                  <p className="text-[10px] text-gray-300 font-bold leading-relaxed transition-colors duration-500">
                    {f.description}
                  </p>
                  <div className="mt-4">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Program Studi</p>
                    <ul className="prodi-list text-gray-200 mt-2">
                      {programCards.filter((p) => p.facultyId === f.id).map((p) => (
                        <li key={p.id}>{p.name} ({p.level})</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected({ kind: "faculty", id: f.id })}
                    className="w-full py-3 mt-6 border-2 border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white hover:text-emerald-900 transition-all duration-500"
                  >
                    Lihat Detail
                  </button>
                </div>
              ))
            : programCards.map((p) => {
                const faculty = FACULTIES.find((f) => f.id === p.facultyId);
                return (
                  <div key={p.id} className="new-package-card shadow-lg hover:-translate-y-4 transition-all duration-500">
                    <div className="flex justify-between items-start mb-6">
                      <div className="min-w-0">
                        <h3 className="text-2xl font-black italic uppercase leading-none text-white">{p.name}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mt-2">
                          {faculty?.shortName ?? "Fakultas"} · {p.level}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl transition-colors duration-500">{p.icon}</div>
                    </div>
                    <p className="text-[10px] text-gray-300 font-bold leading-relaxed transition-colors duration-500">
                      {p.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelected({ kind: "program", id: p.id })}
                      className="w-full py-3 mt-6 border-2 border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white hover:text-emerald-900 transition-all duration-500"
                    >
                      Lihat Detail
                    </button>
                  </div>
                );
              })}
        </div>

        {selected ? (
          <div className="mt-12">
            <div className="bg-card border border-white/10 rounded-[30px] overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-8 text-center">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                  {selectedTitle}
                </h3>
                <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest mt-2">
                  {selectedSubtitle}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab("pendaftaran")}
                    className="px-6 py-2.5 rounded-full bg-black text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-colors"
                  >
                    Daftar Sekarang
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="px-6 py-2.5 rounded-full bg-white/15 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>

              <div className="px-6 md:px-8 py-8">
                <div className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[22px] p-6 transition-colors duration-500">
                  <p className="text-[11px] text-gray-700 dark:text-gray-200 font-bold leading-relaxed transition-colors duration-500">
                    {selectedDescription}
                  </p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {selectedProgram?.accreditation ? (
                      <div className="rounded-[18px] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-4 transition-colors duration-500">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 transition-colors duration-500">
                          Akreditasi
                        </p>
                        <p className="text-[11px] font-bold text-black dark:text-white mt-2 transition-colors duration-500">
                          {selectedProgram.accreditation}
                        </p>
                      </div>
                    ) : null}

                    {selectedProgram?.concentrations?.length ? (
                      <div className="rounded-[18px] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-4 transition-colors duration-500">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 transition-colors duration-500">
                          Konsentrasi
                        </p>
                        <ul className="mt-2 text-[11px] font-bold text-black dark:text-white space-y-1 transition-colors duration-500">
                          {selectedProgram.concentrations.map((c) => (
                            <li key={c}>• {c}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <div className="rounded-[18px] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-4 transition-colors duration-500 md:col-span-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 transition-colors duration-500">
                        Visi
                      </p>
                      <p className="text-[11px] font-bold text-black dark:text-white mt-2 leading-relaxed transition-colors duration-500">
                        {selectedVision}
                      </p>
                    </div>

                    <div className="rounded-[18px] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-4 transition-colors duration-500 md:col-span-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 transition-colors duration-500">
                        Misi
                      </p>
                      <ul className="mt-2 text-[11px] font-bold text-black dark:text-white space-y-1 transition-colors duration-500">
                        {selectedMissions.map((m) => (
                          <li key={m}>• {m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
