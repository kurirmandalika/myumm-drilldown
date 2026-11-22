# myUMM Student — Drill-down Status Mata Kuliah

Prototype aplikasi mobile **myUMM Student** dengan fitur drill-down interaktif dari kartu ringkasan status akademik ke daftar dan rincian mata kuliah, beserta jalur alternatif Riwayat Studi dan jadwal kegiatan prodi.

Dikembangkan berdasarkan dokumen spesifikasi kebutuhan **Worksheet 8 — UX Requirements (UXR-01 s.d. UXR-08)** dan **PRD.md**.

---

## Identitas Proyek

- **Produk:** myUMM Student (iOS, Android, & Web via Expo)
- **Fitur Utama:** Drill-down dari kartu ringkasan status mata kuliah ke rincian mata kuliah
- **Penyusun:** Tifsan Ariel Pratama (NIM: 202310370311349)
- **Mata Kuliah:** Rekayasa Interaksi C — Program Studi Informatika, Universitas Muhammadiyah Malang
- **Versi:** 1.0.0

---

## Masalah yang Diselesaikan

Pada aplikasi myUMM Student sebelumnya, ditemukan masalah interaksi pada dashboard:
1. **Misleading Affordance (M2):** Kartu ringkasan status kelulusan tampak seperti tombol yang bisa ditekan, tetapi statis dan tidak merespons ketukan pengguna.
2. **Ketiadaan Umpan Balik (M3):** Tidak ada umpan balik visual saat kartu ditekan sehingga pengguna menekan berulang kali atau mengira aplikasi macet.
3. **Data Kurang Spesifik (M1, M6, M7):** Dashboard hanya menampilkan angka tanpa daftar nama mata kuliah, sehingga mahasiswa khawatir ada mata kuliah wajib yang belum lulus dan terpaksa berpindah ke web portal kampus.
4. **Jalur Buntu (M4, M5, M8):** Alur menuju rincian status studi tidak jelas dan agenda prodi tidak dapat dibuka.

---

## Solusi & Pemetaan Kebutuhan Fungsional

| ID Kebutuhan | Deskripsi Implementasi | Terpenuhi di |
|---|---|---|
| **FR-01** | Setiap kartu ringkasan di Dashboard bisa ditekan dengan affordance visual eksplisit (ikon `›` dan teks *"Lihat rincian"*). Elemen informasi murni (IPK dan SKS total) dibedakan secara tegas agar tidak tampak seperti tombol. | `StatusSummaryCard.tsx`, `AcademicHeader.tsx` |
| **FR-02** | Menekan kartu status di Dashboard langsung membuka layar Daftar Mata Kuliah (S2) dalam 1 ketukan dengan tab yang bersesuaian langsung aktif. | `src/app/mata-kuliah/index.tsx` |
| **FR-03** | Layar S2 menampilkan kode, nama, SKS, semester kurikulum, nilai, dan label badge *"Wajib/Pilihan"* serta jumlah prasyarat. Tersedia filter *"Hanya Wajib"* untuk menjawab mata kuliah wajib yang belum lulus dalam ≤ 30 detik. Angka sinkron dengan Dashboard. | `src/app/mata-kuliah/index.tsx`, `CourseListItem.tsx` |
| **FR-04** | Menekan mata kuliah di daftar (S2) maupun riwayat studi (S4) membuka Detail Mata Kuliah (S3) lengkap dengan checklist prasyarat dan daftar mata kuliah lanjutan yang mensyaratkannya. | `src/app/mata-kuliah/[kode].tsx` |
| **FR-05** | Umpan balik visual langsung (< 100 ms) saat elemen ditekan (*opacity highlight* dan *ripple*), disertai proteksi *debounce* untuk mencegah navigasi ganda (*double-tap*). | `PressableCard.tsx` |
| **FR-06** | Menu navigasi bawah selalu menampilkan tab **Riwayat Studi** (S4) dengan ringkasan IPK kumulatif dan tampilan *accordion* per semester yang dapat dibuka/tutup. | `src/app/(tabs)/riwayat.tsx` |
| **FR-07** | Setiap kondisi gagal atau kosong memiliki penjelasan penyebab yang jelas dan **satu aksi lanjutan kontekstual**. Disediakan **Simulator Pengujian State** di tab Profil untuk menguji kondisi *error state* dan *empty state*. | `ErrorState.tsx`, `EmptyState.tsx`, `profil.tsx` |
| **FR-08** | Item Jadwal Kegiatan Prodi di Dashboard dapat ditekan untuk membuka Detail Kegiatan Prodi (S6) berisi tanggal, waktu, lokasi, deskripsi agenda, serta aksi simpan pengingat. | `src/app/kegiatan/[id].tsx`, `ProdiActivitySection.tsx` |

---

## Teknologi yang Digunakan

- **Framework:** Expo SDK 58 (React Native 0.88 + React 19)
- **Bahasa:** TypeScript (Strict Mode)
- **Routing:** Expo Router (File-based navigation: Tab bar bawah + Stack)
- **Styling:** React Native StyleSheet dengan sistem tema terpadu (UMM Maroon Brand Theme, WCAG AA Contrast Compliant)
- **Icons:** `@expo/vector-icons` (Ionicons)
- **Data:** Dataset lokal dummy (36 mata kuliah dari semester 1 s.d. 7) dengan jeda simulasi 600 ms

