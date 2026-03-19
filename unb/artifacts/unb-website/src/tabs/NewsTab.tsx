import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { MediaBanner } from "@/components/MediaBanner";
import { ArrowLeft, Calendar, User } from "lucide-react";

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
          text: "Kegiatan meliputi sesi plenary, panel diskusi, dan presentasi paper dari peneliti lintas negara. Konferensi ini menjadi ruang kolaborasi antara akademisi, pemerintah, industri, dan masyarakat.",
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
        {
          id: "p2",
          type: "paragraph",
          text: "Tim mahasiswa UNB berhasil meraih medali emas dalam Pekan Ilmiah Mahasiswa Nasional (PIMNAS) melalui penelitian inovatif di bidang konservasi sumber daya hutan.",
        },
      ],
    },
    {
      id: "news-3",
      slug: "peresmian-laboratorium-terpadu-berbasis-smart-campus",
      title: "Peresmian Laboratorium Terpadu Berbasis Smart Campus",
      excerpt:
        "UNB resmi membuka laboratorium terpadu berteknologi tinggi sebagai wujud komitmen menyediakan fasilitas riset berstandar internasional bagi sivitas akademika.",
      category: "Fasilitas",
      bannerUrl: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
      author: "Humas UNB",
      publishedAt: "2024-09-28",
      blocks: [
        { id: "f1", type: "heading", text: "Laboratorium Terpadu Smart Campus" },
        {
          id: "f2",
          type: "paragraph",
          text: "UNB resmi membuka laboratorium terpadu berteknologi tinggi sebagai wujud komitmen menyediakan fasilitas riset berstandar internasional bagi sivitas akademika.",
        },
      ],
    },
  ],
};

export function NewsTab() {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const content = useMemo<NewsContent>(() => {
    const raw = (settings as any).newsContent;
    if (!raw || typeof raw !== "object") return DEFAULT_NEWS_CONTENT;
    const posts = Array.isArray(raw.posts) ? raw.posts : DEFAULT_NEWS_CONTENT.posts;
    const categories = Array.isArray(raw.categories) ? raw.categories : DEFAULT_NEWS_CONTENT.categories;
    return { categories, posts };
  }, [settings]);

  const postsSorted = useMemo(() => {
    const posts = [...content.posts];
    posts.sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
    return posts;
  }, [content.posts]);

  const selectedPost = useMemo(() => {
    if (!selectedId) return null;
    return postsSorted.find((p) => p.id === selectedId) ?? null;
  }, [postsSorted, selectedId]);

  const formatDate = (iso: string) => {
    try {
      const dt = new Date(iso);
      return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(dt);
    } catch {
      return iso;
    }
  };

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
                if (block.type === "heading") {
                  return (
                    <h2 key={block.id} className="text-xl md:text-2xl font-black italic uppercase text-black dark:text-white transition-colors duration-500">
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "subheading") {
                  return (
                    <h3 key={block.id} className="text-lg md:text-xl font-black italic uppercase text-emerald-500 transition-colors duration-500">
                      {block.text}
                    </h3>
                  );
                }
                if (block.type === "paragraph") {
                  return (
                    <p key={block.id} className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500 whitespace-pre-line">
                      {block.text}
                    </p>
                  );
                }
                if (block.type === "image") {
                  return (
                    <div key={block.id} className="rounded-[30px] overflow-hidden border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5">
                      <img src={block.url} alt={block.caption ?? ""} className="w-full h-auto object-cover" />
                      {block.caption ? (
                        <div className="p-4 text-[11px] text-gray-500 dark:text-gray-400 font-bold">{block.caption}</div>
                      ) : null}
                    </div>
                  );
                }
                if (block.type === "link") {
                  return (
                    <a
                      key={block.id}
                      href={block.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      {block.label}
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </a>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <section className="px-6 md:px-12 py-16">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500">{t.news.title}</h2>
          <p className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em] mt-2">{t.news.subtitle}</p>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {postsSorted.map((news) => (
            <div key={news.id} className="blog-card group cursor-pointer shadow-xl" onClick={() => setSelectedId(news.id)}>
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={news.bannerUrl}
                  alt={news.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    {news.category.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[9px] text-emerald-500/60 font-bold uppercase tracking-widest mb-3">{formatDate(news.publishedAt)}</p>
                <h3 className="font-black italic uppercase text-base mb-3 leading-snug text-white group-hover:text-emerald-400 transition-colors duration-500">{news.title}</h3>
                <p className="text-[10px] text-gray-300 font-bold leading-relaxed line-clamp-3 transition-colors duration-500">{news.excerpt}</p>
                <button
                  className="mt-5 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(news.id);
                  }}
                >
                  {t.news.readMore}
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
