import { MediaBanner } from "@/components/MediaBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";

export type PusdiAgrataruTenagaAhli = {
  id: string;
  nama: string;
  bio: string;
  photoUrl?: string;
};

export type PusdiAgrataruContent = {
  bannerItems: { type: "image"; url: string }[];
  kataPengantar: string[];
  tujuan: string[];
  fungsi: string[];
  bidangKegiatan: string[];
  mitraKerja: string[];
  stafPendukung: string[];
  legalitas: string;
  fasilitas: string;
  pengalamanPakar: {
    agrariaPertanahan: string[];
    tataruangPengembangan: string[];
    pengembanganKelembagaan: string[];
    penyelenggaraanPendidikan: string[];
  };
  tenagaAhli: PusdiAgrataruTenagaAhli[];
};

export const DEFAULT_PUSDI_AGRATARU_CONTENT: PusdiAgrataruContent = {
  bannerItems: [
    { type: "image", url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80" },
    { type: "image", url: "https://images.unsplash.com/photo-1523050853064-8521a3998af7?auto=format&fit=crop&q=80" },
  ],
  kataPengantar: [
    "Puji syukur kita panjatkan kehadirat Allah SWT yang telah melimpahkan Rahmat dan Hidayah  Nya  kepada  kita  semua  sehingga Profil Pusat Studi Agraria dan Tata Ruang (PUSDI  AGRATARU) Universitas Nusa Bangsa (UNB) dapat tersusun  tanpa  halangan suatu apapun dan kesulitan yang sering dijumpai dalam membuat Profil. Dalam pengumpulan data dan penentuan target program  kerja  Pusat Studi ini masih banyak kekurangan, Kami berharap semoga dalam penyusunan Profil Pusat Studi ini, dapat menjadi langkah awal yang  baik guna meningkatkan kinerja, mutu pelayanan dan pencapaian Program Reformasi Agraria secara Nasional di tahun berikutnya.",
    "Kami mengucapkan terima kasih dan dukungan seluruh staf PUSDI AGRATARU yang telah membantu dalam penyusunan Profil Pusat Studi Agraria dan Tata Ruang ini, juga dukungan dan bimbingan dari Ketua Pengurus Yayasan Pengembangan Keterampilan  dan Mutu Kehidupan (YPKMK) Nusantara sangat kami harapkan guna perbaikan penyusunan Profil Pusat Studi Agraria  dan Tata  Ruang  ( PUSDI AGRATARU) berikutnya.",
    "Akhir kata atas segala kekurangan dan kekhilafan kami mohon dengan kerendahan hati berharap adanya saran dan masukan untuk penyempurnaan penyusunan profil ini.",
  ],
  tujuan: [
    "Mengembangkan pemberdayaan yang mengedepankan partisipasi masyarakat di bidang argraria, tataruang, pertanahan dan lingkungan hidup.",
    "Melaksanakan pelayanan berupa penelitian, kajian, pelatihan, konsultasi dan pendampingan kepada pemerintah/pemerintah daerah, korporat/swasta, dan masyarakat.",
    "Mendayagunakan sumberdaya agraria/sumberdaya alam, ruang dan lingkungan secara lestari, optimal, serasi, seimbang (LOSS) dan penataan pusat-pusat budidaya secara aman, tertib, lancar, dan sehat (ATLAS) dalam rangka pelaksanaan pembangunan berkelanjutan.",
    "Menjaga, memelihara, dan memperkuat persatuan dan kesatuan bangsa dalam Negara Kesatuan Republik Indonesia (NKRI) berlandaskan Pancasila dan UUD",
  ],
  fungsi: [
    "Penyaluran aspirasi, ide, gagasan, pemikiran, dan pengalaman para peneliti, pendidik, praktisi serta masyarakat di bidang agraria, tataguna tanah, tataruang, lingkungan hidup, pertanahan (kadastral, hubungan hukum, resolusi konflik/sengketa), bank tanah dan reforma agraria dalam rangka pengelolaan agraria.",
    "Pembinaan dan pengembangan untuk mewujudkan tujuan Pusdi AGRATARU.",
    "Pemberdayaan masyarakat di bidang keagrariaan, tataruang, pertanahan dan lingkungan hidup.",
    "Pemenuhan pelayanan keagrariaan, tataruang, pertanahan dan lingkungan hidup yang berkualitas, transparan dan berkeadilan.",
    "Memelihara dan melestarikan sumberdaya agraria, ruang, tanah dan lingkungan hidup bagi perwujudan tujuan pembangunan.",
  ],
  bidangKegiatan: [
    "Menyalurkan aspirasi, ide, gagasan, pemikiran dan pengalaman para peneliti, pendidik, praktisi serta masyarakat di bidang agraria, tataguna tanah, tataruang, lingkungan hidup, pertanahan (kadastral, hubungan hukum, resolusi konflik/sengketa), bank tanah dan reforma agraria, dalam rangka pengelolaan agraria.",
    "Menyelenggarakan pembinaan dan pengembangan untuk mewujudkan tujuan Pusdi AGRATARU.",
    "Menyelenggarakan usaha-usaha pemberdayaan masyarakat di bidang agraria tataruang, pertanahan dan lingkungan hidup.",
    "Melaksanakan pelayanan agraria, tataruang, pertanahan dan lingkungan yang berkualitas, advokasi penanganan permasalahan terkait agraria yang transparan dan berkeadilan.",
    "Melaksanakan penelitian, kajian, pelatihan, konsultasi dan pendampingan kepada pemerintah/pemerintah daerah, korporat/swasta, dan masyarakat;",
    "Melaksanakan dan memfasilitasi kegiatan pemeliharaan dan pelestarian sumberdaya agraria dan lingkungan.",
    "Melaksanakan bakti sosial dalam rangka pengelolaan sumberdaya agraria, kelestarian lingkungan hidup dan pemberdayaan.",
  ],
  mitraKerja: [
    "Lembaga-lembaga pemerintah maupun pemerintah daerah propinsi maupun kabupaten/kota yang mengatur dan mengelola sumberdaya alam dan lingkungan hidup dalam rangka peningkatan keadilan, kesejahteraan masyarakat dan keberlanjutannya.",
    "Perusahaan-perusahaan swasta nasional maupun multinasional dan BUMN/BUMD/BUMDesa yang bergerak di bidang pengelolaan sumberdaya alam sebagai sumberdaya agraria, kelestarian lingkungan hidup dan pemberdayaan masyarakat.",
    "Organisasi kemasyarakatan baik yang berbadan hukum yang bersifat nasional dan internasional yang bergerak di bidang pengelolaan sumberdaya alam sebagai sumberdaya agraria, dan yang mempunyai perhatian pada kelestarian lingkungan hidup serta pemberdayaan masyarakat.",
    "Lembaga-lembaga penelitian-pengembangan dan pendidikan yang bersifat nasional dan internasional yang bergerak di bidang pengelolaan sumberdaya alam sebagai sumberdaya agraria, dan yang mempunyai perhatian pada kelestarian lingkungan hidup serta pemberdayaan masyarakat.",
  ],
  stafPendukung: [
    "Pusdi AGRATARU didukung oleh ahli-ahli yang berkompeten dan berpengalaman dalam kegiatan Agraria, tataruang, pertanahan dan lingkungan termasuk pengelolaan sumberdaya agraria, tataguna tanah, tataruang, dan pengelolaan lingkungan hidup, serta upaya-upaya pemberdayaan masyarakat, baik dalam tataran teori maupun praktik di lapangan.",
    "Para ahli berasal dari berbagai bidang keahlian seperti evaluasi kemampuan tanah, tataguna tanah, tataruang, hukum agraria, pendaftaran tanah, pengadaan tanah, mediasi konflik agraria, tata-kota, pertanian, perkebunan, peternakan, kehutanan, sosial-ekonomi, kelembagaan, survei, teknologi Informasi, dan bidang-bidang keahlian lain yang relevan.",
  ],
  legalitas:
    "Pusdi Agrataru UNB dibentuk berdasarkan Surat Keputusan Rektor Universitas Nusa Bangsa Nomor : 091/REK-UNB/C-SK/V/2021 tanggal 7 Mei 2021 tentang Pembentukan dan Pengelola Pusat Studi Agraria dan Tata Ruang Universitas Nusa Bangsa.",
  fasilitas:
    "Dalam pelaksanaan kegiatannya, selain menggunakan fasilitas Universitas Nusa Bangsa dan Yayasan Pengembangan Keterampilan dan Mutu Kehidupan (YPKMK) Nusantara, Pusdi AGRATARU bekerjasama dengan berbagai institusi didukung oleh berbagai fasilitas seperti: kebun-kebun, laboratorium, studio dan pusat data. Beberapa institusi tersebut antara lain : Universitas-universitas, Lembaga-lembaga Penelitian serta Organisasi-organisasi Kemasyarakatan, yang terkait dengan pengelolaan sumberdaya agraria dan lingkungan hidup, tataruang dan perencanaan pengembangan wilayan serta pemberdayaan masyarakat baik yang dimiliki oleh lembaga pemerintah, Instansi Swasta dan Organisasi Kemasyarakatan yang telah menjalinn hubungan kerjasama dengan Pusdi AGRATARU.",
  pengalamanPakar: {
    agrariaPertanahan: [
      "Penyusunan Pola Harga Tanah.",
      "Penyusunan Kerangka P4T.",
      "Penyelenggaraan pengukuran bidang tanah.",
      "Mediasi Penyelesaian Sengketa dan Konflik pertanahan.",
      "Pelaksanaan Pengadaan Tanah.",
      "Penyusunan rencana Pendayagunaan Tanah Terlantar.",
      "Penyusunan Dokumen Perencanaan Pengadaan Tanah.",
      "Penyusunan Evaluasi Ijin Lokasi untuk HGU.",
      "Penyusunan Draft Reforma Agraria.",
      "Penyusunan Rancangan Peraturan Presiden tentang Reforma Agraria.",
      "Pelaksanaan Reforma Agraria.",
    ],
    tataruangPengembangan: [
      "Penyusunan Desain Pengembangan Wilayah.",
      "Studi Evaluasi Rencana Kota dan Perumusan Kebijakan Pengembangan Perumahan melalui Pendekatan Kapling Siap Bangun.",
      "Studi perumusan Kebijakan Kependudukan.",
      "Studi Struktur Harga Komoditas suatu Wilayah.",
      "Mengembangkan konsep perencanaan pembangunan secara spasial dengan keterlibatan pemangku kepentingan dan penerapannya di pemerintah.",
    ],
    pengembanganKelembagaan: [
      "Penyusunan Struktur Organisasi dan Tata Kerja Kementerian Agraria dan Tata Ruang/Kepala Badan Pertanahan Nasional.",
      "Pelaksanaan Reformasi Birokrasi.",
      "Penyusunan Pedoman Teknis Penerimaan Pegawai Tidak Tetap.",
      "Penyusunan Pedoman Tunjangan Kinerja.",
      "Penelitian untuk “Kesadaran Hukum di Desa”.",
      "Pengembangkan komunikasi yang lebih baik antara pemerintah daerah dan pusat mengenai isu-isu perubahan iklim.",
      "Pengembangan dan sosialisasi penerapan prinsip-prinsip tata kelola yang baik.",
      "Mengembangkan konsep pendekatan partisipatif dalam pembangunan berkelanjutan di masyarakat.",
      "Mengembangkan praktik pengelolaan perkotaan yang responsif, akuntabel, transparan dan partisipatif di kota-kota tertentu.",
      "Pemetaan pemangku kepentingan & isu strategis, dalam merumuskan dan pengembangan strategi visi pembangunan kota, dengan analisis SWOT dan partisipatif.",
    ],
    penyelenggaraanPendidikan: [
      "Kursus Pengatur Tata Guna Tanah, Kursus Tata Guna Tanah Lanjutan I, Kursus Tata Guna Tanah Lanjutan II, Pengaturan Pengurusan Hak-hak Tanah.",
      "Mengembangkan  matakuliah-matakuliah         Perencanaan Regional, Perencanaan dan Pengembangan Kota dan Wilayah, Perencanaan Pembangunan     Daerah, Sistem Perencanaan dan Pengawasan Pembangunan, dan Manajemen Pertumbuhan Wilayah.",
      "Mengembangkan mata kuliah-mata kuliah: Manajemen Pertanahan, Aplikasi Model Geografi, Politik Agraria.",
      "Pengenalan prinsip-prinsip tata kelola pemerintahan yang baik ke semua pemangku kepentingan dalam lingkup pemerintah dan pemerintah daerah.",
      "Pelayanan konsultasi dan fasilitasi pemangku kepentingan dalam mengembangkan sinergi dan transparansi di pemerintahan daerah dan legislatif daerah.",
      "Kursus Transisi Demokrasi Pasca Pemilu di Indonesia.",
      "Pelatihan dan penyediaan konsultasi penerapan Standar Pelayanan Minimal (SPM).",
      "Penyediaan jasa konsultasi dalam peningkatan interaksi antara institusi tingkat lokal, interlokal dan nasional.",
      "Fasilitasi pelatihan bagi pemangku kepentingan lokal (aparat, parlemen daerah dan masyarakat) mengenai Manajemen Perubahan.",
      "Penyusunan buku pegangan untuk parlemen daerah untuk membantu ADEKSI tentang Perencanaan Tata Ruang.",
    ],
  },
  tenagaAhli: [
    {
      id: "ta-1",
      nama: "Budi Mulyanto",
      bio: "lahir di Madiun 2 Juli 1956, adalah Guru besar tetap bidang Ilmu Tanah (Land Sciences), di Departement Ilmu Tanah dan Sumberdaya Lahan, Fakultas Pertanian, IPB sejak tahun 2007. Gelar Ir diperoleh dari IPB (1980), sedangkan MSc (1990) dan Ph.D (1995) dari RUG Ghent, Belgium.\n\nAktif mengikuti training, workshop, dan seminar baik di dalam maupun luar negeri, terutama di bidang pendidikan tinggi (Enschede, The Netherlands); land and landuse sciences (Jepang, Srilanka, China, Thailand); Agrarian Reform (Thailands, Senegal); Land administration (Australia, China), Land Cadastre and Mapping (Korea, New Zealand); One Map Policy (USA). Lebih dari 75 publikasi ilmiah bidang ilmu yang ditekuni telah diterbitkan dalam jurnal ilmiah dan prosiding baik di lingkup nasional maupun internasional.\n\nJabatan struktural yang pernah diembannya meliputi Ketua Program Studi Ilmu Tanah, Fakultas Pertanian, IPB tahun 2000-2004; Direktur Eksekutif LPIU Quality for Undergraduate Education (QUE) Project untuk Program Studi Ilmu Tanah 1999-2004. Sejak tahun 2006 di BPN menjabat sebagai Direktur Pemetaan Tematik tahun 2006-2010, Direktur Penatagunaan Tanah tahun 2010-2013; Kepala Biro Perencanaan 2013-2014; Deputi bidang Pengadaan Tanah 2014-2015. Di Kementerian ATR/BPN menjabat sebagai Direktur Jenderal Pengadaan Tanah 2015-2016; dan Plt Direktur Jenderal Infrastruktur Keagrariaan 2016.",
    },
    {
      id: "ta-2",
      nama: "Doddy Imron Cholid",
      bio: "lahir di Cianjur, Jawa Barat, 31 Juli 1956. Memperoleh gelar Sarjana Pertanian di Universitas Padjajaran Bandung tahun 1980, dan gelar Magister Sains di Universitas Lambung Mangkurat Banjarmasin tahun 2009. Saat ini menjabat sebagai Wakil Ketua Umum Dewan Pimpinan Pusat Himpunan Kerukunan Tani Indonesia (DPP HKTI); Ketua Satgas Reforma Agraria DPP HKTI; dan Ketua Yayasan Pengembangan Keterampilan dan Mutu Kehidupan (YPKMK) Nusantara. Telah menjabat sebagai Kepala Kantor Pertanahan di Kab. Tapin 1995-1998; dan Kab. Kotabaru 1998-2005, Kepala Kantor Pertanahan Wilayah di Kalimantan Selatan 2005-2006; Kep. Riau 2006-2007; Sulawesi Tenggara 2007-2008; Jawa Tengah 2008-2011; dan Jawa Timur 2011-2012. Di Badan Pertanahan Nasional pernah menjabat sebagai Kepala Biro Perencanaan dan Kerjasama Luar Negeri 2012-2014; dan Deputi Bidang Pengaturan dan Pengendalian Pertanahan 2014-2015. Di Kementerian ATR/BPN menjabat sebagai Dirjen Penataan Agraria 2015-2016; dan Tenaga Ahli Menteri Agraria Bidang Reforma Agraria 2016-2018.\n\nAktif dalam berbagai kegiatan Pemetaan, Penataan, Reforma Agraria, Penyelesaian Konflik Pertanahan di Indonesia sejak tahun 1983. Menjadi narasumber mewakili ATR/BPN terkait masalah Reforma Agraria di berbagai kesempatan. Telah mengikuti studi banding tentang pengadaan tanah di Tokyo, Jepang tahun 2014; dan studi banding tentang penanganan bencana di Tokyo, Fukuoka, dan Hiroshima, Jepang tahun 2015.",
    },
    { id: "ta-3", nama: "Arif Pasha", bio: "mendapatkan gelar Sarjana di FAPERTA Universitas Lampung dan pendidikan Pascasarjana di University of Toyama, Jepang tahun 2016-2017. Merupakan Purnabakti Pegawai Negeri Sipil Kementerian Agraria dan Tata Ruang/Badan Pertanahan Nasional tahun 2019. Jabatan struktural yang pernah diemban adalah; Kasubdit Penataan Penguasaan Tanah Negara 1998-2000; Kasubdit Ganti Rugi dan Penyelesaian Masalah 2000-2003; Kepala Kantor Pertanahan Kota Bandar Lampung 2003-2006; Kepala Bidang HTPT Lampung 2006-2009; Kepala Kantor Pertanahan Kab. Tanggamus 2009; Kepala Kantor Pertanahan Kab. Way Kanan 2009-2012; Kakanwil Propinsi NTB 2012-2013; Kabiro TUPP ATR/BPN 2013-2014; Kakanwil Propinsi Sumatera Selatan 2014-2018; dan Direktur Landreform 2018-2019. Pernah melakukan kunjungan kerja dan Branding Pelaksanaan Pengadaan Tanah Bagi Pembangunan untuk Kepentingan umum (UU No.2/2012) di Jepang dan India bersama Kepala BPN RI; Mewakili Kementerian ATR/BPN dalam kunjungan kerja dan Presentasi Infrastruktur/Pertanahan RI di Seoul, Korea Selatan 2015; Kunjungan Kerja dan Branding pelaksanaan Reforma Agraria dan Konsolidasi Tanah di Taipei, Taiwan 2016." },
    { id: "ta-4", nama: "Agus Widayanto", bio: "lahir di Kabupaten Ponorogo Jawa Timur, 28 Januari 1957 Pensiunan Pegawai Negeri Sipil Kementerian Agraria dan Tata Ruang/Badan Pertanahan Nasional pada tahun 2013. Gelar Sarjana Pertanian Jurusan Ekonomi Pertanian diperoleh di Universitas Sebelas Maret Surakarta pada Tahun 1982. Pada Waktu bertugas di Medan Sumatera Utara menyempatkan diri kuliah dan lulus dengan gelar Magister Sains di Universitas Sumatera Utara (USU) tahun 2006 pada Jurusan Pengelolaan Sumber Daya Alam dan Lingkungan. Pada waktu masih menjabat maupun setelah pensiun dan diangkat sebagai Widyaiswara sering menjadi pengajar/narasumber dalam bidang pertanahan di berbagai pertemuan/diklat/kursus baik yang diselenggarakan oleh Instansi Pemerintah maupun pihak Swasta/Lembaga Swadaya Masyarakat (LSM).\n\nJabatan struktural yang pernah dijalani adalah: Kepala Seksi Konsolidasi dan Pemanfaatan Tanah Kanwil BPN Propinsi Sumatera Utara tahun 1989-1995. Kepala Seksi Pengaturan Penguasaan TanahKantor Pertanahan Kota Medan tahun 1995-1996. Kepala Kantor Pertanahan Kota Binjai Prop. Sumatera Utara tahun 1996-2003. Kasubdit Konsolidasi Tanah Badan Pertanahan Nasional tahun 2003-2005. Kasubdit Pengelolaan Tanah Negara Bekas Hak tahun 2005-2011. Kasubdit Pemeliharaan Penggunaan dan Pemanfaatan Tanah tahun 2011-2013. Widyaiswara Luar Biasa Badan Pertanahan Nasional tahun 2013." },
    { id: "ta-5", nama: "Nurwadjedi", bio: "lahir di Malang, 24 April 1959, adalah Pegawai Negeri Sipil dengan golongan Pembina Utama / IV E di Badan Informasi Geospasial. Saat ini menjabat sebagai Widyaiswara Utama dan Dosen tidak tetap Sekolah Pascasarjana Jurusan Geografi Universitas Indonesia. Mendapatkan gelar Sarjana di Jurusan Ilmu Tanah IPB 1983, gelar Magister di Land Resource Science Department, University of Guelph, Canada 1989, dan mendapatkan gelar Doktor di bidang Ilmu Tanah, Sekolah Pascasarjana IPB 2011. Pernah mendapatkan Training dan Diklat: Geomorphological Mapping Training, ITC Belanda (1984); Training Pengolahan Data Remote Sensing Digital di CCRS (Canadian Center for Remote Sensing), Ontario Canada (1988); Training Course in Remote Sensing Technology (Advanced) at Remote Sensing Technology Center of Japan (Resctec), Tokyo (2000). Riwayat jabatan; Kepala Bidang Jaring Basisdata Sumberdaya Alam, Pusbinsistanas, Bakosurtanal (1990-1995); Pemimpin Proyek Sistem Informasi Geografi, Bakosurtanal (1995-2000); Kepala Kelompok Jabatan Fungsional Pusat Survei Sumberdaya Alam , Bakosurtanal (2000-2001); Kepala Bidang Basisdata Sumber Daya Alam Darat, Bakosurtanal (2001-2010); Kepala Pusat Sumberdaya Alam Laut, Bakosurtanal (2010-2011); Kepala Pusat Sumberdaya Alam Darat, BIG (2012); Kepala Pusat Pemetaan dan Integrasi Tematik, BIG (2012-2013); DeputiBidang Informasi Geospasial Tematik, BIG (Januari 2014 – 2019); Widyaiswara Utama (2019- sekarang); Dosen tidak tetap Sekolah Pascasarjana Jurusan Geografi, FMIPA Universitas Indonesia, Depok (2018- sekarang)." },
    { id: "ta-6", nama: "Andri Supriatna", bio: "lahir di Sukabumi, Jawa Barat pada 23 Juni 1980. Mengenyam pendidikan formal Sarjana di Jurusan Teknik Geodesi, Institut Teknologi Bandung tahun 2004, pendidikan Magister di Jurusan Land Administration, University of Twente tahun 2011, dan pendidikan Doktoral di Jurusan Urban and Regional Planning, University of Queensland tahun 2018. Saat ini merupakan Koordinator Substansi/Penata Pertanahan Muda, Direktorat Penatagunaan Tanah di Kementerian Agraria dan Tata Ruang/Badan Pertanahan Nasional. Memiliki pendidikan non formal, antaralain; Prajabatan Tingkat III 2006; Land Readjustment Course – IUTC South Korea dan UN- HABITAT tahun 2015; dan Workshop Technical Deep Dive: Improving Infrastructure, Services and Livelihoods in Low Income Urban Settlements – World Bank Tokyo, Japan.\n\nAdapun jabatan struktural yang pernah diembannya adalah; Analisis Konsolidasi Tanah Direktorat Konsolidasi Tanah 2013-2018; Kepala Seksi Kerjasama Direktorat Konsolidasi Tanah 2018-2020; dan Kepala Seksi Kawasan Perkotaan Direktorat Penatagunaan Tanah 2020." },
    { id: "ta-7", nama: "Prof. Dr. Ir. PRATIWI, M.Sc.", bio: "lahir di Purwokerto 16 April 1961, adalah Peneliti Ahli Utama di Bidang Konservasi dan Pengaruh Hutan. Bekerja sebagai peneliti di Kementerian Lingkungan Hidup dan Kehutanan (KLHK) sejak tahun 1985. Penelitian yang ditekuni terkait dengan rehabilitasi hutan dan lahan terdegradasi, termasuk lahan alang-alang dan lahan bekas tambang, khususnya bekas tambang timah, pemilihan jenis pohon untuk rehabilitasi lahan, dan teknik-teknik konservasi tanah dan air untuk meningkatkan produktivitas hutan. Anggota Dewan Riset Nasional (DRN) (1997-1998), World Overview of Conservation Approaches and Technologies (WOCAT) (2004-sekarang), Himpunan Ilmu Gulma Indonesia (HIGI) (1997-sekarang); Himpunan Ilmu Tanah Indonesia (HITI) (1997-sekarang); Tim Penilai Peneliti Instansi (TP2I) KLHK (2010-2012); Tim Penilai Peneliti Pusat (TP3) (2013-2019); Dewan Riset KLHK (2014-sekarang); Dewan Etika KLHK (2015-2019); Dewan Pakar KLHK (2015 sekarang); Majelis Asesor Peneliti Instansi (MAPI) (2019- sekarang); Asesor Peneliti Pusat (2019-sekarang); Koordinator Usulan Kegiatan Penelitian (UKP) bidang Teknologi dan Kelembagaan Rehabilitasi Lahan Terdegradasi, Badan Litbang Kehutanan (2003-2008); Koordinator Riset Penelitian Integratif (RPI) bidang Pengelolaan Lahan Pendukung Pengelolaan Daerah Aliran Sungai (2010- 2014); Pembina Koordinator RPPI Konservasi Sumberdaya Air (2015-2019)." },
    { id: "ta-8", nama: "Elda Djuanda Hasan", bio: "merupakan pensiunan Pegawai Negeri Sipil di Kementerian Agraria dan Tata Ruang/Badan Pertanahan Nasional, dengan gelar Sarjana Hukum. Memiliki pangkat terakhir golongan IV/C (Pembina Utama Muda). Memiliki pengalaman jabatan struktural; Kepala Kantor Pertanahan Kab. Hulu Sungai Selatan tahun 2013-2014; Kepala Kantor Kab. Purwakarta tahun 2014-2018; dan Kasubdit WP3WT Kementerian ATR/BPN tahun 2018-2020." },
    { id: "ta-9", nama: "ALI RACHMAN, A.Ptnh., M.H.", bio: "Purnabakti di Kementerian ATR/BPN. Ahli Pengukuran dan Pemetaan. Pangkat terakhir IVB. Pernah bertugas di Kantor Pusat BPN, Kantor Pertanahan Kabupaten Bogor, dan Kantor Pertanahan Kabupaten Karawang." },
    { id: "ta-10", nama: "DICKY QOHARUDDIN", bio: "lahir pada 18 Mei 1962 di Bandung, Jawa Barat. Telah mengenyam pendidikan di Akademi Pertanahan Nasional dengan jurusan Pertanahan pada tahun 1992. Mendapatkan pendidikan, training dan seminar, KPA- Agraria Departemen Dalam Negeri tahun 1984, ERDAS, BPN tahun 1992, Arc Info, BPN tahun 1992, Teknis Menyusun Rencana Wilayah, Kursus Perencanaan PGT tahun 2011, dan Penilai AMDAL, Kursus AMDAL tahun 2012. Sejak tahun 1981 hingga 2018 aktif dalam berbagai kegiatan survei, pengukuran, pemetaan, pengolahan, dan analisis pertanahan dan tata ruang; menjadi Instruktur Pelaksanaan Kursus di Lingkungan Direktorat Penatagunaan Tanah dan ATR/BPN, Narasumber kegiatan Neraca Sumber Daya Alam pada Badan Informasi Geospasial, Konsultan perorangan LP2B Pusat pada Direktorat Penatagunaan Tanah ATR/BPN 2020." },
    { id: "ta-11", nama: "MANIJO", bio: "lahir pada 10 Februari 1972 di Kebumen, Jawa Tengah. Mengenyam pendidikan S1 di Jurusan Agribisnis, Intitut Pertanian Bogor tahun 2005, dan pendidikan S2 di Jurusan Ilmu Perencanaan Wilayah di Institut Pertanian Bogor tahun 2013. Merupakan peneliti di LPPM-P4W IPB, dengan pengalaman kerja antaralain 2014 – Sekarang, Staf Pengajar Diploma 3 Perkebunan dengan materi GIS Perkebunan 2012, Mengajar, Staf Bappeda Kabupaten Nunukan, tentang penggunaan GPS sampai data spatial 2011, Mengajar, Staf perkebunan dengan materi GIS Perkebunan dan 2008 – sekarang mengajar praktikum S2 PWL, MBK, mata kuliah Geographic Information System (GIS) dan PWD, mata kuliah Geospatial. Publikasi, Perubahan penggunaan lahan dan lingkungan dalam hubungannya dengan keamanan/ketahanan pangan (2008), Dinamika perencanaan penggunaan/pemanfataan lahan secara spasial dan implementasinya di Provinsi Kalimantan Barat (2008), Pengembangan dan pemetaan satuan pengelolaan air dan kantong air untuk menentukan daya tampung air wilayah rawa. Studi kasus Kota Banjarmasin (2009), Evaluasi Tata Ruang Daerah Aliran Sungai (DAS) Cisadane Dalam Kaitannya Dengan Banjir (2013), Evaluasi Multikriteria Daerah Aliran Sungai (DAS) Cisadane Untuk Memetakan Potensi Bahaya Banjir (2013)." },
  ],
};

export function PusatStudiAgrataruTab() {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const raw = (settings.profileContent as any)?.pusdiAgrataru;
  const content: PusdiAgrataruContent = {
    ...DEFAULT_PUSDI_AGRATARU_CONTENT,
    ...(raw && typeof raw === "object" ? raw : {}),
    bannerItems: Array.isArray(raw?.bannerItems) ? raw.bannerItems : DEFAULT_PUSDI_AGRATARU_CONTENT.bannerItems,
    kataPengantar: Array.isArray(raw?.kataPengantar) ? raw.kataPengantar : DEFAULT_PUSDI_AGRATARU_CONTENT.kataPengantar,
    tujuan: Array.isArray(raw?.tujuan) ? raw.tujuan : DEFAULT_PUSDI_AGRATARU_CONTENT.tujuan,
    fungsi: Array.isArray(raw?.fungsi) ? raw.fungsi : DEFAULT_PUSDI_AGRATARU_CONTENT.fungsi,
    bidangKegiatan: Array.isArray(raw?.bidangKegiatan) ? raw.bidangKegiatan : DEFAULT_PUSDI_AGRATARU_CONTENT.bidangKegiatan,
    mitraKerja: Array.isArray(raw?.mitraKerja) ? raw.mitraKerja : DEFAULT_PUSDI_AGRATARU_CONTENT.mitraKerja,
    stafPendukung: Array.isArray(raw?.stafPendukung) ? raw.stafPendukung : DEFAULT_PUSDI_AGRATARU_CONTENT.stafPendukung,
    pengalamanPakar: {
      ...DEFAULT_PUSDI_AGRATARU_CONTENT.pengalamanPakar,
      ...(raw?.pengalamanPakar && typeof raw.pengalamanPakar === "object" ? raw.pengalamanPakar : {}),
      agrariaPertanahan: Array.isArray(raw?.pengalamanPakar?.agrariaPertanahan)
        ? raw.pengalamanPakar.agrariaPertanahan
        : DEFAULT_PUSDI_AGRATARU_CONTENT.pengalamanPakar.agrariaPertanahan,
      tataruangPengembangan: Array.isArray(raw?.pengalamanPakar?.tataruangPengembangan)
        ? raw.pengalamanPakar.tataruangPengembangan
        : DEFAULT_PUSDI_AGRATARU_CONTENT.pengalamanPakar.tataruangPengembangan,
      pengembanganKelembagaan: Array.isArray(raw?.pengalamanPakar?.pengembanganKelembagaan)
        ? raw.pengalamanPakar.pengembanganKelembagaan
        : DEFAULT_PUSDI_AGRATARU_CONTENT.pengalamanPakar.pengembanganKelembagaan,
      penyelenggaraanPendidikan: Array.isArray(raw?.pengalamanPakar?.penyelenggaraanPendidikan)
        ? raw.pengalamanPakar.penyelenggaraanPendidikan
        : DEFAULT_PUSDI_AGRATARU_CONTENT.pengalamanPakar.penyelenggaraanPendidikan,
    },
    tenagaAhli: Array.isArray(raw?.tenagaAhli) ? raw.tenagaAhli : DEFAULT_PUSDI_AGRATARU_CONTENT.tenagaAhli,
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#111] transition-colors duration-500 animate-fade-in">
      <section className="px-6 md:px-12 pt-16 md:pt-24 pb-12 text-center relative overflow-hidden">
        <div className="absolute top-10 left-[10%] md:left-[20%] z-10 animate-float pointer-events-none">
          <div className="glass-element w-10 h-10 md:w-14 md:h-14 bg-emerald-500/20 flex items-center justify-center text-xl md:text-3xl shadow-xl">
            🌾
          </div>
        </div>
        <div className="absolute top-4 right-[12%] md:right-[22%] z-10 animate-float-slow pointer-events-none">
          <div className="glass-element w-8 h-8 md:w-12 md:h-12 bg-white/10 flex items-center justify-center text-lg md:text-2xl shadow-xl">
            🗺️
          </div>
        </div>

        <div className="relative z-20">
          <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white uppercase tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {t.menu.pusat_studi}
          </h1>
          <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-in fade-in slide-in-from-left-4 duration-700 delay-300" />
        </div>
      </section>

      <section className="px-6 md:px-12 pb-6">
        <div className="relative mb-12">
          <MediaBanner items={content.bannerItems} />
        </div>
      </section>

      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-5xl mx-auto space-y-10">
          <Card className="border border-black/5 dark:border-white/10 rounded-[35px] bg-gray-50/50 dark:bg-white/5 transition-colors duration-500">
            <CardHeader>
              <CardTitle className="text-2xl font-black italic uppercase text-black dark:text-white">
                Kata Pengantar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
              {content.kataPengantar.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-black/5 dark:border-white/10 rounded-[35px] bg-white dark:bg-white/5 transition-colors duration-500">
              <CardHeader>
                <CardTitle className="text-xl font-black italic uppercase text-black dark:text-white">
                  Tujuan
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
                <div className="font-bold text-emerald-500 mb-3">Pusdi AGRATARU bertujuan:</div>
                <ul className="list-disc list-inside space-y-2">
                  {content.tujuan.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-black/5 dark:border-white/10 rounded-[35px] bg-white dark:bg-white/5 transition-colors duration-500">
              <CardHeader>
                <CardTitle className="text-xl font-black italic uppercase text-black dark:text-white">
                  Fungsi
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
                <div className="font-bold text-emerald-500 mb-3">Pusdi AGRATARU berfungsi sebagai sarana:</div>
                <ul className="list-disc list-inside space-y-2">
                  {content.fungsi.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-black/5 dark:border-white/10 rounded-[35px] bg-gray-50/50 dark:bg-white/5 transition-colors duration-500">
            <CardHeader>
              <CardTitle className="text-2xl font-black italic uppercase text-black dark:text-white">
                Bidang Kegiatan
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
              <div className="font-bold text-emerald-500 mb-3">Kegiatan Pusdi AGRATARU mencakup:</div>
              <ul className="list-disc list-inside space-y-2">
                {content.bidangKegiatan.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-black/5 dark:border-white/10 rounded-[35px] bg-gray-50/50 dark:bg-white/5 transition-colors duration-500">
            <CardHeader>
              <CardTitle className="text-2xl font-black italic uppercase text-black dark:text-white">
                Mitra Kerja Potensial
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
              <ul className="list-disc list-inside space-y-2">
                {content.mitraKerja.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-black/5 dark:border-white/10 rounded-[35px] bg-gray-50/50 dark:bg-white/5 transition-colors duration-500">
            <CardHeader>
              <CardTitle className="text-2xl font-black italic uppercase text-black dark:text-white">
                Staf Pendukung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
              {content.stafPendukung.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-black/5 dark:border-white/10 rounded-[35px] bg-white dark:bg-white/5 transition-colors duration-500">
              <CardHeader>
                <CardTitle className="text-xl font-black italic uppercase text-black dark:text-white">
                  Legalitas
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
                {content.legalitas}
              </CardContent>
            </Card>

            <Card className="border border-black/5 dark:border-white/10 rounded-[35px] bg-white dark:bg-white/5 transition-colors duration-500">
              <CardHeader>
                <CardTitle className="text-xl font-black italic uppercase text-black dark:text-white">
                  Fasilitas
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
                {content.fasilitas}
              </CardContent>
            </Card>
          </div>

          <Card className="border border-black/5 dark:border-white/10 rounded-[35px] bg-gray-50/50 dark:bg-white/5 transition-colors duration-500">
            <CardHeader>
              <CardTitle className="text-2xl font-black italic uppercase text-black dark:text-white">
                Pengalaman Pakar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
              <div className="font-bold text-emerald-500 uppercase tracking-widest text-xs">
                Pengelolaan Sumberdaya Agraria dan Tataruang
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-black/5 dark:border-white/10 rounded-[28px] bg-white dark:bg-white/5 transition-colors duration-500">
                  <CardHeader>
                    <CardTitle className="text-lg font-black italic uppercase text-black dark:text-white">
                      Agraria dan Pertanahan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
                    <ul className="list-disc list-inside space-y-2">
                      {content.pengalamanPakar.agrariaPertanahan.map((x, idx) => (
                        <li key={idx}>{x}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border border-black/5 dark:border-white/10 rounded-[28px] bg-white dark:bg-white/5 transition-colors duration-500">
                  <CardHeader>
                    <CardTitle className="text-lg font-black italic uppercase text-black dark:text-white">
                      Tataruang dan Pengembangan Wilayah
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
                    <ul className="list-disc list-inside space-y-2">
                      {content.pengalamanPakar.tataruangPengembangan.map((x, idx) => (
                        <li key={idx}>{x}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border border-black/5 dark:border-white/10 rounded-[28px] bg-white dark:bg-white/5 transition-colors duration-500">
                  <CardHeader>
                    <CardTitle className="text-lg font-black italic uppercase text-black dark:text-white">
                      Pengembangan Kelembagaan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
                    <ul className="list-disc list-inside space-y-2">
                      {content.pengalamanPakar.pengembanganKelembagaan.map((x, idx) => (
                        <li key={idx}>{x}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border border-black/5 dark:border-white/10 rounded-[28px] bg-white dark:bg-white/5 transition-colors duration-500">
                  <CardHeader>
                    <CardTitle className="text-lg font-black italic uppercase text-black dark:text-white">
                      Penyelenggaraan Pendidikan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
                    <ul className="list-disc list-inside space-y-2">
                      {content.pengalamanPakar.penyelenggaraanPendidikan.map((x, idx) => (
                        <li key={idx}>{x}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-black/5 dark:border-white/10 rounded-[35px] bg-gray-50/50 dark:bg-white/5 transition-colors duration-500">
            <CardHeader>
              <CardTitle className="text-2xl font-black italic uppercase text-black dark:text-white">
                Personil Tenaga Ahli
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.tenagaAhli.map((p: PusdiAgrataruTenagaAhli, idx: number) => (
                  <Card
                    key={p.id || String(idx)}
                    className="border border-black/5 dark:border-white/10 rounded-[28px] bg-white dark:bg-white/5 transition-colors duration-500 overflow-hidden"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-black italic uppercase text-black dark:text-white break-words">
                            {p.nama}
                          </div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                            Tenaga Ahli
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 shrink-0">
                          <img
                            src={
                              p.photoUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(p.nama)}&background=10b981&color=ffffff&size=256&bold=true`
                            }
                            alt={p.nama}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line max-h-[260px] overflow-auto pr-2">
                          {p.bio}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
