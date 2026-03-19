import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { Plus, Trash2, Loader2, Save, Upload, Images } from "lucide-react";
import { MediaItemRow } from "./MediaUploader";
import {
  DEFAULT_LPM_CONTENT,
  type LpmContent,
  type LpmPageContent,
  type LpmCard,
} from "@/tabs/LpmPageTab";

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());

const uploadOrDataUrl = async (file: File): Promise<string> => {
  try {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/site-settings/upload", { method: "POST", body });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data?.url && typeof data.url === "string") return data.url as string;
    throw new Error();
  } catch {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("File read failed"));
      reader.readAsDataURL(file);
    });
  }
};

const PAGE_TABS = [
  { id: "sop" as const, label: "Prosedur Kerja (SOP)", icon: "📋" },
  { id: "jobs" as const, label: "Lowongan Kerja", icon: "💼" },
  { id: "performance" as const, label: "Data Kinerja PT", icon: "📊" },
  { id: "tracer" as const, label: "Alumni & Tracer Study", icon: "🎓" },
  { id: "spmi" as const, label: "Dokumen SPMI", icon: "✅" },
];

const BADGE_OPTIONS = [
  { value: "emerald", label: "Hijau — Aktif / Berlaku / Buka" },
  { value: "blue", label: "Biru — Informasi / Selesai" },
  { value: "yellow", label: "Kuning — Proses / Segera" },
  { value: "red", label: "Merah — Penting / Mendesak" },
  { value: "purple", label: "Ungu — Riset / Dokumen" },
];

type PageId = "sop" | "jobs" | "performance" | "tracer" | "spmi";

function getLpmContent(settings: any): LpmContent {
  const saved = settings?.lpmContent;
  if (!saved) return DEFAULT_LPM_CONTENT;
  return {
    pages: {
      sop: saved.pages?.sop ?? DEFAULT_LPM_CONTENT.pages.sop,
      jobs: saved.pages?.jobs ?? DEFAULT_LPM_CONTENT.pages.jobs,
      performance: saved.pages?.performance ?? DEFAULT_LPM_CONTENT.pages.performance,
      tracer: saved.pages?.tracer ?? DEFAULT_LPM_CONTENT.pages.tracer,
      spmi: saved.pages?.spmi ?? DEFAULT_LPM_CONTENT.pages.spmi,
    },
  };
}

