# myUMM Student — Drill-down Status Mata Kuliah

Prototype aplikasi mobile (iOS, Android, & Web) untuk antarmuka **myUMM Student**, berfokus pada perbaikan interaksi *drill-down* dari kartu ringkasan status mata kuliah di Dashboard ke daftar dan rincian mata kuliah, beserta jalur cadangan melalui menu Riwayat Studi.

Proyek ini disusun berdasarkan hasil riset pengguna dan spesifikasi kebutuhan interaksi pada **Worksheet 8 — UX Requirements (UXR-01 s.d. UXR-08)** serta **PRD (Product Requirement Document)**.

---

## 1. Masalah yang Diselesaikan

Pada aplikasi myUMM Student sebelumnya:
1. **Misleading Affordance:** Kartu ringkasan jumlah mata kuliah (Lulus, Belum Lulus, Sedang Ditempuh) tampak seperti tombol yang bisa ditekan, tetapi kenyataannya statis tanpa umpan balik (*dead end*).
2. **Tidak Ada Nama Mata Kuliah:** Dashboard hanya menampilkan angka agregat tanpa nama mata kuliah. Mahasiswa harus beralih ke portal web kampus untuk mengetahui mata kuliah apa saja yang belum lulus menjelang pengisian KRS.
3. **Ketidakjelasan Jalur Informasi:** Tidak adanya penanda affordance yang jujur menyebabkan pengguna menekan berulang kali atau salah menebak menu navigasi.

---

## 2. Fitur Utama & Kebutuhan Fungsional

| ID | Kebutuhan | Implementasi pada Prototype |
|---|---|---|
| **FR-01** | Kartu ringkasan interaktif | Kartu Lulus, Belum Lulus, dan Sedang Ditempuh dilengkapi ikon chevron "›" dan teks signifier "Lihat rincian". Kartu statis murni informasi dibuat datar tanpa chevron. |
| **FR-02** | Navigasi 1-ketukan ke S2 | Menekan kartu Dashboard langsung membuka Daftar Mata Kuliah dengan tab status yang sesuai sudah aktif. |
| **FR-03** | Daftar mata kuliah informatif | Menampilkan nama, kode, SKS, semester, nilai huruf, badge "Wajib"/"Pilihan", ringkasan SKS tab aktif, serta filter cepat "Hanya wajib". |
| **FR-04** | Detail mata kuliah mendalam (S3) | Menampilkan deskripsi, dosen pengampu, daftar prasyarat bersyarat (bisa ditekan), dan mata kuliah lanjutan yang mensyaratkan mata kuliah ini. |
| **FR-05** | Umpan balik visual ketukan | Respon visual ketukan instan (≤ 100 ms) dengan style highlight, opacity, dan ripple; dilengkapi pencegah ketukan ganda (*debounce*). |
| **FR-06** | Jalur cadangan Riwayat Studi | Menu navigasi bawah menyediakan tab "Riwayat Studi" (S4) dengan ringkasan IPK dan tampilan akordeon per semester yang bisa dibuka-tutup. |
| **FR-07** | Penanganan Loading, Kosong, Gagal | Skeleton animasi saat memuat, pesan positif pada kondisi kosong dengan tombol aksi lanjutan, serta pesan ramah saat gagal dengan tombol "Coba lagi". Dilengkapi toggle simulasi di layar Profil untuk keperluan demo pengujian usability. |
| **FR-08** | Jadwal Kegiatan Prodi (S6) | Kartu agenda kegiatan prodi di Dashboard dapat ditekan untuk melihat rincian tanggal, waktu, tempat, deskripsi, dan tautan pendaftaran. |

---

## 3. Desain & Pedoman UX

Aplikasi dibangun dengan mematuhi panduan desain pada `.claude/skills/myumm-mobile-ux/SKILL.md`:
- **Warna Identitas Kampus:** Merah Marun UMM (`#8B0000`) sebagai warna primer.
- **Warna Status Berpasangan Label:** Hijau (`#1E7B4F`) untuk Lulus, Merah (`#B42318`) untuk Belum Lulus, dan Biru (`#1D5FAF`) untuk Sedang Ditempuh. Status **selalu** disertai teks label (tidak hanya mengandalkan warna).
- **Aksesibilitas (WCAG AA):** Area sentuh minimum 44×44 pt pada seluruh elemen interaktif, kontras warna tinggi, serta `accessibilityRole` dan `accessibilityLabel` yang deskriptif.
- **Konsistensi Istilah:** Menggunakan bahasa Indonesia yang konsisten ("Lulus", "Belum Lulus", "Sedang Ditempuh", "Riwayat Studi", "Lihat rincian", "Coba lagi").

