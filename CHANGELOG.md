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
- **Milestone 1 (Data):** Model dan data dummy jadwal kegiatan prodi dengan tanggal relatif ISO datetime, kategori (Seminar, Workshop, Kuliah Tamu, Lomba, Akademik), status pendaftaran, serta utilitas penyimpanan lokal pengingat dan cache offline berbasis AsyncStorage (FR-01, FR-05, FR-08).
- **Milestone 2 (Dashboard):** Layar Dashboard K1 dengan pratinjau 3 kegiatan terdekat, keterangan waktu pembaruan terakhir "Diperbarui [waktu]", tautan "Lihat semua ›" menuju K2, kartu ringkas dengan label "Baru"/"Hari ini"/"Besok", serta penyesuaian tab navigasi bawah Beranda · Kegiatan · Riwayat Studi · Profil (FR-01, FR-11).
- **Milestone 3 (Daftar Kegiatan):** Layar K2 Daftar Kegiatan Prodi dengan tab Akan Datang & Selesai beserta penghitung jumlah, filter kategori interaktif (Semua, Seminar, Workshop, Kuliah Tamu, Lomba, Akademik), pengelompokan per minggu (Minggu ini, Minggu depan, Bulan ini, Nanti), pull-to-refresh dengan penambahan kegiatan baru, label status Baru/Hari ini/Besok, serta indikator lonceng pengingat aktif (FR-02, FR-03, FR-09).
- **Milestone 4 (Detail Kegiatan):** Layar K3 Detail Kegiatan dengan informasi lengkap (penyelenggara, tanggal, waktu, lokasi, status pendaftaran), tombol kontekstual "Daftar" hanya saat status dibuka dan tautan tersedia, tombol utama "Ingatkan saya" / "Pengingat aktif · Ubah", serta pemisahan tegas elemen interaktif dan statis (FR-04, FR-11).
- **Milestone 5 (Pengingat):** Modal K4 Atur Pengingat (bottom sheet dengan pilihan waktu 1 hari, 3 jam, 1 jam, tombol simpan/hapus/batal), dialog K5 Konfirmasi Pengingat dengan aksi cepat ke Kegiatan Saya, dan layar K6 Kegiatan Saya yang menampilkan seluruh agenda berpengingat urut terdekat lengkap dengan state kosong (FR-05, FR-06).
- **Milestone 6 (State Handling & Cache Offline):** Penanganan state komprehensif pada jadwal kegiatan (skeleton loading, pesan gagal koneksi + tombol "Coba lagi", fallback data tersimpan / cache offline dengan banner pembaruan terakhir, empty state + aksi lanjut), serta toggle simulator demo di Profil untuk gagal memuat kegiatan & tidak ada kegiatan (FR-07, FR-08, FR-10).
- **Milestone 7 (Rapikan & Verifikasi Acceptance Criteria):** Verifikasi seluruh Acceptance Criteria 1 s.d. 9 dari PRD v2, kepatuhan navigasi bebas jalan buntu, pemeliharaan fitur status mata kuliah v1 tanpa degradasi, serta pemutakhiran README.md.

## [0.1.0] - 2026-11-23
### Added
- Inisialisasi project Expo SDK 58 + TypeScript pada root repository.
- Struktur folder aplikasi (`src/app`, `src/components`, `src/constants`, `src/context`, `src/data`, `src/types`, `src/utils`).
- Skema tipe data dan dataset dummy mata kuliah (36 mata kuliah dari semester 1–7 dengan 3 mata kuliah belum lulus dan 6 mata kuliah sedang ditempuh), profil mahasiswa, serta jadwal kegiatan prodi (`src/data/`).
- State management dan perhitungan akademik otomatis (IPK, total SKS, jumlah per status) melalui `AcademicContext` dan helper akademik.
- Fondasi navigasi Expo Router dengan tab bawah (Beranda, Riwayat Studi, Profil) dan Stack screen.
