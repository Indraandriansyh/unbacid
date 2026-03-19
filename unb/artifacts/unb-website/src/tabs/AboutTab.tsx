import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const STRUKTURAL = [
  {
    jabatan: 'Rektor',
    nama: 'Prof. Dr. Ir. Budi Mulyanto, M.Sc.',
    icon: '🎓',
    emerald: true,
    sub: 'Pimpinan Tertinggi Universitas'
  },
  {
    jabatan: 'Wakil Rektor I',
    nama: 'Prof. Dr. Ucu Cahyana, M.Si',
    icon: '📚',
    sub: 'Bidang Akademik & Kemahasiswaan'
  },
  {
    jabatan: 'Wakil Rektor II',
    nama: 'Sunraizal, S.E., M.M., CFrA.',
    icon: '💼',
    sub: 'Bidang Keuangan & SDM'
  },
  {
    jabatan: 'Wakil Rektor III',
    nama: 'Dr. Karmanah SP., M.Si',
    icon: '🏆',
    sub: 'Bidang Kemahasiswaan & Alumni'
  }
];

export const DEKAN = [
  {
    jabatan: 'Dekan Fak. Agroteknopreneur & Agraria',
    nama: 'Dr. Faizal Maad, Ir., M.Si',
    icon: '🌾'
  },
  {
    jabatan: 'Dekan Fak. Ekonomi & Bisnis',
    nama: 'Dr. Isbandriyati Mutmainah, SE., M.SE',
    icon: '📈'
  },
  {
    jabatan: 'Dekan Fak. Sains dan Teknologi',
    nama: 'Dr. Lany Nurhayati, S.Si., M.Si',
    icon: '🔬'
  },
  {
    jabatan: 'Dekan Fak. Kehutanan dan Lingkungan',
    nama: 'Prof. Dr. Ir. Luluk Setyaningsih, M.Si. IPU.',
    icon: '🌲'
  }
];

export const ATAS_PIMPINAN_UNIVERSITAS = [
  { label: 'YAYASAN PKMK', icon: '🏛️' },
  { label: 'DIKTI', icon: '🏛️' },
] as const;

export const PIMPINAN_UNIVERSITAS_INTI = [
  { jabatan: 'Dewan Penyantun', nama: '—', icon: '🤝' },
  { jabatan: 'Rektor', nama: STRUKTURAL[0].nama, icon: '🎓', emerald: true, sub: STRUKTURAL[0].sub },
  { jabatan: 'Senat', nama: '—', icon: '📜' },
  { jabatan: 'Satuan Pengawas Internal', nama: '—', icon: '🛡️' },
] as const;

