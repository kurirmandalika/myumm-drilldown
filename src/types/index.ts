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
