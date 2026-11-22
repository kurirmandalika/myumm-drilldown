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
import { DUMMY_KEGIATAN_PRODI, KEGIATAN_REFRESH_BARU } from "../data/kegiatanProdi";
import {
  countMataKuliahByStatus,
  calculateIPK,
  calculateTotalSKS,
  findDependentCourses,
} from "../utils/academic";
import {
  simpanWaktuRefresh,
  getWaktuRefresh,
  simpanCacheKegiatan,
  getCacheKegiatan,
  formatWaktuRelative,
} from "../utils/pengingat";

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
  isKegiatanLoading: boolean;
  error: string | null;
  kegiatanError: string | null;
  kegiatanLastRefresh: string | null;
  hasCachedKegiatan: boolean;
  simulateError: boolean;
  simulateEmpty: boolean;
  simulateKegiatanError: boolean;
  simulateKegiatanEmpty: boolean;
  setSimulateError: (value: boolean) => void;
  setSimulateEmpty: (value: boolean) => void;
  setSimulateKegiatanError: (value: boolean) => void;
  setSimulateKegiatanEmpty: (value: boolean) => void;
  refreshData: () => Promise<void>;
  refreshKegiatan: () => Promise<void>;
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
  const [kegiatanProdiList, setKegiatanProdiList] = useState<KegiatanProdi[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isKegiatanLoading, setIsKegiatanLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [kegiatanError, setKegiatanError] = useState<string | null>(null);
  const [kegiatanLastRefresh, setKegiatanLastRefresh] = useState<string | null>(null);
  const [hasCachedKegiatan, setHasCachedKegiatan] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [simulateError, setSimulateError] = useState<boolean>(false);
  const [simulateEmpty, setSimulateEmpty] = useState<boolean>(false);
  const [simulateKegiatanError, setSimulateKegiatanError] = useState<boolean>(false);
  const [simulateKegiatanEmpty, setSimulateKegiatanEmpty] = useState<boolean>(false);

  const loadMataKuliah = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (simulateError) {
      setError("Gagal memuat data akademik. Terjadi gangguan pada koneksi server kampus.");
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

  const loadKegiatan = useCallback(async () => {
    setIsKegiatanLoading(true);
    setKegiatanError(null);
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (simulateKegiatanError) {
      // Coba ambil cache
      const cached = await getCacheKegiatan();
      const lastRefresh = await getWaktuRefresh();
      if (cached) {
        setKegiatanProdiList(JSON.parse(cached));
        setHasCachedKegiatan(true);
        setKegiatanLastRefresh(lastRefresh);
      } else {
        setKegiatanError("Gagal memuat jadwal kegiatan. Periksa koneksi internet Anda.");
        setKegiatanProdiList([]);
        setHasCachedKegiatan(false);
      }
      setIsKegiatanLoading(false);
      return;
    }

    if (simulateKegiatanEmpty) {
      setKegiatanProdiList([]);
      setHasCachedKegiatan(false);
      await simpanWaktuRefresh();
      const lastRefresh = await getWaktuRefresh();
      setKegiatanLastRefresh(lastRefresh);
      setIsKegiatanLoading(false);
      return;
    }

    // Muat data normal; refresh ke-1 menambah kegiatan baru
    let data = [...DUMMY_KEGIATAN_PRODI];
    if (refreshCount >= 1 && !data.find((k) => k.id === KEGIATAN_REFRESH_BARU.id)) {
      data = [KEGIATAN_REFRESH_BARU, ...data];
    }

    setKegiatanProdiList(data);
    setHasCachedKegiatan(false);
    await simpanCacheKegiatan(JSON.stringify(data));
    await simpanWaktuRefresh();
    const lastRefresh = await getWaktuRefresh();
    setKegiatanLastRefresh(lastRefresh);
    setIsKegiatanLoading(false);
  }, [simulateKegiatanError, simulateKegiatanEmpty, refreshCount]);

  useEffect(() => { loadMataKuliah(); }, [loadMataKuliah]);
  useEffect(() => { loadKegiatan(); }, [loadKegiatan]);

  const refreshData = useCallback(async () => {
    await loadMataKuliah();
  }, [loadMataKuliah]);

  const refreshKegiatan = useCallback(async () => {
    setRefreshCount((prev) => prev + 1);
  }, []);

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
        mataKuliahList.find((mk) => mk.kode.toLowerCase() === kode.toLowerCase()) ||
        DUMMY_MATA_KULIAH.find((mk) => mk.kode.toLowerCase() === kode.toLowerCase())
      );
    },
    [mataKuliahList]
  );

  const getDependentCourses = useCallback(
    (kode: string): MataKuliah[] => {
      const activeOrDummy = mataKuliahList.length > 0 ? mataKuliahList : DUMMY_MATA_KULIAH;
      return findDependentCourses(activeOrDummy, kode);
    },
    [mataKuliahList]
  );

  const getPrerequisitesDetail = useCallback(
    (course: MataKuliah): PrerequisiteStatus[] => {
      const activeOrDummy = mataKuliahList.length > 0 ? mataKuliahList : DUMMY_MATA_KULIAH;
      return course.prasyarat.map((reqKode) => {
        const found = activeOrDummy.find(
          (mk) => mk.kode.toLowerCase() === reqKode.toLowerCase()
        );
        return { kode: reqKode, course: found, fulfilled: found?.status === "lulus" };
      });
    },
    [mataKuliahList]
  );

  const value = useMemo(
    () => ({
      mataKuliahList,
      mahasiswa: DUMMY_MAHASISWA,
      kegiatanProdiList,
      isLoading,
      isKegiatanLoading,
      error,
      kegiatanError,
      kegiatanLastRefresh,
      hasCachedKegiatan,
      simulateError,
      simulateEmpty,
      simulateKegiatanError,
      simulateKegiatanEmpty,
      setSimulateError,
      setSimulateEmpty,
      setSimulateKegiatanError,
      setSimulateKegiatanEmpty,
      refreshData,
      refreshKegiatan,
      counts,
      totalSksLulus,
      ipk,
      getCourseByCode,
      getDependentCourses,
      getPrerequisitesDetail,
    }),
    [
      mataKuliahList,
      kegiatanProdiList,
      isLoading,
      isKegiatanLoading,
      error,
      kegiatanError,
      kegiatanLastRefresh,
      hasCachedKegiatan,
      simulateError,
      simulateEmpty,
      simulateKegiatanError,
      simulateKegiatanEmpty,
      refreshData,
      refreshKegiatan,
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
