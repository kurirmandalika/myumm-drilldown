import { MataKuliah, StatusMK } from "../types";

export const BOBOT_NILAI: Record<string, number> = {
  A: 4.0,
  "B+": 3.5,
  B: 3.0,
  "C+": 2.5,
  C: 2.0,
  D: 1.0,
  E: 0.0,
};

/**
 * Menghitung jumlah mata kuliah berdasarkan status
 */
export function countMataKuliahByStatus(
  list: MataKuliah[],
  status: StatusMK
): number {
  return list.filter((mk) => mk.status === status).length;
}

/**
 * Menghitung total SKS dari daftar mata kuliah
 */
export function calculateTotalSKS(list: MataKuliah[]): number {
  return list.reduce((acc, mk) => acc + mk.sks, 0);
}

/**
 * Menghitung IPK dari mata kuliah yang telah lulus (dan yang sudah bernilai)
 */
export function calculateIPK(list: MataKuliah[]): number {
  const graded = list.filter((mk) => mk.nilai && BOBOT_NILAI[mk.nilai] !== undefined);
  if (graded.length === 0) return 0;

  const totalBobot = graded.reduce(
    (acc, mk) => acc + (BOBOT_NILAI[mk.nilai!] ?? 0) * mk.sks,
    0
  );
  const totalSks = graded.reduce((acc, mk) => acc + mk.sks, 0);

  if (totalSks === 0) return 0;
  return Number((totalBobot / totalSks).toFixed(2));
}

/**
 * Mengelompokkan mata kuliah per semester untuk tampilan Riwayat Studi
 */
export function groupMataKuliahBySemester(
  list: MataKuliah[]
): Record<number, MataKuliah[]> {
  const grouped: Record<number, MataKuliah[]> = {};
  list.forEach((mk) => {
    if (!grouped[mk.semester]) {
      grouped[mk.semester] = [];
    }
    grouped[mk.semester].push(mk);
  });
  return grouped;
}

/**
 * Mencari mata kuliah lanjutan yang memerlukan mata kuliah ini sebagai prasyarat
 */
export function findDependentCourses(
  list: MataKuliah[],
  kodeMk: string
): MataKuliah[] {
  return list.filter((mk) => mk.prasyarat.includes(kodeMk));
}

/**
 * Format label status dalam Bahasa Indonesia
 */
export function getStatusLabel(status: StatusMK): string {
  switch (status) {
    case "lulus":
      return "Lulus";
    case "belum_lulus":
      return "Belum Lulus";
    case "ditempuh":
      return "Sedang Ditempuh";
  }
}
