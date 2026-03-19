import { useState, useRef } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Upload, Image as ImageIcon, Play } from "lucide-react";
import type { GalleryContent, GalleryItem } from "./GallerySection";
import { isVideo } from "./GallerySection";

const DEFAULT_GALLERY: GalleryContent = { items: [] };

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export default function GalleryManagement() {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const gallery: GalleryContent = (() => {
    const raw = (settings as any).galleryContent;
    if (!raw || !Array.isArray(raw.items)) return DEFAULT_GALLERY;
    return raw as GalleryContent;
  })();

  const [items, setItems] = useState<GalleryItem[]>(gallery.items);

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    const newItems: GalleryItem[] = [];

    for (const file of files) {
      const isImg = file.type.startsWith("image/");
      const isVid = file.type.startsWith("video/");
      if (!isImg && !isVid) {
        toast({ title: "File tidak valid", description: `${file.name} bukan gambar atau video.`, variant: "destructive" });
        continue;
      }
      const maxSize = isVid ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({ title: "File terlalu besar", description: `${file.name} melebihi batas ${isVid ? "50 MB" : "5 MB"}.`, variant: "destructive" });
        continue;
      }

      try {
        const token = localStorage.getItem("auth_token");
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/site-settings/upload", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });

        if (!res.ok) throw new Error("Upload gagal");
        const { url } = await res.json();
        newItems.push({
          id: generateId(),
          imageUrl: url,
          caption: "",
          mediaType: isVid ? "video" : "image",
        });
      } catch {
        toast({ title: "Upload gagal", description: file.name, variant: "destructive" });
      }
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      toast({ title: `${newItems.length} file berhasil diunggah` });
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const updateCaption = (id: string, caption: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, caption } : item));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings("galleryContent", { items });
      toast({ title: "Galeri berhasil disimpan" });
    } catch {
      toast({ title: "Gagal menyimpan", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Kelola Galeri Kegiatan</h2>
          <p className="text-slate-500 mt-1">Tambah foto & video kegiatan. Kolom tengah grid homepage akan otomatis menampilkan video dalam format Reels (9:16).</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="rounded-xl px-5 h-11 border-emerald-200 dark:border-emerald-900 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengunggah...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Unggah Foto / Video
              </>
            )}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 rounded-xl px-6 h-11"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-sm text-emerald-700 dark:text-emerald-400">
        <strong>Info:</strong> Foto maks 5 MB · Video maks 50 MB · Format didukung: JPG, PNG, WebP, MP4, WebM. Video yang diunggah akan tampil dengan format Reels (9:16) saat berada di kolom tengah homepage.
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      {items.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-2 border-slate-200 dark:border-slate-700">
          <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-600 dark:text-slate-400">Belum ada foto atau video</p>
              <p className="text-sm text-slate-400 mt-1">Klik "Unggah Foto / Video" untuk menambahkan.</p>
            </div>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="rounded-xl mt-2">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Media
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="rounded-2xl overflow-hidden group relative border border-slate-200 dark:border-slate-700">
              <div className="aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                {isVideo(item) ? (
                  <>
                    <video
                      src={item.imageUrl}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play size={24} className="text-white" fill="white" />
                    </div>
                    <span className="absolute top-2 left-2 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Video</span>
                  </>
                ) : (
                  <img
                    src={item.imageUrl}
                    alt={item.caption || "Galeri"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=400"; }}
                  />
                )}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="p-2">
                <Input
                  value={item.caption || ""}
                  onChange={(e) => updateCaption(item.id, e.target.value)}
                  placeholder="Keterangan (opsional)"
                  className="h-8 text-xs rounded-lg border-slate-200 dark:border-slate-700"
                />
              </div>
            </Card>
          ))}

          <Card
            className="rounded-2xl border-dashed border-2 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-emerald-400 transition-colors aspect-square flex items-center justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors">
              <Plus size={28} />
              <span className="text-xs font-semibold">Tambah Media</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
