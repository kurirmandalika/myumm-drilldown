import AsyncStorage from '@react-native-async-storage/async-storage';
import { Kegiatan, KategoriKegiatan, Pengingat, StatusPendaftaran } from '../types';

// Helper to create relative ISO dates from now
function relativeDate(daysOffset: number, hoursOffset: number = 0, minutesOffset: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(d.getHours() + hoursOffset, d.getMinutes() + minutesOffset, 0, 0);
  return d.toISOString();
}

// 14 base dummy activities (§10: ±10 upcoming [min 1 today, 1 tomorrow, 2 'Baru'], ±4 past. All 5 categories represented)
export const INITIAL_KEGIATAN_LIST: Kegiatan[] = [
  // 1. Akan Datang - Hari Ini (Akademik) - Label 'Baru' & 'Hari ini'
  {
    id: 'keg-01',
    judul: 'Sosialisasi Penyusunan KRS & Bimbingan Akademik Semester Genap',
    kategori: 'Akademik',
    mulai: relativeDate(0, 4, 30), // Hari ini, 4.5 jam lagi
    selesai: relativeDate(0, 7),
    mode: 'luring',
    tempat: 'Aula GKB 4 Lt. 4 & Zoom Meeting',
    penyelenggara: 'Program Studi Informatika & Tim Akademik',
    deskripsi:
      'Sosialisasi panduan pengisian Kartu Rencana Studi (KRS) semester genap 2026/2027, evaluasi mata kuliah prasyarat, serta sesi tanya jawab bimbingan perwalian bersama Dosen PA.',
    statusPendaftaran: 'dibuka',
    tautanPendaftaran: 'https://inf.umm.ac.id/agenda/krs-genap',
    ditambahkanPada: relativeDate(-1), // 1 hari lalu (Baru)
  },

  // 2. Akan Datang - Besok (Seminar) - Label 'Baru' & 'Besok'
  {
    id: 'keg-02',
    judul: 'Seminar Nasional Artificial Intelligence & Future Interaction 2026',
    kategori: 'Seminar',
    mulai: relativeDate(1, 2), // Besok
    selesai: relativeDate(1, 6),
    mode: 'luring',
    tempat: 'Auditorium UMM Dome',
    penyelenggara: 'Himpunan Mahasiswa Informatika (HMF) UMM',
    deskripsi:
      'Menghadirkan pakar AI terkemuka yang membahas tren generative AI, rekayasa interaksi manusia-komputer modern, dan transformasi industri perangkat lunak masa depan.',
    statusPendaftaran: 'dibuka',
    tautanPendaftaran: 'https://inf.umm.ac.id/agenda/semnas-ai',
    ditambahkanPada: relativeDate(-2), // 2 hari lalu (Baru)
  },

  // 3. Akan Datang - 2 Hari Lagi (Workshop)
  {
    id: 'keg-03',
    judul: 'Hands-on Workshop: React Native & Clean Architecture Mobile Apps',
    kategori: 'Workshop',
    mulai: relativeDate(2, 3),
    selesai: relativeDate(2, 7),
    mode: 'daring',
    tempat: 'Google Meet & Live Coding Repository',
    penyelenggara: 'Laboratorium Rekayasa Perangkat Lunak',
    deskripsi:
      'Praktik langsung merancang arsitektur aplikasi mobile modern menggunakan React Native, Expo Router, TypeScript, dan state management modular.',
    statusPendaftaran: 'dibuka',
    tautanPendaftaran: 'https://inf.umm.ac.id/agenda/workshop-rn',
    ditambahkanPada: relativeDate(-5),
  },

  // 4. Akan Datang - 4 Hari Lagi (Kuliah Tamu)
  {
    id: 'keg-04',
    judul: 'Kuliah Tamu: Cyber Security Incident Response in FinTech Industries',
    kategori: 'Kuliah Tamu',
    mulai: relativeDate(4, 1),
    selesai: relativeDate(4, 4),
    mode: 'luring',
    tempat: 'Ruang Sidang Informatika GKB 3 Lt. 5',
    penyelenggara: 'Laboratorium Jaringan Komputer & Keamanan',
    deskripsi:
      'Kuliah tamu industri membahas deteksi ancaman siber, mitigasi serangan DDoS, dan standar keamanan ISO 27001 dalam industri perbankan serta finansial.',
    statusPendaftaran: 'dibuka',
    tautanPendaftaran: 'https://inf.umm.ac.id/agenda/kuliah-tamu-security',
    ditambahkanPada: relativeDate(-4),
  },

  // 5. Akan Datang - 8 Hari Lagi (Lomba) - Label 'Baru'
  {
    id: 'keg-05',
    judul: 'Informatics Innovation Hackathon 2026: Smart Campus Eco-Solutions',
    kategori: 'Lomba',
    mulai: relativeDate(8, 2),
    selesai: relativeDate(9, 8),
    mode: 'luring',
    tempat: 'Gedung Kuliah Bersama 3 Lt. 4',
    penyelenggara: 'Fakultas Teknik UMM & Tech Community',
    deskripsi:
      'Kompetisi pengembangan prototipe solusi digital kampus berkelanjutan selama 24 jam dengan total hadiah puluhan juta rupiah bagi tim mahasiswa terpilih.',
    statusPendaftaran: 'dibuka',
    tautanPendaftaran: 'https://inf.umm.ac.id/agenda/hackathon-2026',
    ditambahkanPada: relativeDate(-1), // 1 hari lalu (Baru)
  },

  // 6. Akan Datang - 10 Hari Lagi (Seminar)
  {
    id: 'keg-06',
    judul: 'Seminar Proposal Tugas Akhir & Skripsi Gelombang II Periode Genap',
    kategori: 'Seminar',
    mulai: relativeDate(10, 1),
    selesai: relativeDate(10, 7),
    mode: 'luring',
    tempat: 'Ruang Sidang GKB 3 Lt. 5',
    penyelenggara: 'Dewan Skripsi Program Studi Informatika',
    deskripsi:
      'Pelaksanaan seminar proposal bagi mahasiswa tingkat akhir yang telah menyelesaikan minimal 110 SKS dan lulus mata kuliah Metodologi Penelitian.',
    statusPendaftaran: 'dibuka',
    tautanPendaftaran: 'https://inf.umm.ac.id/agenda/sempro-genap',
    ditambahkanPada: relativeDate(-6),
  },

  // 7. Akan Datang - 12 Hari Lagi (Workshop) - Ditutup
  {
    id: 'keg-07',
    judul: 'Workshop Penulisan Paper Ilmiah & Publikasi Terindeks Sinta 2',
    kategori: 'Workshop',
    mulai: relativeDate(12, 2),
    selesai: relativeDate(12, 6),
    mode: 'daring',
    tempat: 'Zoom Meeting',
    penyelenggara: 'Pusat Studi Komputasi Cerdas',
    deskripsi:
      'Pelatihan penulisan manuskrip jurnal ilmiah, strategi memilih outlet publikasi bereputasi, dan teknik review respon reviewer jurnal terakreditasi.',
    statusPendaftaran: 'ditutup',
    ditambahkanPada: relativeDate(-7),
  },

  // 8. Akan Datang - 20 Hari Lagi (Kuliah Tamu) - Tanpa Pendaftaran
  {
    id: 'keg-08',
    judul: 'Kuliah Tamu: Cloud Native DevOps with Kubernetes & GitOps',
    kategori: 'Kuliah Tamu',
    mulai: relativeDate(20, 3),
    selesai: relativeDate(20, 6),
    mode: 'daring',
    tempat: 'YouTube Live Streaming Resmi Prodi',
    penyelenggara: 'Program Studi Informatika',
    deskripsi:
      'Kuliah umum terbuka untuk seluruh mahasiswa mengenai implementasi CI/CD pipelines, container orchestration dengan Kubernetes, dan filosofi GitOps.',
    statusPendaftaran: 'tanpa_pendaftaran',
    ditambahkanPada: relativeDate(-10),
  },

  // 9. Akan Datang - 25 Hari Lagi (Akademik) - Tanpa Pendaftaran
  {
    id: 'keg-09',
    judul: 'Pekan Ujian Tengah Semester (UTS) Semester Genap',
    kategori: 'Akademik',
    mulai: relativeDate(25, 1),
    selesai: relativeDate(32, 8),
    mode: 'luring',
    tempat: 'Ruang Kelas GKB 1, 2, dan 3 UMM',
    penyelenggara: 'Bagian Administrasi Akademik UMM',
    deskripsi:
      'Pelaksanaan UTS terjadwal untuk seluruh mata kuliah semester genap. Mahasiswa diwajibkan membawa Kartu Tanda Mahasiswa (KTM) dan kartu ujian resmi.',
    statusPendaftaran: 'tanpa_pendaftaran',
    ditambahkanPada: relativeDate(-12),
  },

  // 10. Akan Datang - 40 Hari Lagi (Lomba)
  {
    id: 'keg-10',
    judul: 'National Student Mobile UX Design Challenge 2027',
    kategori: 'Lomba',
    mulai: relativeDate(40, 2),
    selesai: relativeDate(45, 8),
    mode: 'daring',
    tempat: 'Portal Kompetisi Mahasiswa Nasional',
    penyelenggara: 'Asosiasi Interaksi Manusia dan Komputer',
    deskripsi:
      'Lomba perancangan antarmuka dan pengalaman pengguna aplikasi mobile skala nasional dengan fokus pada usability, aksesibilitas, dan design system.',
    statusPendaftaran: 'dibuka',
    tautanPendaftaran: 'https://inf.umm.ac.id/agenda/ux-challenge-2027',
    ditambahkanPada: relativeDate(-4),
  },

  // 11. Selesai - 2 Hari Lalu (Seminar)
  {
    id: 'keg-11',
    judul: 'Webinar Industri: Meniti Karier sebagai Product Designer di Tech Unicorn',
    kategori: 'Seminar',
    mulai: relativeDate(-2, -6),
    selesai: relativeDate(-2, -2),
    mode: 'daring',
    tempat: 'Zoom Meeting',
    penyelenggara: 'Alumni Informatika UMM Network',
    deskripsi:
      'Berbagi wawasan mengenai perjalanan karier di industri teknologi, portofolio UX design berdaya saing tinggi, dan negosiasi kerja profesional.',
    statusPendaftaran: 'ditutup',
    ditambahkanPada: relativeDate(-20),
  },

  // 12. Selesai - 6 Hari Lalu (Workshop)
  {
    id: 'keg-12',
    judul: 'Pelatihan Dasar Version Control Git & Kolaborasi GitHub',
    kategori: 'Workshop',
    mulai: relativeDate(-6, -5),
    selesai: relativeDate(-6, -1),
    mode: 'luring',
    tempat: 'Laboratorium Komputer Dasar GKB 3 Lt. 3',
    penyelenggara: 'Laboratorium Rekayasa Perangkat Lunak',
    deskripsi:
      'Materi dasar inisialisasi repositori, branching strategy, pull request workflow, serta penyelesaian merge conflicts dalam tim proyek kuliah.',
    statusPendaftaran: 'ditutup',
    ditambahkanPada: relativeDate(-25),
  },

  // 13. Selesai - 14 Hari Lalu (Kuliah Tamu)
  {
    id: 'keg-13',
    judul: 'Kuliah Tamu: Penerapan Tata Kelola IT dan Audit Sistem Informasi',
    kategori: 'Kuliah Tamu',
    mulai: relativeDate(-14, -6),
    selesai: relativeDate(-14, -3),
    mode: 'daring',
    tempat: 'Google Meet',
    penyelenggara: 'Program Studi Informatika',
    deskripsi:
      'Pemaparan framework COBIT 2019, manajemen risiko teknologi informasi institusi, dan proses audit kepatuhan tata kelola data perusahaan.',
    statusPendaftaran: 'ditutup',
    ditambahkanPada: relativeDate(-30),
  },

  // 14. Selesai - 30 Hari Lalu (Akademik)
  {
    id: 'keg-14',
    judul: 'Batas Akhir Pengajuan Judul Proposal Tugas Akhir Periode I',
    kategori: 'Akademik',
    mulai: relativeDate(-30, -8),
    selesai: relativeDate(-30, -1),
    mode: 'luring',
    tempat: 'Kantor Tata Usaha Informatika GKB 3 Lt. 4',
    penyelenggara: 'Sub-Bagian Akademik Informatika',
    deskripsi:
      'Batas pengumpulan formulir persetujuan topik riset skripsi dari calon dosen pembimbing bagi mahasiswa angkatan tingkat akhir.',
    statusPendaftaran: 'ditutup',
    ditambahkanPada: relativeDate(-45),
  },
];

