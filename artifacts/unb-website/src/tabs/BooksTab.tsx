import { useState, useMemo } from "react";
import { MediaBanner } from "../components/MediaBanner";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Eye, BookOpen, Tag, Search } from "lucide-react";
import { DEFAULT_LPPM_CONTENT, type BookItem } from "./LppmPageTab";

export function BooksTab() {
  const { settings } = useSettings();
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const content = useMemo(() => {
    const saved = (settings as any).lppmContent;
    const books: BookItem[] = Array.isArray(saved?.books) ? (saved.books as BookItem[]) : DEFAULT_LPPM_CONTENT.books;
    return {
      banner: saved?.booksBanner ?? DEFAULT_LPPM_CONTENT.pages.penelitian.banner,
      description: (saved?.booksDescription as string | undefined) ?? "UNB Press menerbitkan karya-karya ilmiah, buku teks, dan modul ajar dari para akademisi Universitas Nusa Bangsa. Semua terbitan tersedia dalam format cetak dan digital untuk mendukung kemajuan ilmu pengetahuan.",
      books,
    };
  }, [settings]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    content.books.forEach((b: BookItem) => b.tags?.forEach((t: string) => set.add(t)));
    return Array.from(set);
  }, [content.books]);

  const filtered = useMemo(() => {
    return content.books.filter((b: BookItem) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.description ?? "").toLowerCase().includes(q);
      const matchTag = !activeTag || b.tags?.includes(activeTag);
      return matchSearch && matchTag;
    });
  }, [content.books, searchQuery, activeTag]);

  return (
    <div className="animate-fade-in bg-white dark:bg-[#151515] transition-colors duration-500">
      <section className="px-6 md:px-12 pt-10 pb-0">
        <MediaBanner items={content.banner} />
        <div className="mt-10 text-center">
          <p className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em]">
            LPPM — Universitas Nusa Bangsa
          </p>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500 mt-3">
            Terbitan Buku
          </h2>
        </div>
        <div className="mt-8 max-w-2xl mx-auto text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
            {content.description}
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-10">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul, penulis, atau kata kunci..."
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-medium placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors ${
                !activeTag
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-white/5 text-gray-400 border-white/10 hover:border-emerald-500/30"
              }`}
            >
              Semua
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors ${
                  activeTag === tag
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white/5 text-gray-400 border-white/10 hover:border-emerald-500/30"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-[30px] border border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center py-20 px-8 text-center">
            <BookOpen className="w-12 h-12 text-emerald-500/40 mb-4" />
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">
              {content.books.length === 0 ? "Belum ada buku" : "Buku tidak ditemukan"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {filtered.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[3/4] rounded-[18px] overflow-hidden bg-emerald-900/20 border border-white/10 shadow-xl group-hover:border-emerald-500/40 transition-all duration-300 mb-3">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                      <BookOpen className="w-10 h-10 text-emerald-500/40 mb-2" />
                      <p className="text-[9px] text-gray-500 text-center font-bold leading-tight">{book.title}</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 gap-2">
                    {book.previewUrl && (
                      <a
                        href={book.previewUrl}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye size={10} />
                        Lihat
                      </a>
                    )}
                    {book.downloadUrl && (
                      <a
                        href={book.downloadUrl}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download size={10} />
                        Unduh
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-[10px] font-black italic uppercase text-white leading-snug line-clamp-2 group-hover:text-emerald-400 transition-colors duration-300 mb-1">
                  {book.title}
                </p>
                <p className="text-[9px] text-gray-400 font-bold leading-snug line-clamp-1">{book.author}</p>
                {book.year && (
                  <p className="text-[8px] text-gray-500 font-bold mt-0.5">{book.publisher ?? "UNB Press"} · {book.year}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <Dialog open={!!selectedBook} onOpenChange={(o) => !o && setSelectedBook(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border border-white/10 text-white">
          {selectedBook && (
            <>
              <DialogHeader>
                <div className="flex gap-5 mb-4">
                  <div className="w-24 h-32 rounded-xl overflow-hidden bg-emerald-900/20 border border-white/10 shrink-0">
                    {selectedBook.coverUrl ? (
                      <img src={selectedBook.coverUrl} alt={selectedBook.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-emerald-500/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-base font-black italic uppercase leading-snug text-white mb-2">
                      {selectedBook.title}
                    </DialogTitle>
                    <p className="text-[11px] text-emerald-400 font-bold mb-1">{selectedBook.author}</p>
                    {selectedBook.publisher && (
                      <p className="text-[10px] text-gray-400 font-bold">{selectedBook.publisher}</p>
                    )}
                    {selectedBook.year && (
                      <p className="text-[10px] text-gray-400 font-bold">Tahun Terbit: {selectedBook.year}</p>
                    )}
                    {selectedBook.isbn && (
                      <p className="text-[10px] text-gray-400 font-bold mt-1">ISBN: {selectedBook.isbn}</p>
                    )}
                  </div>
                </div>
              </DialogHeader>

              {selectedBook.description && (
                <p className="text-sm text-gray-300 leading-relaxed font-medium mb-4">
                  {selectedBook.description}
                </p>
              )}

              {selectedBook.tags && selectedBook.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {selectedBook.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-[9px] text-gray-400 font-bold bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                      <Tag size={8} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                {selectedBook.previewUrl && (
                  <a
                    href={selectedBook.previewUrl}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye size={14} strokeWidth={3} />
                    Baca Online
                  </a>
                )}
                {selectedBook.downloadUrl && (
                  <a
                    href={selectedBook.downloadUrl}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download size={14} strokeWidth={3} />
                    Unduh PDF
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
