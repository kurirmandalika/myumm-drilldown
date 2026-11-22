import { Mahasiswa, MataKuliah, KegiatanProdi, StatusMK } from '../types';

export const DUMMY_MAHASISWA: Mahasiswa = {
  nim: '202310370311349',
  nama: 'Tifsan Ariel Pratama',
  prodi: 'Informatika',
  fakultas: 'Fakultas Teknik',
  semester: 7,
  dosenPA: 'Dr. Ir. Eko Budi Cahyono, M.T.',
  statusAkademik: 'Aktif',
};

export const DUMMY_KEGIATAN: KegiatanProdi[] = [
  {
    id: 'keg-01',
    judul: 'Sosialisasi Penyusunan KRS & Pengisian Riwayat Studi',
    kategori: 'Akademik',
    tanggal: 'Kamis, 18 Desember 2026',
    waktu: '09.00 - 11.30 WIB',
    tempat: 'Aula GKB 4 Lt. 4 & Daring via Zoom',
    deskripsi:
      'Sosialisasi panduan pengisian Kartu Rencana Studi (KRS) semester genap 2026/2027, evaluasi mata kuliah prasyarat, serta bimbingan perwalian bersama Dosen Pembimbing Akademik.',
    narasumber: 'Ketua Program Studi Informatika & Tim Akademik',
    tautanDaftar: 'https://inf.umm.ac.id/agenda/krs-genap',
  },
  {
    id: 'keg-02',
    judul: 'Seminar Proposal Tugas Akhir & Skripsi Gelombang II',
    kategori: 'Tugas Akhir',
    tanggal: 'Senin, 22 Desember 2026',
    waktu: '08.00 - 15.00 WIB',
    tempat: 'Ruang Sidang Informatika, Gedung Kuliah Bersama 3 Lt. 5',
    deskripsi:
      'Pelaksanaan seminar proposal bagi mahasiswa tingkat akhir yang telah memenuhi minimal 110 SKS dan lulus mata kuliah Metodologi Penelitian.',
    narasumber: 'Dewan Penguji Skripsi Program Studi Informatika',
    tautanDaftar: 'https://inf.umm.ac.id/agenda/sempro-2',
  },
  {
    id: 'keg-03',
    judul: 'Workshop Cloud Computing & Persiapan Sertifikasi AWS',
    kategori: 'Pelatihan',
    tanggal: 'Sabtu, 10 Januari 2027',
    waktu: '08.30 - 15.00 WIB',
    tempat: 'Laboratorium Rekayasa Perangkat Lunak GKB 3 Lt. 4',
    deskripsi:
      'Pelatihan intensif arsitektur cloud AWS dan persiapan ujian sertifikasi kompetensi cloud bagi mahasiswa semester 5 ke atas.',
    narasumber: 'Certified AWS Solutions Architect',
    tautanDaftar: 'https://inf.umm.ac.id/agenda/workshop-cloud',
  },
];