// Special demo activity added on first pull-to-refresh (FR-03)
export const DEMO_REFRESH_KEGIATAN: Kegiatan = {
  id: 'keg-demo-new',
  judul: 'Workshop Kilat: Generative AI for Interaction Prototyping',
  kategori: 'Workshop',
  mulai: relativeDate(3, 2),
  selesai: relativeDate(3, 5),
  mode: 'daring',
  tempat: 'Zoom & Figma Community Space',
  penyelenggara: 'Lab IMK & Rekayasa Interaksi UMM',
  deskripsi:
    'Kegiatan baru yang baru saja ditambahkan oleh admin prodi! Mempelajari integrasi AI tools untuk menghasilkan alur UX dan validasi prototipe interaktif secara instan.',
  statusPendaftaran: 'dibuka',
  tautanPendaftaran: 'https://inf.umm.ac.id/agenda/genai-ux',
  ditambahkanPada: new Date().toISOString(), // Dibuat sekarang (Baru)
};

// Simulation State for Kegiatan (FR-10)
export interface KegiatanSimulationState {
  simulateLoadError: boolean;
  simulateEmptyKegiatan: boolean;
  hasRefreshedOnce: boolean;
}

export const kegiatanSimulationState: KegiatanSimulationState = {
  simulateLoadError: false,
  simulateEmptyKegiatan: false,
  hasRefreshedOnce: false,
};

