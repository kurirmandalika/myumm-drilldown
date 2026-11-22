import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAcademic } from "../../context/AcademicContext";
import { SegmentedTabs } from "../../components/SegmentedTabs";
import { CourseListItem } from "../../components/CourseListItem";
import { ErrorState } from "../../components/ErrorState";
import { EmptyState } from "../../components/EmptyState";
import { CourseSkeleton } from "../../components/LoadingSkeleton";
import { Colors, Spacing } from "../../constants/theme";
import { StatusMK, MataKuliah } from "../../types";
import { calculateTotalSKS, getStatusLabel } from "../../utils/academic";

export default function DaftarMataKuliahScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ status?: string }>();
  const { mataKuliahList, counts, isLoading, error, refreshData } =
    useAcademic();

  const initialStatus: StatusMK =
    params.status === "lulus" ||
    params.status === "belum_lulus" ||
    params.status === "ditempuh"
      ? (params.status as StatusMK)
      : "belum_lulus";

  const [activeTab, setActiveTab] = useState<StatusMK>(initialStatus);
  const [onlyWajib, setOnlyWajib] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (
      params.status &&
      (params.status === "lulus" ||
        params.status === "belum_lulus" ||
        params.status === "ditempuh")
    ) {
      setActiveTab(params.status as StatusMK);
    }
  }, [params.status]);

  const currentTabCourses = useMemo(
    () => mataKuliahList.filter((mk) => mk.status === activeTab),
    [mataKuliahList, activeTab]
  );

  const filteredCourses = useMemo(() => {
    return currentTabCourses.filter((mk) => {
      const matchWajib = onlyWajib ? mk.wajib === true : true;
      const matchQuery =
        searchQuery.trim() === "" ||
        mk.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mk.kode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchWajib && matchQuery;
    });
  }, [currentTabCourses, onlyWajib, searchQuery]);

  const activeTabTotalSks = useMemo(
    () => calculateTotalSKS(currentTabCourses),
    [currentTabCourses]
  );

  const filteredTotalSks = useMemo(
    () => calculateTotalSKS(filteredCourses),
    [filteredCourses]
  );

  const handleSelectCourse = (course: MataKuliah) => {
    router.push({
      pathname: "/mata-kuliah/[kode]",
      params: { kode: course.kode },
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Daftar Mata Kuliah",
          headerBackTitle: "Kembali",
        }}
      />

      {/* Segmented Tab Bar (FR-02, FR-03) */}
      <SegmentedTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
      />

      {/* Kontrol Filter & Pencarian */}
      <View style={styles.controlsSection}>
        {/* Search Bar Cepat */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama atau kode mata kuliah..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery("")}
              accessibilityLabel="Hapus pencarian"
            >
              <Ionicons
                name="close-circle"
                size={16}
                color={Colors.textMuted}
              />
            </Pressable>
          )}
        </View>

        {/* Baris Filter & Ringkasan SKS */}
        <View style={styles.filterSummaryRow}>
          <Pressable
            onPress={() => setOnlyWajib(!onlyWajib)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: onlyWajib }}
            accessibilityLabel="Filter hanya mata kuliah wajib"
            style={[
              styles.filterPill,
              onlyWajib && styles.filterPillActive,
            ]}
          >
            <Ionicons
              name={onlyWajib ? "checkmark-circle" : "funnel-outline"}
              size={14}
              color={onlyWajib ? Colors.textInverse : Colors.textSecondary}
            />
            <Text
              style={[
                styles.filterPillText,
                onlyWajib && styles.filterPillTextActive,
              ]}
            >
              Hanya Wajib
            </Text>
          </Pressable>

          <View style={styles.summaryBadge}>
            <Text style={styles.summaryBadgeText}>
              {filteredCourses.length} MK • {filteredTotalSks} SKS
              {onlyWajib ? ` (dari ${activeTabTotalSks} SKS)` : ""}
            </Text>
          </View>
        </View>
      </View>

      {/* Konten Daftar Mata Kuliah / State Handling (FR-07) */}
      {error ? (
        <View style={styles.stateWrapper}>
          <ErrorState
            title="Gagal Memuat Mata Kuliah"
            message={error}
            onRetry={refreshData}
            isRetrying={isLoading}
          />
        </View>
      ) : isLoading && mataKuliahList.length === 0 ? (
        <View style={styles.skeletonList}>
          <CourseSkeleton />
          <CourseSkeleton />
          <CourseSkeleton />
          <CourseSkeleton />
        </View>
      ) : filteredCourses.length === 0 ? (
        <View style={styles.stateWrapper}>
          {onlyWajib ? (
            <EmptyState
              icon="filter-outline"
              title="Tidak Ada Mata Kuliah Wajib"
              description={`Tidak ditemukan mata kuliah berkategori wajib pada status ${getStatusLabel(activeTab).toLowerCase()}.`}
              actionLabel="Tampilkan Semua Mata Kuliah"
              onAction={() => setOnlyWajib(false)}
            />
          ) : searchQuery.length > 0 ? (
            <EmptyState
              icon="search-outline"
              title="Mata Kuliah Tidak Ditemukan"
              description={`Tidak ada hasil yang sesuai dengan kata kunci "${searchQuery}".`}
              actionLabel="Hapus Kata Kunci"
              onAction={() => setSearchQuery("")}
            />
          ) : activeTab === "belum_lulus" ? (
            <EmptyState
              icon="checkmark-circle-outline"
              title="Semua Mata Kuliah Lulus!"
              description="Hebat! Tidak ada catatan mata kuliah yang belum lulus pada semester ini."
              actionLabel="Lihat Riwayat Studi"
              onAction={() => router.push("/(tabs)/riwayat")}
              secondaryActionLabel="Kembali ke Beranda"
              onSecondaryAction={() => router.back()}
            />
          ) : (
            <EmptyState
              icon="file-tray-outline"
              title={`Belum Ada Mata Kuliah ${getStatusLabel(activeTab)}`}
              description={`Tidak ada mata kuliah berstatus ${getStatusLabel(activeTab).toLowerCase()} saat ini.`}
              actionLabel="Lihat Riwayat Studi"
              onAction={() => router.push("/(tabs)/riwayat")}
            />
          )}
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.kode}
          renderItem={({ item }) => (
            <CourseListItem
              course={item}
              onPress={() => handleSelectCourse(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  controlsSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: Spacing.md,
    height: 42,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
    marginBottom: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  filterSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterPillActive: {
    backgroundColor: Colors.badgeWajib.text,
    borderColor: Colors.badgeWajib.text,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  filterPillTextActive: {
    color: Colors.textInverse,
  },
  summaryBadge: {
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  summaryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.secondary,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxxl,
  },
  skeletonList: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
  },
  stateWrapper: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: "center",
  },
});
