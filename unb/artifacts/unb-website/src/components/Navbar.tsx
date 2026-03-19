import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { languages, Language } from '../lib/translations';
import { Sun, Moon, ChevronDown } from 'lucide-react';
import type { TabType } from '../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "./ui/dropdown-menu";

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const [openMobileSubSubmenu, setOpenMobileSubSubmenu] = useState<string | null>(null);

  const navItems: { id: TabType; label: string; children?: { label: string; id: TabType; children?: { label: string; id: TabType }[] }[] }[] = [
    { id: 'home', label: t.nav.home },
    { 
      id: 'tentang', 
      label: t.nav.about,
      children: [
        { label: t.menu.profil, id: 'profil' },
        { 
          label: t.menu.lppm,
          id: 'lppm',
          children: [
            { label: t.menu.penelitian, id: 'penelitian' },
            { label: t.menu.pengabdian, id: 'pengabdian' },
            { label: t.menu.inovasi, id: 'inovasi' },
            { label: t.menu.haki, id: 'haki' },
            { label: t.menu.books, id: 'books' },
            { label: t.menu.seminar, id: 'seminar' },
          ]
        },
        { 
          label: t.menu.lpm,
          id: 'lpm',
          children: [
            { label: t.menu.sop, id: 'sop' },
            { label: t.menu.jobs, id: 'jobs' },
            { label: t.menu.performance, id: 'performance' },
            { label: t.menu.tracer, id: 'tracer' },
            { label: t.menu.spmi, id: 'spmi' },
          ]
        },
        { label: t.menu.ejournal, id: 'ejournal' },
        { 
          label: t.menu.bkk,
          id: 'bkk',
          children: [
            { label: t.menu.cooperation, id: 'cooperation' },
            { label: t.menu.student_affairs, id: 'student_affairs' },
          ]
        },
        { label: t.menu.pusat_studi, id: 'pusat_studi' },
        ]
      },
    { 
      id: 'fakultas', 
      label: t.nav.faculties,
      children: [
        { label: t.menu.f_agri, id: 'f_agri' },
        { label: t.menu.f_econ, id: 'f_econ' },
        { label: t.menu.f_forest, id: 'f_forest' },
        { label: t.menu.f_science, id: 'f_science' },
        { label: t.menu.grad, id: 'grad' },
      ]
    },
    { 
        id: 'layanan', 
        label: t.nav.services,
        children: [
          { label: t.services.simak, id: 'simak', url: 'https://unb.eakademik.id/' },
          { label: t.services.arteri, id: 'arteri', url: 'https://ypkmk-nusantara.or.id/' },
          { label: t.services.scholarship, id: 'scholarship' },
          { label: t.services.career, id: 'career' },
          { label: t.services.hr, id: 'hr', url: 'https://diktendik.unb.ac.id/' },
          { label: t.services.repository, id: 'repository', url: 'https://repository.unb.ac.id/' },
        ]
      },
      { id: 'blog', label: t.nav.news },
    ];

  const handleTabClick = (id: TabType) => {
    setActiveTab(id);
    setIsMenuOpen(false);
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-8 py-6 sticky top-0 bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-md z-50 border-b border-black/5 dark:border-white/5 transition-colors duration-500">
      {/* Left: Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer flex-1 justify-start"
        onClick={() => handleTabClick('home')}
      >
        <div className="w-7 h-7 md:w-8 md:h-8 border-2 border-black dark:border-white rounded-lg flex items-center justify-center font-black italic text-[10px] md:text-xs text-black dark:text-white transition-colors duration-500">
          UNB
        </div>
        <span className="font-bold text-[10px] tracking-tighter uppercase text-black dark:text-white transition-colors duration-500 whitespace-nowrap">Univ. Nusa Bangsa</span>
      </div>

      {/* Center: Nav links (desktop) */}
      <div className="hidden lg:flex gap-4 xl:gap-6 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 transition-colors duration-500 justify-center flex-[2]">
        {navItems.map((item) => (
          item.children ? (
            <DropdownMenu key={item.id}>
              <DropdownMenuTrigger className={`nav-link transition py-1 whitespace-nowrap flex items-center gap-1 outline-none ${activeTab === item.id ? 'nav-link-active' : 'hover:text-black dark:hover:text-white'}`}>
                {item.label}
                <ChevronDown size={10} strokeWidth={3} />
              </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white dark:bg-[#111] border-black/10 dark:border-white/10 rounded-xl min-w-[200px] p-2">
                {item.children.map((child, idx) => (
                  child.children ? (
                    <DropdownMenuSub key={idx}>
                      <DropdownMenuSubTrigger 
                        onClick={() => setActiveTab(child.id as TabType)}
                        className="text-[9px] font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 focus:text-emerald-500 dark:focus:text-emerald-400 focus:bg-emerald-500/5 cursor-pointer rounded-lg transition-colors py-2.5 px-3 flex items-center justify-between"
                      >
                        {child.label}
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="bg-white dark:bg-[#111] border-black/10 dark:border-white/10 rounded-xl min-w-[180px] p-2 ml-1">
                          {child.children.map((subChild: any, subIdx: number) => (
                            <DropdownMenuItem
                              key={subIdx}
                              onClick={() => subChild.url ? window.open(subChild.url, '_blank', 'noopener,noreferrer') : setActiveTab(subChild.id as TabType)}
                              className="text-[9px] font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 focus:text-emerald-500 dark:focus:text-emerald-400 focus:bg-emerald-500/5 cursor-pointer rounded-lg transition-colors py-2.5 px-3"
                            >
                              {subChild.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  ) : (
                    <DropdownMenuItem
                      key={idx}
                      onClick={() => (child as any).url ? window.open((child as any).url, '_blank', 'noopener,noreferrer') : setActiveTab(child.id as TabType)}
                      className="text-[9px] font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 focus:text-emerald-500 dark:focus:text-emerald-400 focus:bg-emerald-500/5 cursor-pointer rounded-lg transition-colors py-2.5 px-3"
                    >
                      {child.label}
                    </DropdownMenuItem>
                  )
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-link transition py-1 whitespace-nowrap ${activeTab === item.id ? 'nav-link-active' : 'hover:text-black dark:hover:text-white'}`}
            >
              {item.label}
            </button>
          )
        ))}
      </div>

      {/* Right: Theme toggle + Language switcher + Register button / Mobile Menu */}
      <div className="flex items-center gap-4 md:gap-6 text-[9px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 flex-1 justify-end">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all duration-300 shadow-sm dark:shadow-none"
        >
          {theme === 'light' ? <Moon size={16} strokeWidth={2.5} /> : <Sun size={16} strokeWidth={2.5} />}
        </button>

        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1 border border-black/10 dark:border-white/20 rounded-full px-3 py-1.5 text-[9px] font-bold hover:border-black/30 dark:hover:border-white/50 transition text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-500"
          >
            {languages[language].split(' ')[0]}
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          {isLangOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl py-1 z-50 transition-colors duration-500">
              {(Object.entries(languages) as [Language, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => { setLanguage(key); setIsLangOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[9px] font-bold tracking-wider uppercase transition-colors ${
                    language === key ? 'text-emerald-500 bg-emerald-500/10' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Register button (Desktop only) */}
        <button
          onClick={() => setActiveTab('pendaftaran')}
          className="hidden lg:flex bg-emerald-500 text-white rounded-full px-5 py-2.5 items-center gap-2 hover:bg-emerald-400 transition"
        >
          {t.nav.register}
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        {/* Mobile Menu Toggle (Visible only on non-desktop) */}
        <div className="lg:hidden relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-black/5 dark:bg-[#222] text-black dark:text-white border border-black/10 dark:border-white/10 rounded-full p-2.5 flex items-center justify-center hover:bg-black/10 dark:hover:bg-[#333] transition-colors duration-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-3 w-56 bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 transition-colors duration-500">
              {navItems.map((item) => (
                <div key={item.id}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setOpenMobileSubmenu(openMobileSubmenu === item.id ? null : item.id)}
                        className={`w-full flex items-center justify-between px-5 py-3 text-[9px] font-bold tracking-[0.2em] uppercase transition-colors ${
                          activeTab === item.id ? 'text-emerald-500 bg-emerald-500/10' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        {item.label}
                        <ChevronDown 
                          size={10} 
                          className={`transition-transform duration-300 ${openMobileSubmenu === item.id ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      <div 
                        className={`overflow-hidden transition-all duration-300 bg-black/5 dark:bg-white/5 ${
                          openMobileSubmenu === item.id ? 'max-h-[800px] py-1' : 'max-h-0'
                        }`}
                      >
                        {item.children.map((child, idx) => (
                          <div key={idx}>
                            {child.children ? (
                              <>
                                <button
                                  onClick={() => setOpenMobileSubSubmenu(openMobileSubSubmenu === child.label ? null : child.label)}
                                  className="w-full flex items-center justify-between px-8 py-2.5 text-[8px] font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors"
                                >
                                  {child.label}
                                  <ChevronDown 
                                    size={8} 
                                    className={`transition-transform duration-300 ${openMobileSubSubmenu === child.label ? 'rotate-180' : ''}`} 
                                  />
                                </button>
                                <div 
                                  className={`overflow-hidden transition-all duration-300 bg-black/5 dark:bg-white/5 ${
                                    openMobileSubSubmenu === child.label ? 'max-h-[400px] py-1' : 'max-h-0'
                                  }`}
                                >
                                  {child.children.map((subChild: any, subIdx: number) => (
                                    <button
                                      key={subIdx}
                                      onClick={() => subChild.url ? window.open(subChild.url, '_blank', 'noopener,noreferrer') : handleTabClick(subChild.id)}
                                      className="w-full text-left px-11 py-2 text-[7.5px] font-bold tracking-wider uppercase text-gray-400 dark:text-gray-500 hover:text-emerald-500 transition-colors"
                                    >
                                      {subChild.label}
                                    </button>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <button
                                onClick={() => (child as any).url ? window.open((child as any).url, '_blank', 'noopener,noreferrer') : handleTabClick(child.id as TabType)}
                                className="w-full text-left px-8 py-2.5 text-[8px] font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors"
                              >
                                {child.label}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full text-left px-5 py-3 text-[9px] font-bold tracking-[0.2em] uppercase transition-colors ${
                        activeTab === item.id ? 'text-emerald-500 bg-emerald-500/10' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
              <div className="border-t border-black/5 dark:border-white/5 mt-1 pt-1 transition-colors duration-500">
                <button
                  onClick={() => handleTabClick('pendaftaran')}
                  className="w-full text-left px-5 py-3 text-[9px] font-black tracking-[0.2em] uppercase text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                >
                  {t.nav.register}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close lang or menu */}
      {(isLangOpen || isMenuOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setIsLangOpen(false); setIsMenuOpen(false); }} />
      )}
    </nav>
  );
}
