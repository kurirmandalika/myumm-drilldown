import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Alert,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAcademic } from "../../context/AcademicContext";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { getPengingat, simpanPengingat, hapusPengingat, formatWaktuPengingat } from "../../utils/pengingat";
import { Pengingat, WaktuPengingat } from "../../types";

const WAKTU_OPTIONS: { label: string; value: WaktuPengingat }[] = [
  { label: "1 hari sebelumnya", value: "1_hari" },
  { label: "3 jam sebelumnya", value: "3_jam" },
  { label: "1 jam sebelumnya", value: "1_jam" },
];

export default function DetailKegiatanProdiScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { kegiatanProdiList } = useAcademic();

  const kegiatan = kegiatanProdiList.find((k) => k.id === id);

  const [pengingat, setPengingat] = useState<Pengingat | null>(null);
  const [showAturPengingat, setShowAturPengingat] = useState(false);
  const [selectedWaktu, setSelectedWaktu] = useState<WaktuPengingat>("1_hari");
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const muatPengingat = useCallback(async () => {
    if (id) {
      const p = await getPengingat(id);
      setPengingat(p);
      if (p) setSelectedWaktu(p.waktu);
    }
  }, [id]);

  useEffect(() => { muatPengingat(); }, [muatPengingat]);

  const handleSimpanPengingat = async () => {
    if (!id) return;
    setIsSaving(true);
    await simpanPengingat(id, selectedWaktu);
    const p = await getPengingat(id);
    setPengingat(p);
    setIsSaving(false);
    setShowAturPengingat(false);
    setShowKonfirmasi(true);
  };

  const handleHapusPengingat = async () => {
    if (!id) return;
    await hapusPengingat(id);
    setPengingat(null);
    setShowAturPengingat(false);
    Alert.alert("Pengingat Dihapus", "Pengingat untuk kegiatan ini telah dihapus.");
  };

  if (!kegiatan) {
    return (
      <View style={styles.notFoundContainer}>
        <Stack.Screen options={{ title: "Kegiatan Prodi" }} />
        <Ionicons name="calendar-clear-outline" size={56} color={Colors.primary} />
        <Text style={styles.notFoundTitle}>Kegiatan Tidak Ditemukan</Text>
        <Text style={styles.notFoundDesc}>
          Informasi kegiatan yang Anda pilih tidak tersedia atau telah berakhir.
        </Text>
        <Pressable style={styles.actionBtn} onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.actionBtnText}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{ title: "Detail Kegiatan", headerBackTitle: "Kembali" }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Kategori Badge */}
        <View style={styles.topBadgeRow}>
          <View style={styles.kategoriBadge}>
            <Text style={styles.kategoriText}>{kegiatan.kategori}</Text>
          </View>
          {pengingat && (
            <View style={styles.penginatActiveBadge}>
              <Ionicons name="notifications" size={12} color={Colors.primary} />
              <Text style={styles.penginatActiveText}>Pengingat aktif</Text>
            </View>
          )}
        </View>

        {/* Judul */}
        <Text style={styles.title}>{kegiatan.judul}</Text>

        {/* Info Meta */}
        <View style={styles.detailBox}>
          <View style={styles.metaRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="business" size={16} color={Colors.primary} />
            </View>
            <View style={styles.metaTextCol}>
              <Text style={styles.metaLabel}>Penyelenggara</Text>
              <Text style={styles.metaValue}>{kegiatan.penyelenggara}</Text>
            </View>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.metaRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="calendar" size={16} color={Colors.primary} />
            </View>
            <View style={styles.metaTextCol}>
              <Text style={styles.metaLabel}>Tanggal Pelaksanaan</Text>
              <Text style={styles.metaValue}>{kegiatan.tanggal}</Text>
            </View>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.metaRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="time" size={16} color={Colors.primary} />
            </View>
            <View style={styles.metaTextCol}>
              <Text style={styles.metaLabel}>Waktu Kegiatan</Text>
              <Text style={styles.metaValue}>{kegiatan.waktu}</Text>
            </View>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.metaRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={16} color={Colors.primary} />
            </View>
            <View style={styles.metaTextCol}>
              <Text style={styles.metaLabel}>Tempat / Media</Text>
              <Text style={styles.metaValue}>{kegiatan.tempat}</Text>
            </View>
          </View>

          <View style={styles.metaDivider} />

          {/* Status Pendaftaran */}
          <View style={styles.metaRow}>
            <View style={styles.iconCircle}>
              <Ionicons
                name={
                  kegiatan.statusPendaftaran === "dibuka"
                    ? "checkmark-circle"
                    : kegiatan.statusPendaftaran === "ditutup"
                    ? "close-circle"
                    : "remove-circle"
                }
                size={16}
                color={
                  kegiatan.statusPendaftaran === "dibuka"
                    ? Colors.status.lulus.text
                    : Colors.status.belum_lulus.text
                }
              />
            </View>
            <View style={styles.metaTextCol}>
              <Text style={styles.metaLabel}>Status Pendaftaran</Text>
              <Text
                style={[
                  styles.metaValue,
                  kegiatan.statusPendaftaran === "dibuka" && { color: Colors.status.lulus.text },
                  kegiatan.statusPendaftaran === "ditutup" && { color: Colors.status.belum_lulus.text },
                ]}
              >
                {kegiatan.statusPendaftaran === "dibuka"
                  ? "Pendaftaran Dibuka"
                  : kegiatan.statusPendaftaran === "ditutup"
                  ? "Pendaftaran Ditutup"
                  : "Tanpa Pendaftaran"}
              </Text>
            </View>
          </View>
        </View>

        {/* Deskripsi */}
        <View style={styles.descSection}>
          <Text style={styles.sectionTitle}>Deskripsi Kegiatan</Text>
          <Text style={styles.descContent}>{kegiatan.deskripsi}</Text>
        </View>

        {/* Tombol Aksi */}
        <View style={styles.actionRow}>
          {/* Tombol Ingatkan Saya / Pengingat Aktif */}
          <Pressable
            style={styles.primaryBtn}
            onPress={() => setShowAturPengingat(true)}
            accessibilityRole="button"
            accessibilityLabel={pengingat ? "Ubah pengingat" : "Ingatkan saya"}
          >
            <Ionicons
              name={pengingat ? "notifications" : "notifications-outline"}
              size={18}
              color={Colors.textInverse}
            />
            <Text style={styles.primaryBtnText}>
              {pengingat ? `Pengingat aktif · Ubah` : "Ingatkan saya"}
            </Text>
          </Pressable>

          {/* Tombol Daftar (hanya jika ada tautan & status dibuka) */}
          {kegiatan.statusPendaftaran === "dibuka" && kegiatan.tautanPendaftaran && (
            <Pressable
              style={styles.secondaryBtn}
              onPress={() => {
                if (kegiatan.tautanPendaftaran) {
                  Linking.openURL(kegiatan.tautanPendaftaran);
                }
              }}
              accessibilityRole="button"
              accessibilityLabel="Daftar kegiatan"
            >
              <Ionicons name="open-outline" size={18} color={Colors.primary} />
              <Text style={styles.secondaryBtnText}>Daftar</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* Modal: Atur Pengingat (K4) */}
      <Modal
        visible={showAturPengingat}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAturPengingat(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowAturPengingat(false)}>
          <Pressable style={styles.bottomSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Atur Pengingat</Text>
            <Text style={styles.sheetSubtitle} numberOfLines={2}>{kegiatan.judul}</Text>

            {WAKTU_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                style={styles.radioRow}
                onPress={() => setSelectedWaktu(opt.value)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selectedWaktu === opt.value }}
              >
                <View style={[styles.radioCircle, selectedWaktu === opt.value && styles.radioCircleActive]}>
                  {selectedWaktu === opt.value && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>{opt.label}</Text>
              </Pressable>
            ))}

            <Pressable
              style={[styles.sheetPrimaryBtn, isSaving && styles.btnDisabled]}
              onPress={handleSimpanPengingat}
              disabled={isSaving}
              accessibilityRole="button"
            >
              <Text style={styles.sheetPrimaryBtnText}>
                {isSaving ? "Menyimpan..." : "Simpan pengingat"}
              </Text>
            </Pressable>

            {pengingat && (
              <Pressable
                style={styles.sheetDangerBtn}
                onPress={handleHapusPengingat}
                accessibilityRole="button"
              >
                <Ionicons name="trash-outline" size={16} color={Colors.status.belum_lulus.text} />
                <Text style={styles.sheetDangerBtnText}>Hapus pengingat</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.sheetCancelBtn}
              onPress={() => setShowAturPengingat(false)}
              accessibilityRole="button"
            >
              <Text style={styles.sheetCancelBtnText}>Batal</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal: Konfirmasi Pengingat (K5) */}
      <Modal
        visible={showKonfirmasi}
        transparent
        animationType="fade"
        onRequestClose={() => setShowKonfirmasi(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.konfirmasiCard}>
            <View style={styles.konfirmasiIconCircle}>
              <Ionicons name="checkmark" size={32} color={Colors.textInverse} />
            </View>
            <Text style={styles.konfirmasiTitle}>Pengingat Disimpan!</Text>
            <Text style={styles.konfirmasiDesc}>
              Kamu akan diingatkan {formatWaktuPengingat(selectedWaktu)} sebelum:
            </Text>
            <Text style={styles.konfirmasiJudul} numberOfLines={2}>{kegiatan.judul}</Text>
            <Text style={styles.konfirmasiTanggal}>{kegiatan.tanggal}</Text>

            <Pressable
              style={styles.sheetPrimaryBtn}
              onPress={() => {
                setShowKonfirmasi(false);
                router.push("/kegiatan/saya" as any);
              }}
              accessibilityRole="button"
            >
              <Text style={styles.sheetPrimaryBtnText}>Lihat Kegiatan Saya</Text>
            </Pressable>
            <Pressable
              style={styles.sheetCancelBtn}
              onPress={() => setShowKonfirmasi(false)}
              accessibilityRole="button"
            >
              <Text style={styles.sheetCancelBtnText}>Kembali ke kegiatan</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  contentContainer: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  topBadgeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: Spacing.sm },
  kategoriBadge: {
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  kategoriText: { ...Typography.captionMedium, color: Colors.secondary },
  penginatActiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  penginatActiveText: { ...Typography.captionMedium, color: Colors.primary },
  title: { ...Typography.title, color: Colors.textPrimary, marginBottom: Spacing.md, lineHeight: 26 },
  detailBox: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  metaRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  metaTextCol: { flex: 1 },
  metaLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
  metaValue: { ...Typography.bodyMedium, color: Colors.textPrimary },
  metaDivider: { height: 1, backgroundColor: Colors.divider, marginVertical: 2 },
  descSection: { marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.subtitle, color: Colors.textPrimary, marginBottom: Spacing.xs },
  descContent: { ...Typography.body, color: Colors.textSecondary, lineHeight: 22 },
  actionRow: { flexDirection: "row", gap: 10 },
  primaryBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 13,
    borderRadius: 10,
    minHeight: 48,
  },
  primaryBtnText: { ...Typography.bodyMedium, color: Colors.textInverse },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    minHeight: 48,
  },
  secondaryBtnText: { ...Typography.bodyMedium, color: Colors.primary },
  notFoundContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: Spacing.xl },
  notFoundTitle: { ...Typography.title, color: Colors.textPrimary, marginTop: Spacing.md },
  notFoundDesc: { ...Typography.body, color: Colors.textMuted, textAlign: "center", marginTop: 4, marginBottom: Spacing.lg },
  actionBtn: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  actionBtnText: { ...Typography.bodyMedium, color: Colors.textInverse },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: Spacing.md,
  },
  sheetTitle: { ...Typography.title, color: Colors.textPrimary, marginBottom: 4 },
  sheetSubtitle: { ...Typography.caption, color: Colors.textMuted, marginBottom: Spacing.lg },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
    minHeight: 44,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircleActive: { borderColor: Colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  radioLabel: { ...Typography.body, color: Colors.textPrimary },
  sheetPrimaryBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: Spacing.md,
    minHeight: 48,
  },
  sheetPrimaryBtnText: { ...Typography.bodyMedium, color: Colors.textInverse },
  btnDisabled: { opacity: 0.6 },
  sheetDangerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.status.belum_lulus.border,
    marginTop: Spacing.sm,
    minHeight: 44,
  },
  sheetDangerBtnText: { ...Typography.bodyMedium, color: Colors.status.belum_lulus.text },
  sheetCancelBtn: { paddingVertical: 12, alignItems: "center", marginTop: Spacing.xs, minHeight: 44 },
  sheetCancelBtnText: { ...Typography.body, color: Colors.textMuted },
  // Konfirmasi
  konfirmasiCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.xl,
    borderRadius: 20,
    padding: Spacing.xl,
    alignItems: "center",
  },
  konfirmasiIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.status.lulus.text,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  konfirmasiTitle: { ...Typography.title, color: Colors.textPrimary, marginBottom: Spacing.xs },
  konfirmasiDesc: { ...Typography.body, color: Colors.textMuted, textAlign: "center" },
  konfirmasiJudul: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
  konfirmasiTanggal: { ...Typography.caption, color: Colors.textMuted, marginTop: 2, marginBottom: Spacing.lg },
});
