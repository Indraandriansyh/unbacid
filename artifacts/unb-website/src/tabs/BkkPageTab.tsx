import { useState, useMemo } from "react";
import { MediaBanner } from "../components/MediaBanner";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, ExternalLink, Tag, Calendar, Building2, Globe, Users } from "lucide-react";

export type BkkCard = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  detail?: string;
  icon?: string;
  date?: string;
  tags?: string[];
  downloadUrl?: string;
  downloadLabel?: string;
  linkUrl?: string;
  linkLabel?: string;
  badgeText?: string;
  badgeColor?: "emerald" | "blue" | "yellow" | "red" | "purple";
  // cooperation-specific
  partner?: string;
  partnerType?: string;
  // student_affairs-specific
  organizer?: string;
  participants?: string;
};

export type BkkPageContent = {
  banner: { type: "image" | "video"; url: string }[];
  description: string;
  cards: BkkCard[];
};

export type BkkContent = {
  pages: {
    cooperation: BkkPageContent;
    student_affairs: BkkPageContent;
  };
};

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());

export const DEFAULT_BKK_CONTENT: BkkContent = {
  pages: {
    cooperation: {
      banner: [
        { type: "image", url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1400" },
        { type: "image", url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400" },
      ],
      description:
        "Biro Kerja Sama dan Kemahasiswaan (BKK) Universitas Nusa Bangsa aktif membangun jaringan kerjasama strategis dengan berbagai instansi pemerintah, BUMN, perusahaan swasta, dan perguruan tinggi di dalam dan luar negeri. Kerjasama ini diwujudkan dalam program magang, penelitian bersama, pengabdian masyarakat, dan pertukaran akademik.",
      cards: [
        {
          id: makeId(),
          title: "MoU dengan Kementerian Pertanian RI",
          subtitle: "Nomor: 01/MoU/UNB-KEMENTAN/2024",
          description: "Perjanjian kerjasama strategis dengan Kementerian Pertanian RI dalam bidang penelitian, pengembangan SDM pertanian, dan program magang mahasiswa di Unit Pelaksana Teknis Kementan.",
          detail: "Ruang lingkup kerjasama: (1) Penelitian bersama pengembangan varietas tanaman unggul lokal; (2) Program magang mahasiswa agroteknologi di Balai Penelitian Kementan; (3) Pertukaran narasumber untuk kuliah umum dan workshop; (4) Publikasi bersama hasil penelitian; (5) Pengabdian masyarakat di kawasan pertanian binaan Kementan. MoU berlaku 3 tahun dan dapat diperpanjang. Ditandatangani 15 Januari 2024.",
          icon: "🏛️",
          date: "15 Januari 2024",
          tags: ["Pemerintah", "Pertanian", "Magang"],
          badgeText: "Aktif",
          badgeColor: "emerald",
          partner: "Kementerian Pertanian RI",
          partnerType: "Instansi Pemerintah",
        },
        {
          id: makeId(),
          title: "Kerjasama dengan PT Bank BJB Syariah",
          subtitle: "Nomor: 02/MoU/UNB-BJB/2024",
          description: "Kerjasama dengan PT Bank BJB Syariah mencakup program beasiswa mahasiswa berprestasi, layanan keuangan kampus, dan pengembangan literasi keuangan syariah.",
          detail: "Program kerjasama meliputi: (1) Beasiswa BJB Syariah untuk 20 mahasiswa berprestasi per tahun senilai Rp 6 juta/semester; (2) Layanan pembayaran UKT via virtual account BJB Syariah; (3) Seminar literasi keuangan syariah untuk mahasiswa; (4) Penelitian bersama ekonomi syariah; (5) Peluang PKL/magang di kantor-kantor BJB Syariah. Total nilai kerjasama: Rp 480 juta per tahun.",
          icon: "🏦",
          date: "20 Februari 2024",
          tags: ["BUMN", "Beasiswa", "Keuangan Syariah"],
          badgeText: "Aktif",
          badgeColor: "emerald",
          partner: "PT Bank BJB Syariah",
          partnerType: "BUMN",
        },
        {
          id: makeId(),
          title: "Kerjasama dengan PT Pertamina (Persero)",
          subtitle: "Nomor: 05/MoU/UNB-PERTAMINA/2023",
          description: "Kerjasama dengan Pertamina dalam program magang mahasiswa, penelitian energi terbarukan, dan beasiswa Pertamina Foundation untuk mahasiswa berprestasi.",
          detail: "Kerjasama UNB-Pertamina berfokus pada: (1) Program magang mahasiswa di berbagai unit bisnis Pertamina (kilang, SPBU, eksplorasi); (2) Penelitian bersama energi terbarukan dan efisiensi energi; (3) Beasiswa Pertamina Foundation 15 mahasiswa/tahun; (4) Guest lecture dari eksekutif Pertamina; (5) CSR Pertamina untuk pengabdian masyarakat di sekitar kampus. MoU berlaku sejak Juli 2023 s.d. Juli 2026.",
          icon: "⚡",
          date: "1 Juli 2023",
          tags: ["Energi", "Magang", "Beasiswa"],
          badgeText: "Aktif",
          badgeColor: "emerald",
          partner: "PT Pertamina (Persero)",
          partnerType: "BUMN",
        },
        {
          id: makeId(),
          title: "Kerjasama dengan Pemkot Bogor",
          subtitle: "Nomor: 08/MoU/UNB-PEMKOT/2024",
          description: "Kerjasama dengan Pemerintah Kota Bogor untuk pengabdian masyarakat, penelitian pengembangan kota, dan program KKN mahasiswa di kelurahan-kelurahan Kota Bogor.",
          detail: "Ruang lingkup MoU UNB-Pemkot Bogor: (1) Program KKN tematik mahasiswa di 20 kelurahan Kota Bogor; (2) Penelitian pengembangan UMKM dan ketahanan pangan; (3) Pendampingan program pertanian perkotaan (urban farming); (4) Pengembangan sistem informasi kelurahan; (5) Pelatihan kompetensi ASN Pemkot oleh dosen UNB. MoU ini merupakan kelanjutan dari kerjasama sebelumnya sejak 2018.",
          icon: "🏙️",
          date: "10 Maret 2024",
          tags: ["Pemda", "KKN", "Pengabdian"],
          badgeText: "Aktif",
          badgeColor: "emerald",
          partner: "Pemerintah Kota Bogor",
          partnerType: "Pemerintah Daerah",
        },
        {
          id: makeId(),
          title: "Kerjasama dengan IPB University",
          subtitle: "Nomor: 11/MoU/UNB-IPB/2024",
          description: "Kerjasama dengan IPB University dalam pengembangan akademik, pertukaran dosen dan mahasiswa, serta kolaborasi penelitian bidang pertanian dan lingkungan.",
          detail: "Program kerjasama antar perguruan tinggi: (1) Student exchange program — mahasiswa UNB dapat mengambil kredit di IPB dan sebaliknya; (2) Joint research dan penulisan artikel ilmiah bersama; (3) Sharing fasilitas laboratorium untuk penelitian; (4) Pengakuan kredit program MBKM lintas kampus; (5) Co-supervisi tesis/disertasi; (6) Seminar bersama dan pengiriman dosen ke konferensi. MoU berlaku 5 tahun mulai Januari 2024.",
          icon: "🎓",
          date: "8 Januari 2024",
          tags: ["Perguruan Tinggi", "Exchange", "Joint Research"],
          badgeText: "Aktif",
          badgeColor: "blue",
          partner: "IPB University",
          partnerType: "Perguruan Tinggi",
        },
        {
          id: makeId(),
          title: "Kerjasama dengan PT Astra Agro Lestari",
          subtitle: "Nomor: 14/MoU/UNB-AAL/2023",
          description: "Kerjasama dengan PT Astra Agro Lestari Tbk dalam program rekrutmen lulusan, magang mahasiswa, dan pengembangan riset perkebunan kelapa sawit berkelanjutan.",
          detail: "Detail program kerjasama: (1) Rekrutmen prioritas lulusan UNB untuk posisi di kebun dan kantor AAL; (2) Program magang 3-6 bulan dengan uang saku Rp 2,5 juta/bulan; (3) Penelitian bersama praktik perkebunan kelapa sawit berkelanjutan (RSPO); (4) Guest lecture dari manajer senior AAL; (5) Sponsorship kegiatan kemahasiswaan pertanian. Sampai Oktober 2024, sudah 34 lulusan UNB bekerja di AAL.",
          icon: "🌴",
          date: "15 Oktober 2023",
          tags: ["Swasta", "Perkebunan", "Rekrutmen"],
          badgeText: "Aktif",
          badgeColor: "emerald",
          partner: "PT Astra Agro Lestari Tbk",
          partnerType: "Perusahaan Swasta",
        },
      ],
    },
    student_affairs: {
      banner: [
        { type: "image", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1400" },
        { type: "image", url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1400" },
      ],
      description:
        "Biro Kemahasiswaan UNB memfasilitasi pengembangan potensi mahasiswa secara holistik melalui berbagai program akademik, non-akademik, organisasi kemahasiswaan, dan kegiatan kewirausahaan. Kami berkomitmen menciptakan lulusan yang tidak hanya kompeten secara akademik, tetapi juga berkarakter, mandiri, dan siap bersaing di tingkat nasional maupun internasional.",
      cards: [
        {
          id: makeId(),
          title: "Program Beasiswa Unggulan UNB 2024",
          subtitle: "Tahun Akademik 2024/2025",
          description: "UNB menyediakan berbagai program beasiswa bagi mahasiswa berprestasi dan mahasiswa kurang mampu, baik dari sumber internal universitas maupun eksternal.",
          detail: "Jenis beasiswa yang tersedia: (1) Beasiswa UNB Prestasi Akademik — IPK ≥3,75, bebas UKT satu semester; (2) Beasiswa UNB Keluarga Tidak Mampu — berdasarkan survei ekonomi keluarga, subsidi 50-100% UKT; (3) Beasiswa BJB Syariah — 20 mahasiswa terpilih, Rp 6 juta/semester; (4) Beasiswa Pertamina Foundation — 15 mahasiswa, Rp 7,5 juta/semester; (5) Beasiswa KIP-Kuliah — dari Kemendikbudristek, full biaya kuliah + biaya hidup. Total penerima beasiswa 2024: 312 mahasiswa.",
          icon: "🎓",
          date: "2024/2025",
          tags: ["Beasiswa", "Prestasi", "KIP-Kuliah"],
          linkUrl: "#",
          linkLabel: "Daftar Beasiswa",
          badgeText: "312 Penerima",
          badgeColor: "emerald",
          organizer: "Biro Kemahasiswaan",
          participants: "Seluruh Mahasiswa",
        },
        {
          id: makeId(),
          title: "Program Wirausaha Mahasiswa UNB (WMU)",
          subtitle: "Inkubator Bisnis Kampus",
          description: "Program WMU mendampingi mahasiswa dalam membangun dan mengembangkan usaha rintisan (startup) dari tahap ideasi hingga memiliki produk/jasa yang siap dipasarkan.",
          detail: "Tahapan program WMU: (1) Seleksi ide bisnis — mahasiswa minimal semester 3; (2) Pelatihan bisnis dasar (4 minggu): business model, marketing, keuangan; (3) Mentoring intensif oleh pengusaha dan dosen; (4) Penyediaan co-working space di kampus; (5) Akses modal awal hingga Rp 10 juta per tim; (6) Demo Day di hadapan investor dan mitra industri. Angkatan 2024: 28 tim dari 5 fakultas. 12 tim sudah menghasilkan pendapatan.",
          icon: "💡",
          date: "2024",
          tags: ["Kewirausahaan", "Startup", "Inkubator"],
          linkUrl: "#",
          linkLabel: "Info Program",
          badgeText: "28 Tim Aktif",
          badgeColor: "yellow",
          organizer: "Biro Kemahasiswaan + LPPM",
          participants: "Mhs. Semester 3+",
        },
        {
          id: makeId(),
          title: "Organisasi Kemahasiswaan UNB",
          subtitle: "BEM, Senat, Himpunan & UKM",
          description: "UNB memiliki ekosistem organisasi kemahasiswaan yang aktif dengan Badan Eksekutif Mahasiswa (BEM), Senat Mahasiswa, 5 himpunan mahasiswa fakultas, dan 18 unit kegiatan mahasiswa (UKM).",
          detail: "Daftar UKM aktif UNB: Olah Raga (Futsal, Basket, Badminton, Taekwondo, Pencak Silat), Seni & Budaya (Paduan Suara, Teater, Tari Tradisional), Penalaran (Penelitian, Debat, Karya Tulis Ilmiah), Pers Mahasiswa, Pecinta Alam, Kewirausahaan, Kerohanian (ROHIS, KMK, KMHD), Komputer & Teknologi, Bahasa Inggris (English Club). Jumlah anggota aktif UKM: 847 mahasiswa (44% dari total mahasiswa).",
          icon: "🏆",
          date: "TA 2024/2025",
          tags: ["BEM", "UKM", "Organisasi"],
          linkUrl: "#",
          linkLabel: "Lihat Semua UKM",
          badgeText: "18 UKM Aktif",
          badgeColor: "blue",
          organizer: "Biro Kemahasiswaan",
          participants: "Seluruh Mahasiswa",
        },
        {
          id: makeId(),
          title: "Program MBKM — Magang & Studi Independen",
          subtitle: "Merdeka Belajar Kampus Merdeka",
          description: "Program MBKM memberi mahasiswa kesempatan belajar di luar kampus selama 1-2 semester melalui magang industri, studi independen, pertukaran mahasiswa, dan program kampus mengajar.",
          detail: "Skema MBKM yang tersedia di UNB: (1) Magang/Praktik Kerja — di perusahaan mitra, pengakuan 20 SKS; (2) Studi Independen Bersertifikat — di platform learning seperti Dicoding, Coursera, diakui 20 SKS; (3) Pertukaran Mahasiswa Nusantara — ke PT lain se-Indonesia; (4) Kampus Mengajar — mengajar di SD/SMP terpencil, diakui 20 SKS; (5) Proyek Kemanusiaan — di NGO/lembaga kemanusiaan. Mahasiswa peserta MBKM 2024: 186 orang dari total 1.918 mahasiswa aktif.",
          icon: "🌐",
          date: "2024",
          tags: ["MBKM", "Magang", "Merdeka Belajar"],
          downloadUrl: "#",
          downloadLabel: "Panduan MBKM",
          linkUrl: "#",
          linkLabel: "Daftar MBKM",
          badgeText: "186 Peserta",
          badgeColor: "emerald",
          organizer: "Biro Kemahasiswaan + Prodi",
          participants: "Mhs. Semester 5+",
        },
        {
          id: makeId(),
          title: "Pekan Olahraga & Seni Mahasiswa (PORSI) 2024",
          subtitle: "Dies Natalis ke-25 UNB",
          description: "PORSI 2024 merupakan ajang kompetisi olahraga dan seni terbesar di lingkungan UNB yang diikuti seluruh fakultas sebagai bagian dari perayaan Dies Natalis ke-25.",
          detail: "Cabang yang dilombakan dalam PORSI 2024: Olahraga: Futsal (putra/putri), Basket 3x3, Badminton (tunggal & ganda), Tenis Meja, Catur, Lari 5K. Seni: Paduan Suara, Tari Tradisional, Vokal Grup, Mural/Lukis, Fotografi. Jadwal: 14-16 November 2024. Hadiah total: Rp 45 juta (piala, medali, dan sertifikat). Diikuti seluruh 5 fakultas + pascasarjana.",
          icon: "🏅",
          date: "14-16 November 2024",
          tags: ["Olahraga", "Seni", "Kompetisi"],
          linkUrl: "#",
          linkLabel: "Daftar Peserta",
          badgeText: "Segera",
          badgeColor: "yellow",
          organizer: "BEM UNB + Biro Kemahasiswaan",
          participants: "Seluruh Mahasiswa",
        },
        {
          id: makeId(),
          title: "Layanan Konseling & Kesehatan Mental",
          subtitle: "UNB Student Wellness Center",
          description: "UNB menyediakan layanan konseling profesional dan dukungan kesehatan mental secara gratis bagi seluruh mahasiswa melalui Pusat Layanan Mahasiswa (PLM).",
          detail: "Layanan yang tersedia: (1) Konseling individual dengan psikolog berlisensi — 2x/minggu, gratis mahasiswa UNB; (2) Kelompok dukungan sebaya (peer support group) — tiap Rabu; (3) Workshop manajemen stres dan kecemasan; (4) Konsultasi masalah akademik dan karir; (5) Layanan darurat 24 jam via WhatsApp. Jam operasional: Senin-Jumat 08.00-16.00 WIB. Kontak: wellness@unb.ac.id / WhatsApp: 0811-000-UNB.",
          icon: "💚",
          date: "Layanan Rutin",
          tags: ["Konseling", "Kesehatan Mental", "Wellness"],
          linkUrl: "#",
          linkLabel: "Buat Janji",
          badgeText: "Gratis",
          badgeColor: "emerald",
          organizer: "Pusat Layanan Mahasiswa",
          participants: "Seluruh Mahasiswa",
        },
      ],
    },
  },
};

const PAGE_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  cooperation: { label: "Kerja Sama", icon: "🤝", color: "from-blue-900/40" },
  student_affairs: { label: "Kemahasiswaan", icon: "🎓", color: "from-emerald-900/40" },
};

const BADGE_COLORS: Record<string, string> = {
  emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  red: "bg-red-500/20 text-red-400 border-red-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

interface BkkPageTabProps {
  pageId: "cooperation" | "student_affairs";
}

export function BkkPageTab({ pageId }: BkkPageTabProps) {
  const { settings } = useSettings();
  const [selectedCard, setSelectedCard] = useState<BkkCard | null>(null);

  const config = PAGE_CONFIG[pageId];

  const content = useMemo<BkkPageContent>(() => {
    const saved = (settings as any).bkkContent?.pages?.[pageId];
    if (saved) return saved;
    return DEFAULT_BKK_CONTENT.pages[pageId];
  }, [settings, pageId]);

  const isCooperation = pageId === "cooperation";

  return (
    <div className="animate-fade-in bg-white dark:bg-[#151515] transition-colors duration-500">
      <section className="px-6 md:px-12 pt-10 pb-0">
        <MediaBanner items={content.banner.length > 0 ? content.banner : DEFAULT_BKK_CONTENT.pages[pageId].banner} />

        <div className="mt-10 text-center">
          <p className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em]">
            BKK — Universitas Nusa Bangsa
          </p>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-black dark:text-white transition-colors duration-500 mt-3">
            {config.label}
          </h2>
        </div>

        <div className="mt-10 max-w-3xl mx-auto">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-center font-medium">
            {content.description}
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.cards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className="bg-card border border-white/10 rounded-[30px] p-7 shadow-2xl cursor-pointer hover:border-emerald-500/40 hover:shadow-emerald-500/10 transition-all duration-300 group flex flex-col"
            >
              <div className="flex items-start gap-4 mb-4">
                {card.icon && (
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl shrink-0">
                    {card.icon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {card.badgeText && (
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${BADGE_COLORS[card.badgeColor ?? "emerald"]}`}>
                        {card.badgeText}
                      </span>
                    )}
                    {card.date && (
                      <span className="flex items-center gap-1 text-[9px] text-gray-400 font-bold">
                        <Calendar size={10} />
                        {card.date}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-black italic uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-300 leading-snug">
                    {card.title}
                  </h3>
                  {card.subtitle && (
                    <p className="text-[10px] text-gray-400 font-bold mt-1">{card.subtitle}</p>
                  )}
                </div>
              </div>

              {isCooperation && (card.partner || card.partnerType) && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {card.partner && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                      <Building2 size={10} /> {card.partner}
                    </span>
                  )}
                  {card.partnerType && (
                    <span className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                      <Globe size={10} /> {card.partnerType}
                    </span>
                  )}
                </div>
              )}

              {!isCooperation && (card.organizer || card.participants) && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {card.organizer && (
                    <span className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                      <Building2 size={10} /> {card.organizer}
                    </span>
                  )}
                  {card.participants && (
                    <span className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                      <Users size={10} /> {card.participants}
                    </span>
                  )}
                </div>
              )}

              <p className="text-[11px] text-gray-300 font-medium leading-relaxed flex-1 mb-4">
                {card.description}
              </p>

              {card.tags && card.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {card.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-[9px] text-gray-400 font-bold bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                      <Tag size={8} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap mt-auto">
                {card.downloadUrl && (
                  <a href={card.downloadUrl} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors" target="_blank" rel="noopener noreferrer">
                    <Download size={12} strokeWidth={3} />
                    {card.downloadLabel ?? "Unduh"}
                  </a>
                )}
                {card.linkUrl && (
                  <a href={card.linkUrl} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={12} strokeWidth={3} />
                    {card.linkLabel ?? "Lihat"}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detail Modal */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#111] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-lg font-black italic uppercase text-white leading-snug">
              {selectedCard?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-4 mt-2">
              {selectedCard.subtitle && (
                <p className="text-xs text-emerald-400 font-bold">{selectedCard.subtitle}</p>
              )}
              {isCooperation && (selectedCard.partner || selectedCard.partnerType) && (
                <div className="flex flex-wrap gap-4 py-2 border-y border-white/10">
                  {selectedCard.partner && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-300 font-semibold">
                      <Building2 size={13} className="text-emerald-400" /> {selectedCard.partner}
                    </span>
                  )}
                  {selectedCard.partnerType && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-300 font-semibold">
                      <Globe size={13} className="text-blue-400" /> {selectedCard.partnerType}
                    </span>
                  )}
                </div>
              )}
              {!isCooperation && (selectedCard.organizer || selectedCard.participants) && (
                <div className="flex flex-wrap gap-4 py-2 border-y border-white/10">
                  {selectedCard.organizer && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-300 font-semibold">
                      <Building2 size={13} className="text-emerald-400" /> {selectedCard.organizer}
                    </span>
                  )}
                  {selectedCard.participants && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-300 font-semibold">
                      <Users size={13} className="text-blue-400" /> {selectedCard.participants}
                    </span>
                  )}
                </div>
              )}
              <p className="text-sm text-gray-300 leading-relaxed">
                {selectedCard.detail ?? selectedCard.description}
              </p>
              {selectedCard.tags && selectedCard.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedCard.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-[9px] text-gray-400 font-bold bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                      <Tag size={8} /> {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-4 flex-wrap pt-2">
                {selectedCard.downloadUrl && (
                  <a href={selectedCard.downloadUrl} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors" target="_blank" rel="noopener noreferrer">
                    <Download size={13} strokeWidth={3} /> {selectedCard.downloadLabel ?? "Unduh"}
                  </a>
                )}
                {selectedCard.linkUrl && (
                  <a href={selectedCard.linkUrl} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={13} strokeWidth={3} /> {selectedCard.linkLabel ?? "Lihat"}
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
