# Changelog

Semua perubahan penting pada project ini dicatat di file ini.
Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).

## [Unreleased]

## [0.2.0] - 2026-11-23

### Added
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