export const KEPALA_BIRO = [
  { jabatan: 'Kepala BAUU', nama: 'Chopep Tolandho, MBA', icon: '🏢' },
  { jabatan: 'Plt. Kepala Biro Administrasi Akademik dan Kemahasiswaan (BAAK)', nama: 'Abdul Rahman Rusli, S.Hut., M.Si', icon: '📋' },
  { jabatan: 'Kepala BHPI', nama: 'Agus Pranamulia, SE., M.M', icon: '⚖️' },
  { jabatan: 'Kepala BKA', nama: 'Febi Nurilmala, M.Si', icon: '🤝' },
  { jabatan: 'Ketua LP-Mutu', nama: 'Dr. Mamay Maslahat, S.Si.,M.Si', icon: '✅' },
  { jabatan: 'Ketua LPPM', nama: 'Dr. Ir. Zainal Muttaqin, MP', icon: '🔭' },
  { jabatan: 'Plt. Kepala Pusat Informasi dan Komputer (Pustikom)', nama: 'Dr. Suhendi, ST., S.Kom., MMSI', icon: '💻' },
  { jabatan: 'Plt. Badan Pengelola Usaha (BPU)', nama: 'Sitti Hafsiah, SH., MH., C. Med', icon: '💼' },
  { jabatan: 'Ketua Program Studi Kehutanan. FKL', nama: 'Dr. Ratna Sari Hasibuan, S.Hut., M.Si', icon: '🌲' },
  { jabatan: 'Ka. TU Fak. Agroteknopreneur dan Agraria', nama: 'Ma’mun Hidayat, S.Kom', icon: '🗂️' },
  { jabatan: 'Ka. TU Fak. Ekonomi & Bisnis', nama: 'Sriyanih, S.Pd.', icon: '🗂️' },
  { jabatan: 'Ka. TU Fak. Kehutanan dan Lingkungan', nama: 'Feby Amelia, SE', icon: '🗂️' },
  { jabatan: 'Ka. TU Fak. Sains dan Teknologi', nama: 'Wahyu Arif Hidayat, S.Hut', icon: '🗂️' },
  { jabatan: 'Kepala Bagian SPMI, Monitoring dan Evaluasi, dan Audit Mutu Internal, LP Mutu', nama: 'Kustin Bintani Meigananti, S.Hut., M.Si', icon: '✅' },
  { jabatan: 'Kepala Bagian Usaha (Sewa Lab, Analisis, Rumah Kaca, Kebun Percobaan. BPU', nama: 'Rea Dwiardhya Garini, S. Ak, ME', icon: '💼' },
  { jabatan: 'Kepala Bagian Administrasi, Kemahasiswaan dan PD-DIKTI, BAAK', nama: 'Hamza Mursandi, S.Si, M.T', icon: '🎓' },
  { jabatan: 'Kepala Bagian SDM dan Hukum, BAUU', nama: 'Siti Martinah, S.Si', icon: '👥' },
  { jabatan: 'Kepala Bagian Perencanaan, Keuangan dan Verifikasi, BAUU', nama: 'Nuryati, S.Ak', icon: '💰' },
  { jabatan: 'Kepala Bagian Usaha Non Akademik (Penyewaan Kantin, Auditorium, dll). BPU', nama: 'Nani Isnaeni, SE', icon: '🏪' },
  { jabatan: 'Kepala Bagian Humas dan Protokoler, BHPI', nama: 'Dwi Agus Sasongko, S.Hut., M.Si', icon: '📣' },
  { jabatan: 'Kepala Bagian Program Non Reguler (KIP, RPL, dan Beasiswa lain), BAAK', nama: 'Ernah Susanti, S.Pd.', icon: '🧾' },
  { jabatan: 'Kepala Bagian Kemahasiswaan dan Alumni. BKA', nama: 'Ayi Ratnaningsih, S.Pt., S.Si', icon: '🎓' },
  { jabatan: 'Kepala Bagian Publikasi Ilmiah dan Kekayaan Intelektual. LPPM', nama: 'Devy Susanty, S.Pd., M.Si', icon: '📚' },
  { jabatan: 'Kepala Lab. Biologi dan Kultur Jaringan merangkap Pengelola Jurnal Sains Natural', nama: 'I Gusti Ayu Manik W., M.Kes', icon: '🧫' },
  { jabatan: 'Kepala Kebun Percobaan', nama: 'Hendra Gunawan, SP', icon: '🌿' },
  { jabatan: 'Kepala Bagian SPME, Monitoring dan Evaluasi, dan Audit Mutu Eksternal, LP Mutu', nama: 'Dr. Hedar Rusman, S.E., Ak., M.M., CA., ACPA', icon: '✅' },
  { jabatan: 'Plt. Kepala Bagian Promosi dan Media Sosial. BHPI', nama: 'Sandi Hasyono, S.I.Kom', icon: '📱' },
  { jabatan: 'Kepala Bagian Penelitian dan Pengabdian Kepada Masyarakat. LPPM', nama: 'Dian Arrisujaya, S.Pd., M.Si', icon: '🔬' },
  { jabatan: 'Plt. Kepala Bagian Pengelolaan Data (termasuk Website), (Pustikom)', nama: 'Mohammad Fachruddin, S.Si., M.Si', icon: '🌐' },
  { jabatan: 'Plt. Kepala Pustakawan', nama: 'Early Siti Shabylla Zahra, S.S.I.', icon: '📖' },
];

export type PimpinanDosen = {
  nama: string;
  fakultas: string;
  prodi: string;
  role: string;
  nidn: string;
  email?: string;
  photoUrl?: string;
  id?: string;
};

