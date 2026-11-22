import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { MataKuliah, StatusMK, Mahasiswa, KegiatanProdi } from "../types";
import { DUMMY_MATA_KULIAH } from "../data/mataKuliah";
import { DUMMY_MAHASISWA } from "../data/mahasiswa";
import { DUMMY_KEGIATAN_PRODI } from "../data/kegiatanProdi";
import {
  countMataKuliahByStatus,
  calculateIPK,
  calculateTotalSKS,
  findDependentCourses,
} from "../utils/academic";

interface PrerequisiteStatus {
  kode: string;
  course?: MataKuliah;
  fulfilled: boolean;
}

interface AcademicContextType {
  mataKuliahList: MataKuliah[];
  mahasiswa: Mahasiswa;
  kegiatanProdiList: KegiatanProdi[];
  isLoading: boolean;
  error: string | null;
  simulateError: boolean;
  simulateEmpty: boolean;
  setSimulateError: (value: boolean) => void;
  setSimulateEmpty: (value: boolean) => void;
  refreshData: () => Promise<void>;
  counts: {
    lulus: number;
    belum_lulus: number;
    ditempuh: number;
  };
  totalSksLulus: number;
  ipk: number;
  getCourseByCode: (kode: string) => MataKuliah | undefined;
  getDependentCourses: (kode: string) => MataKuliah[];
  getPrerequisitesDetail: (course: MataKuliah) => PrerequisiteStatus[];
}

const AcademicContext = createContext<AcademicContextType | undefined>(
  undefined
);

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mataKuliahList, setMataKuliahList] = useState<MataKuliah[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [simulateError, setSimulateError] = useState<boolean>(false);
  const [simulateEmpty, setSimulateEmpty] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Simulasi jeda network ~600ms sesuai PRD bagian 9
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (simulateError) {
      setError(
        "Gagal memuat data akademik. Terjadi gangguan pada koneksi server kampus."
      );
      setMataKuliahList([]);
      setIsLoading(false);
      return;
    }

    if (simulateEmpty) {
      setMataKuliahList([]);
      setIsLoading(false);
      return;
    }

    setMataKuliahList(DUMMY_MATA_KULIAH);
    setIsLoading(false);
  }, [simulateError, simulateEmpty]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const counts = useMemo(
    () => ({
      lulus: countMataKuliahByStatus(mataKuliahList, "lulus"),
      belum_lulus: countMataKuliahByStatus(mataKuliahList, "belum_lulus"),
      ditempuh: countMataKuliahByStatus(mataKuliahList, "ditempuh"),
    }),
    [mataKuliahList]
  );

  const lulusCourses = useMemo(
    () => mataKuliahList.filter((mk) => mk.status === "lulus"),
    [mataKuliahList]
  );

  const totalSksLulus = useMemo(
    () => calculateTotalSKS(lulusCourses),
    [lulusCourses]
  );

  const ipk = useMemo(() => calculateIPK(mataKuliahList), [mataKuliahList]);

  const getCourseByCode = useCallback(
    (kode: string): MataKuliah | undefined => {
      return (
        mataKuliahList.find(
          (mk) => mk.kode.toLowerCase() === kode.toLowerCase()
        ) ||
        DUMMY_MATA_KULIAH.find(
          (mk) => mk.kode.toLowerCase() === kode.toLowerCase()
        )
      );
    },
    [mataKuliahList]
  );

  const getDependentCourses = useCallback(
    (kode: string): MataKuliah[] => {
      const activeOrDummy =
        mataKuliahList.length > 0 ? mataKuliahList : DUMMY_MATA_KULIAH;
      return findDependentCourses(activeOrDummy, kode);
    },
    [mataKuliahList]
  );

  const getPrerequisitesDetail = useCallback(
    (course: MataKuliah): PrerequisiteStatus[] => {
      const activeOrDummy =
        mataKuliahList.length > 0 ? mataKuliahList : DUMMY_MATA_KULIAH;

      return course.prasyarat.map((reqKode) => {
        const found = activeOrDummy.find(
          (mk) => mk.kode.toLowerCase() === reqKode.toLowerCase()
        );
        return {
          kode: reqKode,
          course: found,
          fulfilled: found?.status === "lulus",
        };
      });
    },
    [mataKuliahList]
  );

  const value = useMemo(
    () => ({
      mataKuliahList,
      mahasiswa: DUMMY_MAHASISWA,
      kegiatanProdiList: DUMMY_KEGIATAN_PRODI,
      isLoading,
      error,
      simulateError,
      simulateEmpty,
      setSimulateError,
      setSimulateEmpty,
      refreshData: loadData,
      counts,
      totalSksLulus,
      ipk,
      getCourseByCode,
      getDependentCourses,
      getPrerequisitesDetail,
    }),
    [
      mataKuliahList,
      isLoading,
      error,
      simulateError,
      simulateEmpty,
      loadData,
      counts,
      totalSksLulus,
      ipk,
      getCourseByCode,
      getDependentCourses,
      getPrerequisitesDetail,
    ]
  );

  return (
    <AcademicContext.Provider value={value}>
      {children}
    </AcademicContext.Provider>
  );
};

export function useAcademic(): AcademicContextType {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error("useAcademic must be used within an AcademicProvider");
  }
  return context;
}