type Listener = () => void;
const simulationListeners: Set<Listener> = new Set();

export function subscribeKegiatanSimulation(listener: Listener): () => void {
  simulationListeners.add(listener);
  return () => {
    simulationListeners.delete(listener);
  };
}

export function setSimulateKegiatanLoadError(val: boolean) {
  kegiatanSimulationState.simulateLoadError = val;
  simulationListeners.forEach((l) => l());
}

export function setSimulateEmptyKegiatan(val: boolean) {
  kegiatanSimulationState.simulateEmptyKegiatan = val;
  simulationListeners.forEach((l) => l());
}

export function resetKegiatanSimulation() {
  kegiatanSimulationState.simulateLoadError = false;
  kegiatanSimulationState.simulateEmptyKegiatan = false;
  kegiatanSimulationState.hasRefreshedOnce = false;
  simulationListeners.forEach((l) => l());
}

// Storage Keys
const STORAGE_KEY_PENGINGAT = '@myumm_pengingat_list';
const STORAGE_KEY_CACHE = '@myumm_kegiatan_cache';
const STORAGE_KEY_CACHE_TIME = '@myumm_kegiatan_cache_time';

// --- Local Storage Helpers for Pengingat (FR-05, FR-06) ---
export async function getStoredPengingatList(): Promise<Pengingat[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_PENGINGAT);
    if (!raw) return [];
    return JSON.parse(raw) as Pengingat[];
  } catch {
    return [];
  }
}

