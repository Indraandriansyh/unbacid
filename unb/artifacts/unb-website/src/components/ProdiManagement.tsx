import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import { MediaItemRow } from "./MediaUploader";

type MediaItem = { type: "image" | "video"; url: string };
type OrgItem = { jabatan: string; nama: string; icon: string };
type CurriculumSection = { title: string; items: string[] };
type ProdiData = {
  id: string;
  name: string;
  level: string;
  facultyName: string;
  vision: string;
  missions: string[];
  org: OrgItem[];
  curriculum: CurriculumSection[];
  bannerItems: MediaItem[];
};

const DEFAULT_PRODI: Record<string, ProdiData> = {
  "agroteknologi-s1": {
    id: "agroteknologi-s1", name: "Agroteknologi", level: "S-1", facultyName: "Fakultas Agroteknopreneur & Agraria",
    vision: "Menjadi program studi unggul di bidang agroteknologi berbasis inovasi dan kewirausahaan pertanian.",
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
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1472141521881-95d0e87e2e39?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?q=80&w=1400" },
    ],
  },
  "agribisnis-s1": {
    id: "agribisnis-s1", name: "Agribisnis", level: "S-1", facultyName: "Fakultas Agroteknopreneur & Agraria",
    vision: "Menjadi program studi unggul dalam pengembangan agribisnis yang inovatif dan berdaya saing.",
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
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1400" },
    ],
  },
  "manajemen-s1": {
    id: "manajemen-s1", name: "Manajemen", level: "S-1", facultyName: "Fakultas Ekonomi dan Bisnis",
    vision: "Menjadi program studi manajemen yang unggul dan berdaya saing dalam menghasilkan lulusan profesional dan berjiwa wirausaha.",
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
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1400" },
    ],
  },
  "akuntansi-s1": {
    id: "akuntansi-s1", name: "Akuntansi", level: "S-1", facultyName: "Fakultas Ekonomi dan Bisnis",
    vision: "Menjadi program studi akuntansi yang unggul dan menghasilkan lulusan kompeten dalam bidang akuntansi dan keuangan.",
    missions: [
      "Menyelenggarakan pendidikan akuntansi yang berstandar profesional.",
      "Melaksanakan penelitian di bidang akuntansi, keuangan, dan audit.",
      "Melaksanakan pengabdian masyarakat dalam peningkatan literasi keuangan.",
    ],
    org: [
      { jabatan: "Dekan", nama: "Dr. Isbandriyati Mutmainah, SE., M.SE", icon: "🎓" },
      { jabatan: "Kaprodi Akuntansi", nama: "Dra. Siti Nurjanah, M.Ak", icon: "📋" },
    ],
    curriculum: [
      { title: "Fokus", items: ["Akuntansi Keuangan", "Akuntansi Manajemen", "Audit", "Perpajakan"] },
      { title: "Struktur", items: ["Mata Kuliah Inti", "Praktikum Akuntansi", "Studi Kasus", "Skripsi"] },
    ],
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1454165205744-3b78555e5572?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1400" },
    ],
  },
  "kehutanan-s1": {
    id: "kehutanan-s1", name: "Kehutanan", level: "S-1", facultyName: "Fakultas Kehutanan dan Lingkungan",
    vision: "Menjadi program studi yang unggul dalam ilmu kehutanan dan pengelolaan sumber daya hutan secara berkelanjutan.",
    missions: [
      "Menyelenggarakan pendidikan kehutanan yang berbasis ilmu pengetahuan dan teknologi.",
      "Melaksanakan penelitian yang mendukung pelestarian hutan dan lingkungan.",
      "Melaksanakan pengabdian kepada masyarakat di bidang kehutanan dan konservasi alam.",
    ],
    org: [
      { jabatan: "Dekan", nama: "Dr. Nana Mulyana Arifjaya, Ir., M.Si", icon: "🎓" },
      { jabatan: "Kaprodi Kehutanan", nama: "Dr. Istomo, Ir., MS", icon: "🌲" },
    ],
    curriculum: [
      { title: "Fokus", items: ["Manajemen Hutan", "Konservasi Alam", "Silvikultur", "Hasil Hutan"] },
      { title: "Struktur", items: ["Mata Kuliah Dasar", "Praktikum Lapangan", "Kerja Praktek", "Skripsi"] },
    ],
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=1400" },
    ],
  },
  "biologi-s1": {
    id: "biologi-s1", name: "Biologi", level: "S-1", facultyName: "Fakultas Sains & Teknologi",
    vision: "Menjadi program studi biologi yang unggul dalam ilmu hayati dan bioteknologi untuk kesejahteraan masyarakat.",
    missions: [
      "Menyelenggarakan pendidikan biologi yang berbasis riset ilmiah.",
      "Melaksanakan penelitian bidang ekologi, genetika, dan bioteknologi.",
      "Menerapkan ilmu biologi untuk mengatasi permasalahan lingkungan dan kesehatan.",
    ],
    org: [
      { jabatan: "Dekan", nama: "Dr. Ade Yuniati, M.Si", icon: "🎓" },
      { jabatan: "Kaprodi Biologi", nama: "Dr. Resti Rahajeng, M.Si", icon: "🔬" },
    ],
    curriculum: [
      { title: "Fokus", items: ["Biologi Sel & Molekuler", "Ekologi", "Genetika", "Bioteknologi"] },
      { title: "Struktur", items: ["Kuliah Teori", "Praktikum Lab", "Penelitian", "Skripsi"] },
    ],
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1581091215367-59ab6b7b0b3c?q=80&w=1400" },
    ],
  },
  "kimia-s1": {
    id: "kimia-s1", name: "Kimia", level: "S-1", facultyName: "Fakultas Sains & Teknologi",
    vision: "Menjadi program studi kimia yang unggul dalam menghasilkan lulusan ahli kimia terapan dan analitik.",
    missions: [
      "Menyelenggarakan pendidikan kimia yang berbasis eksperimen dan penelitian.",
      "Melaksanakan riset kimia analitik, organik, dan lingkungan.",
      "Melaksanakan pengabdian masyarakat berbasis aplikasi kimia hijau.",
    ],
    org: [
      { jabatan: "Dekan", nama: "Dr. Ade Yuniati, M.Si", icon: "🎓" },
      { jabatan: "Kaprodi Kimia", nama: "Dr. Tri Esti Purbaningtias, M.Si", icon: "🧪" },
    ],
    curriculum: [
      { title: "Fokus", items: ["Kimia Organik", "Kimia Analitik", "Kimia Fisika", "Kimia Lingkungan"] },
      { title: "Struktur", items: ["Kuliah Teori", "Praktikum Lab", "Penelitian", "Skripsi"] },
    ],
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1559757175-5700dde67548?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1581091215367-59ab6b7b0b3c?q=80&w=1400" },
    ],
  },
  "data-sains-s1": {
    id: "data-sains-s1", name: "Data Sains", level: "S-1", facultyName: "Fakultas Sains & Teknologi",
    vision: "Menjadi program studi data sains yang unggul dalam menghasilkan analis data dan ilmuwan data yang kompeten.",
    missions: [
      "Menyelenggarakan pendidikan data sains berbasis kecerdasan buatan dan big data.",
      "Melaksanakan penelitian dalam pengolahan data, machine learning, dan analitik.",
      "Menerapkan ilmu data untuk pemecahan masalah di berbagai sektor industri.",
    ],
    org: [
      { jabatan: "Dekan", nama: "Dr. Ade Yuniati, M.Si", icon: "🎓" },
      { jabatan: "Kaprodi Data Sains", nama: "Dr. Budi Hermana, M.Kom", icon: "💻" },
    ],
    curriculum: [
      { title: "Fokus", items: ["Machine Learning", "Big Data", "Statistika", "Visualisasi Data"] },
      { title: "Struktur", items: ["Kuliah Teori", "Praktikum Pemrograman", "Proyek Data", "Skripsi"] },
    ],
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400" },
    ],
  },
  "magister-manajemen-s2": {
    id: "magister-manajemen-s2", name: "Magister Manajemen", level: "S-2", facultyName: "Sekolah Pascasarjana",
    vision: "Menjadi program magister manajemen yang unggul dalam menghasilkan pemimpin bisnis yang kompeten dan beretika.",
    missions: [
      "Menyelenggarakan pendidikan magister manajemen yang berfokus pada kepemimpinan dan inovasi bisnis.",
      "Melaksanakan penelitian manajemen strategik dan kebijakan bisnis.",
      "Melaksanakan pengabdian masyarakat melalui konsultasi dan pengembangan UMKM.",
    ],
    org: [
      { jabatan: "Direktur Pascasarjana", nama: "Prof. Dr. Hj. Suhartini, MM", icon: "🎓" },
      { jabatan: "Kaprodi Magister Manajemen", nama: "Dr. Rokhman Permadi, SE., MM", icon: "📈" },
    ],
    curriculum: [
      { title: "Konsentrasi", items: ["Manajemen Strategik", "Manajemen SDM", "Manajemen Keuangan", "Manajemen Pemasaran"] },
      { title: "Struktur", items: ["Mata Kuliah Wajib", "Mata Kuliah Pilihan", "Seminar Proposal", "Tesis"] },
    ],
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400" },
    ],
  },
  "magister-agribisnis-s2": {
    id: "magister-agribisnis-s2", name: "Magister Agribisnis", level: "S-2", facultyName: "Sekolah Pascasarjana",
    vision: "Menjadi program magister agribisnis yang unggul dalam menghasilkan ahli agribisnis berbasis riset ilmiah.",
    missions: [
      "Menyelenggarakan pendidikan magister agribisnis yang berorientasi pada kebutuhan industri pertanian.",
      "Melaksanakan penelitian ekonomi pertanian dan kebijakan agribisnis.",
      "Melaksanakan pengabdian masyarakat dalam pengembangan sistem agribisnis daerah.",
    ],
    org: [
      { jabatan: "Direktur Pascasarjana", nama: "Prof. Dr. Hj. Suhartini, MM", icon: "🎓" },
      { jabatan: "Kaprodi Magister Agribisnis", nama: "Dr. Ir. Yusman Syaukat, M.Ec", icon: "🌾" },
    ],
    curriculum: [
      { title: "Fokus", items: ["Ekonomi Pertanian", "Manajemen Rantai Pasok", "Kebijakan Agribisnis", "Kewirausahaan"] },
      { title: "Struktur", items: ["Mata Kuliah Wajib", "Mata Kuliah Pilihan", "Seminar Proposal", "Tesis"] },
    ],
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1524594162443-73c20d06f989?q=80&w=1400" },
    ],
  },
  "magister-ekonomi-pembangunan-s2": {
    id: "magister-ekonomi-pembangunan-s2", name: "Magister Ekonomi Pembangunan", level: "S-2", facultyName: "Sekolah Pascasarjana",
    vision: "Menjadi program magister yang unggul dalam analisis ekonomi pembangunan dan kebijakan publik.",
    missions: [
      "Menyelenggarakan pendidikan magister ekonomi pembangunan yang relevan dengan kebijakan pembangunan nasional.",
      "Melaksanakan penelitian di bidang ekonomi makro, kebijakan fiskal, dan pembangunan daerah.",
      "Melaksanakan pengabdian masyarakat dalam analisis dan perumusan kebijakan pembangunan.",
    ],
    org: [
      { jabatan: "Direktur Pascasarjana", nama: "Prof. Dr. Hj. Suhartini, MM", icon: "🎓" },
      { jabatan: "Kaprodi Magister Ekonomi Pembangunan", nama: "Dr. Nurul Huda, SE., M.Si", icon: "🏛️" },
    ],
    curriculum: [
      { title: "Fokus", items: ["Ekonomi Makro", "Kebijakan Fiskal", "Pembangunan Daerah", "Ekonometrika"] },
      { title: "Struktur", items: ["Mata Kuliah Wajib", "Mata Kuliah Pilihan", "Seminar Proposal", "Tesis"] },
    ],
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400" },
    ],
  },
};

