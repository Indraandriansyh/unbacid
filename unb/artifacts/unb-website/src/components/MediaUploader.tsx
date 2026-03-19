import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Upload, Loader2, ImageIcon, VideoIcon } from "lucide-react";

export type MediaItem = { type: "image" | "video"; url: string };

interface MediaUploaderProps {
  item: MediaItem;
  index: number;
  onUpdate: (field: keyof MediaItem, value: string) => void;
  onRemove: () => void;
}

export function MediaItemRow({ item, index, onUpdate, onRemove }: MediaUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Upload gagal.");
      }
      const data = await res.json();
      const isVideo = /\.(mp4|webm|mov)$/i.test(file.name);
      onUpdate("type", isVideo ? "video" : "image");
      onUpdate("url", data.url);
    } catch (err: any) {
      setError(err.message ?? "Upload gagal.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const isImage = item.type === "image";
  const isVideo = item.type === "video";
  const hasUrl = !!item.url;

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-2">
      <div className="flex gap-2 items-center">
        <select
          value={item.type}
          onChange={e => onUpdate("type", e.target.value)}
          className="border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shrink-0"
        >
          <option value="image">🖼️ Gambar</option>
          <option value="video">🎥 Video</option>
        </select>

        <Input
          value={item.url}
          onChange={e => onUpdate("url", e.target.value)}
          placeholder="https://... atau upload dari komputer"
          className="flex-1 text-sm"
        />

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Upload dari komputer"
          className="shrink-0 border-emerald-300 text-emerald-600 hover:bg-emerald-50"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-red-400 hover:text-red-600 shrink-0"
          onClick={onRemove}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {error && <p className="text-xs text-red-500 pl-1">{error}</p>}

      {hasUrl && isImage && (
        <img
          src={item.url}
          alt={`preview ${index + 1}`}
          className="h-24 w-full object-cover rounded-lg border border-slate-200 dark:border-slate-700"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          onLoad={e => { (e.target as HTMLImageElement).style.display = "block"; }}
        />
      )}
      {hasUrl && isVideo && (
        <div className="flex items-center gap-2 px-2 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <VideoIcon className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 truncate">{item.url}</span>
        </div>
      )}
    </div>
  );
}
