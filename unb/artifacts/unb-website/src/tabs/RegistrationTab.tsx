import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateRegistration } from '../hooks/use-registrations';
import { useToast } from '@/hooks/use-toast';
import { MediaBanner } from '../components/MediaBanner';
import { 
  UserCheck, 
  FileEdit, 
  CreditCard, 
  UploadCloud, 
  ClipboardCheck, 
  CheckCircle,
  CalendarDays,
  ArrowRight,
  GraduationCap,
  Trophy,
  Gift,
  Info,
  MapPin,
  Download,
  MessageCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const formSchema = z.object({
  fullName: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Required"),
  birthDate: z.string().min(1, "Required"),
  address: z.string().min(5, "Required"),
  faculty: z.string().min(1, "Required"),
  program: z.string().min(1, "Required"),
  registrationType: z.enum(["reguler", "jalur_prestasi", "jalur_mandiri"]),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const FACULTY_PROGRAMS: Record<string, string[]> = {
  "Fakultas Ekonomi & Bisnis": ["Manajemen", "Akutansi", "Magister Ekonomi Pembangunan (Pascasarjana)"],
  "Fakultas Agroteknopreneur & Agraria": ["Agroteknologi", "Agribisnis"],
  "Fakultas Sains & Teknologi": ["Kimia", "Biologi", "Data Sains"],
  "Fakultas Kehutanan & Lingkungan": ["Kehutanan & Lingkungan"]
};

const ADMISSION_FLOW = [
  { 
    id: 1, 
    title: 'Pra-Pendaftaran', 
    sub: 'Pre-Registration', 
    icon: UserCheck,
    desc: 'Calon mahasiswa melakukan registrasi akun di portal pendaftaran dengan email aktif untuk mendapatkan akses ke formulir pendaftaran online.'
  },
  { 
    id: 2, 
    title: 'Isi Formulir', 
    sub: 'Fill Registration Form', 
    icon: FileEdit,
    desc: 'Melengkapi data diri secara detail, data orang tua/wali, serta riwayat pendidikan pada formulir pendaftaran yang telah disediakan.'
  },
  { 
    id: 3, 
    title: 'Pembayaran', 
    sub: 'Pay Registration Fees', 
    icon: CreditCard,
    desc: 'Melakukan pembayaran biaya pendaftaran melalui bank atau kanal pembayaran resmi yang tersedia untuk memvalidasi pendaftaran Anda.'
  },
  { 
    id: 4, 
    title: 'Lengkapi Berkas', 
    sub: 'Complete Form', 
    icon: UploadCloud,
    desc: 'Mengunggah dokumen pendukung seperti scan ijazah/SKL, Kartu Keluarga, KTP, dan foto terbaru untuk keperluan verifikasi administrasi.'
  },
  { 
    id: 5, 
    title: 'Seleksi', 
    sub: 'Selection Process', 
    icon: ClipboardCheck,
    desc: 'Mengikuti ujian saringan masuk (Computer Based Test) atau seleksi berkas/prestasi sesuai dengan jalur pendaftaran yang Anda pilih.'
  },
  { 
    id: 6, 
    title: 'Daftar Ulang', 
    sub: 'Re-Registration', 
    icon: CheckCircle,
    desc: 'Setelah dinyatakan lulus, calon mahasiswa melakukan konfirmasi kedatangan dan melunasi biaya administrasi semester pertama.'
  },
];

const ADMISSION_TRACKS = [
  { 
    id: 1, 
    title: 'Jalur Reguler', 
    sub: 'Regular Admission', 
    icon: GraduationCap, 
    desc: 'Jalur seleksi umum bagi lulusan SMA/SMK/MA sederajat melalui tes saringan masuk universitas untuk mengukur kemampuan akademik dasar calon mahasiswa.' 
  },
  { 
    id: 2, 
    title: 'Jalur Prestasi', 
    sub: 'Achievement Track', 
    icon: Trophy, 
    desc: 'Jalur khusus tanpa tes tertulis bagi siswa yang memiliki prestasi akademik (seperti peringkat kelas) atau non-akademik (olahraga, seni, atau organisasi) minimal tingkat kabupaten/kota.' 
  },
  { 
    id: 3, 
    title: 'Jalur Beasiswa', 
    sub: 'Scholarship Track', 
    icon: Gift, 
    desc: 'Program bantuan biaya pendidikan yang meliputi Beasiswa Hafiz Quran (minimal 10 juz), Beasiswa Prestasi Unggulan, dan KIP Kuliah bagi mahasiswa yang memenuhi kriteria ekonomi dan akademik.' 
  },
];

const ADMISSION_WAVES = [
  { title: 'Gelombang 1', date: 'Januari - Maret 2026', status: 'Buka', active: true },
  { title: 'Gelombang 2', date: 'April - Juni 2026', status: 'Segera', active: false },
  { title: 'Gelombang 3', date: 'Juli - Agustus 2026', status: 'Segera', active: false },
];

const TUITION_DATA = [
  {
    no: "I",
    faculty: "Fakultas Ekonomi & Bisnis",
    programs: [
      { name: "Manajemen", reguler: "5,005,000", ekstensi: "6,240,000" },
      { name: "Akutansi", reguler: "5,005,000", ekstensi: "6,240,000" },
      { name: "Magister Ekonomi Pembangunan (Pascasarjana)", reguler: "7,500,000", ekstensi: "8,500,000" },
    ]
  },
  {
    no: "II",
    faculty: "Fakultas Agroteknopreneur & Agraria",
    programs: [
      { name: "Agroteknologi", reguler: "5,520,000", ekstensi: "6,810,000" },
      { name: "Agribisnis", reguler: "5,520,000", ekstensi: "6,810,000" },
    ]
  },
  {
    no: "III",
    faculty: "Fakultas Sains & Teknologi",
    programs: [
      { name: "Kimia", reguler: "5,150,000", ekstensi: "6,275,000" },
      { name: "Biologi", reguler: "5,245,000", ekstensi: "6,370,000" },
      { name: "Data Sains", reguler: "5,300,000", ekstensi: "6,500,000" },
    ]
  },
  {
    no: "IV",
    faculty: "Fakultas Kehutanan & Lingkungan",
    programs: [
      { name: "Kehutanan & Lingkungan", reguler: "5,520,000", ekstensi: "6,810,000" },
    ]
  }
];

export function RegistrationTab() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const createRegistration = useCreateRegistration();
  const [selectedDetail, setSelectedDetail] = useState<{title: string, desc: string, sub?: string} | null>(null);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { registrationType: "reguler" }
  });

  const selectedFaculty = watch("faculty");
  const regType = watch("registrationType");
  const availablePrograms = selectedFaculty ? FACULTY_PROGRAMS[selectedFaculty] || [] : [];

  const onSubmit = async (data: FormValues) => {
    try {
      await createRegistration.mutateAsync({ data });
      toast({
        title: t.register.success,
        description: t.register.successDesc,
        className: "bg-emerald-500 border-none text-white font-bold shadow-2xl"
      });
      reset();
    } catch {
      toast({
        title: t.register.error,
        description: t.register.errorDesc,
        variant: "destructive"
      });
    }
  };

  const inputCls = "w-full bg-white dark:bg-[#0d0d0d] border border-black/10 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm font-medium text-black dark:text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-colors duration-500";
  const labelCls = "block text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-500";

  return (
    <div className="animate-fade-in">
      <section className="px-6 md:px-12 pt-6 pb-16">
        {/* Banner Landscape */}
        <div className="mb-12">
          <MediaBanner items={[
            { type: 'image', url: 'https://images.unsplash.com/photo-1523050853064-8521a3998af7?q=80&w=1200' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200' }
          ]} />
        </div>

        {/* Alur Pendaftaran */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500">Alur Pendaftaran</h2>
            <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Langkah Mudah Bergabung Bersama Kami</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
            {/* Horizontal line for desktop */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-white/10 -z-0 transition-colors duration-500"></div>
            
            {ADMISSION_FLOW.map((step) => (
              <div 
                key={step.id} 
                className="relative z-10 flex flex-col items-center group cursor-pointer"
                onClick={() => setSelectedDetail({ title: step.title, desc: step.desc, sub: step.sub })}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-card border border-white/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-500 backdrop-blur-xl relative">
                  <step.icon size={24} className="md:w-8 md:h-8" strokeWidth={1.5} />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-emerald-900 transition-colors duration-500">
                    {step.id}
                  </div>
                  <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info size={10} className="text-emerald-400" />
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-[11px] md:text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-white mb-1 group-hover:text-emerald-500 transition-colors duration-500">{step.title}</h4>
                  <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-emerald-600/80 dark:text-emerald-500/60 leading-tight">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jalur Pendaftaran */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500">Jalur Pendaftaran</h2>
            <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Pilih Jalur Yang Sesuai Dengan Kualifikasi Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ADMISSION_TRACKS.map((track) => (
              <div 
                key={track.id}
                className="group cursor-pointer bg-card border border-white/10 rounded-[35px] p-8 hover:border-emerald-500/30 hover:shadow-[0_0_50px_rgba(16,185,129,0.2)] transition-all duration-500 relative overflow-hidden shadow-sm"
                onClick={() => setSelectedDetail({ title: track.title, desc: track.desc, sub: track.sub })}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] group-hover:bg-emerald-500/10 transition-colors"></div>
                
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 transition-transform duration-500">
                  <track.icon size={28} strokeWidth={1.5} />
                </div>

                <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-2 group-hover:text-emerald-400 transition-colors duration-500">{track.title}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/60 mb-6">{track.sub}</p>
                
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  Lihat Detail
                  <ArrowRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jadwal Gelombang */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500">Waktu Pendaftaran</h2>
              <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Tahun Akademik 2026/2027</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl flex items-center gap-3 transition-colors duration-500">
              <CalendarDays size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Pendaftaran Dibuka</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ADMISSION_WAVES.map((wave, idx) => (
              <div 
                key={idx} 
                className={`p-8 rounded-[35px] border transition-all duration-500 relative overflow-hidden group ${
                  wave.active 
                    ? 'bg-emerald-800/80 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.3)]' 
                    : 'bg-card border-white/10 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 shadow-sm'
                }`}
              >
                {wave.active && (
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-[40px]"></div>
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    wave.active ? 'bg-emerald-500 text-white' : 'bg-white/10 text-emerald-500/60'
                  }`}>
                    {wave.status}
                  </div>
                  <CalendarDays size={20} className={wave.active ? 'text-emerald-400' : 'text-emerald-500/40'} />
                </div>

                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2 transition-colors duration-500">{wave.title}</h3>
                <p className={`text-[11px] font-bold uppercase tracking-[0.2em] mb-8 transition-colors duration-500 ${wave.active ? 'text-emerald-300' : 'text-emerald-500/40'}`}>
                  {wave.date}
                </p>

                <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${wave.active ? 'text-emerald-300' : 'text-emerald-500/40'}`}>
                  {wave.active ? 'Daftar Sekarang' : 'Coming Soon'}
                  <ArrowRight size={12} className={wave.active ? 'text-emerald-400' : 'text-emerald-900'} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tuition Table */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500">Detail Biaya Pendidikan</h2>
              <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Estimasi Biaya Semester I</p>
            </div>
            <button className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 transition-all group">
              <Download size={16} className="group-hover:scale-110 transition-transform" />
              Unduh Brosur
            </button>
          </div>

          <div className="bg-card border border-white/10 rounded-[30px] overflow-hidden shadow-2xl transition-colors duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 transition-colors duration-500">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-400">No</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-400">Fakultas / Program Studi</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-400">Reguler (Rp)</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-400">Ekstensi (Rp)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300 transition-colors duration-500">
                  {TUITION_DATA.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <tr className="bg-emerald-500/10">
                        <td className="px-6 py-3 font-bold text-white text-xs">{item.no}</td>
                        <td colSpan={3} className="px-6 py-3 font-bold text-white text-xs uppercase tracking-wider">{item.faculty}</td>
                      </tr>
                      {item.programs.map((prog, pIdx) => (
                        <tr key={pIdx} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-500">
                          <td className="px-6 py-4"></td>
                          <td className="px-6 py-4 text-xs font-medium">{prog.name}</td>
                          <td className="px-6 py-4 text-xs font-mono">{prog.reguler}</td>
                          <td className="px-6 py-4 text-xs font-mono">{prog.ekstensi}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-black/20 transition-colors duration-500">
              <p className="text-[9px] text-emerald-500/60 italic font-medium">* Biaya sewaktu-waktu dapat berubah sesuai kebijakan universitas. SPS (Sumbangan Pengembangan Studi) dibayarkan sekali di awal pendaftaran.</p>
            </div>
          </div>
        </div>

        {/* Header Form */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500">{t.register.title}</h2>
          <p className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em] mt-2">{t.register.subtitle}</p>
        </div>

        {/* Form */}
        <div className="bg-card border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden max-w-3xl mx-auto transition-colors duration-500">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            {/* Row 1: Nama + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>{t.register.fullName}</label>
                <input {...register("fullName")} className={inputCls} placeholder="John Doe" />
                {errors.fullName && <p className="text-[9px] text-red-400 mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className={labelCls}>{t.register.email}</label>
                <input {...register("email")} type="email" className={inputCls} placeholder="email@domain.com" />
                {errors.email && <p className="text-[9px] text-red-400 mt-1">{errors.email.message}</p>}
              </div>
            </div>

            {/* Row 2: Telepon + Tanggal Lahir */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>{t.register.phone}</label>
                <input {...register("phone")} className={inputCls} placeholder="+62 812 3456 7890" />
                {errors.phone && <p className="text-[9px] text-red-400 mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className={labelCls}>{t.register.birthDate}</label>
                <input {...register("birthDate")} type="date" className={`${inputCls} [color-scheme:dark]`} />
                {errors.birthDate && <p className="text-[9px] text-red-400 mt-1">{errors.birthDate.message}</p>}
              </div>
            </div>

            {/* Alamat */}
            <div>
              <label className={labelCls}>{t.register.address}</label>
              <textarea {...register("address")} className={`${inputCls} resize-none h-24`} placeholder="Jl. ..." />
              {errors.address && <p className="text-[9px] text-red-400 mt-1">{errors.address.message}</p>}
            </div>

            {/* Fakultas + Prodi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10 transition-colors duration-500">
              <div>
                <label className={labelCls}>{t.register.faculty}</label>
                <select {...register("faculty")} className={`${inputCls} appearance-none cursor-pointer bg-emerald-950/50`}>
                  <option value="" className="bg-emerald-950 text-white">{t.register.selectFaculty}</option>
                  {Object.keys(FACULTY_PROGRAMS).map(fac => (
                    <option key={fac} value={fac} className="bg-emerald-950 text-white">{fac}</option>
                  ))}
                </select>
                {errors.faculty && <p className="text-[9px] text-red-400 mt-1">{errors.faculty.message}</p>}
              </div>
              <div>
                <label className={labelCls}>{t.register.program}</label>
                <select {...register("program")} className={`${inputCls} appearance-none cursor-pointer bg-emerald-950/50`} disabled={!selectedFaculty}>
                  <option value="" className="bg-emerald-950 text-white">{t.register.selectProgram}</option>
                  {availablePrograms.map(prog => (
                    <option key={prog} value={prog} className="bg-emerald-950 text-white">{prog}</option>
                  ))}
                </select>
                {errors.program && <p className="text-[9px] text-red-400 mt-1">{errors.program.message}</p>}
              </div>
            </div>

            {/* Jalur Pendaftaran */}
            <div>
              <label className={labelCls}>{t.register.type}</label>
              <div className="grid grid-cols-3 gap-3">
                {(['reguler', 'jalur_prestasi', 'jalur_mandiri'] as const).map((type) => (
                  <label
                    key={type}
                    className={`flex items-center justify-center p-3 rounded-2xl border cursor-pointer transition-all text-center ${
                      regType === type
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-emerald-950/30 border-white/10 text-emerald-500/60 hover:border-white/30 transition-colors duration-500'
                    }`}
                  >
                    <input type="radio" value={type} {...register("registrationType")} className="sr-only" />
                    <span className="text-[8px] font-black uppercase tracking-wider">{type.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pesan Opsional */}
            <div>
              <label className={labelCls}>{t.register.message}</label>
              <textarea {...register("message")} className={`${inputCls} resize-none h-20`} placeholder="..." />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={createRegistration.isPending || isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
            >
              {(createRegistration.isPending || isSubmitting) && (
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              )}
              {t.register.submit}
            </button>
          </form>
        </div>

        {/* Pendaftaran Manual / Walk-in */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-card border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden group transition-colors duration-500">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] group-hover:bg-emerald-500/10 transition-colors"></div>
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <FileEdit size={24} />
              </div>
              <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white transition-colors duration-500">Pendaftaran Manual</h3>
            </div>
            
            <p className="text-sm text-gray-300 mb-10 leading-relaxed relative z-10 transition-colors duration-500">
              Anda juga dapat mendaftar secara langsung dengan mengunduh dan mengisi formulir pendaftaran fisik, kemudian membawanya ke bagian pendaftaran di kampus kami.
            </p>

            <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-7 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 group/btn relative z-10">
              <Download size={18} className="text-emerald-400 group-hover/btn:scale-110 transition-transform" />
              Unduh Formulir Pendaftaran (PDF)
            </button>
          </div>

          <div className="bg-card border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden group transition-colors duration-500">
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] group-hover:bg-emerald-500/10 transition-colors"></div>
            
            <div className="space-y-10 relative z-10">
              {/* Alamat */}
              <div className="flex gap-5">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">Lokasi Kampus</h4>
                  <p className="text-sm text-white font-medium leading-relaxed transition-colors duration-500">
                    Jl. KH. Sholeh Iskandar Km. 4<br />
                    Tanah Sareal, Kota Bogor<br />
                    Jawa Barat 16166
                  </p>
                </div>
              </div>

              {/* Kontak */}
              <div className="flex gap-5">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">Layanan WhatsApp</h4>
                  <p className="text-sm text-white font-medium mb-4 transition-colors duration-500">+62 812-3456-7890 (Admin PMB)</p>
                  <a 
                    href="https://wa.me/6281234567890" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Chat Sekarang
                    <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <Dialog open={!!selectedDetail} onOpenChange={() => setSelectedDetail(null)}>
        <DialogContent className="bg-card border-white/10 text-white rounded-[35px] max-w-md transition-colors duration-500">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-emerald-400">
              {selectedDetail?.title}
            </DialogTitle>
            {selectedDetail?.sub && (
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500/60 mt-1">
                {selectedDetail.sub}
              </p>
            )}
          </DialogHeader>
          <div className="mt-6">
            <p className="text-sm text-gray-300 leading-relaxed font-medium transition-colors duration-500">
              {selectedDetail?.desc}
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-end transition-colors duration-500">
            <button 
              onClick={() => setSelectedDetail(null)}
              className="px-8 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              Tutup Detail
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
