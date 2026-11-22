# Changelog

Semua perubahan penting pada project ini dicatat di file ini.
Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).

## [Unreleased]

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
- Bagian pratinjau Jadwal Kegiatan Prodi di Dashboard dengan tautan ke detail agenda (FR-08).

## [0.1.0] - 2026-11-23
### Added
- Inisialisasi project Expo SDK 58 + TypeScript pada root repository.
- Struktur folder aplikasi (`src/app`, `src/components`, `src/constants`, `src/context`, `src/data`, `src/types`, `src/utils`).
- Skema tipe data dan dataset dummy mata kuliah (36 mata kuliah dari semester 1–7 dengan 3 mata kuliah belum lulus dan 6 mata kuliah sedang ditempuh), profil mahasiswa, serta jadwal kegiatan prodi (`src/data/`).
- State management dan perhitungan akademik otomatis (IPK, total SKS, jumlah per status) melalui `AcademicContext` dan helper akademik.
- Fondasi navigasi Expo Router dengan tab bawah (Beranda, Riwayat Studi, Profil) dan Stack screen.
