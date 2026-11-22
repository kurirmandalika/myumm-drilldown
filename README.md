# myUMM Student — Jadwal Kegiatan Prodi & Drill-down Status Akademik

Prototype aplikasi mobile **myUMM Student** (iOS, Android, & Web via Expo) dengan fitur utama **Jadwal Kegiatan Prodi** (melihat kegiatan terbaru, membuka detail, dan menyimpan pengingat) serta fitur pelengkap **Drill-down Status Mata Kuliah** dan **Riwayat Studi**.

Dikembangkan berdasarkan dokumen spesifikasi kebutuhan **PRD v2**, **Worksheet 8 (M8, UXR-07)**, dan pengalaman langsung mahasiswa UMM.

---

## Identitas Proyek

- **Produk:** myUMM Student (iOS, Android, & Web via Expo)
- **Fitur Utama:** Jadwal Kegiatan Prodi (Melihat kegiatan terbaru, detail lengkap, filter kategori, pengingat lokal AsyncStorage, dan Kegiatan Saya)
- **Fitur Pendukung:** Drill-down status mata kuliah, Riwayat Studi accordion, Simulator State Demo
- **Penyusun:** Tifsan Ariel Pratama (NIM: 202310370311349)
- **Mata Kuliah:** Rekayasa Interaksi C — Program Studi Informatika, Universitas Muhammadiyah Malang
- **Versi:** 2.0.0 (PRD v2)

---

## Masalah yang Diselesaikan (PRD v2)

1. **Bagian Kegiatan Tidak Dapat Dibuka (M8):** Di dashboard myUMM Student asli, bagian Jadwal Kegiatan Prodi tidak dapat diklik.
2. **Kegiatan Terbaru Tidak Termuat (M9):** Pengguna melihat informasi usang atau kosong tanpa penjelasan.
3. **Waktu Pembaruan Tidak Jelas (M10):** Pengguna tidak tahu kapan data terakhir diperbarui sehingga tidak yakin informasinya masih berlaku.
4. **Harus Mencari di Kanal Lain (M11):** Mahasiswa terpaksa mencari informasi kegiatan di grup chat atau media sosial prodi.
5. **Mudah Lupa Jadwal Kegiatan (M12):** Tidak ada pengingat lokal untuk kegiatan yang ingin diikuti.

---

## Solusi & Pemetaan Kebutuhan Fungsional (PRD v2)

| ID Kebutuhan | Deskripsi Implementasi | Terpenuhi di |
|---|---|---|
| **FR-01** | Pratinjau 3 kegiatan akan datang terdekat di Dashboard (K1), kartu dapat ditekan ke K3, tautan "Lihat semua ›" ke K2. | `src/app/(tabs)/index.tsx` |
| **FR-02** | Layar K2 Daftar Kegiatan Prodi dengan tab Akan Datang / Selesai (dengan jumlah), filter kategori (Semua, Seminar, Workshop, Kuliah Tamu, Lomba, Akademik), dan pengelompokan per minggu (Minggu ini, Minggu depan, Bulan ini, Nanti). | `src/app/kegiatan/index.tsx`, `src/app/(tabs)/kegiatan.tsx` |
| **FR-03** | Keterangan "Diperbarui [waktu]" pada K1 dan K2. Fitur pull-to-refresh di K2 yang menambahkan 1 kegiatan baru pada muat ulang pertama. | `src/app/(tabs)/index.tsx`, `src/app/kegiatan/index.tsx`, `AcademicContext.tsx` |
| **FR-04** | Layar K3 Detail Kegiatan dengan info lengkap (kategori, waktu, tempat, penyelenggara, deskripsi, status pendaftaran). Tombol "Daftar" muncul kondisional bila status dibuka. | `src/app/kegiatan/[id].tsx` |
| **FR-05** | Pengaturan pengingat (K4) lewat bottom sheet (1 hari, 3 jam, 1 jam sebelumnya) tersimpan lokal di AsyncStorage, dapat diubah dan dihapus. | `src/app/kegiatan/[id].tsx`, `src/utils/pengingat.ts` |
| **FR-06** | Konfirmasi pengingat (K5) dengan ringkasan dan tautan ke Kegiatan Saya (K6) yang mencantumkan seluruh agenda berpengingat. | `src/app/kegiatan/[id].tsx`, `src/app/kegiatan/saya.tsx` |
| **FR-07** | State loading (skeleton), gagal koneksi dengan tombol "Coba lagi", dan kondisi kosong dengan 1 aksi lanjutan. | `ErrorState.tsx`, `EmptyState.tsx`, `LoadingSkeleton.tsx`, `kegiatan/index.tsx` |
| **FR-08** | Offline cache: bila gagal memuat tetapi ada data tersimpan, tampilkan data lama dengan banner waktu pembaruan terakhir dan tombol "Coba lagi". | `src/context/AcademicContext.tsx`, `src/app/kegiatan/index.tsx`, `pengingat.ts` |
| **FR-09** | Label status: "Baru" untuk agenda ≤ 3 hari terakhir; "Hari ini" / "Besok" untuk kegiatan pada hari H / H+1. | `src/utils/pengingat.ts`, `src/app/kegiatan/index.tsx`, `(tabs)/index.tsx` |
| **FR-10** | Toggle demo di tab Profil: "Simulasikan gagal memuat kegiatan" dan "Simulasikan tidak ada kegiatan" (beserta toggle simulasi v1). | `src/app/(tabs)/profil.tsx` |
| **FR-11** | Umpan balik visual langsung (< 100 ms) saat ditekan dan pemisahan tegas elemen informasi statis vs tombol aksi. | `PressableCard.tsx`, theme.ts |

---

## Cara Mencoba Alur Utama (User Flow 6.1)

1. Buka aplikasi, layar **Dashboard** tampil.
2. Di bagian **Jadwal Kegiatan Prodi**, terlihat 3 kegiatan terdekat, keterangan "Diperbarui ...", dan tautan "Lihat semua ›".
3. Tekan salah satu kegiatan untuk langsung membuka **Detail Kegiatan** (Alur cepat 1 ketukan).
4. Atau tekan "Lihat semua ›" / tab **Kegiatan** di navigasi bawah untuk membuka **Daftar Kegiatan Prodi**.
5. Tarik layar ke bawah (*pull-to-refresh*): kegiatan baru berlabel **"Baru"** akan muncul di daftar.
6. Tekan kegiatan untuk masuk ke **Detail Kegiatan**.
7. Tekan tombol **"Ingatkan saya"**, pilih waktu (misal "1 hari sebelumnya"), lalu tekan **"Simpan pengingat"**.
8. Dialog **Konfirmasi Pengingat** tampil. Tekan **"Lihat Kegiatan Saya"**.
9. Halaman **Kegiatan Saya** menampilkan kegiatan yang baru saja disimpan pengingatnya.
10. Buka tab **Profil** untuk mencoba simulator pengujian gagal memuat kegiatan atau data kosong.

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
