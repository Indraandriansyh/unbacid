import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { Navbar } from './components/Navbar';
import { HomeTab } from './tabs/HomeTab';
import { AboutTab } from './tabs/AboutTab';
import { FacultiesTab } from './tabs/FacultiesTab';
import { FacultyPageTab } from './tabs/FacultyPageTab';
import { ProgramStudyTab } from './tabs/ProgramStudyTab';
import { RegistrationTab } from './tabs/RegistrationTab';
import { NewsTab } from './tabs/NewsTab';
import { GenericPageTab } from './tabs/GenericPageTab';
import { PusatStudiAgrataruTab } from './tabs/PusatStudiAgrataruTab';
import { LppmPageTab } from './tabs/LppmPageTab';
import { LpmPageTab } from './tabs/LpmPageTab';
import { BkkPageTab } from './tabs/BkkPageTab';
import { BooksTab } from './tabs/BooksTab';
import { Footer } from './components/Footer';
import { SocialBanner } from './components/SocialBanner';
import { ImageModal } from './components/ImageModal';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import FakultasAdminDashboard from './pages/FakultasAdminDashboard';
import ProdiAdminDashboard from './pages/ProdiAdminDashboard';
import { getSession } from './lib/auth';
import type { TabType } from './types';

function DashboardRouter() {
  const session = getSession();
  const role = session?.user?.role;
  if (role === "fakultas") return <FakultasAdminDashboard />;
  if (role === "prodi") return <ProdiAdminDashboard />;
  return <AdminDashboard />;
}

const queryClient = new QueryClient();

function MainContent() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [pendingPostId, setPendingPostId] = useState<string | null>(null);
  const { t } = useLanguage();

  const openDetail = (src: string) => setModalImg(src);
  const closeDetail = () => setModalImg(null);

  const openNewsPost = (postId: string) => {
    setPendingPostId(postId);
    setActiveTab('blog');
  };

  return (
    <div className="bg-[#f5f5f5] dark:bg-[#0d0d0d] py-[10px] md:py-[20px] min-h-screen selection:bg-emerald-500 selection:text-white transition-colors duration-500">
      <div className="main-container shadow-2xl transition-colors duration-500">
        {/* Sticky Nav inside container */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Pages */}
        {activeTab === 'home' && <HomeTab setActiveTab={setActiveTab} openDetail={openDetail} onOpenNewsPost={openNewsPost} />}
        {(activeTab === 'tentang' || activeTab === 'profil') && <AboutTab />}
        {activeTab === 'fakultas' && <FacultiesTab setActiveTab={setActiveTab} />}
        {activeTab === 'pendaftaran' && <RegistrationTab />}
        {activeTab === 'blog' && <NewsTab initialPostId={pendingPostId} />}
        {activeTab === 'layanan' && <NewsTab />}

        {/* Sub-menu LPPM */}
        {activeTab === 'lppm' && <GenericPageTab title={t.menu.lppm} />}
        {activeTab === 'penelitian' && <LppmPageTab pageId="penelitian" />}
        {activeTab === 'pengabdian' && <LppmPageTab pageId="pengabdian" />}
        {activeTab === 'inovasi' && <LppmPageTab pageId="inovasi" />}
        {activeTab === 'haki' && <LppmPageTab pageId="haki" />}
        {activeTab === 'books' && <BooksTab />}
        {activeTab === 'seminar' && <LppmPageTab pageId="seminar" />}
        
        {activeTab === 'lpm' && <GenericPageTab title={t.menu.lpm} />}
        {activeTab === 'sop' && <LpmPageTab pageId="sop" />}
        {activeTab === 'jobs' && <LpmPageTab pageId="jobs" />}
        {activeTab === 'performance' && <LpmPageTab pageId="performance" />}
        {activeTab === 'tracer' && <LpmPageTab pageId="tracer" />}
        {activeTab === 'spmi' && <LpmPageTab pageId="spmi" />}

        {activeTab === 'ejournal' && <GenericPageTab title={t.menu.ejournal} />}
        {activeTab === 'bkk' && <GenericPageTab title={t.menu.bkk} />}
        {activeTab === 'cooperation' && <BkkPageTab pageId="cooperation" />}
        {activeTab === 'student_affairs' && <BkkPageTab pageId="student_affairs" />}
        {activeTab === 'pusat_studi' && <PusatStudiAgrataruTab />}

        {/* Sub-menu Fakultas */}
        {activeTab === 'f_agri' && <FacultyPageTab setActiveTab={setActiveTab} facultyId="faa" />}
        {activeTab === 'f_econ' && <FacultyPageTab setActiveTab={setActiveTab} facultyId="feb" />}
        {activeTab === 'f_forest' && <FacultyPageTab setActiveTab={setActiveTab} facultyId="fkl" />}
        {activeTab === 'f_science' && <FacultyPageTab setActiveTab={setActiveTab} facultyId="fst" />}
        {activeTab === 'grad' && <FacultyPageTab setActiveTab={setActiveTab} facultyId="pps" />}

        {activeTab === 'prodi_agroteknologi' && <ProgramStudyTab setActiveTab={setActiveTab} programId="agroteknologi-s1" />}
        {activeTab === 'prodi_agribisnis' && <ProgramStudyTab setActiveTab={setActiveTab} programId="agribisnis-s1" />}
        {activeTab === 'prodi_manajemen' && <ProgramStudyTab setActiveTab={setActiveTab} programId="manajemen-s1" />}
        {activeTab === 'prodi_akuntansi' && <ProgramStudyTab setActiveTab={setActiveTab} programId="akuntansi-s1" />}
        {activeTab === 'prodi_kehutanan' && <ProgramStudyTab setActiveTab={setActiveTab} programId="kehutanan-s1" />}
        {activeTab === 'prodi_biologi' && <ProgramStudyTab setActiveTab={setActiveTab} programId="biologi-s1" />}
        {activeTab === 'prodi_kimia' && <ProgramStudyTab setActiveTab={setActiveTab} programId="kimia-s1" />}
        {activeTab === 'prodi_data_sains' && <ProgramStudyTab setActiveTab={setActiveTab} programId="data-sains-s1" />}
        {activeTab === 'prodi_magister_manajemen' && <ProgramStudyTab setActiveTab={setActiveTab} programId="magister-manajemen-s2" />}
        {activeTab === 'prodi_magister_agribisnis' && <ProgramStudyTab setActiveTab={setActiveTab} programId="magister-agribisnis-s2" />}
        {activeTab === 'prodi_magister_ekonomi_pembangunan' && <ProgramStudyTab setActiveTab={setActiveTab} programId="magister-ekonomi-pembangunan-s2" />}

        {/* Sub-menu Layanan */}
        {activeTab === 'simak' && <GenericPageTab title={t.services.simak} />}
        {activeTab === 'arteri' && <GenericPageTab title={t.services.arteri} />}
        {activeTab === 'scholarship' && <GenericPageTab title={t.services.scholarship} />}
        {activeTab === 'career' && <GenericPageTab title={t.services.career} />}
        {activeTab === 'hr' && <GenericPageTab title={t.services.hr} />}
        {activeTab === 'repository' && <GenericPageTab title={t.services.repository} />}

        {/* Social Media Banner + Footer */}
        <SocialBanner />
        <Footer />
      </div>

      {/* Image Modal */}
      <ImageModal src={modalImg} onClose={closeDetail} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <SettingsProvider>
            <Switch>
              <Route path="/admin" component={AdminLogin} />
              <Route path="/admin/dashboard" component={DashboardRouter} />
              <Route path="/">
                <MainContent />
              </Route>
            </Switch>
            <Toaster />
          </SettingsProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