export const PIMPINAN_DOSEN: PimpinanDosen[] = [
  { nama: 'Prof. Dr. Ir. Budi Mulyanto, M.Sc.', fakultas: '-', prodi: '-', role: 'Rektor', nidn: '-' },
  { nama: 'Dr. Faizal Maad, Ir., M.Si', fakultas: 'Fakultas Agroenterpreneur & Agraria', prodi: 'Agribisnis', role: 'Lektor Kepala', nidn: '5096101' },
  { nama: 'Sari Anggarawati, Ir., M.Si', fakultas: 'Fakultas Agroenterpreneur & Agraria', prodi: 'Agribisnis', role: 'Lektor Kepala', nidn: '406046502' },
  { nama: 'Ir. Dyah Budibruri Wibaningwati., M.Sc', fakultas: 'Fakultas Agroenterpreneur & Agraria', prodi: 'Agribisnis', role: 'Dosen Tetap', nidn: '407026702' },
  { nama: 'Linar Humaira, Ir., MS', fakultas: 'Fakultas Agroenterpreneur & Agraria', prodi: 'Agribisnis', role: 'Dosen Tetap', nidn: '5116402' },
  { nama: 'Anak Agung Eka Suwarnata, SP., M.Agb.', fakultas: 'Fakultas Agroenterpreneur & Agraria', prodi: 'Agribisnis', role: 'Dosen Tetap', nidn: '0407048509' },
  { nama: 'Muhammad Sukri N, S.P., M. Si', fakultas: 'Fakultas Agroenterpreneur & Agraria', prodi: 'Agribisnis', role: 'Dosen Tetap', nidn: '0407028104' },
  { nama: 'Fathan Hadyan Rizki,S.Ps., M.Si', fakultas: 'Fakultas Agroenterpreneur & Agraria', prodi: 'Agribisnis', role: 'Dosen Tetap', nidn: '0404019202' },
  { nama: 'Dr. Andi Masnang, Ir., MS', fakultas: 'Fakultas Agroenterpreneur & Agraria', prodi: 'Agroteknologi', role: 'Lektor Kepala', nidn: '19116504' },
  { nama: 'Dr. Karmanah SP., M.Si', fakultas: 'Fakultas Agroenterpreneur & Agraria', prodi: 'Agroteknologi', role: 'Lektor Kepala', nidn: '407067001' },
  { nama: 'Asmanur Jannah, Ir., MP', fakultas: 'Fakultas Agroenterpreneur & Agraria', prodi: 'Agroteknologi', role: 'Dosen Tetap', nidn: '21086010' },
  { nama: 'Sunardi, SP., M.Si', fakultas: 'Fakultas Agroenterpreneur & Agraria', prodi: 'Agroteknologi', role: 'Dosen Tetap', nidn: '0405057808' },
  { nama: 'Flavia Devi Anggraeni, S.P., M.Si', fakultas: 'Fakultas Agroenterpreneur & Agraria', prodi: 'Agroteknologi', role: 'Dosen Tetap', nidn: '4848776677' },
  { nama: 'Yani Mulyani, S.Si, M.Si', fakultas: 'Fakultas Agroenterpreneur & Agraria', prodi: 'Agroteknologi', role: 'Dosen Tetap', nidn: '4441768669' },
  { nama: 'Dr. Yunus Arifien, Ir., M.Si', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Manajemen Pembangunan', role: 'Lektor Kepala', nidn: '0404116101' },
  { nama: 'Dr. Anna Fitriani, S.Pt., M.Si', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Manajemen Pembangunan', role: 'Dosen Tetap', nidn: '0028107302' },
  { nama: 'Dr. Lalu Solihin, SE., M.Si', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Manajemen Pembangunan', role: 'Dosen Tetap', nidn: '0330127704' },
  { nama: 'Dr. Edwin Aldrianto, Ir., M.Si', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Manajemen Pembangunan', role: 'Dosen Tetap', nidn: '9904212551' },
  { nama: 'Dr. Ir. Sugeng Budiharsono, MS', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Manajemen Pembangunan', role: 'Dosen Tetap', nidn: '0413076001' },
  { nama: 'Dr. Yuliana Purba', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Manajemen Pembangunan', role: 'Lektor Kepala', nidn: '-' },
  { nama: 'Dr. James Sinurat', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Manajemen Pembangunan', role: 'Dosen Tetap', nidn: '-' },
  { nama: 'Dr. Isbandriyati Mutmainah, SE., M.SE', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Manajemen', role: 'Lektor Kepala', nidn: '0404126802' },
  { nama: 'Iis Anisa Yulia, SE., MM', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Manajemen', role: 'Dosen Tetap', nidn: '0422078101' },
  { nama: 'Agus Pranamulya, SE., MM', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Manajemen', role: 'Dosen Tetap', nidn: '0428086802' },
  { nama: 'Heri Susanto, SE., MM', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Manajemen', role: 'Dosen Tetap', nidn: '0416047701' },
  { nama: 'Dewi Fitrianti, SE., M.Si', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Manajemen', role: 'Dosen Tetap', nidn: '0403107502' },
  { nama: 'Rumna, SE., M.Si', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Manajemen', role: 'Dosen Tetap', nidn: '0418036902' },
  { nama: 'Mulyana, Gustira Putra, SE., M.Si', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Manajemen', role: 'Dosen Tetap', nidn: '0431086406' },
  { nama: 'Nia Sonani, SE., MM', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Manajemen', role: 'Dosen Tetap', nidn: '0428081004' },
  { nama: 'Feni Marnilin, SE., M.Akt', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Akuntansi', role: 'Dosen Tetap', nidn: '0401039202' },
  { nama: 'Eha Hasni Wahidhani, SE., MM', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Akuntansi', role: 'Dosen Tetap', nidn: '0405086501' },
  { nama: 'Harmoko Sukayat, SE., M.Si', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Akuntansi', role: 'Dosen Tetap', nidn: '0405086501' },
  { nama: 'Dr. Hedar Rusman, S.E., A.k., M.M., CA.', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Akuntansi', role: 'Dosen Tetap', nidn: '0305117206' },
  { nama: 'Ichwan R. SE., M.Si', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Akuntansi', role: 'Dosen Tetap', nidn: '0404037206' },
  { nama: 'Rahmat Irawan, SE., M.Ak', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Akuntansi', role: 'Dosen Tetap', nidn: '0405018605' },
  { nama: 'Ahmad Zaid Mahfudi, SE., M.Akt', fakultas: 'Fakultas Ekonomi & Bisnis', prodi: 'Akuntansi', role: 'Dosen Tetap', nidn: '0412058701' },
  { nama: 'Dra. Nia Yuliani, M.Pd', fakultas: 'Fakultas Sains & Teknologi', prodi: 'Biologi', role: 'Lektor Kepala', nidn: '19076402' },
  { nama: 'Srikandi, S.Si., M.Si', fakultas: 'Fakultas Sains & Teknologi', prodi: 'Biologi', role: 'Dosen Tetap', nidn: '416086601' },
  { nama: 'Dra. Febi Nurilmala, M.Si', fakultas: 'Fakultas Sains & Teknologi', prodi: 'Biologi', role: 'Lektor Kepala', nidn: '9026701' },
  { nama: 'Dra. I Gusti Ayu Manik Widhyastini., M.Kes', fakultas: 'Fakultas Sains & Teknologi', prodi: 'Biologi', role: 'Dosen Tetap', nidn: '5086601' },
  { nama: 'Ade Ayu Oksari, S.Si., M.Si', fakultas: 'Fakultas Sains & Teknologi', prodi: 'Biologi', role: 'Dosen Tetap', nidn: '401108902' },
  { nama: 'Mia Azizah', fakultas: 'Fakultas Sains & Teknologi', prodi: 'Biologi', role: 'Dosen Tetap', nidn: '0406019001' },
  { nama: 'Dr. Lany Nurhayati, S.Si.,M.Si', fakultas: 'Fakultas Sains & Teknologi', prodi: 'Kimia', role: 'Lektor Kepala', nidn: '401126801' },
  { nama: 'Dian Arissunjaya, S.Pd., M.Si', fakultas: 'Fakultas Sains & Teknologi', prodi: 'Kimia', role: 'Dosen Tetap', nidn: '0413078802' },
  { nama: 'Dr. Mamay Maslahat, S.Si.,M.Si', fakultas: 'Fakultas Sains & Teknologi', prodi: 'Kimia', role: 'Dosen Tetap', nidn: '422097503' },
  { nama: 'Dr. Richson P. Hutagaol, S.Si., M.Si', fakultas: 'Fakultas Sains & Teknologi', prodi: 'Kimia', role: 'Lektor Kepala', nidn: '426017002' },
  { nama: 'Devy Susanty, S.Pd., M.Si', fakultas: 'Fakultas Sains & Teknologi', prodi: 'Kimia', role: 'Dosen Tetap', nidn: '431058902' },
  { nama: 'Nina Ariesta, S.Pd., M.Si', fakultas: 'Fakultas Sains & Teknologi', prodi: 'Kimia', role: 'Dosen Tetap', nidn: '414049102' },
  { nama: 'Amri Yahya, S.Si., M. Si', fakultas: 'Fakultas Sains & Teknologi', prodi: 'Kimia', role: 'Dosen Tetap', nidn: '0417019402' },
  { nama: 'Hamza Mursandi, S. Si, M.T', fakultas: 'Fakultas Sains & Teknologi', prodi: 'Kimia', role: 'Dosen Tetap', nidn: '9462776677' },
  { nama: 'Mohammad Fachruddin, S.Pd., M.Si', fakultas: 'Fakultas Sains & Teknologi', prodi: 'Kimia', role: 'Dosen Tetap', nidn: '0301079107' },
  { nama: 'Dr. Nurlela, S.Si., M.Si', fakultas: 'Fakultas Sains & Teknologi', prodi: 'Kimia', role: 'Dosen Tetap', nidn: '-' },
  { nama: 'Prof. Dr. Luluk Setyaningsih, S.Hut., M.Si', fakultas: 'Fakultas Kehutanan & Lingkungan', prodi: 'Kehutanan', role: 'Guru Besar', nidn: '407056801' },
  { nama: 'Tun Susdiyanti, S.Hut., M.Pd', fakultas: 'Fakultas Kehutanan & Lingkungan', prodi: 'Kehutanan', role: 'Lektor Kepala', nidn: '405096901' },
  { nama: 'Dr. Ir. Zainal Muttaqin, MP', fakultas: 'Fakultas Kehutanan & Lingkungan', prodi: 'Kehutanan', role: 'Lektor Kepala', nidn: '10086502' },
  { nama: 'Dr. Ratna Sari Hasibuan, S.Hut., M.Si', fakultas: 'Fakultas Kehutanan & Lingkungan', prodi: 'Kehutanan', role: 'Dosen Tetap', nidn: '413097102' },
  { nama: 'Kustin Bintani M., S.Hut., M.Si', fakultas: 'Fakultas Kehutanan & Lingkungan', prodi: 'Kehutanan', role: 'Dosen Tetap', nidn: '411057301' },
  { nama: 'Dr. Mesalina Salampessy, S.Hut.,M.Si', fakultas: 'Fakultas Kehutanan & Lingkungan', prodi: 'Kehutanan', role: 'Lektor Kepala', nidn: '24097602' },
  { nama: 'Ina Lidiawati, Ir., M.Si', fakultas: 'Fakultas Kehutanan & Lingkungan', prodi: 'Kehutanan', role: 'Dosen Tetap', nidn: '3086307' },
  { nama: 'Abdul Rahman Rusli, S.Hut., M.Si', fakultas: 'Fakultas Kehutanan & Lingkungan', prodi: 'Kehutanan', role: 'Dosen Tetap', nidn: '408086901' },
  { nama: 'Nengsih Anen, S.Hut., M.Si', fakultas: 'Fakultas Kehutanan & Lingkungan', prodi: 'Kehutanan', role: 'Dosen Tetap', nidn: '0412067505' },
  { nama: 'Dwi Agus Sasongko, S.Hut., M.Si', fakultas: 'Fakultas Kehutanan & Lingkungan', prodi: 'Kehutanan', role: 'Dosen Tetap', nidn: '0401097903' },
  { nama: 'Dr. Bambang Supriyanto', fakultas: 'Fakultas Kehutanan & Lingkungan', prodi: 'Kehutanan', role: 'Dosen Tetap', nidn: '8916350022' },
];

export function AboutTab() {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const [selectedPerson, setSelectedPerson] = useState<PimpinanDosen | null>(null);
  const [peopleQuery, setPeopleQuery] = useState("");
  const [peoplePage, setPeoplePage] = useState(1);
  const [showAllOrgUnits, setShowAllOrgUnits] = useState(false);

  const defaultProfileContent = {
    title: t.about.title,
    subtitle: t.about.subtitle,
    historyText: t.about.historyText,
    visionText: t.about.visionText,
    missions: [t.about.m1, t.about.m2, t.about.m3].filter(Boolean),
    sideImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
    sideTitle: "Kampus UNB Bogor",
    sideSubtitle: "Jl. KH. Sholeh Iskandar KM.4",
    facilities: [
      {
        id: "fac-1",
        title: t.about.fac1,
        description: t.about.fac1desc,
        imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop",
      },
      {
        id: "fac-2",
        title: t.about.fac2,
        description: t.about.fac2desc,
        imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop",
      },
      {
        id: "fac-3",
        title: t.about.fac3,
        description: t.about.fac3desc,
        imageUrl: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=600&auto=format&fit=crop",
      },
    ],
  };

  const normalizeProfileContent = (raw: any) => {
    if (!raw || typeof raw !== "object") return defaultProfileContent;
    if ("about" in raw || "visionMission" in raw) {
      return {
        ...defaultProfileContent,
        ...raw,
        title: raw.about?.title ?? defaultProfileContent.title,
        subtitle: raw.about?.subtitle ?? defaultProfileContent.subtitle,
        historyText: raw.history?.subtitle ?? raw.historyText ?? defaultProfileContent.historyText,
        visionText: raw.visionMission?.vision ?? raw.visionText ?? defaultProfileContent.visionText,
        missions: Array.isArray(raw.visionMission?.missions)
          ? raw.visionMission.missions
          : Array.isArray(raw.missions)
            ? raw.missions
            : defaultProfileContent.missions,
        sideImage: raw.visionMission?.sideImage ?? raw.sideImage ?? defaultProfileContent.sideImage,
        sideTitle: raw.visionMission?.sideTitle ?? raw.sideTitle ?? defaultProfileContent.sideTitle,
        sideSubtitle: raw.visionMission?.sideSubtitle ?? raw.sideSubtitle ?? defaultProfileContent.sideSubtitle,
        facilities: Array.isArray(raw.facilities) ? raw.facilities : defaultProfileContent.facilities,
      };
    }
    return { ...defaultProfileContent, ...raw };
  };

  const profileContent = settings.profileContent ? normalizeProfileContent(settings.profileContent) : defaultProfileContent;
  const peopleSource = Array.isArray((profileContent as any).people) ? (profileContent as any).people : PIMPINAN_DOSEN;
  const orgStructure = (profileContent as any).orgStructure && typeof (profileContent as any).orgStructure === "object"
    ? (profileContent as any).orgStructure
    : {
        atasPimpinan: ATAS_PIMPINAN_UNIVERSITAS,
        pimpinanInti: PIMPINAN_UNIVERSITAS_INTI,
        wakilRektor: STRUKTURAL.slice(1),
        dekan: DEKAN,
        kepalaBiro: KEPALA_BIRO,
      };

  const pageSize = 8;
  const normalizedPeopleQuery = peopleQuery.trim().toLowerCase();
  const filteredPeople = normalizedPeopleQuery
    ? peopleSource.filter((p: any) => {
        const haystack = [
          p.nama,
          p.role,
          p.fakultas,
          p.prodi,
          p.nidn,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedPeopleQuery);
      })
    : peopleSource;

  const totalPeoplePages = Math.max(1, Math.ceil(filteredPeople.length / pageSize));
  const currentPeoplePage = Math.min(peoplePage, totalPeoplePages);
  const peopleToRender = filteredPeople.slice(
    (currentPeoplePage - 1) * pageSize,
    currentPeoplePage * pageSize,
  );
  const orgUnitsToRender = showAllOrgUnits ? orgStructure.kepalaBiro : orgStructure.kepalaBiro.slice(0, 6);
  const getAvatarUrl = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=ffffff&size=512&bold=true`;

  return (
    <div className="animate-fade-in transition-colors duration-500">
      <section className="px-6 md:px-12 py-16">
        {/* Header */}
        <div className="mb-14">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500">
            {profileContent.title || t.about.title}
          </h2>
          <p className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em] mt-2">
            {profileContent.subtitle || t.about.subtitle}
          </p>
        </div>

        {/* Sejarah + Visi + Misi + Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-20">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-black italic uppercase mb-4 text-emerald-500">{t.about.history}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-loose transition-colors duration-500">
                {profileContent.historyText || t.about.historyText}
              </p>
            </div>
            <div className="p-6 border border-white/10 rounded-[30px] bg-card relative overflow-hidden transition-colors duration-500 shadow-xl">
              <div className="absolute -right-4 -top-4 text-7xl opacity-10">🌟</div>
              <h3 className="text-xl font-black italic uppercase mb-3 text-white transition-colors duration-500">{t.about.vision}</h3>
              <p className="text-[11px] text-gray-200 font-bold leading-relaxed tracking-wider uppercase transition-colors duration-500">
                {profileContent.visionText || t.about.visionText}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-black italic uppercase mb-3 text-black dark:text-white transition-colors duration-500">{t.about.mission}</h3>
              <ul className="text-[11px] text-gray-500 dark:text-gray-400 font-bold leading-relaxed tracking-wider uppercase space-y-3 list-disc list-inside marker:text-emerald-500 transition-colors duration-500">
                {(profileContent.missions?.length ? profileContent.missions : [t.about.m1, t.about.m2, t.about.m3])
                  .filter(Boolean)
                  .map((m: string, i: number) => (
                    <li key={i}>{m}</li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden border-2 border-black/5 dark:border-white/10 relative group transition-colors duration-500">
              <img
                src={profileContent.sideImage || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop"}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700"
                alt="Kampus"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white dark:from-black via-white/80 dark:via-black/80 to-transparent transition-colors duration-500">
                <p className="text-black dark:text-white font-black italic text-2xl uppercase transition-colors duration-500">
                  {profileContent.sideTitle || "Kampus UNB Bogor"}
                </p>
                <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest mt-1">
                  {profileContent.sideSubtitle || "Jl. KH. Sholeh Iskandar KM.4"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== STRUKTUR ORGANISASI DENGAN DATA NYATA ===== */}
        <div>
          <h3 className="text-3xl font-black italic uppercase mb-3 text-center text-black dark:text-white transition-colors duration-500">{t.about.structure}</h3>
          <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-12 transition-colors duration-500">Data Resmi Jabatan Struktural UNB</p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {orgStructure.atasPimpinan.map((item: any) => (
              <div key={item.label} className="bg-card border border-white/10 rounded-[22px] p-4 flex items-center gap-3 shadow-md">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-lg shrink-0 transition-colors duration-500">{item.icon}</div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 transition-colors duration-500 truncate">{item.label}</p>
                  <p className="text-[10px] text-gray-300 font-bold mt-1 leading-tight transition-colors duration-500">—</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pimpinan Universitas */}
          <div className="mb-10">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6 text-center border-b border-emerald-500/20 pb-3 transition-colors duration-500">PIMPINAN UNIVERSITAS</p>

            <div className="grid grid-cols-4 gap-3 sm:gap-5 mb-6">
              {orgStructure.pimpinanInti.map((item: any) => {
                const isEmerald = "emerald" in item && item.emerald;

                return (
                  <div
                    key={item.jabatan}
                    className={[
                      "bg-card rounded-[22px] p-3 sm:p-5 text-center transition-all duration-500 shadow-lg",
                      isEmerald ? "border-2 border-emerald-500/60 shadow-emerald-500/20" : "border border-white/10 hover:border-emerald-500/40",
                    ].join(" ")}
                  >
                    <div className={isEmerald ? "w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center text-lg sm:text-xl mb-2 sm:mb-3 border border-emerald-500/50 transition-colors duration-500" : "w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-white/5 rounded-full flex items-center justify-center text-lg sm:text-xl mb-2 sm:mb-3 transition-colors duration-500"}>
                      {item.icon}
                    </div>
                    <h4 className="font-black italic uppercase text-[9px] sm:text-xs text-white leading-tight transition-colors duration-500">{item.jabatan}</h4>
                    {"sub" in item && item.sub ? (
                      <p className="text-[7px] sm:text-[8px] text-emerald-400 font-bold uppercase tracking-widest mt-1">{item.sub}</p>
                    ) : null}
                    <p className={isEmerald ? "text-[9px] sm:text-[10px] text-gray-200 font-bold mt-2 leading-tight transition-colors duration-500" : "text-[9px] sm:text-[10px] text-gray-300 font-bold mt-2 leading-tight transition-colors duration-500"}>
                      {item.nama}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Garis vertikal ke Wakil Rektor */}
            <div className="flex justify-center mb-4 hidden md:flex">
              <div className="w-px h-6 bg-emerald-500/30"></div>
            </div>

            {/* Wakil Rektor 1, 2, 3 */}
            <div className="grid grid-cols-3 gap-3 sm:gap-5">
              {orgStructure.wakilRektor.map((item: any) => (
                <div key={item.jabatan} className="bg-card border border-white/10 rounded-[25px] p-3 sm:p-5 text-center hover:border-emerald-500/40 transition-all duration-500 shadow-lg">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 mx-auto bg-white/5 rounded-full flex items-center justify-center text-lg sm:text-xl mb-2 sm:mb-3 transition-colors duration-500">{item.icon}</div>
                  <h4 className="font-black italic uppercase text-[10px] sm:text-xs text-white transition-colors duration-500">{item.jabatan}</h4>
                  <p className="text-[7px] sm:text-[8px] text-emerald-400 font-bold uppercase tracking-widest mt-1">{item.sub}</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-300 font-bold mt-2 leading-tight transition-colors duration-500">{item.nama}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dekan Fakultas */}
          <div className="mb-10">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6 text-center border-b border-emerald-500/20 pb-3 transition-colors duration-500">DEKAN FAKULTAS</p>
            <div className="grid grid-cols-2 gap-5">
              {orgStructure.dekan.map((item: any) => (
                <div key={item.jabatan} className="bg-card border border-white/10 rounded-[25px] p-5 flex items-start gap-4 hover:border-emerald-500/40 transition-all duration-500 shadow-lg">
                  <div className="w-11 h-11 bg-white/5 rounded-full flex items-center justify-center text-xl shrink-0 transition-colors duration-500">{item.icon}</div>
                  <div className="min-w-0">
                    <h4 className="font-black italic uppercase text-[10px] text-white leading-tight transition-colors duration-500 break-words">{item.jabatan}</h4>
                    <p className="text-[10px] text-gray-300 font-bold mt-1 transition-colors duration-500 break-words">{item.nama}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kepala Biro & Lembaga */}
          <div>
            <div className="flex items-end justify-between gap-6 mb-6 border-b border-emerald-500/20 pb-3">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 text-center transition-colors duration-500">KEPALA BIRO &amp; LEMBAGA</p>
              <button
                type="button"
                onClick={() => setShowAllOrgUnits((v) => !v)}
                className="text-emerald-500 font-black uppercase tracking-widest text-[10px] hover:text-emerald-400 transition-colors whitespace-nowrap"
              >
                {showAllOrgUnits ? 'Sembunyikan' : 'Lihat Semua'} →
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {orgUnitsToRender.map((item: any) => (
                <div key={item.jabatan} className="bg-card border border-white/10 rounded-[20px] p-4 flex items-start gap-3 hover:border-emerald-500/30 transition-all duration-500 shadow-md">
                  <div className="w-9 h-9 bg-emerald-500/10 rounded-full flex items-center justify-center text-lg shrink-0 transition-colors duration-500">{item.icon}</div>
                  <div>
                    <h4 className="font-black italic uppercase text-[9px] text-emerald-400 transition-colors duration-500">{item.jabatan}</h4>
                    <p className="text-[10px] text-gray-300 font-bold mt-0.5 leading-tight transition-colors duration-500">{item.nama}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500">
                Pimpinan &amp; Dosen
              </h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-1 transition-colors duration-500">
                Akademisi terbaik di bidangnya.
              </p>
            </div>
            <div className="w-full sm:w-72">
              <Input
                value={peopleQuery}
                onChange={(e) => {
                  setPeopleQuery(e.target.value);
                  setPeoplePage(1);
                }}
                placeholder="Cari pimpinan/dosen..."
                className="h-9 rounded-full text-[11px] font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {peopleToRender.map((p: any) => (
              <button
                key={`${p.nama}-${p.nidn}-${p.role}`}
                type="button"
                onClick={() => setSelectedPerson(p)}
                className="bg-card border border-white/10 rounded-[30px] p-4 text-left hover:border-emerald-500/40 transition-all duration-500 shadow-xl group"
              >
                <div className="aspect-[16/10] rounded-[22px] overflow-hidden bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 transition-colors duration-500">
                  <img
                    src={p.photoUrl || getAvatarUrl(p.nama)}
                    alt={p.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-[11px] font-black uppercase tracking-widest text-emerald-500">
                    {p.role}
                  </p>
                  <h4 className="font-black italic uppercase text-[12px] text-black dark:text-white mt-1 leading-tight transition-colors duration-500">
                    {p.nama}
                  </h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-2 leading-snug transition-colors duration-500">
                    {p.fakultas !== '-' ? p.fakultas : 'Universitas'}
                  </p>
                  <p className="text-[9px] text-emerald-500/70 font-bold uppercase tracking-widest mt-1 transition-colors duration-500">
                    {p.prodi !== '-' ? p.prodi : '—'} · NIDN: {p.nidn}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest transition-colors duration-500">
              {filteredPeople.length} data · Halaman {currentPeoplePage} / {totalPeoplePages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPeoplePage((p) => Math.max(1, p - 1))}
                disabled={currentPeoplePage <= 1}
                className="h-9 px-4 rounded-full border border-white/10 bg-card text-[10px] font-black uppercase tracking-widest text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-emerald-500/40 transition-colors"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                onClick={() => setPeoplePage((p) => Math.min(totalPeoplePages, p + 1))}
                disabled={currentPeoplePage >= totalPeoplePages}
                className="h-9 px-4 rounded-full border border-white/10 bg-card text-[10px] font-black uppercase tracking-widest text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-emerald-500/40 transition-colors"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>

        <div className="mb-20 mt-24">
          <h3 className="text-3xl font-black italic uppercase mb-8 text-center text-black dark:text-white transition-colors duration-500">{t.about.facilities}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(profileContent.facilities?.length ? profileContent.facilities : defaultProfileContent.facilities).map((f: any) => (
              <div key={f.id} className="bg-card rounded-[30px] p-4 border border-white/10 group hover:border-emerald-500/50 transition-all duration-500 shadow-xl">
                <div className="aspect-video rounded-[20px] overflow-hidden mb-4">
                  <img src={f.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={f.title} />
                </div>
                <h4 className="font-black italic uppercase px-2 text-sm text-white transition-colors duration-500">{f.title}</h4>
                <p className="text-[10px] text-emerald-500/60 px-2 mt-1 font-bold transition-colors duration-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        <Dialog open={!!selectedPerson} onOpenChange={(open) => { if (!open) setSelectedPerson(null); }}>
          <DialogContent className="max-w-lg bg-white dark:bg-[#111] border-black/10 dark:border-white/10 rounded-[30px] p-0 overflow-hidden">
            {selectedPerson && (
              <div>
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-8 relative">
                  <button
                    type="button"
                    onClick={() => setSelectedPerson(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                    aria-label="Tutup"
                  >
                    ✕
                  </button>
                  <div className="w-24 h-24 rounded-full border-4 border-white/70 bg-white/20 overflow-hidden mx-auto shadow-2xl">
                    <img src={selectedPerson.photoUrl || getAvatarUrl(selectedPerson.nama)} alt={selectedPerson.nama} className="w-full h-full object-cover" />
                  </div>
                </div>

                <DialogHeader className="px-8 pt-6 pb-2 text-center">
                  <DialogTitle className="text-xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500">
                    {selectedPerson.nama}
                  </DialogTitle>
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                      {selectedPerson.role}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <a
                      href={`mailto:${selectedPerson.email ?? "info@unb.ac.id"}?subject=${encodeURIComponent(`Kontak: ${selectedPerson.nama}`)}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                      Email
                    </a>
                  </div>
                </DialogHeader>

                <div className="px-8 pb-8 pt-4">
                  <div className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[22px] p-5 transition-colors duration-500">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between gap-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 transition-colors duration-500">Fakultas</span>
                        <span className="text-[10px] font-bold text-black dark:text-white text-right transition-colors duration-500">{selectedPerson.fakultas}</span>
                      </div>
                      <div className="flex justify-between gap-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 transition-colors duration-500">Prodi</span>
                        <span className="text-[10px] font-bold text-black dark:text-white text-right transition-colors duration-500">{selectedPerson.prodi}</span>
                      </div>
                      <div className="flex justify-between gap-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 transition-colors duration-500">NIDN</span>
                        <span className="text-[10px] font-bold text-black dark:text-white text-right transition-colors duration-500">{selectedPerson.nidn}</span>
                      </div>
                      <div className="flex justify-between gap-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 transition-colors duration-500">Email</span>
                        <a
                          href={`mailto:${selectedPerson.email ?? "info@unb.ac.id"}?subject=${encodeURIComponent(`Kontak: ${selectedPerson.nama}`)}`}
                          className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 text-right transition-colors duration-500 break-all"
                        >
                          {selectedPerson.email ?? "info@unb.ac.id"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
