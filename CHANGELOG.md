# Changelog

Semua perubahan penting pada project ini dicatat di file ini.
Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).

## [Unreleased]

## [0.7.0] - 2026-11-23

### Added
- Dokumentasi komprehensif pada `README.md` mencakup latar belakang masalah, pemetaan fitur terhadap kebutuhan fungsional (FR-01 s.d. FR-08), panduan menjalankan aplikasi di Expo Go dan browser web, serta petunjuk skenario pengujian evaluasi usability testing.

### Verified
- Validasi seluruh acceptance criteria PRD Bagian 11 mencakup alur utama 1-ketukan dari Dashboard ke daftar mata kuliah, keselarasan angka kartu dan tab, filter mata kuliah wajib, navigasi prasyarat pada rincian mata kuliah, alur cadangan Riwayat Studi, dan pengujian state gagal/kosong.
- Validasi kompilasi kode TypeScript (`npx tsc --noEmit`) dan bundling web statis (`npx expo export --platform web`) dengan hasil 100% lulus tanpa error.
- Pemeriksaan menyeluruh kepatuhan terhadap seluruh aturan checklist pedoman antarmuka `SKILL.md`.

## [0.6.0] - 2026-11-23

### Added
- Layar Detail Kegiatan Prodi (S6) lengkap dengan kategori, judul, tanggal, waktu, tempat, narasumber, dan deskripsi acara (FR-08, UXR-07).
- Navigasi interaktif dari item agenda kegiatan di Dashboard langsung ke Detail Kegiatan Prodi (FR-08).
- Tombol aksi pembukaan tautan pendaftaran/informasi kegiatan ke peramban (FR-08).
- Penanganan state pemuatan skeleton dan penanganan kesalahan dengan tombol "Coba lagi" pada layar kegiatan (FR-07, FR-08).

## [0.5.0] - 2026-11-23

### Added
- Komponen terpusat `EmptyState` dan `ErrorState` (`src/components/StateView.tsx`) dengan pesan ramah, tanpa kode teknis, dan 1 aksi lanjutan yang jelas (FR-07, UXR-06).
- Layar Profil lengkap (`app/(tabs)/profil.tsx`) dengan informasi profil akademik mahasiswa (FR-07).
- Saklar toggle simulasi di layar Profil: "Simulasikan gagal memuat" dan "Simulasikan belum lulus kosong" untuk mendemonstrasikan evaluasi usability testing prototype (FR-07, UXR-06).
- Tombol "Coba lagi" yang memuat ulang data saat terjadi kegagalan jaringan simulasi di seluruh layar (FR-07, UXR-06).
- State kosong positif pada daftar belum lulus yang mengarahkan pengguna ke "Lihat Riwayat Studi" (FR-07, UXR-06).

## [0.4.0] - 2026-11-23

### Added
- Layar Riwayat Studi (S4) sebagai alur navigasi cadangan yang selalu dapat diakses dari tab navigasi bawah (FR-06, UXR-05).
- Ringkasan akademik lengkap di bagian atas: IPK Kumulatif, total SKS Lulus, Belum Lulus, dan Sedang Ditempuh (FR-06).
- Tampilan riwayat mata kuliah per semester dengan model akordeon buka-tutup (collapsible) yang intuitif (FR-06).
- Item mata kuliah di Riwayat Studi dapat ditekan untuk melihat rincian di Detail Mata Kuliah (S3) (FR-04, FR-06).
- Dukungan animasi layout, pull-to-refresh, skeleton loading, dan state penanganan gagal memuat (FR-05, FR-07).

## [0.3.0] - 2026-11-23

### Added
- Layar Daftar Mata Kuliah (S2) dengan segmented tab interaktif (Belum Lulus, Sedang Ditempuh, Lulus) yang konsisten dengan angka di Dashboard (FR-02, FR-03, UXR-01, UXR-04).
- Baris ringkasan jumlah mata kuliah dan total SKS aktif di atas daftar (FR-03).
- Filter "Hanya wajib" untuk memfilter mata kuliah wajib dengan cepat (FR-03, UXR-04).
- Pengurutan default mata kuliah: wajib terlebih dahulu, kemudian semester terkecil (FR-03).
- Komponen `CourseItem` dengan urutan informasi terstandarisasi: nama (teks tebal), kode/SKS/semester, badge Wajib/Pilihan, nilai akhir, dan chevron '›' (FR-03, FR-05).
- Layar Detail Mata Kuliah (S3) lengkap dengan bobot SKS, semester, nilai akhir, dosen pengampu, deskripsi, daftar prasyarat bersyarat yang bisa ditekan, dan daftar mata kuliah lanjutan (FR-04).
- Banner peringatan khusus pada mata kuliah wajib yang berstatus Belum Lulus untuk memudahkan perencanaan KRS (FR-03, FR-04).
- Penanganan state loading (skeleton), kosong, dan gagal dengan tombol "Coba lagi" pada S2 dan S3 (FR-05, FR-07).

