import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAcademic } from "../../context/AcademicContext";
import { Colors, Spacing, Typography } from "../../constants/theme";

export default function ProfilScreen() {
  const {
    mahasiswa,
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
    isLoading,
  } = useAcademic();

  const handleToggleError = (val: boolean) => {
    setSimulateError(val);
    if (val) { setSimulateEmpty(false); }
  };

  const handleToggleEmpty = (val: boolean) => {
    setSimulateEmpty(val);
    if (val) { setSimulateError(false); }
  };

  const handleToggleKegiatanError = (val: boolean) => {
    setSimulateKegiatanError(val);
    if (val) { setSimulateKegiatanEmpty(false); }
  };

  const handleToggleKegiatanEmpty = (val: boolean) => {
    setSimulateKegiatanEmpty(val);
    if (val) { setSimulateKegiatanError(false); }
  };

  const handleResetData = async () => {
    setSimulateError(false);
    setSimulateEmpty(false);
    setSimulateKegiatanError(false);
    setSimulateKegiatanEmpty(false);
    await refreshData();
    await refreshKegiatan();
    Alert.alert("Data Direset", "Data dummy akademik dan kegiatan berhasil dimuat ulang ke kondisi normal.");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Profil Mahasiswa */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>
            {mahasiswa.nama.charAt(0)}
          </Text>
        </View>
        <Text style={styles.profileName}>{mahasiswa.nama}</Text>
        <Text style={styles.profileNim}>NIM: {mahasiswa.nim}</Text>
        <View style={styles.statusPill}>
          <View style={styles.activeDot} />
          <Text style={styles.statusPillText}>Mahasiswa Aktif</Text>
        </View>
      </View>

      {/* Rincian Identitas Akademik */}
      <View style={styles.infoCard}>
        <Text style={styles.cardHeaderTitle}>Informasi Akademik</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoLabelGroup}>
            <Ionicons name="business-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.infoLabel}>Program Studi</Text>
          </View>
          <Text style={styles.infoValue}>{mahasiswa.prodi}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabelGroup}>
            <Ionicons name="ribbon-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.infoLabel}>Fakultas</Text>
          </View>
          <Text style={styles.infoValue}>{mahasiswa.fakultas}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabelGroup}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.infoLabel}>Semester Aktif</Text>
          </View>
          <Text style={styles.infoValue}>Semester {mahasiswa.semesterAktif}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabelGroup}>
            <Ionicons name="person-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.infoLabel}>Dosen Pembimbing</Text>
          </View>
          <Text style={styles.infoValue} numberOfLines={1}>
            {mahasiswa.dosenPA}
          </Text>
        </View>
      </View>

      {/* Simulator State Demo (FR-07, FR-10) */}
      <View style={styles.demoCard}>
        <View style={styles.demoHeader}>
          <View style={styles.demoTitleGroup}>
            <Ionicons name="construct-outline" size={20} color={Colors.primary} />
            <Text style={styles.demoTitle}>Simulator Pengujian State (FR-07, FR-10)</Text>
          </View>
          <Text style={styles.demoBadge}>Demo Tool</Text>
        </View>
        <Text style={styles.demoDesc}>
          Gunakan toggle di bawah ini untuk menguji penanganan error dan kondisi kosong pada layar aplikasi.
        </Text>

        <Text style={styles.demoSubheading}>Status Mata Kuliah</Text>

        {/* Toggle 1: Simulasikan Gagal Memuat Mata Kuliah */}
        <View style={styles.switchRow}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchLabel}>Simulasikan gagal memuat</Text>
            <Text style={styles.switchSubLabel}>
              Memicu state error koneksi jaringan dengan tombol &quot;Coba lagi&quot;
            </Text>
          </View>
          <Switch
            value={simulateError}
            onValueChange={handleToggleError}
            trackColor={{ false: "#CBD5E1", true: Colors.status.belum_lulus.border }}
            thumbColor={simulateError ? Colors.primary : "#F8FAFC"}
            accessibilityLabel="Toggle simulasikan gagal memuat mata kuliah"
          />
        </View>

        <View style={styles.divider} />

        {/* Toggle 2: Simulasikan Data Kosong Mata Kuliah */}
        <View style={styles.switchRow}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchLabel}>Simulasikan data kosong</Text>
            <Text style={styles.switchSubLabel}>
              Memicu state daftar kosong dengan pesan positif dan tombol aksi
            </Text>
          </View>
          <Switch
            value={simulateEmpty}
            onValueChange={handleToggleEmpty}
            trackColor={{ false: "#CBD5E1", true: Colors.primaryLight }}
            thumbColor={simulateEmpty ? Colors.primary : "#F8FAFC"}
            accessibilityLabel="Toggle simulasikan data kosong mata kuliah"
          />
        </View>

        <View style={styles.divider} />

        <Text style={styles.demoSubheading}>Jadwal Kegiatan Prodi</Text>

        {/* Toggle 3: Simulasikan Gagal Memuat Kegiatan */}
        <View style={styles.switchRow}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchLabel}>Simulasikan gagal memuat kegiatan</Text>
            <Text style={styles.switchSubLabel}>
              Memicu error pada layar kegiatan; jika ada cache, data lama ditampilkan dengan banner
            </Text>
          </View>
          <Switch
            value={simulateKegiatanError}
            onValueChange={handleToggleKegiatanError}
            trackColor={{ false: "#CBD5E1", true: Colors.status.belum_lulus.border }}
            thumbColor={simulateKegiatanError ? Colors.primary : "#F8FAFC"}
            accessibilityLabel="Toggle simulasikan gagal memuat kegiatan"
          />
        </View>

        <View style={styles.divider} />

        {/* Toggle 4: Simulasikan Tidak Ada Kegiatan */}
        <View style={styles.switchRow}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchLabel}>Simulasikan tidak ada kegiatan</Text>
            <Text style={styles.switchSubLabel}>
              Memicu state kosong pada layar jadwal kegiatan
            </Text>
          </View>
          <Switch
            value={simulateKegiatanEmpty}
            onValueChange={handleToggleKegiatanEmpty}
            trackColor={{ false: "#CBD5E1", true: Colors.primaryLight }}
            thumbColor={simulateKegiatanEmpty ? Colors.primary : "#F8FAFC"}
            accessibilityLabel="Toggle simulasikan tidak ada kegiatan"
          />
        </View>

        <View style={styles.divider} />

        {/* Tombol Muat Ulang / Reset */}
        <Pressable
          onPress={handleResetData}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Reset dan muat ulang data akademik normal"
          style={({ pressed }) => [
            styles.resetButton,
            pressed && styles.resetButtonPressed,
          ]}
        >
          <Ionicons name="refresh-circle-outline" size={18} color={Colors.textInverse} />
          <Text style={styles.resetButtonText}>
            {isLoading ? "Memproses..." : "Reset ke Data Normal"}
          </Text>
        </Pressable>
      </View>

      {/* Informasi Project Rekayasa Interaksi */}
      <View style={styles.footerCard}>
        <Text style={styles.footerTitle}>myUMM Student — Drill-down Status Mata Kuliah</Text>
        <Text style={styles.footerText}>
          Tugas Rekayasa Interaksi C • Worksheet 8 (UXR-01 s.d. UXR-08)
        </Text>
        <Text style={styles.footerAuthor}>
          Tifsan Ariel Pratama (202310370311349)
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  profileHeaderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarLarge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textInverse,
  },
  profileName: {
    ...Typography.title,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  profileNim: {
    ...Typography.body,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.status.lulus.bg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.status.lulus.text,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.status.lulus.text,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  cardHeaderTitle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  infoLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  infoValue: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.sm,
  },
  demoCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 14,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: "#FDE68A",
    marginBottom: Spacing.md,
  },
  demoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  demoTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400E",
  },
  demoBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: "#92400E",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  demoDesc: {
    ...Typography.caption,
    color: "#78350F",
    lineHeight: 16,
    marginBottom: Spacing.md,
  },
  demoSubheading: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textPrimary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  switchTextContainer: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  switchSubLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: Spacing.xs,
  },
  resetButtonPressed: {
    opacity: 0.85,
  },
  resetButtonText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: "600",
  },
  footerCard: {
    padding: Spacing.lg,
    alignItems: "center",
  },
  footerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textMuted,
    textAlign: "center",
  },
  footerText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: "center",
  },
  footerAuthor: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: "center",
  },
});
