import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { Plus, Trash2, Loader2, Save, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaItemRow } from "./MediaUploader";

type MediaItem = { type: "image" | "video"; url: string };
type GallerySection = { title: string; items: MediaItem[] };

type FacultyData = {
  id: string;
  name: string;
  vision: string;
  missions: string[];
  reasons: { title: string; desc: string; icon: string }[];
  bannerItems: MediaItem[];
  gallery: GallerySection[];
};

const DEFAULT_FACULTIES: Record<string, FacultyData> = {
  faa: {
    id: "faa",
    name: "Fakultas Agroteknopreneur & Agraria",
    vision: "Menjadi fakultas unggul dalam pengembangan sains pertanian dan agribisnis berbasis kewirausahaan serta pengelolaan lingkungan.",
    missions: [
      "Menyelenggarakan pendidikan di bidang agroteknologi dan agribisnis yang relevan.",
      "Melaksanakan penelitian terapan untuk inovasi pertanian berkelanjutan.",
      "Melaksanakan pengabdian kepada masyarakat melalui pemberdayaan dan kewirausahaan.",
    ],
    reasons: [
      { title: "Pertanian Modern", desc: "Belajar teknologi budidaya, produksi, dan inovasi pertanian berkelanjutan.", icon: "🧪" },
      { title: "Kewirausahaan Agraria", desc: "Mendorong lahirnya wirausaha muda melalui proyek dan studi lapang.", icon: "💡" },
      { title: "Dampak Nyata", desc: "Kontribusi langsung ke masyarakat melalui program pengabdian dan pendampingan.", icon: "🤝" },
    ],
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1472141521881-95d0e87e2e39?q=80&w=1400" },
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
  feb: {
    id: "feb",
    name: "Fakultas Ekonomi dan Bisnis",
    vision: "Menjadi Fakultas Ekonomi yang unggul dalam pembelajaran ilmu ekonomi dan bisnis yang berwawasan lingkungan pada tingkat nasional tahun 2025.",
    missions: [
      "Menyelenggarakan pendidikan dan pembelajaran bidang ekonomi dan bisnis serta menghasilkan lulusan sesuai kebutuhan stakeholders.",
      "Melaksanakan penelitian untuk mengembangkan pengetahuan di bidang ekonomi dan bisnis.",
      "Melaksanakan pengabdian kepada masyarakat dalam pengembangan ekonomi dan bisnis berbasis kewirausahaan.",
    ],
    reasons: [
      { title: "Kurikulum Relevan", desc: "Pembelajaran disusun agar selaras dengan kebutuhan industri, sektor publik, dan dunia usaha.", icon: "📚" },
      { title: "Kompetensi Profesional", desc: "Menguatkan kompetensi manajerial, analisis keuangan, dan pengambilan keputusan.", icon: "🧩" },
      { title: "Wawasan Kewirausahaan", desc: "Mendorong mindset wirausaha melalui proyek, studi kasus, dan praktik terapan.", icon: "🚀" },
    ],
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400" },
      { type: "video", url: "https://v.ftcdn.net/06/08/54/12/700_F_608541243_m33xYF6f22UeO1l6C2uI2G7w4X0E1X2T_ST.mp4" },
      { type: "image", url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1400" },
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
  fkl: {
    id: "fkl",
    name: "Fakultas Kehutanan dan Lingkungan",
    vision: "Menjadi fakultas unggul dalam pengelolaan hutan dan lingkungan berbasis konservasi serta pembangunan berkelanjutan.",
    missions: [
      "Menyelenggarakan pendidikan kehutanan dan lingkungan yang bermutu.",
      "Mengembangkan riset konservasi dan pengelolaan sumber daya alam.",
      "Mendorong pengabdian masyarakat untuk peningkatan kualitas lingkungan.",
    ],
    reasons: [
      { title: "Konservasi & Ekowisata", desc: "Belajar konservasi sumber daya hutan serta pengembangan ekowisata berkelanjutan.", icon: "🧭" },
      { title: "Praktik Lapangan", desc: "Pengalaman lapangan melalui praktikum, survei, dan proyek berbasis lingkungan.", icon: "🥾" },
      { title: "Karier Hijau", desc: "Kompetensi untuk berkarier di sektor kehutanan, lingkungan, dan pengelolaan SDA.", icon: "🌿" },
    ],
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400" },
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
  fst: {
    id: "fst",
    name: "Fakultas Sains & Teknologi",
    vision: "Menjadi fakultas unggul dalam riset dan inovasi sains-teknologi yang bermanfaat bagi masyarakat.",
    missions: [
      "Menyelenggarakan pendidikan sains dan teknologi yang adaptif terhadap perkembangan zaman.",
      "Melaksanakan penelitian untuk menghasilkan inovasi dan publikasi ilmiah.",
      "Mengimplementasikan keilmuan melalui pengabdian dan kolaborasi.",
    ],
    reasons: [
      { title: "Berbasis Riset", desc: "Pembelajaran menguatkan kemampuan analisis dan riset melalui praktikum dan proyek.", icon: "🧠" },
      { title: "Laboratorium", desc: "Fasilitas lab untuk eksplorasi sains dan teknologi terapan.", icon: "⚗️" },
      { title: "Skill Masa Depan", desc: "Membangun kompetensi analitik data, eksperimen, dan inovasi teknologi.", icon: "📊" },
    ],
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1581091215367-59ab6b7b0b3c?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400" },
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
  pps: {
    id: "pps",
    name: "Sekolah Pascasarjana",
    vision: "Menjadi sekolah pascasarjana unggul dalam pengembangan ilmu terapan berbasis riset dan pengelolaan lingkungan.",
    missions: [
      "Menyelenggarakan pendidikan magister yang berkualitas dan relevan.",
      "Mengembangkan penelitian terapan untuk solusi persoalan pembangunan.",
      "Mendorong publikasi dan pengabdian berbasis hasil riset.",
    ],
    reasons: [
      { title: "Penguatan Kompetensi", desc: "Memperdalam keahlian profesional dan akademik untuk karier lanjutan.", icon: "📚" },
      { title: "Berbasis Riset", desc: "Pendekatan pembelajaran berbasis studi kasus, riset, dan publikasi ilmiah.", icon: "🔍" },
      { title: "Jaringan Kolaborasi", desc: "Peluang kolaborasi dengan praktisi dan akademisi untuk dampak nyata.", icon: "🤝" },
    ],
    bannerItems: [
      { type: "image", url: "https://images.unsplash.com/photo-1523050853064-8521a3998af7?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400" },
      { type: "image", url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400" },
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
};

const FACULTY_LIST = [
  { id: "faa", label: "Agroteknopreneur", icon: "🌾" },
  { id: "feb", label: "Ekonomi & Bisnis", icon: "📈" },
  { id: "fkl", label: "Kehutanan & Lingkungan", icon: "🌲" },
  { id: "fst", label: "Sains & Teknologi", icon: "🔬" },
  { id: "pps", label: "Pascasarjana", icon: "🎓" },
];

export default function FakultasManagement({ facultyId }: { facultyId: string }) {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const getInitialData = (id: string): FacultyData => {
    const saved = (settings as any).fakultasContent?.[id];
    const def = DEFAULT_FACULTIES[id];
    if (!def) return { id, name: "", vision: "", missions: [], reasons: [], bannerItems: [], gallery: [] };
    const base = { ...def, bannerItems: def.bannerItems ?? [], gallery: def.gallery ?? [] };
    return saved ? { ...base, ...saved, bannerItems: saved.bannerItems ?? base.bannerItems, gallery: saved.gallery ?? base.gallery } : base;
  };

  const [data, setData] = useState<FacultyData>(() => getInitialData(facultyId));

  useEffect(() => {
    setData(getInitialData(facultyId));
  }, [facultyId, settings]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const current = (settings as any).fakultasContent ?? {};
      await updateSettings("fakultasContent", { ...current, [facultyId]: data });
      toast({ title: "Tersimpan", description: `Konten Fakultas ${data.name} berhasil diperbarui.` });
    } catch {
      toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Terjadi kesalahan saat menyimpan." });
    } finally {
      setIsSaving(false);
    }
  };

  const updateMission = (i: number, val: string) => {
    setData(d => { const m = [...d.missions]; m[i] = val; return { ...d, missions: m }; });
  };
  const addMission = () => setData(d => ({ ...d, missions: [...d.missions, ""] }));
  const removeMission = (i: number) => setData(d => ({ ...d, missions: d.missions.filter((_, idx) => idx !== i) }));

  const updateReason = (i: number, field: keyof FacultyData["reasons"][0], val: string) => {
    setData(d => {
      const r = d.reasons.map((item, idx) => idx === i ? { ...item, [field]: val } : item);
      return { ...d, reasons: r };
    });
  };
  const addReason = () => setData(d => ({ ...d, reasons: [...d.reasons, { title: "", desc: "", icon: "⭐" }] }));
  const removeReason = (i: number) => setData(d => ({ ...d, reasons: d.reasons.filter((_, idx) => idx !== i) }));

  const updateBanner = (i: number, field: keyof MediaItem, val: string) =>
    setData(d => { const b = d.bannerItems.map((it, idx) => idx === i ? { ...it, [field]: val } : it); return { ...d, bannerItems: b }; });
  const addBanner = () => setData(d => ({ ...d, bannerItems: [...d.bannerItems, { type: "image" as const, url: "" }] }));
  const removeBanner = (i: number) => setData(d => ({ ...d, bannerItems: d.bannerItems.filter((_, idx) => idx !== i) }));

  const addGallerySection = () => setData(d => ({ ...d, gallery: [...d.gallery, { title: "Galeri Baru", items: [] }] }));
  const removeGallerySection = (si: number) => setData(d => ({ ...d, gallery: d.gallery.filter((_, idx) => idx !== si) }));
  const updateGalleryTitle = (si: number, val: string) =>
    setData(d => { const g = d.gallery.map((s, idx) => idx === si ? { ...s, title: val } : s); return { ...d, gallery: g }; });
  const addGalleryItem = (si: number) =>
    setData(d => { const g = d.gallery.map((s, idx) => idx === si ? { ...s, items: [...s.items, { type: "image" as const, url: "" }] } : s); return { ...d, gallery: g }; });
  const removeGalleryItem = (si: number, ii: number) =>
    setData(d => { const g = d.gallery.map((s, idx) => idx === si ? { ...s, items: s.items.filter((_, i) => i !== ii) } : s); return { ...d, gallery: g }; });
  const updateGalleryItem = (si: number, ii: number, field: keyof MediaItem, val: string) =>
    setData(d => { const g = d.gallery.map((s, idx) => idx === si ? { ...s, items: s.items.map((it, i) => i === ii ? { ...it, [field]: val } : it) } : s); return { ...d, gallery: g }; });

  const meta = FACULTY_LIST.find(f => f.id === facultyId);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-xl">
          {meta?.icon ?? "🏛️"}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Edit Konten Fakultas</h2>
          <p className="text-sm text-slate-500">{meta?.label}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
          <CardDescription>Nama dan identitas fakultas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nama Fakultas</label>
            <Input value={data.name} onChange={e => setData(d => ({ ...d, name: e.target.value }))} placeholder="Nama lengkap fakultas" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visi</CardTitle>
          <CardDescription>Pernyataan visi fakultas</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={3}
            value={data.vision}
            onChange={e => setData(d => ({ ...d, vision: e.target.value }))}
            placeholder="Tulis visi fakultas..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Misi</CardTitle>
          <CardDescription>Daftar misi fakultas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.missions.map((m, i) => (
            <div key={i} className="flex gap-2">
              <Textarea
                rows={2}
                value={m}
                onChange={e => updateMission(i, e.target.value)}
                placeholder={`Misi ${i + 1}`}
                className="flex-1"
              />
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
        <CardHeader>
          <CardTitle>Keunggulan / Alasan Memilih</CardTitle>
          <CardDescription>Poin-poin unggulan yang ditampilkan di halaman fakultas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.reasons.map((r, i) => (
            <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Poin {i + 1}</span>
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-7 w-7" onClick={() => removeReason(i)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-500">Ikon (emoji)</label>
                  <Input value={r.icon} onChange={e => updateReason(i, "icon", e.target.value)} placeholder="🎓" className="text-center text-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-500">Judul</label>
                  <Input value={r.title} onChange={e => updateReason(i, "title", e.target.value)} placeholder="Judul keunggulan" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-500">Deskripsi</label>
                <Textarea rows={2} value={r.desc} onChange={e => updateReason(i, "desc", e.target.value)} placeholder="Deskripsi keunggulan..." />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-300" onClick={addReason}>
            <Plus className="w-4 h-4" /> Tambah Poin Keunggulan
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gambar Banner Utama</CardTitle>
          <CardDescription>Gambar atau video yang tampil di carousel bagian atas halaman fakultas. Masukkan URL gambar (jpg/png/webp) atau video (mp4).</CardDescription>
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

      <Card>
        <CardHeader>
          <CardTitle>Galeri Foto</CardTitle>
          <CardDescription>Bagian galeri di bawah halaman fakultas. Setiap bagian bisa punya judul dan beberapa gambar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.gallery.length === 0 && (
            <p className="text-sm text-slate-400 italic">Belum ada bagian galeri. Klik "Tambah Bagian Galeri" untuk mulai.</p>
          )}
          {data.gallery.map((section, si) => (
            <div key={si} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  value={section.title}
                  onChange={e => updateGalleryTitle(si, e.target.value)}
                  placeholder="Judul bagian galeri..."
                  className="flex-1 font-semibold"
                />
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-8 w-8" onClick={() => removeGallerySection(si)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 pl-2">
                {section.items.map((it, ii) => (
                  <MediaItemRow
                    key={ii}
                    item={it}
                    index={ii}
                    onUpdate={(field, val) => updateGalleryItem(si, ii, field, val)}
                    onRemove={() => removeGalleryItem(si, ii)}
                  />
                ))}
                <Button variant="ghost" size="sm" className="text-emerald-600 gap-1 pl-0" onClick={() => addGalleryItem(si)}>
                  <Plus className="w-3 h-3" /> Tambah Gambar
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-300" onClick={addGallerySection}>
            <Plus className="w-4 h-4" /> Tambah Bagian Galeri
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 px-6"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
}
