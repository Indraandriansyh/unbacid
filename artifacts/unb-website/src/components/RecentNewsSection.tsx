import { useState, useEffect, useMemo } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { ArrowRight, Calendar } from "lucide-react";
import type { NewsPost } from "@/tabs/NewsTab";

interface RecentNewsSectionProps {
  onOpenNews?: (post: NewsPost) => void;
  setActiveTab?: (tab: string) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  } catch { return iso; }
}

export function RecentNewsSection({ onOpenNews, setActiveTab }: RecentNewsSectionProps) {
  const { settings } = useSettings();

  const allPosts = useMemo<NewsPost[]>(() => {
    const raw = (settings as any).newsContent;
    if (!raw || !Array.isArray(raw.posts) || raw.posts.length === 0) return [];
    return [...raw.posts].sort((a: NewsPost, b: NewsPost) =>
      String(b.publishedAt).localeCompare(String(a.publishedAt))
    );
  }, [settings]);

  const [displayed, setDisplayed] = useState<NewsPost[]>([]);

  const pickRandom = (posts: NewsPost[]) => shuffle(posts).slice(0, 3);

  useEffect(() => {
    if (allPosts.length === 0) return;
    setDisplayed(pickRandom(allPosts));
    const interval = setInterval(() => {
      setDisplayed(pickRandom(allPosts));
    }, 30000);
    return () => clearInterval(interval);
  }, [allPosts]);

  if (displayed.length === 0) return null;

  return (
    <section className="px-6 md:px-10 pb-20 pt-4">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-emerald-500 mb-2">INFORMASI KAMPUS</p>
          <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500">
            Berita Terkini
          </h2>
        </div>
        {setActiveTab && (
          <button
            onClick={() => setActiveTab("blog")}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition"
          >
            Lihat Semua <ArrowRight size={14} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayed.map((post) => (
          <article
            key={post.id}
            className="group cursor-pointer rounded-3xl overflow-hidden border border-black/5 dark:border-white/5 bg-white dark:bg-[#1a1a1a] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            onClick={() => onOpenNews ? onOpenNews(post) : setActiveTab?.("blog")}
          >
            <div className="aspect-[16/9] overflow-hidden relative">
              <img
                src={post.bannerUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=600"; }}
              />
              <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                {post.category}
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-2">
                <Calendar size={10} />
                {formatDate(post.publishedAt)}
              </div>
              <h3 className="font-black text-sm leading-snug text-black dark:text-white line-clamp-2 mb-2 transition-colors duration-500 group-hover:text-emerald-500">
                {post.title}
              </h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
