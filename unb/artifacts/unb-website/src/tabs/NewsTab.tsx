import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { MediaBanner } from "@/components/MediaBanner";
import { ArrowLeft, Calendar, User, Search, ChevronLeft, ChevronRight, X, Filter } from "lucide-react";

export type NewsBlock =
  | { id: string; type: "heading"; text: string }
  | { id: string; type: "subheading"; text: string }
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "image"; url: string; caption?: string }
  | { id: string; type: "link"; label: string; url: string };

export type NewsPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  bannerUrl: string;
  author: string;
  publishedAt: string;
  blocks: NewsBlock[];
  prodiId?: string;
};

export type NewsContent = {
  categories: string[];
  posts: NewsPost[];
};

export const DEFAULT_NEWS_CONTENT: NewsContent = {
  categories: ["Konferensi", "Prestasi", "Fasilitas", "Akademik"],
  posts: [
    {
      id: "news-1",
      slug: "unb-gelar-konferensi-internasional-lingkungan-2024",
      title: "UNB Gelar Konferensi Internasional Lingkungan 2024",
      excerpt:
        "Universitas Nusa Bangsa sukses menyelenggarakan konferensi internasional bertema pengelolaan lingkungan hidup berkelanjutan yang dihadiri oleh pakar dari 15 negara.",
      category: "Konferensi",
      bannerUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
      author: "Humas UNB",
      publishedAt: "2024-10-12",
      blocks: [
        { id: "b1", type: "heading", text: "Konferensi Internasional Lingkungan 2024" },
        {
          id: "b2",
          type: "paragraph",
          text: "Universitas Nusa Bangsa sukses menyelenggarakan konferensi internasional bertema pengelolaan lingkungan hidup berkelanjutan yang dihadiri oleh pakar dari 15 negara.",
        },
        { id: "b3", type: "subheading", text: "Agenda Utama" },
        {
          id: "b4",
          type: "paragraph",
          text: "Kegiatan meliputi sesi plenary, panel diskusi, dan presentasi paper dari peneliti lintas negara.",
        },
      ],
    },
    {
      id: "news-2",
      slug: "mahasiswa-fakultas-kehutanan-raih-medali-emas-pimnas",
      title: "Mahasiswa Fakultas Kehutanan Raih Medali Emas PIMNAS",
      excerpt:
        "Tim mahasiswa UNB berhasil meraih medali emas dalam Pekan Ilmiah Mahasiswa Nasional (PIMNAS) melalui penelitian inovatif di bidang konservasi sumber daya hutan.",
      category: "Prestasi",
      bannerUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
      author: "Humas UNB",
      publishedAt: "2024-10-05",
      blocks: [
        { id: "p1", type: "heading", text: "Prestasi Mahasiswa UNB di PIMNAS" },
        { id: "p2", type: "paragraph", text: "Tim mahasiswa UNB berhasil meraih medali emas dalam PIMNAS." },
      ],
    },
    {
      id: "news-3",
      slug: "peresmian-laboratorium-terpadu-berbasis-smart-campus",
      title: "Peresmian Laboratorium Terpadu Berbasis Smart Campus",
      excerpt:
        "UNB resmi membuka laboratorium terpadu berteknologi tinggi sebagai wujud komitmen menyediakan fasilitas riset berstandar internasional.",
      category: "Fasilitas",
      bannerUrl: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
      author: "Humas UNB",
      publishedAt: "2024-09-28",
      blocks: [
        { id: "f1", type: "heading", text: "Laboratorium Terpadu Smart Campus" },
        { id: "f2", type: "paragraph", text: "UNB resmi membuka laboratorium terpadu berteknologi tinggi." },
      ],
    },
  ],
};

const POSTS_PER_PAGE = 9;

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function getYear(iso: string) {
  try { return new Date(iso).getFullYear(); } catch { return null; }
}
function getMonth(iso: string) {
  try { return new Date(iso).getMonth(); } catch { return null; }
}

const MONTH_NAMES = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