export async function saveStoredPengingat(
  kegiatanId: string,
  waktu: '1_hari' | '3_jam' | '1_jam'
): Promise<Pengingat> {
  const currentList = await getStoredPengingatList();
  const existingIdx = currentList.findIndex((p) => p.kegiatanId === kegiatanId);
  const newPengingat: Pengingat = {
    kegiatanId,
    waktu,
    dibuatPada: new Date().toISOString(),
  };

  let updatedList: Pengingat[];
  if (existingIdx >= 0) {
    updatedList = [...currentList];
    updatedList[existingIdx] = newPengingat;
  } else {
    updatedList = [...currentList, newPengingat];
  }

  await AsyncStorage.setItem(STORAGE_KEY_PENGINGAT, JSON.stringify(updatedList));
  return newPengingat;
}

export async function removeStoredPengingat(kegiatanId: string): Promise<void> {
  const currentList = await getStoredPengingatList();
  const updatedList = currentList.filter((p) => p.kegiatanId !== kegiatanId);
  await AsyncStorage.setItem(STORAGE_KEY_PENGINGAT, JSON.stringify(updatedList));
}

export async function getStoredPengingatById(kegiatanId: string): Promise<Pengingat | undefined> {
  const currentList = await getStoredPengingatList();
  return currentList.find((p) => p.kegiatanId === kegiatanId);
}

