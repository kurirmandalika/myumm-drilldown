# myUMM Student — Jadwal Kegiatan Prodi & Status Mata Kuliah

Prototype aplikasi mobile (iOS, Android, & Web) untuk antarmuka **myUMM Student**. Proyek ini melanjutkan fondasi v1 (*drill-down* status mata kuliah) dengan fitur utama baru: **Jadwal Kegiatan Prodi (PRD v2)** — memungkinkan mahasiswa melihat agenda kegiatan terbaru langsung dari dashboard, meninjau rincian kegiatan lengkap, mengatur pengingat lokal, serta mengelola agenda pada halaman Kegiatan Saya.

Proyek ini dibangun berdasarkan hasil riset pengguna dan spesifikasi kebutuhan interaksi pada **Worksheet 8 (M8, UXR-07)**, pengalaman riil mahasiswa, serta panduan antarmuka **`.claude/skills/myumm-mobile-ux/SKILL.md`**.

---

## 1. Masalah yang Diselesaikan (PRD v2)

Pada aplikasi myUMM Student sebelumnya:
1. **Bagian Kegiatan Tidak Dapat Dibuka (M8):** Bagian Jadwal Kegiatan Prodi di Dashboard bersifat statis dan tidak dapat dibuka menjadi rincian (*dead end*).
2. **Informasi Usang atau Kosong Tanpa Penjelasan (M9):** Kegiatan terbaru tidak termuat sehingga mahasiswa harus mencari informasi di kanal lain (grup chat, media sosial).
3. **Ketidakpastian Kesegaran Data (M10):** Pengguna tidak tahu kapan informasi kegiatan terakhir diperbarui.
4. **Mudah Lupa Jadwal Kegiatan (M12):** Tidak tersedianya pengingat kegiatan menyebabkan mahasiswa melewatkan seminar atau workshop penting.
5. **Kebutuhan v1 Tetap Terjaga:** Kartu ringkasan status mata kuliah di dashboard tetap dapat di-*drill-down* menuju daftar mata kuliah dan rincian prasyarat.

---

## 2. Pemetaan Kebutuhan Fungsional (PRD v2 §8)

| ID | Kebutuhan | Implementasi pada Prototype |
|---|---|---|
| **FR-01** | Pratinjau 3 Kegiatan Terdekat di Dashboard (K1) | Menampilkan 3 kartu kegiatan akan datang yang terdekat secara otomatis. Setiap kartu interaktif (chevron "›") dan memiliki tautan "Lihat semua ›" menuju K2. |
| **FR-02** | Daftar Kegiatan Prodi Lengkap (K2) | Tab Akan Datang (terdekat dulu) dan Selesai (terbaru dulu), chip filter 5 kategori (Seminar, Workshop, Kuliah Tamu, Lomba, Akademik), dan pengelompokan per minggu ("Minggu ini", "Minggu depan", "Bulan ini", "Nanti"). |
| **FR-03** | Kesegaran Data & Tarik untuk Muat Ulang | Menampilkan label "Diperbarui [waktu]" (misal "Diperbarui baru saja", "5 menit lalu"). Tarik untuk muat ulang (pull-to-refresh) di K2 menambahkan 1 kegiatan baru demo berlabel "Baru". |
| **FR-04** | Detail Kegiatan Mendalam (K3) | Informasi lengkap judul, kategori, tanggal & waktu format Indonesia, tempat/mode (luring/daring), penyelenggara, deskripsi, dan status pendaftaran. Tombol "Daftar" hanya muncul jika pendaftaran dibuka dan ada tautan. |
| **FR-05** | Pengaturan Pengingat Lokal (K4) | Bottom sheet Atur Pengingat dengan pilihan radio: 1 hari, 3 jam, atau 1 jam sebelumnya. Pengingat disimpan persisten di `AsyncStorage` dan dapat diubah/dihapus. |
| **FR-06** | Konfirmasi Pengingat (K5) & Kegiatan Saya (K6) | Dialog konfirmasi yang menyebut nama kegiatan dan waktu pengingat. Layar Kegiatan Saya menampilkan semua agenda yang diberi pengingat urut terdekat, lengkap dengan aksi hapus pengingat. |
| **FR-07** | Penanganan State Loading, Gagal, dan Kosong | Animasi skeleton saat pemuatan data, pesan ramah pengguna tanpa kode teknis saat gagal beserta tombol "Coba lagi", dan kondisi kosong informatif dengan aksi lanjutan. |
| **FR-08** | Banner Data Tersimpan (Offline Cache) | Bila pemuatan gagal tetapi ada data tersimpan di cache lokal, data lama tetap ditampilkan bersama banner kuning peringatan dan aksi "Coba lagi". |
| **FR-09** | Badge Relatif "Baru", "Hari ini", dan "Besok" | Badge biru "Baru" untuk kegiatan ditambahkan ≤ 3 hari, badge merah "Hari ini", dan badge oranye "Besok". |
| **FR-10** | Saklar Simulasi Demo di Profil | Toggle di tab Profil: "Simulasikan gagal memuat kegiatan" dan "Simulasikan tidak ada kegiatan", berdampingan dengan simulasi mata kuliah v1. |
| **FR-11** | Umpan Balik Visual Instan & Signifier Jujur | Respon tekan seketika (≤ 100 ms) dengan `android_ripple`, opacity, dan chevron. Elemen statis informasi dibuat datar tanpa affordance tombol palsu. |