---

## Cara Menjalankan Aplikasi

### 1. Prasyarat
Pastikan Node.js (v18+) dan npm telah terpasang di komputer Anda.

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan di Browser (Web)
```bash
npm run web
# atau
npx expo start --web
```
Aplikasi akan terbuka otomatis di peramban web (misalnya `http://localhost:8081`).

### 4. Menjalankan di Perangkat Mobile (Android / iOS)
```bash
npx expo start
```
Pindai QR code yang tampil di terminal menggunakan aplikasi **Expo Go** pada ponsel Android atau kamera iPhone.

### 5. Pengecekan Type Safety TypeScript
```bash
npx tsc --noEmit
```

---

## Alur Navigasi Utama untuk Evaluasi Prototype

1. **Alur Utama (Drill-down Status Belum Lulus):**
   - Di Beranda, ketuk kartu **"Belum Lulus: 3"** (terdapat penanda "Lihat rincian ›").
   - Layar **Daftar Mata Kuliah** terbuka langsung dengan tab *"Belum Lulus"* aktif.
   - Ketuk filter **"Hanya Wajib"** untuk langsung menyaring mata kuliah wajib yang belum lulus (*Struktur Data & Algoritma*, *Sistem Operasi*).
   - Ketuk salah satu mata kuliah untuk membuka **Detail Mata Kuliah** dan memeriksa keterkaitan prasyaratnya.

2. **Alur Cadangan (Riwayat Studi):**
   - Dari navigasi bawah, ketuk tab **"Riwayat Studi"**.
   - Buka-tutup (*expand/collapse*) semester yang diinginkan (Semester 1 s.d. 7).
   - Ketuk mata kuliah apa saja untuk masuk ke layar detailnya.

3. **Alur Pengujian State Error / Kosong (Demo Usability):**
   - Dari navigasi bawah, ketuk tab **"Profil"**.
   - Pada panel **Simulator Pengujian State (FR-07)**, aktifkan toggle *"Simulasikan gagal memuat"* atau *"Simulasikan data kosong"*.
   - Buka kembali tab Beranda atau Daftar Mata Kuliah untuk melihat penanganan *ErrorState* (dengan tombol "Coba Lagi") atau *EmptyState* (dengan tombol aksi lanjutan).
   - Ketuk *"Reset ke Data Normal"* pada tab Profil untuk mengembalikan data seperti semula.

---

## Struktur Folder

```text
myumm-drilldown/
├── assets/                    # Aset gambar, ikon aplikasi, dan favicon
├── src/
│   ├── app/                   # Rute halaman (Expo Router)
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx    # Konfigurasi tab navigasi bawah
│   │   │   ├── index.tsx      # S1: Dashboard Beranda myUMM
│   │   │   ├── riwayat.tsx    # S4: Riwayat Studi per semester (Accordion)
│   │   │   └── profil.tsx     # Profil Mahasiswa & Simulator State Demo
│   │   ├── mata-kuliah/
│   │   │   ├── index.tsx      # S2: Daftar Mata Kuliah per status
│   │   │   └── [kode].tsx     # S3: Detail Mata Kuliah & Prasyarat
│   │   ├── kegiatan/
│   │   │   └── [id].tsx       # S6: Detail Kegiatan Prodi
│   │   └── _layout.tsx        # Root Stack Navigation & Provider
│   ├── components/            # Komponen UI modular
│   │   ├── AcademicHeader.tsx # Header informasi profil & statis
│   │   ├── CourseListItem.tsx # Item daftar mata kuliah interaktif
│   │   ├── EmptyState.tsx     # Komponen state kosong
│   │   ├── ErrorState.tsx     # Komponen state gagal memuat
│   │   ├── LoadingSkeleton.tsx# Skeleton loader animasi
│   │   ├── PressableCard.tsx  # Wrapper sentuh dengan feedback < 100ms
│   │   ├── ProdiActivitySection.tsx # Seksi agenda kegiatan prodi
│   │   ├── SegmentedTabs.tsx  # Segmented control tab status
│   │   └── StatusSummaryCard.tsx # Kartu ringkasan status ber-affordance
│   ├── constants/
│   │   └── theme.ts           # Tema warna UMM, tipografi, dan spacing
│   ├── context/
│   │   └── AcademicContext.tsx# Manajemen state akademik & simulasi
│   ├── data/
│   │   ├── kegiatanProdi.ts   # Data dummy agenda prodi
│   │   ├── mahasiswa.ts       # Data dummy profil mahasiswa
│   │   └── mataKuliah.ts      # Dataset dummy 36 mata kuliah (semester 1-7)
│   ├── types/
│   │   └── index.ts           # Definisi interface TypeScript
│   └── utils/
│       └── academic.ts        # Helper kalkulasi SKS, IPK, dan prasyarat
├── app.json                   # Konfigurasi Expo
├── CHANGELOG.md               # Catatan perubahan bertahap per milestone
├── package.json               # Dependensi proyek
├── PRD.md                     # Product Requirement Document
├── README.md                  # Dokumentasi proyek & panduan pengujian
└── tsconfig.json              # Konfigurasi TypeScript
```
