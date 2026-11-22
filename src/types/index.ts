export type StatusMK = 'lulus' | 'belum_lulus' | 'ditempuh';

export interface MataKuliah {
  kode: string;          // contoh: "IF201"
  nama: string;
  sks: number;
  semester: number;      // semester pengambilan dalam kurikulum
  status: StatusMK;
  nilai?: string;        // "A", "B+", ..., "D", "E"; kosong bila sedang ditempuh
  wajib: boolean;
  prasyarat: string[];   // daftar kode mata kuliah
  deskripsi?: string;
  dosenPengampu?: string;
}

export interface Mahasiswa {
  nim: string;
  nama: string;
  prodi: string;
  fakultas: string;
  semester: number;
  dosenPA: string;
  statusAkademik: string;
}

// PRD v2 - Kegiatan Prodi Types (§10)
export type KategoriKegiatan = 'Seminar' | 'Workshop' | 'Kuliah Tamu' | 'Lomba' | 'Akademik';
export type StatusPendaftaran = 'dibuka' | 'ditutup' | 'tanpa_pendaftaran';

export interface Kegiatan {
  id: string;
  judul: string;
  kategori: KategoriKegiatan;
  mulai: string;            // ISO datetime
  selesai?: string;         // ISO datetime
  mode: 'luring' | 'daring';
  tempat: string;           // ruang/gedung atau nama platform daring
  penyelenggara: string;
  deskripsi: string;
  statusPendaftaran: StatusPendaftaran;
  tautanPendaftaran?: string;
  ditambahkanPada: string;  // ISO datetime, untuk label "Baru"
}

export interface Pengingat {
  kegiatanId: string;
  waktu: '1_hari' | '3_jam' | '1_jam';
  dibuatPada: string;
}

// Legacy alias for compatibility with v1
export interface KegiatanProdi {
  id: string;
  judul: string;
  kategori: string;
  tanggal: string;
  waktu: string;
  tempat: string;
  deskripsi: string;
  narasumber?: string;
  tautanDaftar?: string;
}

export type TabStatus = 'semua' | StatusMK;