---

## 4. Cara Menjalankan Prototype

### Prasyarat
- **Node.js** (versi 18 ke atas)
- **npm** (atau package manager yang setara)

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan di Browser Web (Expo Web)
```bash
npm run web
# atau
npx expo start --web
```
Aplikasi akan terbuka otomatis di peramban pada alamat `http://localhost:8081`.

### 3. Menjalankan di Smartphone (Expo Go)
```bash
npx expo start
```
- Unduh aplikasi **Expo Go** di Play Store (Android) atau App Store (iOS).
- Pindai QR Code yang tampil di terminal menggunakan kamera ponsel (iOS) atau aplikasi Expo Go (Android).

---

## 5. Panduan Pengujian Usability (Demo Mode)

Untuk keperluan pengujian usability (Worksheet 8):

1. **Alur Utama (FR-01, FR-02, FR-03, FR-04):**
   - Di Beranda, ketuk kartu **"Belum Lulus: 3"**.
   - Halaman Daftar Mata Kuliah terbuka dalam 1 ketukan dengan tab "Belum Lulus" aktif.
   - Aktifkan filter **"Hanya wajib"** untuk melihat mata kuliah wajib yang belum lulus dalam < 30 detik.
   - Ketuk salah satu mata kuliah (misalnya *Struktur Data*) untuk meninjau prasyarat dan mata kuliah lanjutan yang terdampak.
   - Ketuk tombol kembali di app bar untuk kembali ke daftar.

2. **Alur Cadangan (FR-06):**
   - Dari navigasi bawah, ketuk tab **"Riwayat Studi"**.
   - Buka-tutup akordeon semester 1 sampai 6 untuk melihat seluruh riwayat perkuliahan dan nilai.
   - Ketuk mata kuliah apa pun untuk melihat detailnya.

3. **Pengujian State Gagal & Kosong (FR-07):**
   - Dari navigasi bawah, ketuk tab **"Profil"**.
   - Aktifkan toggle **"Simulasikan gagal memuat"**: Buka tab Beranda atau Daftar Mata Kuliah, maka state kesalahan dengan tombol **"Coba lagi"** akan muncul.
   - Aktifkan toggle **"Simulasikan belum lulus kosong"**: Buka tab Belum Lulus, maka state kosong dengan pesan positif dan tombol **"Lihat Riwayat Studi"** akan muncul.
   - Tekan tombol **"Kembalikan ke Kondisi Normal"** untuk mereset data.

---

## 6. Struktur Direktori

```text
myumm-drilldown/
├── app/                        # Rute dan navigasi (Expo Router)
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Konfigurasi navigasi bawah 3 tab
│   │   ├── index.tsx           # S1: Dashboard Mahasiswa
│   │   ├── riwayat.tsx         # S4: Riwayat Studi (Akordeon per semester)
│   │   └── profil.tsx          # Profil & Toggle Simulasi State (FR-07)
│   ├── mata-kuliah/
│   │   ├── index.tsx           # S2: Daftar Mata Kuliah (Segmented tabs & filter)
│   │   └── [kode].tsx          # S3: Detail Mata Kuliah & Relasi Prasyarat
│   ├── kegiatan/
│   │   └── [id].tsx            # S6: Detail Jadwal Kegiatan Prodi
│   └── _layout.tsx             # Root layout stack navigasi
├── src/
│   ├── components/             # Komponen antarmuka yang dapat digunakan ulang
│   │   ├── Badge.tsx           # Badge status & badge wajib/pilihan
│   │   ├── CourseItem.tsx      # Baris item mata kuliah dengan chevron
│   │   ├── SegmentedTabs.tsx   # Segmented control tab bar
│   │   ├── Skeleton.tsx        # Animasi skeleton loading
│   │   ├── StateView.tsx       # Tampilan terpadu empty state & error state
│   │   └── StatusCard.tsx      # Kartu ringkasan interaktif Dashboard
│   ├── constants/
│   │   └── theme.ts            # Warna UMM, skala font, jarak, dan elevasi
│   ├── data/
│   │   └── mataKuliah.ts       # Data dummy 36 mata kuliah & simulasi fetch
│   └── types/
│       └── index.ts            # Definisi antarmuka TypeScript
├── .claude/
│   └── skills/
│       └── myumm-mobile-ux/    # Panduan aturan desain UX myUMM
├── CHANGELOG.md                # Riwayat perubahan per milestone
├── PRD.md                      # Product Requirement Document
└── README.md                   # Petunjuk penggunaan dan dokumentasi
```
