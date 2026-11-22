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

export type KategoriKegiatan = "Seminar" | "Workshop" | "Kuliah Tamu" | "Lomba" | "Akademik";
export type StatusPendaftaran = "dibuka" | "ditutup" | "tanpa_pendaftaran";
export type WaktuPengingat = "1_hari" | "3_jam" | "1_jam";

export interface KegiatanProdi {
  id: string;
  judul: string;
  tanggal: string;         // contoh: "Senin, 28 November 2026"
  waktu: string;           // contoh: "09:00 - 12:00 WIB"
  tempat: string;          // contoh: "Aula GKB IV Lt. 9 / Zoom"
  deskripsi: string;
  penyelenggara: string;
  kategori: KategoriKegiatan;
  statusPendaftaran: StatusPendaftaran;
  tautanPendaftaran?: string;
  ditambahkanPada: string; // ISO datetime, untuk label "Baru"
  mulai: string;           // ISO datetime, untuk sorting dan filter
}

export interface Pengingat {
  kegiatanId: string;
  waktu: WaktuPengingat;
  dibuatPada: string; // ISO datetime
}

export interface Mahasiswa {
  nama: string;
  nim: string;
  prodi: string;
  fakultas: string;
  semesterAktif: number;
  dosenPA: string;
}
