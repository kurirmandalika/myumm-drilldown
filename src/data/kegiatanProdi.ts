import { KegiatanProdi } from "../types";

export const DUMMY_KEGIATAN_PRODI: KegiatanProdi[] = [
  {
    id: "keg-1",
    judul: "Sosialisasi Penyusunan KRS & Bimbingan Akademik Semester Genap",
    tanggal: "28 November 2026",
    waktu: "09:00 - 11:30 WIB",
    tempat: "Aula GKB IV Lantai 9 / Hybrid Zoom",
    deskripsi:
      "Penjelasan alur pengisian Kartu Rencana Studi (KRS), kebijakan prasyarat mata kuliah kurikulum OBE, serta sesi tanya jawab bersama Ketua Program Studi dan Dosen Pembimbing Akademik.",
    penyelenggara: "Program Studi Informatika UMM",
    kategori: "Seminar",
    statusPendaftaran: "dibuka",
    tautanPendaftaran: "https://example.com/keg-1",
    ditambahkanPada: new Date().toISOString(),
  },
  {
    id: "keg-2",
    judul: "Workshop Persiapan Uji Kompetensi Keahlian Rekayasa Web",
    tanggal: "05 Desember 2026",
    waktu: "13:00 - 16:00 WIB",
    tempat: "Lab Komputer Terpadu GKB III Lt. 3",
    deskripsi:
      "Pelatihan intensif persiapan sertifikasi kompetensi LSP UMM untuk skema Pemrograman Web dan Mobile, ditujukan bagi mahasiswa semester 5 dan 7.",
    penyelenggara: "Laboratorium Informatika & LSP UMM",
    kategori: "Workshop",
    statusPendaftaran: "dibuka",
    tautanPendaftaran: "https://example.com/keg-2",
    ditambahkanPada: new Date().toISOString(),
  },
  {
    id: "keg-3",
    judul: "Batas Akhir Pengajuan Judul & Proposal Tugas Akhir Periode I",
    tanggal: "15 Desember 2026",
    waktu: "23:59 WIB",
    tempat: "Portal Tugas Akhir Infoum",
    deskripsi:
      "Batas akhir penyerahan berkas proposal skripsi/tugas akhir yang telah disetujui oleh calon dosen pembimbing utama untuk mahasiswa angkatan 2023 ke atas.",
    penyelenggara: "Tim Tugas Akhir Prodi Informatika",
    kategori: "Akademik",
    statusPendaftaran: "tanpa_pendaftaran",
    ditambahkanPada: new Date().toISOString(),
  },
];
