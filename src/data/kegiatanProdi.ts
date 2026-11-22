import { KegiatanProdi } from "../types";

// Tanggal dibuat relatif terhadap hari ini saat app dijalankan
// Supaya prototype selalu menampilkan kegiatan "terbaru" kapan pun didemokan
function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Kegiatan akan datang (~10 items) dan selesai (~4 items)
// Semua kategori terwakili
export const DUMMY_KEGIATAN_PRODI: KegiatanProdi[] = [
  // ===== AKAN DATANG =====
  {
    id: "keg-hari-ini",
    judul: "Kuliah Tamu: AI dalam Dunia Industri Masa Kini",
    tanggal: formatDate(daysFromNow(0)),
    waktu: "10:00 - 12:00 WIB",
    tempat: "Ruang Seminar GKB II Lt. 5",
    deskripsi:
      "Kuliah tamu bersama praktisi industri AI dari Tokopedia membahas penerapan machine learning dan natural language processing dalam skala produksi besar.",
    penyelenggara: "Himpunan Mahasiswa Informatika UMM",
    kategori: "Kuliah Tamu",
    statusPendaftaran: "dibuka",
    tautanPendaftaran: "https://bit.ly/kuliah-tamu-ai",
    ditambahkanPada: daysAgo(1), // Ditambahkan kemarin → label "Baru"
    mulai: daysFromNow(0),
  },
  {
    id: "keg-besok",
    judul: "Workshop Git & GitHub untuk Kolaborasi Tim",
    tanggal: formatDate(daysFromNow(1)),
    waktu: "13:00 - 16:00 WIB",
    tempat: "Lab Komputer Terpadu GKB III Lt. 3",
    deskripsi:
      "Workshop hands-on penggunaan Git untuk version control dan GitHub untuk kolaborasi tim, termasuk branching strategy dan pull request workflow.",
    penyelenggara: "Laboratorium Informatika UMM",
    kategori: "Workshop",
    statusPendaftaran: "dibuka",
    tautanPendaftaran: "https://bit.ly/workshop-git",
    ditambahkanPada: daysAgo(2), // 2 hari lalu → label "Baru"
    mulai: daysFromNow(1),
  },
  {
    id: "keg-3",
    judul: "Sosialisasi Penyusunan KRS & Bimbingan Akademik Semester Genap",
    tanggal: formatDate(daysFromNow(5)),
    waktu: "09:00 - 11:30 WIB",
    tempat: "Aula GKB IV Lantai 9 / Hybrid Zoom",
    deskripsi:
      "Penjelasan alur pengisian Kartu Rencana Studi (KRS), kebijakan prasyarat mata kuliah kurikulum OBE, serta sesi tanya jawab bersama Ketua Program Studi dan Dosen Pembimbing Akademik.",
    penyelenggara: "Program Studi Informatika UMM",
    kategori: "Seminar",
    statusPendaftaran: "tanpa_pendaftaran",
    ditambahkanPada: daysAgo(5),
    mulai: daysFromNow(5),
  },
  {
    id: "keg-4",
    judul: "Seminar Nasional Teknologi Informasi dan Komunikasi 2026",
    tanggal: formatDate(daysFromNow(8)),
    waktu: "08:00 - 17:00 WIB",
    tempat: "Gedung Dome UMM",
    deskripsi:
      "Seminar nasional tahunan Prodi Informatika UMM menghadirkan narasumber dari akademisi dan industri teknologi terkemuka, membahas tren AI, IoT, dan Cyber Security.",
    penyelenggara: "Program Studi Informatika UMM",
    kategori: "Seminar",
    statusPendaftaran: "dibuka",
    tautanPendaftaran: "https://bit.ly/semnas-tik-2026",
    ditambahkanPada: daysAgo(7),
    mulai: daysFromNow(8),
  },
  {
    id: "keg-5",
    judul: "Lomba Hackathon Ideas 2026",
    tanggal: formatDate(daysFromNow(12)),
    waktu: "08:00 - 20:00 WIB",
    tempat: "Gedung Student Center UMM",
    deskripsi:
      "Kompetisi hackathon 12 jam bertemakan solusi digital untuk permasalahan lokal. Dibuka untuk mahasiswa aktif semua angkatan, tim 2-4 orang.",
    penyelenggara: "BEM Fakultas Teknik UMM",
    kategori: "Lomba",
    statusPendaftaran: "dibuka",
    tautanPendaftaran: "https://bit.ly/hackathon-2026",
    ditambahkanPada: daysAgo(3), // 3 hari lalu → label "Baru"
    mulai: daysFromNow(12),
  },
  {
    id: "keg-6",
    judul: "Workshop Persiapan Uji Kompetensi Keahlian Rekayasa Web",
    tanggal: formatDate(daysFromNow(14)),
    waktu: "13:00 - 16:00 WIB",
    tempat: "Lab Komputer Terpadu GKB III Lt. 3",
    deskripsi:
      "Pelatihan intensif persiapan sertifikasi kompetensi LSP UMM untuk skema Pemrograman Web dan Mobile, ditujukan bagi mahasiswa semester 5 dan 7.",
    penyelenggara: "Laboratorium Informatika & LSP UMM",
    kategori: "Workshop",
    statusPendaftaran: "ditutup",
    ditambahkanPada: daysAgo(10),
    mulai: daysFromNow(14),
  },
  {
    id: "keg-7",
    judul: "Kuliah Tamu: Pengembangan Karir di Bidang Teknologi",
    tanggal: formatDate(daysFromNow(18)),
    waktu: "09:00 - 11:00 WIB",
    tempat: "Zoom Meeting (Link dikirim via email)",
    deskripsi:
      "Sesi daring bersama alumni Informatika UMM yang kini berkarir di perusahaan teknologi global membahas persiapan karir, skill yang dibutuhkan, dan tips mendapatkan pekerjaan impian.",
    penyelenggara: "Career Center UMM & Prodi Informatika",
    kategori: "Kuliah Tamu",
    statusPendaftaran: "dibuka",
    tautanPendaftaran: "https://bit.ly/kuliah-tamu-karir",
    ditambahkanPada: daysAgo(4),
    mulai: daysFromNow(18),
  },
  {
    id: "keg-8",
    judul: "Batas Akhir Pengajuan Judul & Proposal Tugas Akhir Periode I",
    tanggal: formatDate(daysFromNow(22)),
    waktu: "23:59 WIB",
    tempat: "Portal Tugas Akhir Infoum",
    deskripsi:
      "Batas akhir penyerahan berkas proposal skripsi/tugas akhir yang telah disetujui oleh calon dosen pembimbing utama untuk mahasiswa angkatan 2023 ke atas.",
    penyelenggara: "Tim Tugas Akhir Prodi Informatika",
    kategori: "Akademik",
    statusPendaftaran: "tanpa_pendaftaran",
    ditambahkanPada: daysAgo(14),
    mulai: daysFromNow(22),
  },
  {
    id: "keg-9",
    judul: "Seminar Metode Penelitian dan Penulisan Karya Ilmiah",
    tanggal: formatDate(daysFromNow(25)),
    waktu: "09:00 - 12:00 WIB",
    tempat: "Aula GKB II Lt. 4",
    deskripsi:
      "Pembekalan metodologi penelitian dan teknik penulisan karya ilmiah yang baik dan benar sesuai pedoman UMM 2024, khususnya untuk mahasiswa yang sedang menyusun skripsi.",
    penyelenggara: "Program Studi Informatika UMM",
    kategori: "Seminar",
    statusPendaftaran: "dibuka",
    tautanPendaftaran: "https://bit.ly/seminar-metpen",
    ditambahkanPada: daysAgo(6),
    mulai: daysFromNow(25),
  },
  {
    id: "keg-10",
    judul: "Olimpiade Informatika Tingkat Universitas",
    tanggal: formatDate(daysFromNow(30)),
    waktu: "08:00 - 17:00 WIB",
    tempat: "Gedung Kuliah Bersama (GKB) III",
    deskripsi:
      "Kompetisi pemrograman dan logika informatika antar mahasiswa UMM. Kategori: Pemrograman Dasar, Algoritma & Struktur Data, dan Desain Database.",
    penyelenggara: "Himpunan Mahasiswa Informatika UMM",
    kategori: "Lomba",
    statusPendaftaran: "dibuka",
    tautanPendaftaran: "https://bit.ly/olimpiade-informatika",
    ditambahkanPada: daysAgo(8),
    mulai: daysFromNow(30),
  },

  // ===== SELESAI (~4 items) =====
  {
    id: "keg-selesai-1",
    judul: "Workshop Desain UI/UX dengan Figma",
    tanggal: formatDate(daysAgo(10)),
    waktu: "09:00 - 15:00 WIB",
    tempat: "Lab Komputer GKB III Lt. 2",
    deskripsi:
      "Workshop intensif desain antarmuka pengguna menggunakan Figma: dari wireframe, mockup, hingga prototyping interaktif. Peserta mendapat sertifikat keikutsertaan.",
    penyelenggara: "Laboratorium Informatika UMM",
    kategori: "Workshop",
    statusPendaftaran: "ditutup",
    ditambahkanPada: daysAgo(20),
    mulai: daysAgo(10),
  },
  {
    id: "keg-selesai-2",
    judul: "Kuliah Tamu: Blockchain & Web3 untuk Developer",
    tanggal: formatDate(daysAgo(15)),
    waktu: "13:00 - 15:00 WIB",
    tempat: "Ruang Seminar GKB II Lt. 5",
    deskripsi:
      "Pembahasan mendalam tentang teknologi blockchain, smart contract, dan ekosistem Web3 dari sudut pandang developer oleh praktisi dari startup Web3 Indonesia.",
    penyelenggara: "Himpunan Mahasiswa Informatika UMM",
    kategori: "Kuliah Tamu",
    statusPendaftaran: "ditutup",
    ditambahkanPada: daysAgo(25),
    mulai: daysAgo(15),
  },
  {
    id: "keg-selesai-3",
    judul: "Seminar Keamanan Siber: Ancaman dan Mitigasi",
    tanggal: formatDate(daysAgo(20)),
    waktu: "08:30 - 12:00 WIB",
    tempat: "Aula GKB IV Lantai 9",
    deskripsi:
      "Seminar membahas lanskap ancaman siber terkini, teknik ethical hacking, dan strategi mitigasi risiko keamanan informasi di era digital.",
    penyelenggara: "Program Studi Informatika UMM",
    kategori: "Seminar",
    statusPendaftaran: "ditutup",
    ditambahkanPada: daysAgo(30),
    mulai: daysAgo(20),
  },
  {
    id: "keg-selesai-4",
    judul: "Deadline Pengumpulan Laporan Kerja Praktik Semester Ganjil",
    tanggal: formatDate(daysAgo(5)),
    waktu: "23:59 WIB",
    tempat: "Portal Akademik UMM",
    deskripsi:
      "Batas akhir pengumpulan laporan kerja praktik beserta berkas pendukung (surat keterangan, lembar pengesahan) untuk mahasiswa yang melaksanakan KP semester ganjil 2026.",
    penyelenggara: "Tim Kerja Praktik Prodi Informatika",
    kategori: "Akademik",
    statusPendaftaran: "tanpa_pendaftaran",
    ditambahkanPada: daysAgo(35),
    mulai: daysAgo(5),
  },
];

// Kegiatan "baru" yang ditambahkan saat pull-to-refresh pertama kali
export const KEGIATAN_REFRESH_BARU: KegiatanProdi = {
  id: "keg-refresh",
  judul: "Info Baru: Pendaftaran Beasiswa Prestasi Akademik 2027",
  tanggal: formatDate(daysFromNow(3)),
  waktu: "23:59 WIB",
  tempat: "Portal Beasiswa UMM",
  deskripsi:
    "Dibuka pendaftaran beasiswa prestasi akademik untuk mahasiswa aktif dengan IPK ≥ 3.50. Kuota terbatas, segera lengkapi berkas dan unggah dokumen persyaratan.",
  penyelenggara: "Bagian Kemahasiswaan UMM",
  kategori: "Akademik",
  statusPendaftaran: "dibuka",
  tautanPendaftaran: "https://bit.ly/beasiswa-prestasi-2027",
  ditambahkanPada: new Date().toISOString(), // Baru saja ditambahkan
  mulai: daysFromNow(3),
};