export function NewsTab() {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filters & pagination
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [filterYear, setFilterYear] = useState<string>("");
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [page, setPage] = useState(1);

  const content = useMemo<NewsContent>(() => {
    const raw = (settings as any).newsContent;
    if (!raw || typeof raw !== "object") return DEFAULT_NEWS_CONTENT;
    const posts = Array.isArray(raw.posts) ? raw.posts : DEFAULT_NEWS_CONTENT.posts;
    const categories = Array.isArray(raw.categories) ? raw.categories : DEFAULT_NEWS_CONTENT.categories;
    return { categories, posts };
  }, [settings]);

  const postsSorted = useMemo(() => {
    return [...content.posts].sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
  }, [content.posts]);

  // Available years from posts
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    postsSorted.forEach(p => { const y = getYear(p.publishedAt); if (y) years.add(y); });
    return Array.from(years).sort((a, b) => b - a);
  }, [postsSorted]);

  // Available months for selected year
  const availableMonths = useMemo(() => {
    if (!filterYear) return [];
    const months = new Set<number>();
    postsSorted.forEach(p => {
      if (String(getYear(p.publishedAt)) === filterYear) {
        const m = getMonth(p.publishedAt);
        if (m !== null) months.add(m);
      }
    });
    return Array.from(months).sort((a, b) => a - b);
  }, [postsSorted, filterYear]);

  // Filtered posts
  const filtered = useMemo(() => {
    let result = postsSorted.filter(p => !p.prodiId);
    if (activeCategory !== "Semua") result = result.filter(p => p.category === activeCategory);
    if (filterYear) result = result.filter(p => String(getYear(p.publishedAt)) === filterYear);
    if (filterMonth !== "") result = result.filter(p => String(getMonth(p.publishedAt)) === filterMonth);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
    }
    return result;
  }, [postsSorted, activeCategory, filterYear, filterMonth, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE);

  const resetFilters = () => {
    setSearch(""); setActiveCategory("Semua"); setFilterYear(""); setFilterMonth(""); setPage(1);
  };
  const hasActiveFilters = search || activeCategory !== "Semua" || filterYear || filterMonth !== "";

  const goPage = (n: number) => { setPage(Math.max(1, Math.min(n, totalPages))); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const selectedPost = useMemo(() => {
    if (!selectedId) return null;
    return postsSorted.find((p) => p.id === selectedId) ?? null;
  }, [postsSorted, selectedId]);

  // ---- Detail View ----
  if (selectedPost) {
    return (
      <div className="animate-fade-in">
        <section className="px-6 md:px-12 py-10">
          <button
            onClick={() => setSelectedId(null)}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={3} />
            Kembali
          </button>
        </section>

        <section className="px-6 md:px-12 pb-6">
          <div className="relative mb-10">
            <MediaBanner items={[{ type: "image", url: selectedPost.bannerUrl }]} />
          </div>
        </section>

        <section className="px-6 md:px-12 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                {selectedPost.category}
              </span>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                <Calendar size={14} strokeWidth={2.5} />
                {formatDate(selectedPost.publishedAt)}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                <User size={14} strokeWidth={2.5} />
                {selectedPost.author}
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tight text-black dark:text-white transition-colors duration-500 mb-6">
              {selectedPost.title}
            </h1>

            <div className="space-y-6">
              {selectedPost.blocks.map((block) => {
                if (block.type === "heading") return (
                  <h2 key={block.id} className="text-xl md:text-2xl font-black italic uppercase text-black dark:text-white transition-colors duration-500">{block.text}</h2>
                );
                if (block.type === "subheading") return (
                  <h3 key={block.id} className="text-lg md:text-xl font-black italic uppercase text-emerald-500">{block.text}</h3>
                );
                if (block.type === "paragraph") return (
                  <p key={block.id} className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{block.text}</p>
                );
                if (block.type === "image") return (
                  <div key={block.id} className="rounded-[30px] overflow-hidden border border-black/5 dark:border-white/10">
                    <img src={block.url} alt={block.caption ?? ""} className="w-full h-auto object-cover" />
                    {block.caption ? <div className="p-4 text-[11px] text-gray-500 dark:text-gray-400 font-bold">{block.caption}</div> : null}
                  </div>
                );
                if (block.type === "link") return (
                  <a key={block.id} href={block.url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">
                    {block.label}
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                );
                return null;
              })}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ---- List View ----
  return (
    <div className="animate-fade-in">
      <section className="px-6 md:px-12 py-16">

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500">{t.news.title}</h2>
          <p className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em] mt-2">{t.news.subtitle}</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berita..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
          />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {["Semua", ...content.categories].map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${
                  activeCategory === cat
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-transparent text-gray-500 dark:text-gray-400 border-black/15 dark:border-white/15 hover:border-emerald-500 hover:text-emerald-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Date Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <select
              value={filterYear}
              onChange={e => { setFilterYear(e.target.value); setFilterMonth(""); setPage(1); }}
              className="text-[10px] font-bold bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
            >
              <option value="">Semua Tahun</option>
              {availableYears.map(y => <option key={y} value={String(y)}>{y}</option>)}
            </select>

            {filterYear && (
              <select
                value={filterMonth}
                onChange={e => { setFilterMonth(e.target.value); setPage(1); }}
                className="text-[10px] font-bold bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
              >
                <option value="">Semua Bulan</option>
                {availableMonths.map(m => <option key={m} value={String(m)}>{MONTH_NAMES[m]}</option>)}
              </select>
            )}

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Result Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {filtered.length === 0 ? "Tidak ada berita" : `${filtered.length} berita ditemukan`}
            {hasActiveFilters && " · filter aktif"}
          </p>
          {totalPages > 1 && (
            <p className="text-[10px] text-gray-400 font-bold">
              Halaman {safePage} dari {totalPages}
            </p>
          )}
        </div>

        {/* News Grid */}
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Search className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-bold text-gray-400">Tidak ada berita yang cocok dengan pencarian kamu.</p>
            <button onClick={resetFilters} className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">
              Tampilkan semua berita
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {paginated.map((news) => (
              <div key={news.id} className="blog-card group cursor-pointer shadow-xl" onClick={() => setSelectedId(news.id)}>
                <div className="relative aspect-video overflow-hidden">
                  {news.bannerUrl ? (
                    <img
                      src={news.bannerUrl}
                      alt={news.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition duration-700"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-slate-800 flex items-center justify-center">
                      <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">UNB</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                      {news.category.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[9px] text-emerald-500/60 font-bold uppercase tracking-widest mb-3">{formatDate(news.publishedAt)}</p>
                  <h3 className="font-black italic uppercase text-base mb-3 leading-snug text-white group-hover:text-emerald-400 transition-colors duration-500 line-clamp-3">{news.title}</h3>
                  <p className="text-[10px] text-gray-300 font-bold leading-relaxed line-clamp-3">{news.excerpt}</p>
                  <button
                    className="mt-5 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedId(news.id); }}
                  >
                    {t.news.readMore}
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16">
            <button
              onClick={() => goPage(safePage - 1)}
              disabled={safePage === 1}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-black/10 dark:border-white/10 text-gray-400 hover:border-emerald-500 hover:text-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - safePage) <= 2)
              .reduce<(number | "...")[]>((acc, n, i, arr) => {
                if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(n);
                return acc;
              }, [])
              .map((item, i) =>
                item === "..." ? (
                  <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-[10px] text-gray-400 font-bold">···</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => goPage(item as number)}
                    className={`w-9 h-9 rounded-full text-[11px] font-black transition-all border ${
                      safePage === item
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "border-black/10 dark:border-white/10 text-gray-400 hover:border-emerald-500 hover:text-emerald-500"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => goPage(safePage + 1)}
              disabled={safePage === totalPages}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-black/10 dark:border-white/10 text-gray-400 hover:border-emerald-500 hover:text-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </section>
    </div>
  );
}
