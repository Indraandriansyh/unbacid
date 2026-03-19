import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Settings, 
  Users, 
  FileText, 
  Newspaper,
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Globe,
  Plus,
  Image as ImageIcon,
  Video,
  Type,
  Layout,
  BarChart3,
  Upload,
  Link as LinkIcon,
  Trash2,
  Loader2,
  GraduationCap,
  BookOpen,
  FlaskConical,
  ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import ProfileManagement from "@/components/ProfileManagement";
import DataDosenManagement from "@/components/DataDosenManagement.tsx";
import NewsManagement from "@/components/NewsManagement";
import FakultasManagement from "@/components/FakultasManagement";
import ProdiManagement, { PRODI_LIST } from "@/components/ProdiManagement";
import LppmManagement from "@/components/LppmManagement";
import RegistrationManagement from "@/components/RegistrationManagement";

const FAKULTAS_LIST = [
  { id: "faa", label: "Agroteknopreneur", icon: "🌾" },
  { id: "feb", label: "Ekonomi & Bisnis", icon: "📈" },
  { id: "fkl", label: "Kehutanan & Lingkungan", icon: "🌲" },
  { id: "fst", label: "Sains & Teknologi", icon: "🔬" },
  { id: "pps", label: "Pascasarjana", icon: "🎓" },
];

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState("home");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [, setLocation] = useLocation();

  const toggleSection = (key: string) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  const { toast } = useToast();
  const { settings, updateSettings, isLoading: isSettingsLoading } = useSettings();
  const [isSaving, setIsSaving] = useState(false);

  // Initial Home Content State (Default)
  const defaultHomeContent = {
    hero: {
      welcome: "#WELCOMETO",
      title: "NUSA BANGSA UNIVERSITY",
      subtitle1: "UNIVERSITAS NUSA BANGSA — BOGOR, INDONESIA",
      subtitle2: "AKREDITASI & PROGRAM STUDI TERBAIK",
      accreditation: "TERAKREDITASI BAN-PT",
      programs: "5 FAKULTAS · 8 PROGRAM STUDI",
      buttonText: "JELAJAHI PROGRAM"
    },
    banners: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200' },
      { type: 'video', url: 'https://v.ftcdn.net/06/08/54/12/700_F_608541243_m33xYF6f22UeO1l6C2uI2G7w4X0E1X2T_ST.mp4' }
    ],
    gridItems: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=400' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=400' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400' }
    ],
    cta: {
      heading1: "PENERIMAAN",
      heading2: "MAHASISWA",
      heading3: "BARU",
      description: "DAFTARKAN DIRIMU SEKARANG DAN WUJUDKAN MIMPIMU BERSAMA UNB BOGOR",
      features: [
        { title: "PROGRAM UNGGULAN", desc: "BERBAGAI PILIHAN PROGRAM STUDI TERAKREDITASI SESUAI MINAT DAN BAKATMU." },
        { title: "FASILITAS LENGKAP", desc: "KAMPUS DILENGKAPI LABORATORIUM, PERPUSTAKAAN, DAN SISTEM INFORMASI TERKINI." },
        { title: "JALUR MASUK BERAGAM", desc: "TERSEDIA JALUR REGULER, JALUR PRESTASI, DAN JALUR MANDIRI UNTUK SEMUA SISWA." }
      ],
      cardImage: "https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=800",
      statStudents: "15,000+ MAHASISWA AKTIF",
      statCampus: "KAMPUS UNGGULAN"
    }
  };

  const [homeContent, setHomeContent] = useState(defaultHomeContent);

  useEffect(() => {
    if (settings.homeContent) {
      setHomeContent(settings.homeContent);
    }
  }, [settings]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => {
      setIsMobile(media.matches);
      if (media.matches) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const menuItems = [
    { id: "home", label: "Home", icon: Home, description: "Kelola halaman utama website" },
    { id: "profile", label: "Profile", icon: FileText, description: "Kelola konten halaman profil" },
    { id: "data-dosen", label: "Data Dosen", icon: Users, description: "Kelola data dosen & struktur organisasi" },
    { id: "news", label: "Berita", icon: Newspaper, description: "Kelola berita dan kategori" },
  ];

  const showSidebarLabels = isMobile ? true : isSidebarOpen;
  const getActiveMenuLabel = () => {
    const fromMenu = menuItems.find((x) => x.id === activeMenu)?.label;
    if (fromMenu) return fromMenu;
    if (activeMenu === "lppm") return "LPPM";
    if (activeMenu === "pendaftaran") return "Pendaftaran";
    if (activeMenu.startsWith("fakultas-")) {
      const id = activeMenu.replace("fakultas-", "");
      const f = FAKULTAS_LIST.find(f => f.id === id);
      return f ? `Fakultas ${f.label}` : "Fakultas";
    }
    if (activeMenu.startsWith("prodi-")) {
      const id = activeMenu.replace("prodi-", "");
      const p = PRODI_LIST.find(p => p.id === id);
      return p ? `Prodi ${p.name}` : "Program Studi";
    }
    return activeMenu;
  };
  const activeMenuLabel = getActiveMenuLabel();

  const handleLogout = () => {
    setLocation("/admin");
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateSettings('homeContent', homeContent);
      toast({
        title: "Perubahan Disimpan",
        description: "Konten halaman Home telah berhasil diperbarui di database.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan ke database.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isSettingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0d0d0d]">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0d0d0d] flex text-slate-800 dark:text-slate-200">
      {isMobile && isSidebarOpen ? (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
          aria-label="Tutup sidebar"
        />
      ) : null}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white dark:bg-[#111111] border-r border-emerald-100 dark:border-emerald-900/30 transition-all duration-300 fixed md:relative z-50 h-screen top-0 left-0",
          isMobile ? "w-72" : isSidebarOpen ? "w-72" : "w-20",
          isMobile ? (isSidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3 border-b border-emerald-50 dark:border-emerald-900/10">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            {showSidebarLabels ? (
              <div className="font-extrabold text-xl tracking-tight text-emerald-600 dark:text-emerald-500 truncate">
                Admin Master
              </div>
            ) : null}
            {isMobile ? (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="ml-auto w-10 h-10 rounded-xl flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                aria-label="Tutup sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            ) : null}
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  if (isMobile) setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
                  activeMenu === item.id 
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                    : "hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-slate-500 dark:text-slate-400"
                )}
              >
                <item.icon className={cn("w-5 h-5", activeMenu === item.id ? "text-white" : "group-hover:text-emerald-500")} />
                {showSidebarLabels ? <span className="font-semibold">{item.label}</span> : null}
                {showSidebarLabels && activeMenu === item.id ? <ChevronRight className="ml-auto w-4 h-4" /> : null}
              </button>
            ))}

            {/* ——— Fakultas Accordion ——— */}
            <div>
              <button
                onClick={() => toggleSection("fakultas")}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
                  activeMenu.startsWith("fakultas-")
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600"
                    : "hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-slate-500 dark:text-slate-400"
                )}
              >
                <GraduationCap className={cn("w-5 h-5 shrink-0", activeMenu.startsWith("fakultas-") ? "text-emerald-500" : "group-hover:text-emerald-500")} />
                {showSidebarLabels ? (
                  <>
                    <span className="font-semibold flex-1 text-left">Fakultas</span>
                    {openSections["fakultas"]
                      ? <ChevronDown className="w-4 h-4 ml-auto" />
                      : <ChevronRight className="w-4 h-4 ml-auto" />}
                  </>
                ) : null}
              </button>
              {showSidebarLabels && openSections["fakultas"] && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-emerald-100 dark:border-emerald-900/30 pl-3">
                  {FAKULTAS_LIST.map(f => (
                    <button
                      key={f.id}
                      onClick={() => { setActiveMenu(`fakultas-${f.id}`); if (isMobile) setIsSidebarOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                        activeMenu === `fakultas-${f.id}`
                          ? "bg-emerald-500 text-white font-semibold shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600"
                      )}
                    >
                      <span className="text-base">{f.icon}</span>
                      <span className="truncate">{f.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ——— Program Studi Accordion ——— */}
            <div>
              <button
                onClick={() => toggleSection("prodi")}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
                  activeMenu.startsWith("prodi-")
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600"
                    : "hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-slate-500 dark:text-slate-400"
                )}
              >
                <BookOpen className={cn("w-5 h-5 shrink-0", activeMenu.startsWith("prodi-") ? "text-emerald-500" : "group-hover:text-emerald-500")} />
                {showSidebarLabels ? (
                  <>
                    <span className="font-semibold flex-1 text-left">Program Studi</span>
                    {openSections["prodi"]
                      ? <ChevronDown className="w-4 h-4 ml-auto" />
                      : <ChevronRight className="w-4 h-4 ml-auto" />}
                  </>
                ) : null}
              </button>
              {showSidebarLabels && openSections["prodi"] && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-emerald-100 dark:border-emerald-900/30 pl-3">
                  {PRODI_LIST.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setActiveMenu(`prodi-${p.id}`); if (isMobile) setIsSidebarOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                        activeMenu === `prodi-${p.id}`
                          ? "bg-emerald-500 text-white font-semibold shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600"
                      )}
                    >
                      <span className="text-base">{p.icon}</span>
                      <span className="truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* ——— LPPM ——— */}
            <button
              onClick={() => {
                setActiveMenu("lppm");
                if (isMobile) setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
                activeMenu === "lppm"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-slate-500 dark:text-slate-400"
              )}
            >
              <FlaskConical className={cn("w-5 h-5 shrink-0", activeMenu === "lppm" ? "text-white" : "group-hover:text-emerald-500")} />
              {showSidebarLabels ? <span className="font-semibold flex-1 text-left">LPPM</span> : null}
              {showSidebarLabels && activeMenu === "lppm" ? <ChevronRight className="ml-auto w-4 h-4" /> : null}
            </button>

            {/* ——— Pendaftaran ——— */}
            <button
              onClick={() => {
                setActiveMenu("pendaftaran");
                if (isMobile) setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
                activeMenu === "pendaftaran"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-slate-500 dark:text-slate-400"
              )}
            >
              <ClipboardList className={cn("w-5 h-5 shrink-0", activeMenu === "pendaftaran" ? "text-white" : "group-hover:text-emerald-500")} />
              {showSidebarLabels ? <span className="font-semibold flex-1 text-left">Pendaftaran</span> : null}
              {showSidebarLabels && activeMenu === "pendaftaran" ? <ChevronRight className="ml-auto w-4 h-4" /> : null}
            </button>
          </nav>

          <div className="p-4 border-t border-emerald-50 dark:border-emerald-900/10">
            <button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200",
                showSidebarLabels ? "justify-start" : "justify-center"
              )}
            >
              <LogOut className="w-5 h-5" />
              {showSidebarLabels ? <span className="font-semibold">Keluar</span> : null}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="h-16 md:h-20 bg-white/80 dark:bg-[#0d0d0d]/80 backdrop-blur-md border-b border-emerald-50 dark:border-emerald-900/10 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-base md:text-xl font-bold tracking-tight truncate">
                {activeMenuLabel}
              </h1>
              <div className="hidden md:block text-xs text-slate-500 truncate">
                {menuItems.find((x) => x.id === activeMenu)?.description ?? ""}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-500 rounded-full text-sm font-medium border border-emerald-100 dark:border-emerald-900/20">
              <Globe className="w-4 h-4" />
              <span>unb.ac.id</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-emerald-500 flex items-center justify-center overflow-hidden">
              <Users className="w-6 h-6 text-slate-500" />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {activeMenu === "home" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight">Kelola Halaman Home</h2>
                  <p className="text-slate-500 mt-1">Sesuaikan konten utama yang tampil di depan.</p>
                </div>
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

              <Tabs defaultValue="hero" className="w-full">
                <TabsList className="bg-white dark:bg-[#1a1a1a] p-1 rounded-2xl border border-emerald-50 dark:border-emerald-900/10 mb-8 h-14">
                  <TabsTrigger value="hero" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white h-full px-6 gap-2">
                    <Type className="w-4 h-4" /> Hero
                  </TabsTrigger>
                  <TabsTrigger value="media" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white h-full px-6 gap-2">
                    <ImageIcon className="w-4 h-4" /> Media Banner
                  </TabsTrigger>
                  <TabsTrigger value="cta" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white h-full px-6 gap-2">
                    <Layout className="w-4 h-4" /> Admissions
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white h-full px-6 gap-2">
                    <BarChart3 className="w-4 h-4" /> Stats
                  </TabsTrigger>
                </TabsList>

                {/* HERO TAB */}
                <TabsContent value="hero">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl">
                      <CardHeader>
                        <CardTitle className="text-lg">Teks Utama</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Welcome Tag</label>
                          <Input 
                            value={homeContent.hero.welcome} 
                            onChange={(e) => setHomeContent({...homeContent, hero: {...homeContent.hero, welcome: e.target.value}})}
                            className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Judul Utama</label>
                          <Input 
                            value={homeContent.hero.title} 
                            onChange={(e) => setHomeContent({...homeContent, hero: {...homeContent.hero, title: e.target.value}})}
                            className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Teks Tombol</label>
                          <Input 
                            value={homeContent.hero.buttonText} 
                            onChange={(e) => setHomeContent({...homeContent, hero: {...homeContent.hero, buttonText: e.target.value}})}
                            className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl">
                      <CardHeader>
                        <CardTitle className="text-lg">Sub-info Hero</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Line 1</label>
                          <Input 
                            value={homeContent.hero.subtitle1} 
                            onChange={(e) => setHomeContent({...homeContent, hero: {...homeContent.hero, subtitle1: e.target.value}})}
                            className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Line 2</label>
                          <Input 
                            value={homeContent.hero.subtitle2} 
                            onChange={(e) => setHomeContent({...homeContent, hero: {...homeContent.hero, subtitle2: e.target.value}})}
                            className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Akreditasi</label>
                          <Input 
                            value={homeContent.hero.accreditation} 
                            onChange={(e) => setHomeContent({...homeContent, hero: {...homeContent.hero, accreditation: e.target.value}})}
                            className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fakultas & Prodi</label>
                          <Input 
                            value={homeContent.hero.programs} 
                            onChange={(e) => setHomeContent({...homeContent, hero: {...homeContent.hero, programs: e.target.value}})}
                            className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* MEDIA TAB */}
                <TabsContent value="media">
                  <div className="space-y-8">
                    {/* Landscape Banner */}
                    <Card className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Banner Landscape (Carousel)</CardTitle>
                          <CardDescription>Ubah gambar atau video pada banner utama</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-xl border-emerald-500 text-emerald-500 hover:bg-emerald-50 gap-2">
                          <Plus className="w-4 h-4" /> Tambah Item
                        </Button>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {homeContent.banners.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-[#252525] rounded-2xl p-4 space-y-3 relative group">
                              <div className="aspect-video rounded-lg overflow-hidden bg-slate-200">
                                {item.type === 'video' ? (
                                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
                                    <Video className="w-8 h-8 opacity-50" />
                                  </div>
                                ) : (
                                  <img src={item.url} className="w-full h-full object-cover" alt="" />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <select 
                                  className="text-xs bg-white dark:bg-slate-800 border-none rounded-md p-1"
                                  value={item.type}
                                  onChange={(e) => {
                                    const newBanners = [...homeContent.banners];
                                    newBanners[idx].type = e.target.value as 'image' | 'video';
                                    setHomeContent({...homeContent, banners: newBanners});
                                  }}
                                >
                                  <option value="image">Image</option>
                                  <option value="video">Video</option>
                                </select>
                                <Input 
                                  value={item.url} 
                                  placeholder="Link CDN / URL"
                                  className="h-8 text-xs bg-white dark:bg-slate-800 border-none"
                                  onChange={(e) => {
                                    const newBanners = [...homeContent.banners];
                                    newBanners[idx].url = e.target.value;
                                    setHomeContent({...homeContent, banners: newBanners});
                                  }}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1 h-8 text-[10px] gap-1 rounded-lg">
                                  <Upload className="w-3 h-3" /> Upload
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 rounded-lg">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Grid Images */}
                    <Card className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl">
                      <CardHeader>
                        <CardTitle className="text-lg">Grid Media (Bawah Banner)</CardTitle>
                        <CardDescription>3 item media di bawah banner utama</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {homeContent.gridItems.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-[#252525] rounded-2xl p-4 space-y-3">
                              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-slate-200">
                                <img src={item.url} className="w-full h-full object-cover" alt="" />
                              </div>
                              <Input 
                                value={item.url} 
                                placeholder="Link CDN / URL"
                                className="h-8 text-xs bg-white dark:bg-slate-800 border-none"
                                onChange={(e) => {
                                  const newGrid = [...homeContent.gridItems];
                                  newGrid[idx].url = e.target.value;
                                  setHomeContent({...homeContent, gridItems: newGrid});
                                }}
                              />
                              <Button size="sm" variant="outline" className="w-full h-8 text-[10px] gap-1 rounded-lg">
                                <Upload className="w-3 h-3" /> Ganti Gambar
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* ADMISSIONS TAB */}
                <TabsContent value="cta">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl">
                      <CardHeader>
                        <CardTitle className="text-lg">Teks Pendaftaran</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Heading 1</label>
                            <Input value={homeContent.cta.heading1} onChange={(e) => setHomeContent({...homeContent, cta: {...homeContent.cta, heading1: e.target.value}})} className="bg-slate-50 dark:bg-[#252525] border-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Heading 2</label>
                            <Input value={homeContent.cta.heading2} onChange={(e) => setHomeContent({...homeContent, cta: {...homeContent.cta, heading2: e.target.value}})} className="bg-slate-50 dark:bg-[#252525] border-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Heading 3</label>
                            <Input value={homeContent.cta.heading3} onChange={(e) => setHomeContent({...homeContent, cta: {...homeContent.cta, heading3: e.target.value}})} className="bg-slate-50 dark:bg-[#252525] border-none" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sub-judul / Deskripsi</label>
                          <Textarea value={homeContent.cta.description} onChange={(e) => setHomeContent({...homeContent, cta: {...homeContent.cta, description: e.target.value}})} className="bg-slate-50 dark:bg-[#252525] border-none min-h-[80px]" />
                        </div>

                        <div className="pt-4 space-y-6">
                          <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest border-b border-emerald-100 dark:border-emerald-900/30 pb-2 block">Poin-poin Unggulan</label>
                          {homeContent.cta.features.map((f, idx) => (
                            <div key={idx} className="space-y-3 p-4 bg-slate-50 dark:bg-[#252525] rounded-2xl">
                              <Input 
                                value={f.title} 
                                placeholder="Judul Poin"
                                className="font-bold bg-white dark:bg-slate-800 border-none"
                                onChange={(e) => {
                                  const newFeatures = [...homeContent.cta.features];
                                  newFeatures[idx].title = e.target.value;
                                  setHomeContent({...homeContent, cta: {...homeContent.cta, features: newFeatures}});
                                }}
                              />
                              <Textarea 
                                value={f.desc} 
                                placeholder="Keterangan Poin"
                                className="text-xs bg-white dark:bg-slate-800 border-none min-h-[60px]"
                                onChange={(e) => {
                                  const newFeatures = [...homeContent.cta.features];
                                  newFeatures[idx].desc = e.target.value;
                                  setHomeContent({...homeContent, cta: {...homeContent.cta, features: newFeatures}});
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-6">
                      <Card className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl">
                        <CardHeader>
                          <CardTitle className="text-lg">Gambar Kartu</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
                            <img src={homeContent.cta.cardImage} className="w-full h-full object-cover" alt="" />
                          </div>
                          <Input 
                            value={homeContent.cta.cardImage} 
                            placeholder="Link Gambar"
                            className="bg-slate-50 dark:bg-[#252525] border-none text-xs"
                            onChange={(e) => setHomeContent({...homeContent, cta: {...homeContent.cta, cardImage: e.target.value}})}
                          />
                          <Button variant="outline" className="w-full gap-2 rounded-xl">
                            <Upload className="w-4 h-4" /> Upload Gambar
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* STATS TAB */}
                <TabsContent value="stats">
                  <Card className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl max-w-2xl">
                    <CardHeader>
                      <CardTitle className="text-lg">Statistik & Badge</CardTitle>
                      <CardDescription>Ubah angka dan teks pada badge melayang</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
                          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white mb-2">
                            <Users className="w-6 h-6" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Badge Mahasiswa</label>
                            <Input 
                              value={homeContent.cta.statStudents} 
                              onChange={(e) => setHomeContent({...homeContent, cta: {...homeContent.cta, statStudents: e.target.value}})}
                              className="bg-white dark:bg-slate-800 border-none font-bold"
                            />
                          </div>
                        </div>

                        <div className="space-y-3 p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
                          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white mb-2">
                            <ShieldCheck className="w-6 h-6" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Badge Kampus</label>
                            <Input 
                              value={homeContent.cta.statCampus} 
                              onChange={(e) => setHomeContent({...homeContent, cta: {...homeContent.cta, statCampus: e.target.value}})}
                              className="bg-white dark:bg-slate-800 border-none font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeMenu === "profile" && <ProfileManagement />}
          {activeMenu === "data-dosen" && <DataDosenManagement />}
          {activeMenu === "news" && <NewsManagement />}
          {activeMenu === "lppm" && <LppmManagement />}
          {activeMenu === "pendaftaran" && <RegistrationManagement />}

          {/* Fakultas pages */}
          {FAKULTAS_LIST.map(f =>
            activeMenu === `fakultas-${f.id}` ? (
              <FakultasManagement key={f.id} facultyId={f.id} />
            ) : null
          )}

          {/* Program Studi pages */}
          {PRODI_LIST.map(p =>
            activeMenu === `prodi-${p.id}` ? (
              <ProdiManagement key={p.id} prodiId={p.id} />
            ) : null
          )}
        </div>
      </main>
    </div>
  );
}
