# Changelog

Semua perubahan penting pada project ini dicatat di file ini.
Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).

## [Unreleased]

## [1.0.0] - 2026-11-23
### Added
- Dokumentasi komprehensif pada `README.md` mencakup latar belakang masalah (M1–M8), pemetaan kebutuhan fungsional (FR-01 s.d. FR-08), petunjuk instalasi dan pengujian, serta alur evaluasi prototipe.
- Validasi Acceptance Criteria 1 s.d. 8 dari PRD.md:
  - 1 ketukan drill-down dari Dashboard ke Daftar Mata Kuliah per status (FR-02, UXR-01).
  - Umpan balik visual langsung < 100 ms dan proteksi double-tap (FR-05, UXR-02).
  - Sinkronisasi jumlah angka kartu dan tab list dari single source of truth (FR-03).
  - Filter "Hanya Wajib" dan badge penanda mata kuliah prioritas kelulusan (FR-03, UXR-04).
  - Akses Riwayat Studi ≤ 2 ketukan melalui tab bar navigasi bawah (FR-06, UXR-05).
  - Penanganan state gagal dengan tombol "Coba Lagi" dan state kosong dengan aksi lanjutan (FR-07, UXR-06).
  - Simulator pengujian kondisi error dan empty pada tab Profil untuk keperluan demo (FR-07).
  - Navigasi dua arah tanpa jalan buntu untuk alur utama maupun cadangan (UXR-07).
  - Validasi kompilasi TypeScript dan web export bundling tanpa error (AC 8).

## [0.6.0] - 2026-11-23
### Added
- Layar Detail Kegiatan Prodi (S6) yang menampilkan judul agenda, tanggal, waktu pelaksanaan, ruang/media pertemuan, deskripsi lengkap, serta penyelenggara (FR-08).
- Navigasi interaktif dari daftar item agenda pada Dashboard menuju layar detail kegiatan prodi (FR-08).
- Tombol aksi simpan pengingat kalender dan bagikan agenda untuk mempermudah koordinasi mahasiswa (FR-08).

## [0.5.0] - 2026-11-23
### Added
- Penanganan status loading dengan skeleton placeholder (`CourseSkeleton`, `DashboardCardSkeleton`) dan jeda simulasi 600 ms (FR-05, FR-07).
- Komponen `ErrorState` yang memuat penjelasan penyebab gangguan koneksi dan tombol aksi "Coba Lagi" (FR-07, UXR-06).
- Komponen `EmptyState` dengan pesan informatif dan satu aksi lanjutan kontekstual (misal "Lihat Riwayat Studi" atau "Tampilkan Semua") untuk mencegah jalan buntu (FR-07, UXR-06).
- Panel Simulator Pengujian State di layar Profil dengan toggle "Simulasikan gagal memuat" dan "Simulasikan data kosong" untuk demonstrasi evaluasi usability testing (FR-07).

## [0.4.0] - 2026-11-23
### Added
- Layar Riwayat Studi (S4) sebagai jalur navigasi alternatif dari tab bar bawah yang selalu terlihat (FR-06, UXR-05).
- Ringkasan IPK kumulatif, total SKS lulus, dan SKS sedang berjalan pada header Riwayat Studi.
- Komponen daftar per semester dengan antarmuka accordion interaktif (bisa dibuka/tutup) dan kalkulasi IPS otomatis (FR-06).
- Integrasi item mata kuliah di Riwayat Studi yang dapat ditekan untuk membuka Detail Mata Kuliah (FR-04).

## [0.3.0] - 2026-11-23
### Added
- Layar Daftar Mata Kuliah (S2) dengan sinkronisasi tab otomatis sesuai kartu yang ditekan dari Dashboard (FR-02, UXR-01).
- Tampilan detail per mata kuliah di S2 mencakup kode, nama, SKS, semester, nilai, label "Wajib/Pilihan", dan indikator prasyarat (FR-03).
- Filter "Hanya wajib" pada S2 untuk memudahkan identifikasi mata kuliah prioritas KRS dalam ≤ 30 detik (FR-03, UXR-04).
- Layar Detail Mata Kuliah (S3) yang menampilkan rincian bobot SKS, nilai, status kelulusan, daftar mata kuliah prasyarat, serta mata kuliah lanjutan yang mensyaratkan mata kuliah terkait (FR-04).
- Navigasi drill-down interaktif antar mata kuliah dari daftar prasyarat dan mata kuliah lanjutan (FR-04).

## [0.2.0] - 2026-11-23
### Added
- Layar Dashboard (S1) dengan kartu ringkasan status mata kuliah yang dapat ditekan (FR-01, UXR-03).
- Komponen `StatusSummaryCard` dengan penanda visual eksplisit berupa ikon chevron "›" dan teks "Lihat rincian" (FR-01).
- Komponen `PressableCard` dengan umpan balik visual instan (ripple/highlight ≤ 100 ms) dan proteksi debounce untuk mencegah navigasi ganda (FR-05, UXR-02).
- Pemisahan visual yang tegas antara elemen informasi statis (IPK dan SKS kumulatif) dan kartu aksi interaktif agar tidak menimbulkan *misleading affordance* (FR-01).
- Implementasi tipe data Kegiatan Prodi dengan fitur baru (kategori, status pendaftaran, label "Baru") dan pembaruan dummy data (FR-01, FR-08).\
- Penambahan tampilan pratinjau Jadwal Kegiatan Prodi pada Dashboard serta penambahan tab Kegiatan (FR-01, FR-08).

## [0.1.0] - 2026-11-23
### Added
- Inisialisasi project Expo SDK 58 + TypeScript pada root repository.
- Struktur folder aplikasi (`src/app`, `src/components`, `src/constants`, `src/context`, `src/data`, `src/types`, `src/utils`).
- Skema tipe data dan dataset dummy mata kuliah (36 mata kuliah dari semester 1–7 dengan 3 mata kuliah belum lulus dan 6 mata kuliah sedang ditempuh), profil mahasiswa, serta jadwal kegiatan prodi (`src/data/`).
- State management dan perhitungan akademik otomatis (IPK, total SKS, jumlah per status) melalui `AcademicContext` dan helper akademik.
- Fondasi navigasi Expo Router dengan tab bawah (Beranda, Riwayat Studi, Profil) dan Stack screen.
