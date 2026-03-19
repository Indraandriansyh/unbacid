import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { Plus, Trash2, Loader2, Save, Upload, Pencil, Images, Newspaper, ArrowUp, ArrowDown } from "lucide-react";
import { MediaItemRow } from "./MediaUploader";
import type { NewsPost, NewsContent, NewsBlock } from "@/tabs/NewsTab";
import { DEFAULT_NEWS_CONTENT } from "@/tabs/NewsTab";

type MediaItem = { type: "image" | "video"; url: string };
type OrgItem = { jabatan: string; nama: string; icon: string };
type CurriculumSection = { title: string; items: string[] };
type GalleryItem = { url: string; caption?: string; title?: string };
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
  gallery?: GalleryItem[];
};

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });

const uploadOrDataUrl = async (file: File) => {
  try {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/site-settings/upload", { method: "POST", body });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data?.url && typeof data.url === "string") return data.url as string;
    throw new Error();
  } catch {
    return await readAsDataUrl(file);
  }
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

export type ProdiSection = "informasi" | "banner" | "galeri" | "berita";

export default function ProdiManagement({ prodiId, section }: { prodiId: string; section?: ProdiSection }) {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const getInitialData = (id: string): ProdiData => {
    const saved = (settings as any).prodiContent?.[id];
    const def = DEFAULT_PRODI[id];
    if (!def) return { id, name: "", level: "S-1", facultyName: "", vision: "", missions: [], org: [], curriculum: [], bannerItems: [], gallery: [] };
    const base = { ...def, bannerItems: def.bannerItems ?? [], gallery: (def as any).gallery ?? [] };
    return saved ? { ...base, ...saved, bannerItems: saved.bannerItems ?? base.bannerItems, gallery: saved.gallery ?? base.gallery } : base;
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

  const updateGallery = (i: number, field: keyof GalleryItem, val: string) =>
    setData(d => { const g = d.gallery.map((it, idx) => idx === i ? { ...it, [field]: val } : it); return { ...d, gallery: g }; });
  const removeGallery = (i: number) => setData(d => ({ ...d, gallery: d.gallery.filter((_, idx) => idx !== i) }));
  const addGallery = () => setData(d => ({ ...d, gallery: [...d.gallery, { url: "", title: "", caption: "" }] }));

  const galleryFileRef = useRef<HTMLInputElement>(null);
  const [galleryUploadIdx, setGalleryUploadIdx] = useState<number | null>(null);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const handleGalleryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || galleryUploadIdx === null) return;
    try {
      setIsUploadingGallery(true);
      const url = await uploadOrDataUrl(file);
      updateGallery(galleryUploadIdx, "url", url);
      toast({ title: "Berhasil", description: "Foto berhasil diupload." });
    } catch {
      toast({ variant: "destructive", title: "Gagal upload", description: "Upload foto gagal." });
    } finally {
      setIsUploadingGallery(false);
      setGalleryUploadIdx(null);
    }
  };

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

      {(!section || section === "informasi") && <>
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
      </>}

      {(!section || section === "banner") && <Card>
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
      </Card>}

      {(!section || section === "galeri") && <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Images className="w-5 h-5 text-emerald-500" />
            <CardTitle>Galeri Kegiatan</CardTitle>
          </div>
          <CardDescription>Foto-foto kegiatan program studi yang tampil di halaman prodi. Upload foto dan tambahkan judul/keterangan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input ref={galleryFileRef} type="file" accept="image/*" className="hidden" onChange={handleGalleryFileChange} />
          {data.gallery.length === 0 && (
            <p className="text-sm text-slate-400 italic">Belum ada foto galeri. Klik "Tambah Foto" untuk mulai menambahkan.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.gallery.map((item, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">Foto {i + 1}</span>
                  <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-7 w-7" onClick={() => removeGallery(i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {item.url && (
                  <div className="rounded-lg overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800">
                    <img src={item.url} alt={item.title ?? "Gallery"} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={item.url}
                    onChange={e => updateGallery(i, "url", e.target.value)}
                    placeholder="URL foto (https://...)"
                    className="flex-1 text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    disabled={isUploadingGallery}
                    onClick={() => { setGalleryUploadIdx(i); galleryFileRef.current?.click(); }}
                  >
                    {isUploadingGallery && galleryUploadIdx === i ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </Button>
                </div>
                <Input
                  value={item.title ?? ""}
                  onChange={e => updateGallery(i, "title", e.target.value)}
                  placeholder="Judul foto (opsional)"
                  className="text-sm"
                />
                <Input
                  value={item.caption ?? ""}
                  onChange={e => updateGallery(i, "caption", e.target.value)}
                  placeholder="Keterangan foto (opsional)"
                  className="text-sm"
                />
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-300" onClick={addGallery}>
            <Plus className="w-4 h-4" /> Tambah Foto
          </Button>
        </CardContent>
      </Card>}

      {section !== "berita" && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 px-6">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Perubahan
          </Button>
        </div>
      )}

      {(!section || section === "berita") && (
        <div className={section === "berita" ? "" : "border-t border-slate-200 dark:border-slate-700 pt-8"}>
          <ProdiNewsSection prodiId={prodiId} prodiName={data.name} />
        </div>
      )}
    </div>
  );
}

function ProdiNewsSection({ prodiId, prodiName }: { prodiId: string; prodiName: string }) {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const newsContent = useMemo<NewsContent>(() => {
    const raw = (settings as any).newsContent;
    if (!raw || typeof raw !== "object") return DEFAULT_NEWS_CONTENT;
    const categories = Array.isArray(raw.categories) ? raw.categories : DEFAULT_NEWS_CONTENT.categories;
    const posts = Array.isArray(raw.posts) ? raw.posts : DEFAULT_NEWS_CONTENT.posts;
    return { categories: categories.length ? categories : DEFAULT_NEWS_CONTENT.categories, posts };
  }, [settings]);

  const prodiPosts = useMemo(() =>
    [...newsContent.posts]
      .filter(p => p.prodiId === prodiId)
      .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt))),
    [newsContent.posts, prodiId]
  );

  const [isAddingPost, setIsAddingPost] = useState(false);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [newPost, setNewPost] = useState<NewsPost>({
    id: "", title: "", slug: "", excerpt: "", category: newsContent.categories[0] ?? "Umum",
    bannerUrl: "", author: "", publishedAt: new Date().toISOString().slice(0, 10),
    blocks: [{ id: "b1", type: "paragraph", text: "" }], prodiId,
  });

  const bannerFileRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const blockImageFileRef = useRef<HTMLInputElement | null>(null);
  const [uploadTargetBlockId, setUploadTargetBlockId] = useState<string | null>(null);
  const [isUploadingBlockImage, setIsUploadingBlockImage] = useState(false);

  const draft = isAddingPost ? newPost : editingPost;
  const setDraft = (next: NewsPost) => { if (isAddingPost) setNewPost(next); else setEditingPost(next); };
  const updateDraft = (fn: (d: NewsPost) => void) => { if (draft) fn(draft); };

  const openAddPost = () => {
    setNewPost({
      id: makeId(), title: "", slug: "", excerpt: "", category: newsContent.categories[0] ?? "Umum",
      bannerUrl: "", author: "", publishedAt: new Date().toISOString().slice(0, 10),
      blocks: [{ id: makeId(), type: "paragraph", text: "" }], prodiId,
    });
    setIsAddingPost(true);
  };

  const closeEditor = () => { setIsAddingPost(false); setEditingPost(null); };

  const upsertPost = (post: NewsPost) => {
    const allPosts = newsContent.posts;
    const slug = post.slug?.trim() ? post.slug.trim() : slugify(post.title);
    const normalized = { ...post, slug, prodiId };
    const exists = allPosts.some(p => p.id === post.id);
    const nextPosts = exists ? allPosts.map(p => p.id === post.id ? normalized : p) : [normalized, ...allPosts];
    return { ...newsContent, posts: nextPosts };
  };

  const deletePost = async (id: string) => {
    if (!confirm("Hapus berita ini?")) return;
    try {
      setIsSaving(true);
      const nextPosts = newsContent.posts.filter(p => p.id !== id);
      await updateSettings("newsContent", { ...newsContent, posts: nextPosts });
      toast({ title: "Berhasil", description: "Berita dihapus." });
    } catch {
      toast({ variant: "destructive", title: "Gagal menghapus", description: "Terjadi kesalahan." });
    } finally { setIsSaving(false); }
  };

  const submitEditor = async () => {
    if (!draft) return;
    if (!draft.title.trim()) { toast({ variant: "destructive", title: "Judul wajib diisi" }); return; }
    try {
      setIsSaving(true);
      const next = upsertPost(draft);
      await updateSettings("newsContent", next);
      closeEditor();
      toast({ title: "Berhasil", description: "Berita tersimpan." });
    } catch {
      toast({ variant: "destructive", title: "Gagal menyimpan", description: "Terjadi kesalahan." });
    } finally { setIsSaving(false); }
  };

  const addBlock = (type: NewsBlock["type"]) => {
    const id = makeId();
    const base: any = { id, type };
    if (type === "link") { base.label = "Buka Link"; base.url = ""; }
    if (type === "image") { base.url = ""; base.caption = ""; }
    if (["heading", "subheading", "paragraph"].includes(type)) base.text = "";
    if (draft) setDraft({ ...draft, blocks: [...draft.blocks, base as NewsBlock] });
  };
  const updateBlock = (blockId: string, patch: Partial<NewsBlock>) => {
    if (draft) setDraft({ ...draft, blocks: draft.blocks.map(b => b.id === blockId ? ({ ...b, ...patch } as any) : b) });
  };
  const deleteBlock = (blockId: string) => {
    if (draft) setDraft({ ...draft, blocks: draft.blocks.filter(b => b.id !== blockId) });
  };
  const moveBlock = (blockId: string, dir: -1 | 1) => {
    if (!draft) return;
    const idx = draft.blocks.findIndex(b => b.id === blockId);
    const nextIdx = idx + dir;
    if (idx < 0 || nextIdx < 0 || nextIdx >= draft.blocks.length) return;
    const next = [...draft.blocks];
    [next[idx], next[nextIdx]] = [next[nextIdx], next[idx]];
    setDraft({ ...draft, blocks: next });
  };

  const handleBannerFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file || !draft) return;
    try { setIsUploadingBanner(true); const url = await uploadOrDataUrl(file); setDraft({ ...draft, bannerUrl: url }); toast({ title: "Berhasil", description: "Banner diupload." }); }
    catch { toast({ variant: "destructive", title: "Gagal upload" }); }
    finally { setIsUploadingBanner(false); }
  };
  const handleBlockImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file || !uploadTargetBlockId || !draft) return;
    try { setIsUploadingBlockImage(true); const url = await uploadOrDataUrl(file); updateBlock(uploadTargetBlockId, { url } as any); toast({ title: "Berhasil", description: "Gambar diupload." }); }
    catch { toast({ variant: "destructive", title: "Gagal upload" }); }
    finally { setIsUploadingBlockImage(false); setUploadTargetBlockId(null); }
  };

  return (
    <div className="space-y-6">
      <input ref={bannerFileRef} type="file" accept="image/*" className="hidden" onChange={handleBannerFile} />
      <input ref={blockImageFileRef} type="file" accept="image/*" className="hidden" onChange={handleBlockImageFile} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-emerald-500" />
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Berita & Jurnal {prodiName}</h3>
            <p className="text-sm text-slate-500">Kelola berita, jurnal, dan publikasi khusus program studi ini. Berita ini juga tampil di halaman Berita utama.</p>
          </div>
        </div>
        <Button onClick={openAddPost} className="bg-emerald-500 hover:bg-emerald-600 gap-2 rounded-xl shrink-0">
          <Plus className="w-4 h-4" /> Tambah Berita
        </Button>
      </div>

      {prodiPosts.length === 0 && (
        <p className="text-sm text-slate-400 italic py-4">Belum ada berita untuk program studi ini.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prodiPosts.map(p => (
          <Card key={p.id} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden group">
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative">
              {p.bannerUrl ? <img src={p.bannerUrl} alt="" className="w-full h-full object-cover" /> : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">Tidak ada gambar</div>
              )}
              <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full">{p.category}</div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button onClick={() => setEditingPost(p)} size="icon" className="bg-white/90 hover:bg-white text-slate-800 rounded-lg h-7 w-7">
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button onClick={() => deletePost(p.id)} size="icon" className="bg-red-500/90 hover:bg-red-500 text-white rounded-lg h-7 w-7" disabled={isSaving}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4 space-y-1">
              <div className="font-bold text-sm line-clamp-2">{p.title}</div>
              <div className="text-xs text-slate-500">{p.publishedAt} · {p.author || "—"}</div>
              <div className="text-xs text-slate-500 line-clamp-2">{p.excerpt}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(isAddingPost || editingPost) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-4xl border-none shadow-2xl bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{isAddingPost ? "Tambah Berita" : "Edit Berita"} — {prodiName}</CardTitle>
                <CardDescription>Isi judul, banner, penulis, kategori, dan konten. Berita ini akan tampil di halaman prodi dan halaman berita utama.</CardDescription>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button onClick={closeEditor} variant="ghost" className="rounded-xl">Batal</Button>
                <Button onClick={submitEditor} disabled={isSaving} className="bg-emerald-500 hover:bg-emerald-600 rounded-xl gap-2">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6 max-h-[80vh] overflow-auto">
              {draft && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Judul</label>
                      <Input value={draft.title} onChange={e => { const t = e.target.value; setDraft({ ...draft, title: t, slug: draft.slug?.trim() ? draft.slug : slugify(t) }); }} className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slug</label>
                      <Input value={draft.slug} onChange={e => setDraft({ ...draft, slug: e.target.value })} className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kategori</label>
                      <select className="w-full bg-slate-50 dark:bg-[#252525] border-none rounded-xl px-3 h-11 text-sm" value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })}>
                        {newsContent.categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Penulis</label>
                      <Input value={draft.author} onChange={e => setDraft({ ...draft, author: e.target.value })} className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tanggal</label>
                      <Input type="date" value={draft.publishedAt} onChange={e => setDraft({ ...draft, publishedAt: e.target.value })} className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Banner</label>
                    <div className="flex gap-2">
                      <Input value={draft.bannerUrl} onChange={e => setDraft({ ...draft, bannerUrl: e.target.value })} className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl flex-1" placeholder="https://..." />
                      <Button onClick={() => bannerFileRef.current?.click()} disabled={isUploadingBanner} variant="outline" className="rounded-xl gap-2">
                        {isUploadingBanner ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ringkasan</label>
                    <Textarea value={draft.excerpt} onChange={e => setDraft({ ...draft, excerpt: e.target.value })} className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[80px]" />
                  </div>
                  <Card className="border border-black/5 dark:border-white/10 rounded-3xl bg-white dark:bg-white/5">
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                      <CardTitle className="text-base">Konten Berita</CardTitle>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {(["heading", "subheading", "paragraph", "link", "image"] as const).map(t => (
                          <Button key={t} type="button" onClick={() => addBlock(t)} variant="outline" className="rounded-xl text-xs h-8 px-3 capitalize">
                            {t === "heading" ? "Judul" : t === "subheading" ? "Sub Judul" : t === "paragraph" ? "Teks" : t === "link" ? "Link" : "Gambar"}
                          </Button>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {draft.blocks.map((block, idx) => (
                        <div key={block.id} className="rounded-2xl border border-black/5 dark:border-white/10 bg-slate-50 dark:bg-[#252525] p-4 space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{block.type} · {idx + 1}</div>
                            <div className="flex items-center gap-2">
                              <Button type="button" size="icon" variant="outline" className="rounded-xl h-8 w-8" onClick={() => moveBlock(block.id, -1)} disabled={idx === 0}><ArrowUp className="w-3.5 h-3.5" /></Button>
                              <Button type="button" size="icon" variant="outline" className="rounded-xl h-8 w-8" onClick={() => moveBlock(block.id, 1)} disabled={idx === draft.blocks.length - 1}><ArrowDown className="w-3.5 h-3.5" /></Button>
                              <Button type="button" size="icon" variant="destructive" className="rounded-xl h-8 w-8" onClick={() => deleteBlock(block.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                          </div>
                          {(block.type === "heading" || block.type === "subheading" || block.type === "paragraph") && (
                            <Textarea value={(block as any).text ?? ""} onChange={e => updateBlock(block.id, { text: e.target.value } as any)} className="bg-white dark:bg-[#1a1a1a] border-none rounded-xl min-h-[80px]" placeholder={block.type === "paragraph" ? "Isi teks..." : "Judul..."} />
                          )}
                          {block.type === "image" && (
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Input value={(block as any).url ?? ""} onChange={e => updateBlock(block.id, { url: e.target.value } as any)} className="bg-white dark:bg-[#1a1a1a] border-none rounded-xl flex-1" placeholder="URL gambar..." />
                                <Button type="button" variant="outline" className="rounded-xl gap-2" disabled={isUploadingBlockImage} onClick={() => { setUploadTargetBlockId(block.id); blockImageFileRef.current?.click(); }}>
                                  {isUploadingBlockImage && uploadTargetBlockId === block.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload
                                </Button>
                              </div>
                              <Input value={(block as any).caption ?? ""} onChange={e => updateBlock(block.id, { caption: e.target.value } as any)} className="bg-white dark:bg-[#1a1a1a] border-none rounded-xl" placeholder="Keterangan gambar..." />
                            </div>
                          )}
                          {block.type === "link" && (
                            <div className="space-y-2">
                              <Input value={(block as any).label ?? ""} onChange={e => updateBlock(block.id, { label: e.target.value } as any)} className="bg-white dark:bg-[#1a1a1a] border-none rounded-xl" placeholder="Label link..." />
                              <Input value={(block as any).url ?? ""} onChange={e => updateBlock(block.id, { url: e.target.value } as any)} className="bg-white dark:bg-[#1a1a1a] border-none rounded-xl" placeholder="https://..." />
                            </div>
                          )}
                        </div>
                      ))}
                      {draft.blocks.length === 0 && <p className="text-sm text-slate-400 italic">Tambah blok konten di atas.</p>}
                    </CardContent>
                  </Card>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
