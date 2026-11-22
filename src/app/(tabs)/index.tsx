import React, { useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAcademic } from "../../context/AcademicContext";
import { AcademicHeader } from "../../components/AcademicHeader";
import { StatusSummaryCard } from "../../components/StatusSummaryCard";
import { ProdiActivitySection } from "../../components/ProdiActivitySection";
import { ErrorState } from "../../components/ErrorState";
import { EmptyState } from "../../components/EmptyState";
import { DashboardCardSkeleton } from "../../components/LoadingSkeleton";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { calculateTotalSKS } from "../../utils/academic";
import { KegiatanProdi, StatusMK } from "../../types";

export default function DashboardScreen() {
  const router = useRouter();
  const {
    mataKuliahList,
    mahasiswa,
    kegiatanProdiList,
    isLoading,
    error,
    counts,
    ipk,
    totalSksLulus,
    refreshData,
  } = useAcademic();

  const sksBelumLulus = useMemo(
    () =>
      calculateTotalSKS(
        mataKuliahList.filter((mk) => mk.status === "belum_lulus")
      ),
    [mataKuliahList]
  );

  const sksDitempuh = useMemo(
    () =>
      calculateTotalSKS(
        mataKuliahList.filter((mk) => mk.status === "ditempuh")
      ),
    [mataKuliahList]
  );

  const handleNavigateToStatus = (status: StatusMK) => {
    router.push({
      pathname: "/mata-kuliah",
      params: { status },
    });
  };

  const handleSelectKegiatan = (kegiatan: KegiatanProdi) => {
    router.push({
      pathname: "/kegiatan/[id]",
      params: { id: kegiatan.id },
    });
  };

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
      {/* Header Profil & Ringkasan Statis Mahasiswa */}
      <AcademicHeader
        mahasiswa={mahasiswa}
        ipk={ipk}
        totalSksLulus={totalSksLulus}
      />

      <View style={styles.body}>
        {/* Section Title Kartu Status Akademik */}
        <View style={styles.sectionTitleRow}>
          <View style={styles.titleWithIcon}>
            <Ionicons name="layers-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionHeading}>Status Mata Kuliah</Text>
          </View>
          <Text style={styles.sectionNote}>Pilih kartu untuk drill-down</Text>
        </View>

        {/* State Handling: Error, Loading Skeleton, Empty, or Cards (FR-07) */}
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
            description="Data mata kuliah belum tersedia pada semester ini. Anda dapat memeriksa arsip riwayat studi pada menu navigasi."
            actionLabel="Buka Riwayat Studi"
            onAction={() => router.push("/(tabs)/riwayat")}
          />
        ) : (
          <View style={styles.cardsContainer}>
            {/* 1. Belum Lulus (Prioritas Perhatian KRS) */}
            <StatusSummaryCard
              status="belum_lulus"
              count={counts.belum_lulus}
              totalSks={sksBelumLulus}
              onPress={() => handleNavigateToStatus("belum_lulus")}
            />

            {/* 2. Sedang Ditempuh */}
            <StatusSummaryCard
              status="ditempuh"
              count={counts.ditempuh}
              totalSks={sksDitempuh}
              onPress={() => handleNavigateToStatus("ditempuh")}
            />

            {/* 3. Lulus */}
            <StatusSummaryCard
              status="lulus"
              count={counts.lulus}
              totalSks={totalSksLulus}
              onPress={() => handleNavigateToStatus("lulus")}
            />
          </View>
        )}

        {/* Section Jadwal Kegiatan Prodi */}
        <ProdiActivitySection
          kegiatanList={kegiatanProdiList}
          onSelectKegiatan={handleSelectKegiatan}
        />
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
    paddingBottom: Spacing.xxxl,
  },
  body: {
    paddingHorizontal: Spacing.lg,
    marginTop: -Spacing.md,
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionHeading: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
  },
  sectionNote: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  cardsContainer: {
    marginTop: Spacing.xs,
  },
  skeletonContainer: {
    marginTop: Spacing.xs,
  },
});