## [0.2.0] - 2026-11-23

### Added
- Layar Detail Kegiatan Prodi (K3) dengan informasi lengkap kategori, tanggal & waktu format Indonesia, tempat/mode (luring/daring), penyelenggara, deskripsi, dan status pendaftaran (FR-04).
- Logika tombol sekunder pendaftaran yang hanya muncul ketika pendaftaran dibuka dan memiliki tautan resmi (FR-04).
- Tombol utama "Ingatkan saya" interaktif yang berubah menjadi "Pengingat aktif · Ubah" saat pengingat aktif (FR-04, FR-05).
- Layar Daftar Kegiatan Prodi (K2) dengan tab Akan Datang & Selesai, chip filter 5 kategori, dan pengelompokan per minggu (FR-02, FR-09).
- Fitur tarik untuk muat ulang (pull-to-refresh) di K2 dengan pembaruan timestamp, umpan balik toast, dan penambahan kegiatan demo berlabel "Baru" (FR-03, FR-09).
- Banner peringatan cache data tersimpan dengan tombol "Coba lagi" saat pemuatan gagal (FR-08).
- Bagian Jadwal Kegiatan Prodi di Dashboard dengan 3 kegiatan terdekat, keterangan "Diperbarui [waktu]", blok tanggal visual, badge "Baru"/"Hari ini"/"Besok", dan tautan "Lihat semua ›" (K1, FR-01, FR-03, FR-11).
- Tab Kegiatan pada navigasi bawah (Beranda, Kegiatan, Riwayat Studi, Profil) dan navigasi 1 ketukan dari Dashboard ke detail kegiatan (K1, FR-01, FR-11).
- Komponen `KegiatanCard` dengan blok tanggal di kiri, badge kategori, indikator pengingat aktif, dan signifier chevron interaktif (FR-01, FR-11).
- Model data `Kegiatan`, `Pengingat`, serta generator tanggal relatif ISO untuk 14 agenda kegiatan prodi mencakup 10 kegiatan akan datang dan 4 kegiatan selesai di seluruh 5 kategori (FR-05, FR-08, FR-10).
- Penyimpanan lokal pengingat kegiatan dan cache data tersimpan menggunakan AsyncStorage untuk mendukung akses offline (FR-05, FR-08).
- Dashboard (S1) dengan header mahasiswa lengkap (nama, NIM, prodi, IPK, total SKS lulus) (FR-01, UXR-01).
- Tiga kartu status mata kuliah yang interaktif (Lulus, Belum Lulus, Sedang Ditempuh) dengan signifier jelas: chevron '›', teks "Lihat rincian", dan badge status (FR-01, UXR-03).
- Umpan balik visual ketukan langsung (highlight/ripple/opacity) dan pencegah navigasi ganda (FR-05, UXR-02).
- Navigasi ketukan kartu langsung ke daftar mata kuliah (S2) dengan parameter tab aktif (FR-01, FR-02).
- Kartu informasi statis tanpa signifier interaktif untuk membedakan elemen tombol vs informasi murni (FR-01, UXR-03).
- Kerangka navigasi bawah tiga tab: Beranda, Riwayat Studi, dan Profil (FR-06, UXR-05).

## [0.1.0] - 2026-11-23

### Added
- Inisialisasi project Expo (SDK 58) dengan TypeScript dan konfigurasi Expo Router.
- Struktur folder aplikasi (`src/constants`, `src/types`, `src/data`).
- Tema visual dan palet warna sesuai pedoman identitas myUMM Student (`src/constants/theme.ts`).
- Data dummy 36 mata kuliah semester 1–6, profil mahasiswa, dan jadwal kegiatan prodi dengan jeda simulasi 600 ms serta toggle pengujian status error/kosong (`src/data/mataKuliah.ts`) (FR-01, FR-02, FR-03, FR-07).