---

## 3. Alur Pengujian Usability & Skenario Demo

### Alur Utama 6.1 (Menemukan Kegiatan & Mengatur Pengingat)
1. **Buka Aplikasi (Dashboard):**
   - Perhatikan bagian **Jadwal Kegiatan Prodi** di bawah status mata kuliah.
   - Terlihat 3 kegiatan terdekat, keterangan "Diperbarui [waktu]", dan tautan "Lihat semua ›".
2. **Buka Daftar Kegiatan (K2):**
   - Ketuk **"Lihat semua ›"** (atau gunakan tab navigasi bawah **Kegiatan**).
   - Layar Daftar Kegiatan terbuka. Coba ganti filter kategori (misal: "Workshop" atau "Seminar").
   - Tarik layar ke bawah (*pull-to-refresh*): perhatikan indikator refresh dan munculnya kegiatan baru berlabel **"Baru"** beserta toast pemberitahuan.
3. **Buka Detail Kegiatan (K3):**
   - Ketuk salah satu kegiatan akan datang.
   - Perhatikan detail waktu ("Sen, 24 Nov 2026 · 09.00 WIB"), mode luring/daring, penyelenggara, dan status pendaftaran.
4. **Atur Pengingat (K4):**
   - Ketuk tombol utama **"Ingatkan saya"**.
   - Bottom sheet Atur Pengingat muncul. Pilih waktu pengingat (contoh: "1 hari sebelumnya").
   - Ketuk **"Simpan pengingat"**.
5. **Konfirmasi Pengingat (K5):**
   - Dialog konfirmasi tampil: "Pengingat disimpan. Kamu akan diingatkan 1 hari sebelum [judul], [tanggal]".
   - Ketuk **"Lihat Kegiatan Saya"**.
6. **Kegiatan Saya (K6):**
   - Layar Kegiatan Saya terbuka menampilkan kegiatan yang baru saja disimpan.
   - Ketuk tombol tempat sampah pada item untuk menghapus pengingat (notifikasi toast "Pengingat dihapus" akan muncul).

### Alur Cepat (8.2)
- Di Dashboard, ketuk langsung salah satu dari 3 kartu kegiatan terdekat → langsung menuju Detail Kegiatan dalam **1 ketukan**.

### Pengujian State Gagal & Cache Data Tersimpan (FR-08, FR-10)
1. Buka tab **Profil** di navigasi bawah.
2. Aktifkan saklar **"Simulasikan gagal memuat kegiatan"**.
3. Buka tab **Kegiatan**:
   - Jika sebelumnya sudah pernah memuat data, aplikasi menampilkan banner kuning di atas daftar: *"Menampilkan data terakhir (diperbarui …). Coba lagi"*.
   - Jika belum ada data tersimpan, layar gagal tampil dengan pesan ramah dan tombol *"Coba lagi"*.
