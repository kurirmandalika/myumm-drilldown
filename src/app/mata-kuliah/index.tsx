import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAcademic } from "../../context/AcademicContext";
import { SegmentedTabs } from "../../components/SegmentedTabs";
import { CourseListItem } from "../../components/CourseListItem";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { StatusMK, MataKuliah } from "../../types";
import { calculateTotalSKS, getStatusLabel } from "../../utils/academic";

export default function DaftarMataKuliahScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ status?: string }>();
  const { mataKuliahList, counts, isLoading, error, refreshData } =
    useAcademic();

  // Validasi tab awal dari parameter URL
  const initialStatus: StatusMK =
    params.status === "lulus" ||
    params.status === "belum_lulus" ||
    params.status === "ditempuh"
      ? (params.status as StatusMK)
      : "belum_lulus";

  const [activeTab, setActiveTab] = useState<StatusMK>(initialStatus);
  const [onlyWajib, setOnlyWajib] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sync tab jika params status berubah
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

  // Filter list mata kuliah berdasarkan tab aktif, filter wajib, dan query pencarian
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
          {/* Tombol Filter "Hanya wajib" (FR-03, UXR-04) */}
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

          {/* Ringkasan Jumlah MK & Total SKS (PRD S2) */}
          <View style={styles.summaryBadge}>
            <Text style={styles.summaryBadgeText}>
              {filteredCourses.length} MK • {filteredTotalSks} SKS
              {onlyWajib ? ` (dari ${activeTabTotalSks} SKS)` : ""}
            </Text>
          </View>
        </View>
      </View>

      {/* Konten Daftar Mata Kuliah */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat daftar mata kuliah...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.primary} />
          <Text style={styles.errorTitle}>Terjadi Kesalahan</Text>
          <Text style={styles.errorDesc}>{error}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={refreshData}
            accessibilityRole="button"
            accessibilityLabel="Coba lagi memuat data"
          >
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </Pressable>
        </View>
      ) : filteredCourses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name={
              onlyWajib || searchQuery
                ? "search-outline"
                : activeTab === "belum_lulus"
                ? "checkmark-circle-outline"
                : "document-text-outline"
            }
            size={44}
            color={Colors.textMuted}
          />
          <Text style={styles.emptyTitle}>
            {onlyWajib
              ? `Tidak ada mata kuliah wajib ${getStatusLabel(activeTab).toLowerCase()}`
              : searchQuery
              ? "Mata kuliah tidak ditemukan"
              : activeTab === "belum_lulus"
              ? "Bagus sekali! Tidak ada mata kuliah belum lulus."
              : `Tidak ada mata kuliah ${getStatusLabel(activeTab).toLowerCase()}`}
          </Text>
          <Text style={styles.emptySubtitle}>
            {onlyWajib || searchQuery
              ? "Coba nonaktifkan filter atau gunakan kata kunci lain."
              : "Seluruh mata kuliah telah memenuhi standar kelulusan."}
          </Text>
          {onlyWajib && (
            <Pressable
              style={styles.resetFilterBtn}
              onPress={() => setOnlyWajib(false)}
            >
              <Text style={styles.resetFilterText}>Tampilkan Semua</Text>
            </Pressable>
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
  errorTitle: {
    ...Typography.subtitle,
    color: Colors.primary,
    marginTop: Spacing.md,
  },
  errorDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.textInverse,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xxl,
  },
  emptyTitle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
    textAlign: "center",
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  resetFilterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
  },
  resetFilterText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
});
