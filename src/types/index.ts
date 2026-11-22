export type StatusMK = "lulus" | "belum_lulus" | "ditempuh";

export interface MataKuliah {
  kode: string;          // contoh: "IF201"
  nama: string;
  sks: number;
  semester: number;      // semester pengambilan dalam kurikulum
  status: StatusMK;
  nilai?: string;        // "A", "B+", ..., "D", "E"; kosong bila sedang ditempuh
  wajib: boolean;
  prasyarat: string[];   // daftar kode mata kuliah
}

export interface KegiatanProdi {
  id: string;
  judul: string;
  tanggal: string;       // contoh: "28 November 2026"
  waktu: string;         // contoh: "09:00 - 12:00 WIB"
  tempat: string;        // contoh: "Aula GKB IV Lt. 9 / Zoom"
  deskripsi: string;
  penyelenggara: string;
}

export interface Mahasiswa {
  nama: string;
  nim: string;
  prodi: string;
  fakultas: string;
  semesterAktif: number;
  dosenPA: string;
}
