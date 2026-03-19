import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { Plus, Trash2, Loader2, Save, Upload, BookOpen, Images } from "lucide-react";
import { MediaItemRow } from "./MediaUploader";
import {
  DEFAULT_LPPM_CONTENT,
  type LppmContent,
  type LppmPageContent,
  type LppmCard,
  type BookItem,
} from "@/tabs/LppmPageTab";

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
  { id: "penelitian" as const, label: "Penelitian", icon: "🔬" },
  { id: "pengabdian" as const, label: "Pengabdian", icon: "🤝" },
  { id: "inovasi" as const, label: "Inovasi", icon: "💡" },
  { id: "haki" as const, label: "HAKI", icon: "📜" },
  { id: "seminar" as const, label: "Seminar", icon: "🏛️" },
  { id: "books" as const, label: "Terbitan Buku", icon: "📚" },
];

const BADGE_OPTIONS = [
  { value: "emerald", label: "Aktif / Selesai / Berkelanjutan" },
  { value: "blue", label: "Informasi / Selesai" },
  { value: "yellow", label: "Berlangsung / Proses" },
  { value: "red", label: "Penting / Mendesak" },
  { value: "purple", label: "Riset / Prototipe" },
];

type PageId = "penelitian" | "pengabdian" | "inovasi" | "haki" | "seminar";

function getLppmContent(settings: any): LppmContent {
  const saved = settings?.lppmContent;
  if (!saved) return DEFAULT_LPPM_CONTENT;
  return {
    pages: {
      penelitian: saved.pages?.penelitian ?? DEFAULT_LPPM_CONTENT.pages.penelitian,
      pengabdian: saved.pages?.pengabdian ?? DEFAULT_LPPM_CONTENT.pages.pengabdian,
      inovasi: saved.pages?.inovasi ?? DEFAULT_LPPM_CONTENT.pages.inovasi,
      haki: saved.pages?.haki ?? DEFAULT_LPPM_CONTENT.pages.haki,
      seminar: saved.pages?.seminar ?? DEFAULT_LPPM_CONTENT.pages.seminar,
    },
    books: Array.isArray(saved.books) ? saved.books : DEFAULT_LPPM_CONTENT.books,
  };
}