export const DUMMY_MATA_KULIAH: MataKuliah[] = [
  // Semester 1
  {
    kode: 'IF101',
    nama: 'Algoritma dan Pemrograman I',
    sks: 3,
    semester: 1,
    status: 'lulus',
    nilai: 'A',
    wajib: true,
    prasyarat: [],
    deskripsi: 'Konsep dasar pemrograman terstruktur, tipe data, kontrol alur, fungsi, array, dan algoritma dasar.',
    dosenPengampu: 'Nur Hayatin, S.Kom., M.Kom.',
  },
  {
    kode: 'IF102',
    nama: 'Matematika Diskrit',
    sks: 3,
    semester: 1,
    status: 'lulus',
    nilai: 'B+',
    wajib: true,
    prasyarat: [],
    deskripsi: 'Himpunan, relasi, fungsi, teori graf, kombinatorika, dan aljabar boolean dalam ilmu komputer.',
    dosenPengampu: 'Deni Sutaji, M.Kom.',
  },
  {
    kode: 'IF103',
    nama: 'Pengantar Teknologi Informasi',
    sks: 2,
    semester: 1,
    status: 'lulus',
    nilai: 'A',
    wajib: true,
    prasyarat: [],
    deskripsi: 'Pengenalan lanskap teknologi informasi terkini, sistem komputer, dan etika profesi IT.',
    dosenPengampu: 'Gita Indah Marthasari, S.T., M.Kom.',
  },
  {
    kode: 'UM101',
    nama: 'Bahasa Indonesia',
    sks: 2,
    semester: 1,
    status: 'lulus',
    nilai: 'A',
    wajib: true,
    prasyarat: [],
    deskripsi: 'Kaidah penulisan karya ilmiah dan komunikasi akademik berbahasa Indonesia.',
    dosenPengampu: 'Dra. Sri Wahyuni, M.Pd.',
  },
  {
    kode: 'UM102',
    nama: 'Pendidikan Agama Islam',
    sks: 2,
    semester: 1,
    status: 'lulus',
    nilai: 'A',
    wajib: true,
    prasyarat: [],
    deskripsi: 'Integrasi nilai-nilai keislaman dan kemuhammadiyahan dalam kehidupan bermasyarakat dan profesi.',
    dosenPengampu: 'Dr. Khozin, M.Si.',
  },
  {
    kode: 'IF104',
    nama: 'Logika Matematika',
    sks: 3,
    semester: 1,
    status: 'lulus',
    nilai: 'B',
    wajib: true,
    prasyarat: [],
    deskripsi: 'Proposisi, kalkulus predikat, metode pembuktian formal, dan induksi matematika.',
    dosenPengampu: 'Agus Eko Minarno, S.Kom., M.Kom.',
  },
  {
    kode: 'UM103',
    nama: 'Bahasa Inggris I',
    sks: 2,
    semester: 1,
    status: 'lulus',
    nilai: 'B+',
    wajib: true,
    prasyarat: [],
    deskripsi: 'Membaca dan memahami literatur teknis bidang komputer dalam bahasa Inggris.',
    dosenPengampu: 'Rina Wahyu, M.Ed.',
  },

  // Semester 2
  {
    kode: 'IF201',
    nama: 'Algoritma dan Pemrograman II',
    sks: 3,
    semester: 2,
    status: 'lulus',
    nilai: 'B',
    wajib: true,
    prasyarat: ['IF101'],
    deskripsi: 'Rekursi, dynamic memory allocation, pointer, manipulasi berkas, dan pemrograman modular tingkat lanjut.',
    dosenPengampu: 'Nur Hayatin, S.Kom., M.Kom.',
  },
  {
    kode: 'IF202',
    nama: 'Struktur Data',
    sks: 3,
    semester: 2,
    status: 'belum_lulus',
    nilai: 'D',
    wajib: true,
    prasyarat: ['IF101'],
    deskripsi: 'Linked list, stack, queue, binary search tree, heap, graph, dan analisis kompleksitas algoritma.',
    dosenPengampu: 'Christian Sri Kusuma Aditya, M.Kom.',
  },
  {
    kode: 'IF203',
    nama: 'Aljabar Linier dan Matriks',
    sks: 3,
    semester: 2,
    status: 'lulus',
    nilai: 'A',
    wajib: true,
    prasyarat: ['IF102'],
    deskripsi: 'Operasi matriks, sistem persamaan linier, ruang vektor, nilai dan vektor eigen.',
    dosenPengampu: 'Deni Sutaji, M.Kom.',
  },
  {
    kode: 'IF204',
    nama: 'Arsitektur dan Organisasi Komputer',
    sks: 3,
    semester: 2,
    status: 'lulus',
    nilai: 'B+',
    wajib: true,
    prasyarat: [],
    deskripsi: 'Struktur CPU, memori, bus, representasi data bilangan biner, set instruksi assembly.',
    dosenPengampu: 'Mahar Faiqurahman, M.T.',
  },
  {
    kode: 'UM201',
    nama: 'Pendidikan Pancasila',
    sks: 2,
    semester: 2,
    status: 'lulus',
    nilai: 'A',
    wajib: true,
    prasyarat: [],
    deskripsi: 'Filsafat Pancasila sebagai ideologi negara dan etika dalam berbangsa dan bernegara.',
    dosenPengampu: 'Drs. Suparto, M.Pd.',
  },
  {
    kode: 'UM202',
    nama: 'Bahasa Inggris II',
    sks: 2,
    semester: 2,
    status: 'lulus',
    nilai: 'A',
    wajib: true,
    prasyarat: ['UM103'],
    deskripsi: 'Komunikasi lisan, presentasi teknis, dan penulisan laporan teknis bahasa Inggris.',
    dosenPengampu: 'Rina Wahyu, M.Ed.',
  },
  {
    kode: 'IF205',
    nama: 'Sistem Operasi',
    sks: 3,
    semester: 2,
    status: 'lulus',
    nilai: 'B',
    wajib: true,
    prasyarat: [],
    deskripsi: 'Manajemen proses, threads, konkurensi, deadlock, manajemen memori virtual, dan sistem berkas.',
    dosenPengampu: 'Zulfikar Al Huda, M.Kom.',
  },

  // Semester 3
  {
    kode: 'IF301',
    nama: 'Pemrograman Berorientasi Objek',
    sks: 3,
    semester: 3,
    status: 'lulus',
    nilai: 'A',
    wajib: true,
    prasyarat: ['IF201'],
    deskripsi: 'Enkapsulasi, pewarisan, polimorfisme, abstraksi, exception handling, dan design patterns dasar.',
    dosenPengampu: 'Yuda Munarko, S.Kom., M.Sc.',
  },
  {
    kode: 'IF302',
    nama: 'Basis Data',
    sks: 3,
    semester: 3,
    status: 'lulus',
    nilai: 'B+',
    wajib: true,
    prasyarat: ['IF202'],
    deskripsi: 'Model relasional, normalisasi data, SQL DDL & DML, transaksi database, indexing, dan trigger.',
    dosenPengampu: 'Gita Indah Marthasari, S.T., M.Kom.',
  },
  {
    kode: 'IF303',
    nama: 'Analisis dan Desain Algoritma',
    sks: 3,
    semester: 3,
    status: 'belum_lulus',
    nilai: 'E',
    wajib: true,
    prasyarat: ['IF202'],
    deskripsi: 'Asymptotic notation, divide and conquer, greedy algorithms, dynamic programming, backtracking.',
    dosenPengampu: 'Agus Eko Minarno, S.Kom., M.Kom.',
  },
  {
    kode: 'IF304',
    nama: 'Probabilitas dan Statistika',
    sks: 3,
    semester: 3,
    status: 'lulus',
    nilai: 'B',
    wajib: true,
    prasyarat: ['IF102'],
    deskripsi: 'Distribusi peluang, regresi linier, uji hipotesis, dan analisis data inferensial komputasi.',
    dosenPengampu: 'Deni Sutaji, M.Kom.',
  },
  {
    kode: 'IF305',
    nama: 'Jaringan Komputer',
    sks: 3,
    semester: 3,
    status: 'lulus',
    nilai: 'A',
    wajib: true,
    prasyarat: [],
    deskripsi: 'Model OSI 7 Layer, TCP/IP, routing, subnetting IPv4/IPv6, switching, dan keamanan jaringan dasar.',
    dosenPengampu: 'Mahar Faiqurahman, M.T.',
  },
  {
    kode: 'IF306',
    nama: 'Interaksi Manusia dan Komputer',
    sks: 3,
    semester: 3,
    status: 'lulus',
    nilai: 'A',
    wajib: true,
    prasyarat: [],
    deskripsi: 'Prinsip desain antarmuka, usability engineering, user-centered design, prototyping, dan evaluasi heuristik.',
    dosenPengampu: 'Ir. Wildan Suharso, M.Kom.',
  },

  // Semester 4
  {
    kode: 'IF401',
    nama: 'Rekayasa Perangkat Lunak',
    sks: 3,
    semester: 4,
    status: 'lulus',
    nilai: 'A',
    wajib: true,
    prasyarat: ['IF301'],
    deskripsi: 'SDLC, pemodelan UML, metodologi Agile/Scrum, estimasi proyek, dan manajemen risiko perangkat lunak.',
    dosenPengampu: 'Yuda Munarko, S.Kom., M.Sc.',
  },
  {
    kode: 'IF402',
    nama: 'Pemrograman Web',
    sks: 3,
    semester: 4,
    status: 'lulus',
    nilai: 'B+',
    wajib: true,
    prasyarat: ['IF301', 'IF302'],
    deskripsi: 'Arsitektur client-server web, RESTful API, backend frameworks, state management, dan database integration.',
    dosenPengampu: 'Zulfikar Al Huda, M.Kom.',
  },
  {
    kode: 'IF403',
    nama: 'Kecerdasan Buatan',
    sks: 3,
    semester: 4,
    status: 'lulus',
    nilai: 'A',
    wajib: true,
    prasyarat: ['IF303'],
    deskripsi: 'Search strategies (A*, minimax), knowledge representation, sistem pakar, dan logika fuzzy.',
    dosenPengampu: 'Dr. Ir. Eko Budi Cahyono, M.T.',
  },
  {
    kode: 'IF404',
    nama: 'Keamanan Informasi',
    sks: 3,
    semester: 4,
    status: 'lulus',
    nilai: 'B',
    wajib: true,
    prasyarat: ['IF305'],
    deskripsi: 'Kriptografi simetris & asimetris, otentikasi, vulnerability scanning, dan standar keamanan ISO 27001.',
    dosenPengampu: 'Mahar Faiqurahman, M.T.',
  },
  {
    kode: 'IF405',
    nama: 'Grafika Komputer',
    sks: 3,
    semester: 4,
    status: 'belum_lulus',
    nilai: 'D',
    wajib: false,
    prasyarat: ['IF203'],
    deskripsi: 'Transformasi 2D/3D, rendering pipeline, shading, pencahayaan, ray tracing, dan OpenGL/WebGL shaders.',
    dosenPengampu: 'Agus Eko Minarno, S.Kom., M.Kom.',
  },
  {
    kode: 'IF406',
    nama: 'Pemrograman Mobile Lanjut',
    sks: 3,
    semester: 4,
    status: 'lulus',
    nilai: 'A',
    wajib: false,
    prasyarat: ['IF301'],
    deskripsi: 'Pengembangan aplikasi multiplatform React Native/Flutter, offline-first sync, dan background service.',
    dosenPengampu: 'Christian Sri Kusuma Aditya, M.Kom.',
  },

  // Semester 5
  {
    kode: 'IF501',
    nama: 'Pembelajaran Mesin',
    sks: 3,
    semester: 5,
    status: 'lulus',
    nilai: 'A',
    wajib: true,
    prasyarat: ['IF403'],
    deskripsi: 'Supervised vs unsupervised learning, regresi, klasifikasi SVM, clustering K-Means, dan evaluasi model.',
    dosenPengampu: 'Dr. Ir. Eko Budi Cahyono, M.T.',
  },
  {
    kode: 'IF502',
    nama: 'Cloud Computing',
    sks: 3,
    semester: 5,
    status: 'lulus',
    nilai: 'B+',
    wajib: true,
    prasyarat: ['IF305'],
    deskripsi: 'Virtualisasi, containerisasi Docker & Kubernetes, serverless architecture, dan cloud deployment.',
    dosenPengampu: 'Mahar Faiqurahman, M.T.',
  },
  {
    kode: 'IF503',
    nama: 'Rekayasa Kebutuhan Perangkat Lunak',
    sks: 3,
    semester: 5,
    status: 'lulus',
    nilai: 'A',
    wajib: true,
    prasyarat: ['IF401'],
    deskripsi: 'Elisitasi kebutuhan, spesifikasi SRS, pemodelan use case formal, validasi kebutuhan, dan trace matrix.',
    dosenPengampu: 'Yuda Munarko, S.Kom., M.Sc.',
  },
  {
    kode: 'IF504',
    nama: 'Pengolahan Citra Digital',
    sks: 3,
    semester: 5,
    status: 'lulus',
    nilai: 'B+',
    wajib: false,
    prasyarat: ['IF203'],
    deskripsi: 'Peningkatan kontras, filtering frekuensi spasial, segmentasi citra, morfologi, dan ekstraksi fitur.',
    dosenPengampu: 'Agus Eko Minarno, S.Kom., M.Kom.',
  },

  // Semester 6 / Semester Berjalan (6 Sedang Ditempuh)
  {
    kode: 'IF601',
    nama: 'Metodologi Penelitian',
    sks: 2,
    semester: 6,
    status: 'ditempuh',
    wajib: true,
    prasyarat: ['IF401'],
    deskripsi: 'Metode riset komputasi, studi literatur, perumusan hipotesis, dan penyusunan proposal penelitian tugas akhir.',
    dosenPengampu: 'Dr. Ir. Eko Budi Cahyono, M.T.',
  },
  {
    kode: 'IF602',
    nama: 'Kerja Praktik',
    sks: 2,
    semester: 6,
    status: 'ditempuh',
    wajib: true,
    prasyarat: ['IF401'],
    deskripsi: 'Pengalaman magang industri selama 1-2 bulan dan penyusunan laporan kerja praktik lapangan.',
    dosenPengampu: 'Ir. Wildan Suharso, M.Kom.',
  },
  {
    kode: 'IF603',
    nama: 'Rekayasa Interaksi',
    sks: 3,
    semester: 6,
    status: 'ditempuh',
    wajib: true,
    prasyarat: ['IF306'],
    deskripsi: 'Perancangan interaksi manusia-komputer tingkat lanjut, drill-down interaction, micro-interactions, dan evaluasi usability pengguna.',
    dosenPengampu: 'Ir. Wildan Suharso, M.Kom.',
  },
  {
    kode: 'IF604',
    nama: 'Sistem Terdistribusi',
    sks: 3,
    semester: 6,
    status: 'ditempuh',
    wajib: true,
    prasyarat: ['IF502'],
    deskripsi: 'RPC/gRPC, konsensus Raft/Paxos, CAP theorem, message queue Kafka/RabbitMQ, dan arsitektur microservices.',
    dosenPengampu: 'Mahar Faiqurahman, M.T.',
  },
  {
    kode: 'IF605',
    nama: 'Pengujian Perangkat Lunak',
    sks: 3,
    semester: 6,
    status: 'ditempuh',
    wajib: true,
    prasyarat: ['IF401'],
    deskripsi: 'White-box & black-box testing, unit testing Jest, integration testing, CI/CD pipeline, dan test automation.',
    dosenPengampu: 'Yuda Munarko, S.Kom., M.Sc.',
  },
  {
    kode: 'IF606',
    nama: 'Deep Learning',
    sks: 3,
    semester: 6,
    status: 'ditempuh',
    wajib: false,
    prasyarat: ['IF501'],
    deskripsi: 'Arsitektur neural networks, backpropagation, CNN, RNN/LSTM, Transformer models, dan transfer learning dengan PyTorch.',
    dosenPengampu: 'Dr. Ir. Eko Budi Cahyono, M.T.',
  },
];

