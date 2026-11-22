import React, { useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAcademic } from "../../context/AcademicContext";
import { AcademicHeader } from "../../components/AcademicHeader";
import { StatusSummaryCard } from "../../components/StatusSummaryCard";
import { ErrorState } from "../../components/ErrorState";
import { EmptyState } from "../../components/EmptyState";
import { DashboardCardSkeleton } from "../../components/LoadingSkeleton";
import { PressableCard } from "../../components/PressableCard";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { calculateTotalSKS } from "../../utils/academic";
import { formatWaktuRelative, getLabelKegiatan } from "../../utils/pengingat";
import { KegiatanProdi, StatusMK } from "../../types";

export default function DashboardScreen() {
  const router = useRouter();
  const {
    mataKuliahList,
    mahasiswa,
    kegiatanProdiList,
    isLoading,
    isKegiatanLoading,
    kegiatanError,
    kegiatanLastRefresh,
    error,
    counts,
    ipk,
    totalSksLulus,
    refreshData,
    refreshKegiatan,
  } = useAcademic();

  const sksBelumLulus = useMemo(
    () => calculateTotalSKS(mataKuliahList.filter((mk) => mk.status === "belum_lulus")),
    [mataKuliahList]
  );
  const sksDitempuh = useMemo(
    () => calculateTotalSKS(mataKuliahList.filter((mk) => mk.status === "ditempuh")),
    [mataKuliahList]
  );

  // 3 kegiatan akan datang terdekat untuk preview (K1)
  const preview3 = useMemo(() => {
    const now = new Date();
    return [...kegiatanProdiList]
      .filter((k) => new Date(k.mulai) >= now)
      .sort((a, b) => new Date(a.mulai).getTime() - new Date(b.mulai).getTime())
      .slice(0, 3);
  }, [kegiatanProdiList]);

  const handleNavigateToStatus = (status: StatusMK) => {
    router.push({ pathname: "/mata-kuliah", params: { status } });
  };
  const handleSelectKegiatan = (kegiatan: KegiatanProdi) => {
    router.push({ pathname: "/kegiatan/[id]", params: { id: kegiatan.id } });
  };
  const handleLihatSemua = () => {
    router.push("/(tabs)/kegiatan" as any);
  };

  const diperbarui = formatWaktuRelative(kegiatanLastRefresh);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshData}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
    >
      <AcademicHeader mahasiswa={mahasiswa} ipk={ipk} totalSksLulus={totalSksLulus} />

      <View style={styles.body}>
        {/* ===== SECTION: Jadwal Kegiatan Prodi (K1) – FITUR UTAMA ===== */}
        <View style={styles.sectionTitleRow}>
          <View style={styles.titleWithIcon}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionHeading}>Jadwal Kegiatan Prodi</Text>
          </View>
          <Pressable onPress={handleLihatSemua} accessibilityRole="button" accessibilityLabel="Lihat semua kegiatan">
            <Text style={styles.lihatSemuaLink}>Lihat semua ›</Text>
          </Pressable>
        </View>

        {/* Diperbarui [waktu] */}
        {!kegiatanError && kegiatanLastRefresh && (
          <Text style={styles.diperbarui}>Diperbarui {diperbarui}</Text>
        )}

        {/* K1 State Handling */}
        {kegiatanError ? (
          <ErrorState
            title="Gagal Memuat Kegiatan"
            message={kegiatanError}
            onRetry={refreshKegiatan}
            isRetrying={isKegiatanLoading}
          />
        ) : isKegiatanLoading && kegiatanProdiList.length === 0 ? (
          <View style={styles.skeletonContainer}>
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </View>
        ) : preview3.length === 0 ? (
          <EmptyState
            title="Tidak Ada Kegiatan Mendatang"
            description="Belum ada kegiatan akan datang. Periksa tab Selesai atau tarik layar untuk memperbarui."
            actionLabel="Lihat semua kegiatan"
            onAction={handleLihatSemua}
          />
        ) : (
          <View style={styles.kegiatanContainer}>
            {preview3.map((k) => {
              const badge = getLabelKegiatan(k.mulai, k.ditambahkanPada);
              return (
                <PressableCard
                  key={k.id}
                  onPress={() => handleSelectKegiatan(k)}
                  style={styles.kegiatanCard}
                  accessibilityLabel={`Kegiatan prodi: ${k.judul}, tanggal ${k.tanggal}. Ketuk untuk detail.`}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.dateTag}>
                      <Ionicons name="calendar-outline" size={12} color={Colors.primary} />
                      <Text style={styles.dateText}>{k.tanggal}</Text>
                      {badge && (
                        <View
                          style={[
                            styles.badgeContainer,
                            badge === "Hari ini" && styles.badgeHariIni,
                            badge === "Besok" && styles.badgeBesok,
                            badge === "Baru" && styles.badgeBaru,
                          ]}
                        >
                          <Text style={styles.badgeText}>{badge}</Text>
                        </View>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                  </View>
                  <Text style={styles.kegiatanTitle} numberOfLines={2}>{k.judul}</Text>
                  <View style={styles.footerRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
                      <Text style={styles.locationText} numberOfLines={1}>{k.waktu}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
                      <Text style={styles.locationText} numberOfLines={1}>{k.tempat}</Text>
                    </View>
                  </View>
                </PressableCard>
              );
            })}
          </View>
        )}

        {/* ===== SECTION: Status Mata Kuliah ===== */}
        <View style={styles.sectionTitleRow}>
          <View style={styles.titleWithIcon}>
            <Ionicons name="layers-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionHeading}>Status Mata Kuliah</Text>
          </View>
          <Text style={styles.sectionNote}>Pilih kartu untuk drill-down</Text>
        </View>

        {error ? (
          <ErrorState
            title="Gagal Memuat Status Studi"
            message={error}
            onRetry={refreshData}
            isRetrying={isLoading}
          />
        ) : isLoading && mataKuliahList.length === 0 ? (
          <View style={styles.skeletonContainer}>
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </View>
        ) : mataKuliahList.length === 0 ? (
          <EmptyState
            title="Tidak Ada Data Studi"
            description="Data mata kuliah belum tersedia pada semester ini."
            actionLabel="Buka Riwayat Studi"
            onAction={() => router.push("/(tabs)/riwayat")}
          />
        ) : (
          <View style={styles.cardsContainer}>
            <StatusSummaryCard status="belum_lulus" count={counts.belum_lulus} totalSks={sksBelumLulus} onPress={() => handleNavigateToStatus("belum_lulus")} />
            <StatusSummaryCard status="ditempuh" count={counts.ditempuh} totalSks={sksDitempuh} onPress={() => handleNavigateToStatus("ditempuh")} />
            <StatusSummaryCard status="lulus" count={counts.lulus} totalSks={totalSksLulus} onPress={() => handleNavigateToStatus("lulus")} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  contentContainer: { paddingBottom: Spacing.xxxl },
  body: { paddingHorizontal: Spacing.lg, marginTop: -Spacing.md },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  titleWithIcon: { flexDirection: "row", alignItems: "center", gap: 6 },
  sectionHeading: { ...Typography.subtitle, color: Colors.textPrimary },
  sectionNote: { ...Typography.caption, color: Colors.textMuted },
  lihatSemuaLink: { ...Typography.captionMedium, color: Colors.primary },
  diperbarui: { ...Typography.caption, color: Colors.textMuted, marginBottom: Spacing.sm },
  kegiatanContainer: { marginTop: Spacing.xs },
  kegiatanCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  dateTag: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateText: { fontSize: 11, fontWeight: "600", color: Colors.primary },
  badgeContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  badgeHariIni: { backgroundColor: "#10B981" },
  badgeBesok: { backgroundColor: "#3B82F6" },
  badgeBaru: { backgroundColor: Colors.accent },
  badgeText: { ...Typography.captionMedium, color: Colors.textInverse, fontSize: 10 },
  kegiatanTitle: { ...Typography.bodyMedium, color: Colors.textPrimary, marginBottom: 6 },
  footerRow: { flexDirection: "row", alignItems: "center", gap: 12, flexWrap: "wrap" },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  locationText: { ...Typography.caption, color: Colors.textMuted },
  cardsContainer: { marginTop: Spacing.xs },
  skeletonContainer: { marginTop: Spacing.xs },
});