// --- Local Storage Helpers for Cache (FR-08) ---
export async function getCachedKegiatan(): Promise<{ list: Kegiatan[]; timestamp: string } | null> {
  try {
    const rawData = await AsyncStorage.getItem(STORAGE_KEY_CACHE);
    const rawTime = await AsyncStorage.getItem(STORAGE_KEY_CACHE_TIME);
    if (!rawData) return null;
    return {
      list: JSON.parse(rawData) as Kegiatan[],
      timestamp: rawTime || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function setCachedKegiatan(list: Kegiatan[], timestamp: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_CACHE, JSON.stringify(list));
    await AsyncStorage.setItem(STORAGE_KEY_CACHE_TIME, timestamp);
  } catch {
    // Ignore cache write error
  }
}

// --- Fetching Function with Delay and Simulation (FR-01, FR-03, FR-07, FR-08) ---
export interface FetchKegiatanResult {
  data: Kegiatan[];
  lastUpdated: string;
  isFromCache: boolean;
  addedNewOnRefresh?: boolean;
}

export async function fetchKegiatanList(
  isRefresh: boolean = false,
  delayMs: number = 600
): Promise<FetchKegiatanResult> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  // If simulate load error is active
  if (kegiatanSimulationState.simulateLoadError) {
    const cache = await getCachedKegiatan();
    if (cache && cache.list.length > 0) {
      return {
        data: cache.list,
        lastUpdated: cache.timestamp,
        isFromCache: true,
      };
    }
    throw new Error('Kegiatan belum bisa dimuat. Periksa koneksi internet kamu, lalu coba lagi.');
  }

  // If simulate empty is active
  if (kegiatanSimulationState.simulateEmptyKegiatan) {
    const emptyTime = new Date().toISOString();
    return {
      data: [],
      lastUpdated: emptyTime,
      isFromCache: false,
    };
  }

  // Base list
  let list = [...INITIAL_KEGIATAN_LIST];

  // If pull to refresh triggered on demo, add the new activity on first refresh
  let addedNew = false;
  if (isRefresh) {
    if (!kegiatanSimulationState.hasRefreshedOnce) {
      kegiatanSimulationState.hasRefreshedOnce = true;
      list = [DEMO_REFRESH_KEGIATAN, ...list];
      addedNew = true;
    } else {
      list = [DEMO_REFRESH_KEGIATAN, ...list];
    }
  } else if (kegiatanSimulationState.hasRefreshedOnce) {
    list = [DEMO_REFRESH_KEGIATAN, ...list];
  }

  const nowIso = new Date().toISOString();
  await setCachedKegiatan(list, nowIso);

  return {
    data: list,
    lastUpdated: nowIso,
    isFromCache: false,
    addedNewOnRefresh: addedNew,
  };
}

export async function fetchKegiatanDetail(id: string, delayMs: number = 500): Promise<Kegiatan | undefined> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  if (kegiatanSimulationState.simulateLoadError) {
    // Try from cache first
    const cache = await getCachedKegiatan();
    if (cache) {
      const found = cache.list.find((k) => k.id === id);
      if (found) return found;
    }
    throw new Error('Detail kegiatan belum bisa dimuat.');
  }

  if (id === DEMO_REFRESH_KEGIATAN.id) {
    return DEMO_REFRESH_KEGIATAN;
  }

  return INITIAL_KEGIATAN_LIST.find((k) => k.id === id);
}

// --- Date & Time Formatter according to SKILL.md ---
const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const BULAN_LENGKAP = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

// Returns "Sen, 24 Nov 2026 · 09.00 WIB" (using dot per SKILL.md: 09.00)
export function formatDateTimeIndo(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;

    const hari = HARI[d.getDay()];
    const tgl = d.getDate();
    const bln = BULAN[d.getMonth()];
    const thn = d.getFullYear();
    const jam = String(d.getHours()).padStart(2, '0');
    const menit = String(d.getMinutes()).padStart(2, '0');

    return `${hari}, ${tgl} ${bln} ${thn} · ${jam}.${menit} WIB`;
  } catch {
    return isoString;
  }
}

