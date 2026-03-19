import { MediaBanner } from '../components/MediaBanner';

interface GenericPageTabProps {
  title: string;
}

export function GenericPageTab({ title }: GenericPageTabProps) {
  // Fungsi untuk mendapatkan icon FDE berdasarkan judul halaman
  const getFDEIcons = (pageTitle: string) => {
    const lowerTitle = pageTitle.toLowerCase();
    
    // Fakultas
    if (lowerTitle.includes('pertanian') || lowerTitle.includes('agri')) return { left: '🌱', right: '🚜' };
    if (lowerTitle.includes('ekonomi') || lowerTitle.includes('bisnis') || lowerTitle.includes('econ')) return { left: '📈', right: '💰' };
    if (lowerTitle.includes('kehutanan') || lowerTitle.includes('forest')) return { left: '🌲', right: '🍃' };
    if (lowerTitle.includes('mipa') || lowerTitle.includes('sains') || lowerTitle.includes('science')) return { left: '🧪', right: '🔬' };
    if (lowerTitle.includes('pascasarjana') || lowerTitle.includes('grad')) return { left: '🎓', right: '🏛️' };
    
    // LPPM / Penelitian
    if (lowerTitle.includes('lppm') || lowerTitle.includes('penelitian') || lowerTitle.includes('research')) return { left: '🔍', right: '📊' };
    if (lowerTitle.includes('pengabdian')) return { left: '🤝', right: '🏠' };
    if (lowerTitle.includes('inovasi')) return { left: '💡', right: '🚀' };
    if (lowerTitle.includes('haki')) return { left: '📜', right: '⚖️' };
    if (lowerTitle.includes('buku') || lowerTitle.includes('books')) return { left: '📚', right: '✍️' };
    
    // Layanan
    if (lowerTitle.includes('simak') || lowerTitle.includes('akademik')) return { left: '💻', right: '📅' };
    if (lowerTitle.includes('beasiswa')) return { left: '✨', right: '🎁' };
    if (lowerTitle.includes('karir') || lowerTitle.includes('alumni')) return { left: '💼', right: '🎓' };
    if (lowerTitle.includes('sdm')) return { left: '👥', right: '⚙️' };
    if (lowerTitle.includes('jurnal') || lowerTitle.includes('repository')) return { left: '📖', right: '🌐' };
    
    // Default
    return { left: '🎓', right: '✨' };
  };

  const icons = getFDEIcons(title);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#111] transition-colors duration-500 animate-fade-in">
      {/* Header Halaman - Judul di posisi atas (bukan overlay) */}
      <section className="px-6 md:px-12 pt-16 md:pt-24 pb-12 text-center relative overflow-hidden">
        {/* Floating decorative elements (FDE) */}
        <div className="absolute top-10 left-[10%] md:left-[20%] z-10 animate-float pointer-events-none">
          <div className="glass-element w-10 h-10 md:w-14 md:h-14 bg-emerald-500/20 flex items-center justify-center text-xl md:text-3xl shadow-xl">{icons.left}</div>
        </div>
        <div className="absolute top-4 right-[12%] md:right-[22%] z-10 animate-float-slow pointer-events-none">
          <div className="glass-element w-8 h-8 md:w-12 md:h-12 bg-white/10 flex items-center justify-center text-lg md:text-2xl shadow-xl">{icons.right}</div>
        </div>

        <div className="relative z-20">
          <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white uppercase tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {title}
          </h1>
          <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-in fade-in slide-in-from-left-4 duration-700 delay-300" />
        </div>
      </section>

      {/* Banner Landscape - Menggunakan MediaBanner seperti di Halaman Daftar */}
      <section className="px-6 md:px-12 pb-6">
        <div className="relative mb-12">
          <MediaBanner items={[
            { type: 'image', url: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1523050853064-8521a3998af7?auto=format&fit=crop&q=80' }
          ]} />
        </div>
      </section>

      {/* Konten Halaman (Placeholder) */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8 transition-colors duration-500">
            Halaman ini sedang dalam pengembangan. Segera hadir konten informasi lengkap mengenai {title} Universitas Nusa Bangsa.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 border border-black/5 dark:border-white/5 rounded-[35px] bg-gray-50/50 dark:bg-white/5 transition-colors duration-500 group hover:border-emerald-500/30 hover:shadow-2xl">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full" />
                </div>
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-full w-3/4 mx-auto mb-3 transition-colors duration-500" />
                <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-full w-1/2 mx-auto transition-colors duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