export const PRODI_LIST = [
  { id: "agroteknologi-s1", name: "Agroteknologi", facultyId: "faa", icon: "🌾" },
  { id: "agribisnis-s1", name: "Agribisnis", facultyId: "faa", icon: "🧺" },
  { id: "manajemen-s1", name: "Manajemen", facultyId: "feb", icon: "📊" },
  { id: "akuntansi-s1", name: "Akuntansi", facultyId: "feb", icon: "📋" },
  { id: "kehutanan-s1", name: "Kehutanan", facultyId: "fkl", icon: "🌲" },
  { id: "biologi-s1", name: "Biologi", facultyId: "fst", icon: "🔬" },
  { id: "kimia-s1", name: "Kimia", facultyId: "fst", icon: "🧪" },
  { id: "data-sains-s1", name: "Data Sains", facultyId: "fst", icon: "💻" },
  { id: "magister-manajemen-s2", name: "Magister Manajemen", facultyId: "pps", icon: "🎓" },
  { id: "magister-agribisnis-s2", name: "Magister Agribisnis", facultyId: "pps", icon: "🌾" },
  { id: "magister-ekonomi-pembangunan-s2", name: "Magister Ekonomi Pembangunan", facultyId: "pps", icon: "🏛️" },
];

export default function ProdiManagement({ prodiId }: { prodiId: string }) {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const getInitialData = (id: string): ProdiData => {
    const saved = (settings as any).prodiContent?.[id];
    const def = DEFAULT_PRODI[id];
    if (!def) return { id, name: "", level: "S-1", facultyName: "", vision: "", missions: [], org: [], curriculum: [], bannerItems: [] };
    const base = { ...def, bannerItems: def.bannerItems ?? [] };
    return saved ? { ...base, ...saved, bannerItems: saved.bannerItems ?? base.bannerItems } : base;
  };

  const [data, setData] = useState<ProdiData>(() => getInitialData(prodiId));

  useEffect(() => {
    setData(getInitialData(prodiId));
  }, [prodiId, settings]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const current = (settings as any).prodiContent ?? {};
      await updateSettings("prodiContent", { ...current, [prodiId]: data });
      toast({ title: "Tersimpan", description: `Konten Program Studi ${data.name} berhasil diperbarui.` });
    } catch {
      toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Terjadi kesalahan saat menyimpan." });
    } finally {
      setIsSaving(false);
    }
  };

  const meta = PRODI_LIST.find(p => p.id === prodiId);

  const updateMission = (i: number, val: string) =>
    setData(d => { const m = [...d.missions]; m[i] = val; return { ...d, missions: m }; });
  const addMission = () => setData(d => ({ ...d, missions: [...d.missions, ""] }));
  const removeMission = (i: number) => setData(d => ({ ...d, missions: d.missions.filter((_, idx) => idx !== i) }));

  const updateOrg = (i: number, field: keyof OrgItem, val: string) =>
    setData(d => { const o = d.org.map((item, idx) => idx === i ? { ...item, [field]: val } : item); return { ...d, org: o }; });
  const addOrg = () => setData(d => ({ ...d, org: [...d.org, { jabatan: "", nama: "", icon: "👤" }] }));
  const removeOrg = (i: number) => setData(d => ({ ...d, org: d.org.filter((_, idx) => idx !== i) }));

  const updateCurrSection = (i: number, field: "title", val: string) =>
    setData(d => { const c = d.curriculum.map((s, idx) => idx === i ? { ...s, [field]: val } : s); return { ...d, curriculum: c }; });
  const updateCurrItem = (si: number, ii: number, val: string) =>
    setData(d => {
      const c = d.curriculum.map((s, idx) => idx === si ? { ...s, items: s.items.map((it, i) => i === ii ? val : it) } : s);
      return { ...d, curriculum: c };
    });
  const addCurrItem = (si: number) =>
    setData(d => { const c = d.curriculum.map((s, idx) => idx === si ? { ...s, items: [...s.items, ""] } : s); return { ...d, curriculum: c }; });
  const removeCurrItem = (si: number, ii: number) =>
    setData(d => { const c = d.curriculum.map((s, idx) => idx === si ? { ...s, items: s.items.filter((_, i) => i !== ii) } : s); return { ...d, curriculum: c }; });
  const addCurrSection = () => setData(d => ({ ...d, curriculum: [...d.curriculum, { title: "", items: [""] }] }));
  const removeCurrSection = (i: number) => setData(d => ({ ...d, curriculum: d.curriculum.filter((_, idx) => idx !== i) }));

  const updateBanner = (i: number, field: keyof MediaItem, val: string) =>
    setData(d => { const b = d.bannerItems.map((it, idx) => idx === i ? { ...it, [field]: val } : it); return { ...d, bannerItems: b }; });
  const addBanner = () => setData(d => ({ ...d, bannerItems: [...d.bannerItems, { type: "image" as const, url: "" }] }));
  const removeBanner = (i: number) => setData(d => ({ ...d, bannerItems: d.bannerItems.filter((_, idx) => idx !== i) }));

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-xl">
          {meta?.icon ?? "📚"}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Edit Program Studi</h2>
          <p className="text-sm text-slate-500">{data.facultyName} · {data.level}</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Informasi Dasar</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Nama Program Studi</label>
              <Input value={data.name} onChange={e => setData(d => ({ ...d, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Jenjang</label>
              <Input value={data.level} onChange={e => setData(d => ({ ...d, level: e.target.value }))} placeholder="S-1 / S-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Nama Fakultas (tampil di halaman)</label>
            <Input value={data.facultyName} onChange={e => setData(d => ({ ...d, facultyName: e.target.value }))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Visi</CardTitle></CardHeader>
        <CardContent>
          <Textarea rows={3} value={data.vision} onChange={e => setData(d => ({ ...d, vision: e.target.value }))} placeholder="Visi program studi..." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Misi</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {data.missions.map((m, i) => (
            <div key={i} className="flex gap-2">
              <Textarea rows={2} value={m} onChange={e => updateMission(i, e.target.value)} placeholder={`Misi ${i + 1}`} className="flex-1" />
              <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 shrink-0 mt-1" onClick={() => removeMission(i)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-300" onClick={addMission}>
            <Plus className="w-4 h-4" /> Tambah Misi
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Struktur Organisasi</CardTitle><CardDescription>Pimpinan program studi</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          {data.org.map((o, i) => (
            <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">Anggota {i + 1}</span>
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-7 w-7" onClick={() => removeOrg(i)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-[60px_1fr] gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-500">Ikon</label>
                  <Input value={o.icon} onChange={e => updateOrg(i, "icon", e.target.value)} className="text-center text-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-500">Jabatan</label>
                  <Input value={o.jabatan} onChange={e => updateOrg(i, "jabatan", e.target.value)} placeholder="Jabatan..." />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-500">Nama Lengkap & Gelar</label>
                <Input value={o.nama} onChange={e => updateOrg(i, "nama", e.target.value)} placeholder="Nama & gelar akademik..." />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-300" onClick={addOrg}>
            <Plus className="w-4 h-4" /> Tambah Anggota
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Kurikulum</CardTitle><CardDescription>Bagian-bagian kurikulum program studi</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          {data.curriculum.map((section, si) => (
            <div key={si} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  value={section.title}
                  onChange={e => updateCurrSection(si, "title", e.target.value)}
                  placeholder="Judul bagian (mis: Fokus Kurikulum)"
                  className="flex-1 font-semibold"
                />
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-8 w-8" onClick={() => removeCurrSection(si)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 pl-2">
                {section.items.map((item, ii) => (
                  <div key={ii} className="flex gap-2">
                    <Input value={item} onChange={e => updateCurrItem(si, ii, e.target.value)} placeholder="Item kurikulum..." className="flex-1" />
                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-8 w-8" onClick={() => removeCurrItem(si, ii)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="text-emerald-600 gap-1 pl-0" onClick={() => addCurrItem(si)}>
                  <Plus className="w-3 h-3" /> Tambah Item
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-300" onClick={addCurrSection}>
            <Plus className="w-4 h-4" /> Tambah Bagian Kurikulum
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gambar Banner</CardTitle>
          <CardDescription>Gambar atau video yang tampil di bagian atas halaman program studi. Masukkan URL gambar (jpg/png/webp) atau video (mp4).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.bannerItems.length === 0 && (
            <p className="text-sm text-slate-400 italic">Belum ada gambar kustom. Klik "Tambah Gambar" untuk mulai menambahkan.</p>
          )}
          {data.bannerItems.map((item, i) => (
            <MediaItemRow
              key={i}
              item={item}
              index={i}
              onUpdate={(field, val) => updateBanner(i, field, val)}
              onRemove={() => removeBanner(i)}
            />
          ))}
          <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-300" onClick={addBanner}>
            <Plus className="w-4 h-4" /> Tambah Gambar / Video
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 px-6">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
}