// Returns date only: "Sen, 24 Nov 2026"
export function formatDateOnlyIndo(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;

    const hari = HARI[d.getDay()];
    const tgl = d.getDate();
    const bln = BULAN[d.getMonth()];
    const thn = d.getFullYear();

    return `${hari}, ${tgl} ${bln} ${thn}`;
  } catch {
    return isoString;
  }
}

// Returns block date for card: { date: "24", month: "Nov" }
export function getDateBlock(isoString: string): { day: string; month: string } {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return { day: '--', month: '--' };
    return {
      day: String(d.getDate()),
      month: BULAN[d.getMonth()],
    };
  } catch {
    return { day: '--', month: '--' };
  }
}

// Relative time string: "baru saja", "5 menit lalu", "kemarin, 14.20"
export function formatRelativeTime(isoString: string): string {
  try {
    const then = new Date(isoString).getTime();
    const now = Date.now();
    const diffSec = Math.floor((now - then) / 1000);

    if (diffSec < 60) {
      return 'baru saja';
    }
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
      return `${diffMin} menit lalu`;
    }
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) {
      return `${diffHour} jam lalu`;
    }

    const d = new Date(isoString);
    const jam = String(d.getHours()).padStart(2, '0');
    const menit = String(d.getMinutes()).padStart(2, '0');
    if (diffHour < 48) {
      return `kemarin, ${jam}.${menit}`;
    }

    const hari = HARI[d.getDay()];
    const tgl = d.getDate();
    const bln = BULAN[d.getMonth()];
    return `${hari}, ${tgl} ${bln} ${jam}.${menit}`;
  } catch {
    return 'beberapa saat lalu';
  }
}

// Badge status logic (FR-09)
// "Baru" for <= 3 days added; "Hari ini" / "Besok" for event day
export function getKegiatanBadges(kegiatan: Kegiatan): {
  isHariIni: boolean;
  isBesok: boolean;
  isBaru: boolean;
} {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startTomorrow = startToday + 24 * 60 * 60 * 1000;
  const startAfterTomorrow = startTomorrow + 24 * 60 * 60 * 1000;

  const eventTime = new Date(kegiatan.mulai).getTime();
  const isHariIni = eventTime >= startToday && eventTime < startTomorrow;
  const isBesok = eventTime >= startTomorrow && eventTime < startAfterTomorrow;

  const addedTime = new Date(kegiatan.ditambahkanPada).getTime();
  const diffDaysAdded = (now.getTime() - addedTime) / (1000 * 60 * 60 * 24);
  const isBaru = diffDaysAdded <= 3 && diffDaysAdded >= 0;

  return { isHariIni, isBesok, isBaru };
}

// Group activities by period (§7 K2, SKILL.md §5a)
// "Minggu ini", "Minggu depan", "Bulan ini", "Nanti"
export function groupKegiatanByPeriod(list: Kegiatan[]): { period: string; items: Kegiatan[] }[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfWeek = todayStart + 7 * 24 * 60 * 60 * 1000;
  const endOfNextWeek = todayStart + 14 * 24 * 60 * 60 * 1000;
  const endOfMonth = todayStart + 30 * 24 * 60 * 60 * 1000;

  const groups: Record<string, Kegiatan[]> = {
    'Minggu ini': [],
    'Minggu depan': [],
    'Bulan ini': [],
    Nanti: [],
  };

  list.forEach((item) => {
    const t = new Date(item.mulai).getTime();
    if (t < endOfWeek) {
      groups['Minggu ini'].push(item);
    } else if (t < endOfNextWeek) {
      groups['Minggu depan'].push(item);
    } else if (t < endOfMonth) {
      groups['Bulan ini'].push(item);
    } else {
      groups['Nanti'].push(item);
    }
  });

  return [
    { period: 'Minggu ini', items: groups['Minggu ini'] },
    { period: 'Minggu depan', items: groups['Minggu depan'] },
    { period: 'Bulan ini', items: groups['Bulan ini'] },
    { period: 'Nanti', items: groups['Nanti'] },
  ].filter((g) => g.items.length > 0);
}