function PageEditor({ pageId, content, onChange }: {
  pageId: PageId;
  content: LppmPageContent;
  onChange: (c: LppmPageContent) => void;
}) {
  const addBanner = () =>
    onChange({ ...content, banner: [...content.banner, { type: "image" as const, url: "" }] });
  const removeBanner = (i: number) =>
    onChange({ ...content, banner: content.banner.filter((_, idx) => idx !== i) });
  const updateBanner = (i: number, field: "type" | "url", val: string) =>
    onChange({ ...content, banner: content.banner.map((it, idx) => idx === i ? { ...it, [field]: val as any } : it) });

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
        icon: "📄",
        date: "",
        tags: [],
        downloadUrl: "",
        downloadLabel: "Unduh",
        linkUrl: "",
        linkLabel: "Lihat",
        badgeText: "",
        badgeColor: "emerald" as const,
      },
    ],
  });

  const removeCard = (i: number) =>
    onChange({ ...content, cards: content.cards.filter((_, idx) => idx !== i) });

  const updateCard = (i: number, field: keyof LppmCard, val: any) =>
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
        <CardHeader>
          <CardTitle>Kartu Konten</CardTitle>
          <CardDescription>Setiap kartu bisa diklik untuk melihat detail lengkap. Isi judul, deskripsi singkat, dan detail panjang.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.cards.length === 0 && (
            <p className="text-sm text-slate-400 italic">Belum ada kartu. Klik "Tambah Kartu" untuk mulai.</p>
          )}
          {content.cards.map((card, i) => (
            <div key={card.id} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3 bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500">Kartu {i + 1}</span>
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-7 w-7" onClick={() => removeCard(i)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-[56px_1fr] gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Ikon</label>
                  <Input
                    value={card.icon ?? ""}
                    onChange={(e) => updateCard(i, "icon", e.target.value)}
                    className="text-center text-lg"
                    placeholder="🔬"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Judul *</label>
                  <Input
                    value={card.title}
                    onChange={(e) => updateCard(i, "title", e.target.value)}
                    placeholder="Judul kartu..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Sub-judul / Info Singkat</label>
                  <Input
                    value={card.subtitle ?? ""}
                    onChange={(e) => updateCard(i, "subtitle", e.target.value)}
                    placeholder="Tim, lokasi, tahun..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Tanggal / Periode</label>
                  <Input
                    value={card.date ?? ""}
                    onChange={(e) => updateCard(i, "date", e.target.value)}
                    placeholder="2024 / Januari-Juni 2024"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Deskripsi Singkat (tampil di kartu)</label>
                <Textarea
                  rows={2}
                  value={card.description}
                  onChange={(e) => updateCard(i, "description", e.target.value)}
                  placeholder="Ringkasan singkat yang tampil di kartu..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Detail Lengkap (tampil saat kartu diklik)</label>
                <Textarea
                  rows={4}
                  value={card.detail ?? ""}
                  onChange={(e) => updateCard(i, "detail", e.target.value)}
                  placeholder="Penjelasan panjang, angka, data, dll..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Teks Badge (opsional)</label>
                  <Input
                    value={card.badgeText ?? ""}
                    onChange={(e) => updateCard(i, "badgeText", e.target.value)}
                    placeholder="Aktif / Selesai / Berlangsung..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Warna Badge</label>
                  <select
                    value={card.badgeColor ?? "emerald"}
                    onChange={(e) => updateCard(i, "badgeColor", e.target.value)}
                    className="w-full h-9 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  >
                    {BADGE_OPTIONS.map((b) => (
                      <option key={b.value} value={b.value}>{b.value} — {b.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Tag (pisahkan dengan koma)</label>
                <Input
                  value={(card.tags ?? []).join(", ")}
                  onChange={(e) => updateCardTags(i, e.target.value)}
                  placeholder="Penelitian, Kompetitif, 2024"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">URL Download (opsional)</label>
                  <Input
                    value={card.downloadUrl ?? ""}
                    onChange={(e) => updateCard(i, "downloadUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Label Tombol Download</label>
                  <Input
                    value={card.downloadLabel ?? ""}
                    onChange={(e) => updateCard(i, "downloadLabel", e.target.value)}
                    placeholder="Unduh Laporan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">URL Link Eksternal (opsional)</label>
                  <Input
                    value={card.linkUrl ?? ""}
                    onChange={(e) => updateCard(i, "linkUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Label Tombol Link</label>
                  <Input
                    value={card.linkLabel ?? ""}
                    onChange={(e) => updateCard(i, "linkLabel", e.target.value)}
                    placeholder="Lihat Jurnal"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-300 w-full" onClick={addCard}>
            <Plus className="w-4 h-4" /> Tambah Kartu Baru
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function BooksEditor({ books, onChange }: { books: BookItem[]; onChange: (b: BookItem[]) => void }) {
  const coverFileRef = useRef<HTMLInputElement>(null);
  const [uploadIdx, setUploadIdx] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const addBook = () =>
    onChange([
      ...books,
      {
        id: makeId(),
        title: "",
        author: "",
        year: "",
        coverUrl: "",
        description: "",
        isbn: "",
        publisher: "UNB Press",
        tags: [],
        downloadUrl: "",
        previewUrl: "",
      },
    ]);

  const removeBook = (i: number) => onChange(books.filter((_, idx) => idx !== i));

  const updateBook = (i: number, field: keyof BookItem, val: any) =>
    onChange(books.map((b, idx) => idx === i ? { ...b, [field]: val } : b));

  const updateTags = (i: number, raw: string) => {
    const tags = raw.split(",").map((s) => s.trim()).filter(Boolean);
    updateBook(i, "tags", tags);
  };

  const handleCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || uploadIdx === null) return;
    try {
      setIsUploading(true);
      const url = await uploadOrDataUrl(file);
      updateBook(uploadIdx, "coverUrl", url);
      toast({ title: "Berhasil", description: "Cover berhasil diupload." });
    } catch {
      toast({ variant: "destructive", title: "Gagal upload" });
    } finally {
      setIsUploading(false);
      setUploadIdx(null);
    }
  };

  return (
    <div className="space-y-6">
      <input ref={coverFileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverFile} />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            Koleksi Buku
          </CardTitle>
          <CardDescription>Tambah atau edit buku terbitan UNB. Setiap buku tampil dalam format toko buku dengan opsi preview dan download.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {books.length === 0 && (
            <p className="text-sm text-slate-400 italic">Belum ada buku. Klik "Tambah Buku" untuk mulai.</p>
          )}

          {books.map((book, i) => (
            <div key={book.id} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3 bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500">Buku {i + 1}</span>
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-7 w-7" onClick={() => removeBook(i)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0">
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Cover</label>
                  <div
                    className="w-20 h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer group"
                    onClick={() => { setUploadIdx(i); coverFileRef.current?.click(); }}
                  >
                    {book.coverUrl ? (
                      <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                        <Images className="w-6 h-6 mb-1" />
                        <span className="text-[8px] font-bold">Upload</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 mt-1">
                    <Button
                      type="button" variant="outline" size="sm"
                      className="text-[10px] h-7 px-2 gap-1 w-full"
                      disabled={isUploading && uploadIdx === i}
                      onClick={() => { setUploadIdx(i); coverFileRef.current?.click(); }}
                    >
                      {isUploading && uploadIdx === i ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                      Upload
                    </Button>
                  </div>
                </div>

                <div className="flex-1 space-y-3 min-w-0">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-500">URL Cover (atau upload di kiri)</label>
                    <Input
                      value={book.coverUrl ?? ""}
                      onChange={(e) => updateBook(i, "coverUrl", e.target.value)}
                      placeholder="https://..."
                      className="text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-500">Judul Buku *</label>
                      <Input value={book.title} onChange={(e) => updateBook(i, "title", e.target.value)} placeholder="Judul buku..." />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-500">Penulis *</label>
                      <Input value={book.author} onChange={(e) => updateBook(i, "author", e.target.value)} placeholder="Nama penulis..." />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Tahun Terbit</label>
                  <Input value={book.year ?? ""} onChange={(e) => updateBook(i, "year", e.target.value)} placeholder="2024" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Penerbit</label>
                  <Input value={book.publisher ?? ""} onChange={(e) => updateBook(i, "publisher", e.target.value)} placeholder="UNB Press" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">ISBN</label>
                  <Input value={book.isbn ?? ""} onChange={(e) => updateBook(i, "isbn", e.target.value)} placeholder="978-..." />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Deskripsi Buku</label>
                <Textarea
                  rows={3}
                  value={book.description ?? ""}
                  onChange={(e) => updateBook(i, "description", e.target.value)}
                  placeholder="Sinopsis atau keterangan buku..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Tag (pisahkan dengan koma)</label>
                <Input
                  value={(book.tags ?? []).join(", ")}
                  onChange={(e) => updateTags(i, e.target.value)}
                  placeholder="Agribisnis, Teks Kuliah, 2024"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">URL Download PDF</label>
                  <Input value={book.downloadUrl ?? ""} onChange={(e) => updateBook(i, "downloadUrl", e.target.value)} placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">URL Preview / Baca Online</label>
                  <Input value={book.previewUrl ?? ""} onChange={(e) => updateBook(i, "previewUrl", e.target.value)} placeholder="https://..." />
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-300 w-full" onClick={addBook}>
            <Plus className="w-4 h-4" /> Tambah Buku Baru
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LppmManagement() {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [activePageTab, setActivePageTab] = useState<typeof PAGE_TABS[number]["id"]>("penelitian");
  const [lppmContent, setLppmContent] = useState<LppmContent>(DEFAULT_LPPM_CONTENT);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLppmContent(getLppmContent(settings));
  }, [settings]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateSettings("lppmContent", lppmContent);
      toast({ title: "Tersimpan", description: "Konten LPPM berhasil diperbarui." });
    } catch {
      toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Terjadi kesalahan." });
    } finally {
      setIsSaving(false);
    }
  };

  const updatePage = (pageId: PageId, content: LppmPageContent) => {
    setLppmContent((prev) => ({
      ...prev,
      pages: { ...prev.pages, [pageId]: content },
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Kelola Halaman LPPM</h2>
          <p className="text-slate-500 mt-1 text-sm">Edit banner, deskripsi, dan kartu konten untuk setiap halaman LPPM.</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 rounded-xl px-6 h-11 gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
        {PAGE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePageTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activePageTab === tab.id
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activePageTab !== "books" ? (
        <PageEditor
          key={activePageTab}
          pageId={activePageTab as PageId}
          content={lppmContent.pages[activePageTab as PageId]}
          onChange={(c) => updatePage(activePageTab as PageId, c)}
        />
      ) : (
        <BooksEditor
          books={lppmContent.books}
          onChange={(b) => setLppmContent((prev) => ({ ...prev, books: b }))}
        />
      )}
    </div>
  );
}
