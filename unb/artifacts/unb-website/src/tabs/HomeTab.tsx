import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';
import type { TabType } from '../types';
import { MediaBanner } from '../components/MediaBanner';

interface HomeTabProps {
  setActiveTab: (tab: TabType) => void;
  openDetail: (src: string) => void;
}

export function HomeTab({ setActiveTab, openDetail }: HomeTabProps) {
  const { t } = useLanguage();
  const { settings } = useSettings();

  // Content priority: Database -> Translations -> Default
  const dbHomeContent = settings.homeContent;
  
  const homeContent = {
    hero: {
      welcome: dbHomeContent?.hero?.welcome || "#WELCOMETO",
      title: dbHomeContent?.hero?.title || "NUSA BANGSA UNIVERSITY",
      subtitle1: dbHomeContent?.hero?.subtitle1 || t.hero.subtitle1,
      subtitle2: dbHomeContent?.hero?.subtitle2 || t.hero.subtitle2,
      accreditation: dbHomeContent?.hero?.accreditation || t.hero.accred,
      programs: dbHomeContent?.hero?.programs || t.hero.program,
      buttonText: dbHomeContent?.hero?.buttonText || t.hero.explore
    },
    banners: dbHomeContent?.banners || [
      { type: 'image' as const, url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200' },
      { type: 'image' as const, url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200' },
      { type: 'video' as const, url: 'https://v.ftcdn.net/06/08/54/12/700_F_608541243_m33xYF6f22UeO1l6C2uI2G7w4X0E1X2T_ST.mp4' },
      { type: 'image' as const, url: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200' },
    ],
    gridItems: dbHomeContent?.gridItems || [
      { type: 'image', url: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200' }
    ],
    cta: {
      heading1: dbHomeContent?.cta?.heading1 || t.cta.heading1,
      heading2: dbHomeContent?.cta?.heading2 || t.cta.heading2,
      heading3: dbHomeContent?.cta?.heading3 || t.cta.heading3,
      description: dbHomeContent?.cta?.description || t.cta.desc,
      features: [
        { title: dbHomeContent?.cta?.features?.[0]?.title || t.cta.f1title, desc: dbHomeContent?.cta?.features?.[0]?.desc || t.cta.f1desc },
        { title: dbHomeContent?.cta?.features?.[1]?.title || t.cta.f2title, desc: dbHomeContent?.cta?.features?.[1]?.desc || t.cta.f2desc },
        { title: dbHomeContent?.cta?.features?.[2]?.title || t.cta.f3title, desc: dbHomeContent?.cta?.features?.[2]?.desc || t.cta.f3desc }
      ],
      cardImage: dbHomeContent?.cta?.cardImage || 'https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=800',
      statStudents: dbHomeContent?.cta?.statStudents || "15,000+",
      statCampus: dbHomeContent?.cta?.statCampus || t.hero.stat2
    }
  };

  const BANNER_ITEMS = homeContent.banners;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="px-4 md:px-6 pt-12 md:pt-20 pb-12 relative flex flex-col items-center">
        <div className="w-full text-center relative z-10 px-4">
          {/* Floating decorative elements */}
          <div className="absolute -top-10 left-[5%] md:left-[15%] z-20 animate-float">
            <div className="glass-element w-12 h-12 md:w-16 md:h-16 bg-emerald-500/25 flex items-center justify-center text-2xl md:text-4xl shadow-xl">🎓</div>
          </div>
          <div className="absolute top-0 right-[8%] md:right-[18%] z-20 animate-float-slow">
            <div className="glass-element w-10 h-10 md:w-14 md:h-14 bg-white/10 flex items-center justify-center text-xl md:text-3xl shadow-xl">💡</div>
          </div>
          <div className="absolute top-[80px] md:top-[125px] left-[18%] md:left-[24%] z-20 animate-float-plane">
            <div className="glass-element w-12 h-12 md:w-16 md:h-16 bg-emerald-500/20 flex items-center justify-center text-2xl md:text-4xl shadow-2xl shadow-emerald-500/30">🌱</div>
          </div>

          {/* Main heading — #WELCOMETO / NUSA BANGSA / UNIVERSITY */}
          <h1 className="hero-heading font-black uppercase italic relative z-10 px-2 transition-colors duration-500">
            <span className="text-outline block mb-2 md:mb-4">{homeContent.hero.welcome}</span>
            <span className="text-black dark:text-white transition-colors duration-500">{homeContent.hero.title}</span>
          </h1>

          {/* Sub info + Explore button */}
          <div className="mt-12 md:mt-20 flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl mx-auto gap-8 md:gap-10 transition-colors duration-500">
            <div className="text-[8px] md:text-[9px] uppercase font-bold tracking-[0.2em] text-gray-500 dark:text-gray-400 leading-relaxed text-center sm:text-left transition-colors duration-500">
              {homeContent.hero.subtitle1}<br />
              {homeContent.hero.subtitle2}<br />
              <span className="text-black dark:text-white text-[10px] md:text-xs transition-colors duration-500">{homeContent.hero.accreditation}</span><br />
              <span className="text-black dark:text-white text-[10px] md:text-xs transition-colors duration-500">{homeContent.hero.programs}</span>
            </div>
            <button
              onClick={() => setActiveTab('fakultas')}
              className="w-full sm:w-auto bg-transparent border border-black/20 dark:border-white/30 rounded-full px-8 md:px-10 py-3 md:py-4 flex items-center justify-center gap-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-black dark:text-white hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all group duration-500"
            >
              {homeContent.hero.buttonText}
              <div className="bg-black dark:bg-white text-white dark:text-black rounded-full p-1 md:p-1.5 group-hover:bg-white dark:group-hover:bg-black group-hover:text-black dark:group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
            </button>
          </div>

          {/* New Landscape Media Banner */}
          <div className="max-w-5xl mx-auto w-full px-2 md:px-4">
            <MediaBanner items={BANNER_ITEMS} className="mt-16 md:mt-24" />
          </div>
        </div>

        {/* Images Grid — clicking opens popup detail */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mt-16 md:mt-24 w-full px-2 md:px-4 max-w-5xl">
          {homeContent.gridItems.map((item: any, idx: number) => (
            <div
              key={idx}
              className={cn(
                "rounded-[20px] md:rounded-[35px] overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-lg cursor-pointer group relative transition-colors duration-500",
                idx === 1 ? "aspect-[3/5.5] -mt-8 md:-mt-16 border-2 border-emerald-500/40 z-10 shadow-2xl" : "aspect-[3/4.5]"
              )}
              onClick={() => openDetail(item.url)}
            >
              <img
                src={item.url}
                className={cn(
                  "w-full h-full object-cover group-hover:scale-105 transition duration-700",
                  idx !== 1 && "grayscale group-hover:grayscale-0"
                )}
                alt={`Media ${idx + 1}`}
              />
              <div className="absolute inset-0 flex items-end justify-center pb-4">
                <span className="text-white text-[8px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-3 py-1 rounded-full">🔍 Lihat Detail</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section — PENERIMAAN MAHASISWA BARU */}
      <section className="px-6 md:px-10 pb-20 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start bg-card p-8 md:p-12 rounded-[40px] border border-border shadow-2xl relative overflow-hidden transition-colors duration-500">
          {/* Background glow */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          {/* Left: Text content */}
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6">
              <span className="text-outline block mb-2">{homeContent.cta.heading1}</span>
              <span className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] block">{homeContent.cta.heading2}</span>
              <span className="text-white block transition-colors duration-500">{homeContent.cta.heading3}</span>
            </h2>
            <p className="text-[9px] md:text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-8 leading-relaxed">
              {homeContent.cta.description}
            </p>

            <div className="space-y-5 mb-8">
              {homeContent.cta.features.map((feature: any, idx: number) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-500">
                    {idx === 0 && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>}
                    {idx === 1 && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>}
                    {idx === 2 && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>}
                  </div>
                  <div>
                    <h4 className="text-sm font-black italic uppercase text-white mb-1 transition-colors duration-500">{feature.title}</h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase leading-relaxed transition-colors duration-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('pendaftaran')}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-3"
            >
              {t.cta.btn}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>

          {/* Right: Image with floating stats INSIDE the container */}
          <div className="relative w-full mx-auto mt-4 lg:mt-0" style={{ maxWidth: 380 }}>
            {/* Main image */}
            <div
              className="w-full aspect-square rounded-[40px] overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#0d0d0d] shadow-2xl cursor-pointer group transition-colors duration-500"
              onClick={() => openDetail(homeContent.cta.cardImage)}
            >
              <img
                src={homeContent.cta.cardImage}
                className="w-full h-full object-cover opacity-70 mix-blend-multiply dark:mix-blend-lighten group-hover:scale-105 transition duration-700"
                alt="Admission"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent mix-blend-overlay pointer-events-none"></div>
            </div>

            {/* Floating badge 1 — students count */}
            <div className="absolute top-4 left-4 glass-element bg-white/70 dark:bg-black/70 border border-black/10 dark:border-white/10 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl animate-float transition-colors duration-500">
              <h4 className="text-2xl md:text-3xl font-black italic text-emerald-500 tracking-tighter drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                {homeContent.cta.statStudents.split(' ')[0]}
              </h4>
              <p className="text-[8px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest mt-0.5 transition-colors duration-500">
                {homeContent.cta.statStudents.split(' ').slice(1).join(' ') || t.hero.stat1}
              </p>
            </div>

            {/* Floating badge 2 — rating */}
            <div className="absolute bottom-4 right-4 glass-element bg-white/70 dark:bg-black/70 border border-black/10 dark:border-white/10 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl flex flex-col items-center animate-float-slow transition-colors duration-500">
              <div className="flex gap-0.5 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ))}
              </div>
              <p className="text-[8px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest mt-1 transition-colors duration-500">{homeContent.cta.statCampus}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