// In-memory simulation states (can be modified in Profil for testing FR-07)
export interface SimulationConfig {
  simulateLoadError: boolean;
  simulateEmptyBelumLulus: boolean;
}

export const simulationState: SimulationConfig = {
  simulateLoadError: false,
  simulateEmptyBelumLulus: false,
};

// Listeners for simulation state changes
type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function subscribeSimulationState(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setSimulateLoadError(val: boolean) {
  simulationState.simulateLoadError = val;
  listeners.forEach((l) => l());
}

export function setSimulateEmptyBelumLulus(val: boolean) {
  simulationState.simulateEmptyBelumLulus = val;
  listeners.forEach((l) => l());
}

export function resetSimulationState() {
  simulationState.simulateLoadError = false;
  simulationState.simulateEmptyBelumLulus = false;
  listeners.forEach((l) => l());
}

// Calculate summary stats dynamically from data
export function getStats(courses: MataKuliah[] = DUMMY_MATA_KULIAH) {
  const lulus = courses.filter((c) => c.status === 'lulus');
  const belumLulusRaw = courses.filter((c) => c.status === 'belum_lulus');
  const belumLulus = simulationState.simulateEmptyBelumLulus ? [] : belumLulusRaw;
  const ditempuh = courses.filter((c) => c.status === 'ditempuh');

  const sksLulus = lulus.reduce((sum, c) => sum + c.sks, 0);
  const sksBelumLulus = belumLulus.reduce((sum, c) => sum + c.sks, 0);
  const sksDitempuh = ditempuh.reduce((sum, c) => sum + c.sks, 0);

  // Grade weight mapping for IPK
  const bobotNilai: Record<string, number> = {
    A: 4.0,
    'B+': 3.5,
    B: 3.0,
    'C+': 2.5,
    C: 2.0,
    D: 1.0,
    E: 0.0,
  };

  let totalBobotSks = 0;
  let totalSksSelesai = 0;

  lulus.forEach((c) => {
    if (c.nilai && bobotNilai[c.nilai] !== undefined) {
      totalBobotSks += bobotNilai[c.nilai] * c.sks;
      totalSksSelesai += c.sks;
    }
  });

  const ipk = totalSksSelesai > 0 ? (totalBobotSks / totalSksSelesai).toFixed(2) : '0.00';

  return {
    countLulus: lulus.length,
    countBelumLulus: belumLulus.length,
    countDitempuh: ditempuh.length,
    sksLulus,
    sksBelumLulus,
    sksDitempuh,
    totalMataKuliah: courses.length,
    ipk,
  };
}

// Fetch all courses with simulated network delay (±600ms)
export async function fetchMataKuliah(
  statusFilter?: StatusMK,
  delayMs = 600
): Promise<MataKuliah[]> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  if (simulationState.simulateLoadError) {
    throw new Error('Gagal memuat data dari server kampus.');
  }

  let list = [...DUMMY_MATA_KULIAH];
  if (simulationState.simulateEmptyBelumLulus) {
    list = list.filter((c) => c.status !== 'belum_lulus');
  }

  if (statusFilter) {
    list = list.filter((c) => c.status === statusFilter);
  }

  return list;
}

