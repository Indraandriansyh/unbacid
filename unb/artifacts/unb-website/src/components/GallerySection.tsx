import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { X, Play } from "lucide-react";

export type GalleryItem = {
  id: string;
  imageUrl: string;
  caption?: string;
  mediaType?: "image" | "video";
};

export type GalleryContent = {
  items: GalleryItem[];
};

export const DEFAULT_GALLERY: GalleryContent = { items: [] };

export function isVideo(item: GalleryItem): boolean {
  if (item.mediaType === "video") return true;
  if (item.mediaType === "image") return false;
  const url = item.imageUrl.toLowerCase().split("?")[0];
  return /\.(mp4|webm|ogg|mov|avi|mkv)$/.test(url);
}

export function GallerySection() {
  const { settings } = useSettings();
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const gallery: GalleryContent = (() => {
    const raw = (settings as any).galleryContent;
    if (!raw || !Array.isArray(raw.items)) return DEFAULT_GALLERY;
    return raw as GalleryContent;
  })();

  if (gallery.items.length === 0) return null;

  return (
    <section className="px-6 md:px-10 pb-16 pt-4">
      <div className="mb-8 text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-emerald-500 mb-2">DOKUMENTASI</p>
        <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500">
          Galeri Kegiatan
        </h2>
      </div>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {gallery.items.map((item) => (
          <div
            key={item.id}
            className="break-inside-avoid cursor-pointer group rounded-2xl overflow-hidden relative"
            onClick={() => setLightbox(item)}
          >
            {isVideo(item) ? (
              <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
                <video
                  src={item.imageUrl}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                  <Play size={32} className="text-white drop-shadow-lg" fill="white" />
                </div>
              </div>
            ) : (
              <img
                src={item.imageUrl}
                alt={item.caption || "Galeri UNB"}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=400"; }}
              />
            )}
            {item.caption && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 rounded-2xl">
                <p className="text-white text-[10px] font-bold uppercase tracking-widest leading-tight">{item.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
            onClick={() => setLightbox(null)}
          >
            <X size={20} />
          </button>
          {isVideo(lightbox) ? (
            <video
              src={lightbox.imageUrl}
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl"
              controls
              autoPlay
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={lightbox.imageUrl}
              alt={lightbox.caption || ""}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          {lightbox.caption && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-xs font-bold uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full">
              {lightbox.caption}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