function PageEditor({ pageId, content, onChange }: {
  pageId: PageId;
  content: LpmPageContent;
  onChange: (c: LpmPageContent) => void;
}) {
  const addBanner = () =>
    onChange({ ...content, banner: [...content.banner, { type: "image" as const, url: "" }] });
  const removeBanner = (i: number) =>
    onChange({ ...content, banner: content.banner.filter((_, idx) => idx !== i) });
  const updateBanner = (i: number, field: "type" | "url", val: string) =>
    onChange({ ...content, banner: content.banner.map((it, idx) => idx === i ? { ...it, [field]: val as any } : it) });

  const isJobsPage = pageId === "jobs";

  const addCard = () => onChange({
    ...content,
    cards: [
      ...content.cards,
      {
        id: makeId(),
        title: "",
        subtitle: "",
        description: "",
        detail: "",
        icon: isJobsPage ? "💼" : "📄",
        date: "",
        tags: [],
        downloadUrl: "",
        downloadLabel: isJobsPage ? "Lamar Sekarang" : "Unduh",
        linkUrl: "",
        linkLabel: isJobsPage ? "Detail Lowongan" : "Lihat",
        badgeText: "",
        badgeColor: "emerald" as const,
        ...(isJobsPage ? { location: "", deadline: "", type: "Full-time" } : {}),
      },
    ],
  });

  const removeCard = (i: number) =>
    onChange({ ...content, cards: content.cards.filter((_, idx) => idx !== i) });

  const updateCard = (i: number, field: keyof LpmCard, val: any) =>
    onChange({ ...content, cards: content.cards.map((c, idx) => idx === i ? { ...c, [field]: val } : c) });

  const updateCardTags = (i: number, raw: string) => {
    const tags = raw.split(",").map((s) => s.trim()).filter(Boolean);
    updateCard(i, "tags", tags);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gambar Banner</CardTitle>
          <CardDescription>Gambar atau video yang tampil di bagian atas halaman.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {content.banner.length === 0 && (
            <p className="text-sm text-slate-400 italic">Belum ada banner. Klik "Tambah Gambar" untuk mulai.</p>
          )}
          {content.banner.map((item, i) => (
            <MediaItemRow
              key={i}
              item={item}
              index={i}
              onUpdate={(field, val) => updateBanner(i, field as "type" | "url", val)}
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
          <CardTitle>Deskripsi Halaman</CardTitle>
          <CardDescription>Teks pengantar yang tampil di bagian atas setelah banner.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={4}
            value={content.description}
            onChange={(e) => onChange({ ...content, description: e.target.value })}
            placeholder="Deskripsi singkat halaman ini..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Daftar Konten</CardTitle>
            <CardDescription>
              {isJobsPage ? "Daftar lowongan kerja yang ditampilkan." : "Daftar item/dokumen yang ditampilkan di halaman ini."}
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0" onClick={addCard}>
            <Plus className="w-3.5 h-3.5" />
            {isJobsPage ? "Tambah Lowongan" : "Tambah Item"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {content.cards.length === 0 && (
            <p className="text-sm text-slate-400 italic text-center py-6">
              Belum ada item. Klik tombol tambah di atas untuk memulai.
            </p>
          )}
          {content.cards.map((card, i) => (
            <div key={card.id} className="border border-slate-200 dark:border-white/10 rounded-2xl p-5 space-y-4 bg-slate-50 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Item #{i + 1}</span>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 gap-1.5 text-xs" onClick={() => removeCard(i)}>
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Judul *</label>
                  <Input value={card.title} onChange={(e) => updateCard(i, "title", e.target.value)} placeholder="Judul item..." />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Subjudul</label>
                  <Input value={card.subtitle ?? ""} onChange={(e) => updateCard(i, "subtitle", e.target.value)} placeholder="Kode dokumen, kategori..." />
                </div>
              </div>

              {isJobsPage && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Lokasi</label>
                    <Input value={(card as any).location ?? ""} onChange={(e) => updateCard(i, "location" as any, e.target.value)} placeholder="Kota, Provinsi" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Tipe Pekerjaan</label>
                    <Input value={(card as any).type ?? ""} onChange={(e) => updateCard(i, "type" as any, e.target.value)} placeholder="Full-time / Part-time..." />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Deadline</label>
                    <Input value={(card as any).deadline ?? ""} onChange={(e) => updateCard(i, "deadline" as any, e.target.value)} placeholder="31 Desember 2024" />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Deskripsi Singkat *</label>
                <Textarea rows={2} value={card.description} onChange={(e) => updateCard(i, "description", e.target.value)} placeholder="Deskripsi singkat yang tampil di kartu..." />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Detail / Isi Lengkap</label>
                <Textarea rows={3} value={card.detail ?? ""} onChange={(e) => updateCard(i, "detail", e.target.value)} placeholder="Teks lengkap yang tampil saat kartu diklik..." />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Ikon Emoji</label>
                  <Input value={card.icon ?? ""} onChange={(e) => updateCard(i, "icon", e.target.value)} placeholder="📋" className="text-center text-lg" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Tanggal</label>
                  <Input value={card.date ?? ""} onChange={(e) => updateCard(i, "date", e.target.value)} placeholder="Jan 2024" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Badge Label</label>
                  <Input value={card.badgeText ?? ""} onChange={(e) => updateCard(i, "badgeText", e.target.value)} placeholder="Berlaku, Buka..." />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Warna Badge</label>
                  <select
                    value={card.badgeColor ?? "emerald"}
                    onChange={(e) => updateCard(i, "badgeColor", e.target.value)}
                    className="w-full border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs bg-background"
                  >
                    {BADGE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Tag (pisahkan dengan koma)</label>
                <Input value={(card.tags ?? []).join(", ")} onChange={(e) => updateCardTags(i, e.target.value)} placeholder="SOP, Akademik, Mutu" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Link Unduh</label>
                  <Input value={card.downloadUrl ?? ""} onChange={(e) => updateCard(i, "downloadUrl", e.target.value)} placeholder="https://..." />
                  <Input value={card.downloadLabel ?? ""} onChange={(e) => updateCard(i, "downloadLabel", e.target.value)} placeholder="Label tombol unduh" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Link Eksternal</label>
                  <Input value={card.linkUrl ?? ""} onChange={(e) => updateCard(i, "linkUrl", e.target.value)} placeholder="https://..." />
                  <Input value={card.linkLabel ?? ""} onChange={(e) => updateCard(i, "linkLabel", e.target.value)} placeholder="Label tombol link" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function LpmManagement() {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<PageId>("sop");
  const [lpmContent, setLpmContent] = useState<LpmContent>(() => getLpmContent(settings));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLpmContent(getLpmContent(settings));
  }, [settings]);

  const handlePageChange = (pageId: PageId, content: LpmPageContent) => {
    setLpmContent((prev) => ({
      ...prev,
      pages: { ...prev.pages, [pageId]: content },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings("lpmContent", lpmContent);
      toast({ title: "Tersimpan!", description: "Konten LPM berhasil diperbarui.", className: "bg-emerald-500 text-white border-0" });
    } catch {
      toast({ title: "Gagal menyimpan", description: "Terjadi kesalahan. Silakan coba lagi.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Manajemen LPM</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola konten halaman Lembaga Penjaminan Mutu (LPM)</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Semua Perubahan
        </Button>
      </div>

      {/* Sub-page Tabs */}
      <div className="flex flex-wrap gap-2">
        {PAGE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active page editor */}
      <PageEditor
        pageId={activeTab}
        content={lpmContent.pages[activeTab]}
        onChange={(c) => handlePageChange(activeTab, c)}
      />

      {/* Bottom save button */}
      <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-white/10">
        <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Semua Perubahan
        </Button>
      </div>
    </div>
  );
}