// Fetch single course by code
export async function fetchMataKuliahByKode(
  kode: string,
  delayMs = 600
): Promise<MataKuliah | undefined> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  if (simulationState.simulateLoadError) {
    throw new Error('Gagal memuat detail mata kuliah.');
  }

  return DUMMY_MATA_KULIAH.find((c) => c.kode.toLowerCase() === kode.toLowerCase());
}

// Fetch prerequisites details
export function getPrasyaratDetails(prasyaratKodes: string[]): MataKuliah[] {
  return DUMMY_MATA_KULIAH.filter((c) => prasyaratKodes.includes(c.kode));
}

// Find courses that require this course as prerequisite
export function getDependentCourses(kode: string): MataKuliah[] {
  return DUMMY_MATA_KULIAH.filter((c) => c.prasyarat.includes(kode));
}

// Fetch prodi activities
export async function fetchKegiatanProdi(delayMs = 600): Promise<KegiatanProdi[]> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  if (simulationState.simulateLoadError) {
    throw new Error('Gagal memuat jadwal kegiatan prodi.');
  }

  return DUMMY_KEGIATAN;
}

// Fetch prodi activity by ID
export async function fetchKegiatanById(id: string, delayMs = 600): Promise<KegiatanProdi | undefined> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  if (simulationState.simulateLoadError) {
    throw new Error('Gagal memuat detail kegiatan.');
  }

  return DUMMY_KEGIATAN.find((k) => k.id === id);
}
