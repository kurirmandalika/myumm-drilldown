import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pengingat, WaktuPengingat } from "../types";

const KEY_PREFIX = "pengingat_";
const KEY_LAST_REFRESH = "last_refresh";
const KEY_CACHED_KEGIATAN = "cached_kegiatan";

export async function getPengingat(kegiatanId: string): Promise<Pengingat | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY_PREFIX + kegiatanId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function getAllPengingat(): Promise<Pengingat[]> {
  try {
    const keys = (await AsyncStorage.getAllKeys()) as string[];
    const penginatKeys = keys.filter((k: string) => k.startsWith(KEY_PREFIX));
    if (penginatKeys.length === 0) return [];
    const items = await Promise.all(
      penginatKeys.map((k: string) => AsyncStorage.getItem(k))
    );
    return items
      .map((v: string | null) => (v ? JSON.parse(v) : null))
      .filter(Boolean) as Pengingat[];
  } catch {
    return [];
  }
}

export async function simpanPengingat(
  kegiatanId: string,
  waktu: WaktuPengingat
): Promise<void> {
  const pengingat: Pengingat = {
    kegiatanId,
    waktu,
    dibuatPada: new Date().toISOString(),
  };
  await AsyncStorage.setItem(KEY_PREFIX + kegiatanId, JSON.stringify(pengingat));
}

export async function hapusPengingat(kegiatanId: string): Promise<void> {
  await AsyncStorage.removeItem(KEY_PREFIX + kegiatanId);
}

export async function simpanWaktuRefresh(): Promise<void> {
  await AsyncStorage.setItem(KEY_LAST_REFRESH, new Date().toISOString());
}

export async function getWaktuRefresh(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEY_LAST_REFRESH);
  } catch {
    return null;
  }
}

export async function simpanCacheKegiatan(data: string): Promise<void> {
  await AsyncStorage.setItem(KEY_CACHED_KEGIATAN, data);
}

export async function getCacheKegiatan(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEY_CACHED_KEGIATAN);
  } catch {
    return null;
  }
}

export function formatWaktuRelative(isoString: string | null): string {
  if (!isoString) return "belum pernah";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  if (diffMins < 1) return "baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari lalu`;
}

export function formatWaktuPengingat(waktu: WaktuPengingat): string {
  switch (waktu) {
    case "1_hari": return "1 hari sebelumnya";
    case "3_jam": return "3 jam sebelumnya";
    case "1_jam": return "1 jam sebelumnya";
  }
}

export function getLabelKegiatan(
  mulaiIso: string,
  ditambahkanPadaIso: string
): "Baru" | "Hari ini" | "Besok" | null {
  const now = new Date();
  const mulai = new Date(mulaiIso);
  const added = new Date(ditambahkanPadaIso);
  const diffAddedDays = (now.getTime() - added.getTime()) / (1000 * 60 * 60 * 24);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (isSameDay(mulai, now)) return "Hari ini";
  if (isSameDay(mulai, tomorrow)) return "Besok";
  if (diffAddedDays <= 3) return "Baru";
  return null;
}