4. Kembali ke Profil dan aktifkan saklar **"Simulasikan tidak ada kegiatan"** untuk menguji tampilan kosong positif beserta tombol pengarah ke kegiatan selesai.
5. Tekan tombol **"Kembalikan ke Kondisi Normal"** untuk mereset seluruh pengujian ke kondisi awal.

### Fitur Status Mata Kuliah (v1 Tetap Berfungsi Penuh)
- Di Beranda, ketuk kartu **"Belum Lulus: 3"** → terbuka Daftar Mata Kuliah dengan filter "Hanya wajib".
- Ketuk mata kuliah apa pun → Detail Mata Kuliah & prasyarat interaktif.
- Buka tab **Riwayat Studi** → akordeon per semester dengan ringkasan IPK dan total SKS.

---

## 4. Cara Menjalankan Prototype

### Prasyarat
- **Node.js** (versi 18+)
- **npm**

### 1. Menjalankan di Browser Web (Expo Web)
```bash
npm run web
# atau
npx expo start --web
```
Aplikasi dapat diuji langsung di peramban web pada alamat `http://localhost:8081`.

### 2. Menjalankan di Smartphone (Expo Go)
```bash
npx expo start
```
- Pindai QR Code menggunakan aplikasi **Expo Go** di Android atau kamera ponsel di iOS.

### 3. Validasi TypeScript
```bash
npx tsc --noEmit
```

---

## 5. Struktur Direktori Proyek

```text
myumm-drilldown/
├── app/                        # Navigasi & Halaman (Expo Router)
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Navigasi 4 tab: Beranda, Kegiatan, Riwayat Studi, Profil
│   │   ├── index.tsx           # K1: Dashboard Mahasiswa & Pratinjau Kegiatan Terdekat
│   │   ├── kegiatan.tsx        # K2: Daftar Kegiatan Prodi (Filter, Tab, Refresh)
│   │   ├── riwayat.tsx         # S4: Riwayat Studi Mahasiswa (Collapsible per semester)
│   │   └── profil.tsx          # Profil Mahasiswa & Toggle Simulasi State (FR-10)
│   ├── kegiatan/
│   │   ├── [id].tsx            # K3: Detail Kegiatan Prodi
│   │   └── saya.tsx            # K6: Kegiatan Saya (Daftar Pengingat Tersimpan)
│   ├── mata-kuliah/
│   │   ├── index.tsx           # S2: Daftar Mata Kuliah (StatusMK tabs)
│   │   └── [kode].tsx          # S3: Detail Mata Kuliah & Prasyarat
│   └── _layout.tsx             # Root Stack layout
├── src/
│   ├── components/             # Komponen antarmuka modular
│   │   ├── Badge.tsx           # Badge status mata kuliah
│   │   ├── CourseItem.tsx      # Item daftar mata kuliah
│   │   ├── KegiatanCard.tsx    # Kartu kegiatan prodi (blok tanggal, badge, signifier)
│   │   ├── ReminderBottomSheet.tsx # K4: Bottom sheet atur pengingat
│   │   ├── ReminderConfirmationModal.tsx # K5: Modal konfirmasi pengingat
│   │   ├── SegmentedTabs.tsx   # Segmented control tab bar
│   │   ├── Skeleton.tsx        # Skeleton animasi loading
│   │   ├── StateView.tsx       # Komponen kosong & gagal seragam
│   │   └── StatusCard.tsx      # Kartu interaktif status mata kuliah
│   ├── constants/
│   │   └── theme.ts            # Warna UMM, tipografi, elevasi, ukuran sentuh
│   ├── data/
│   │   ├── kegiatan.ts         # Data dummy 14 kegiatan prodi relatif, cache & storage
│   │   └── mataKuliah.ts       # Data dummy 36 mata kuliah & profil mahasiswa
│   └── types/
│       └── index.ts            # Definisi antarmuka TypeScript lengkap
├── .claude/
│   └── skills/
│       └── myumm-mobile-ux/    # Panduan aturan desain antarmuka myUMM
├── CHANGELOG.md                # Catatan riwayat perubahan terstruktur
├── PRD.md                      # Product Requirement Document (v2)
└── README.md                   # Dokumentasi panduan penggunaan & arsitektur
```
