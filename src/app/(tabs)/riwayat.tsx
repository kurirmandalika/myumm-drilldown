import React, { useState, useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAcademic } from "../../context/AcademicContext";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { MataKuliah } from "../../types";
import {
  calculateIPK,
  calculateTotalSKS,
  groupMataKuliahBySemester,
} from "../../utils/academic";
import { PressableCard } from "../../components/PressableCard";

export default function RiwayatStudiScreen() {
  const router = useRouter();
  const {
    mataKuliahList,
    ipk,
    totalSksLulus,
    isLoading,
    refreshData,
  } = useAcademic();

  // Kelompokkan per semester
  const groupedBySemester = useMemo(
    () => groupMataKuliahBySemester(mataKuliahList),
    [mataKuliahList]
  );

  const semesters = useMemo(
    () =>
      Object.keys(groupedBySemester)
        .map(Number)
        .sort((a, b) => b - a), // Tampilkan dari semester terbaru (7 ke 1)
    [groupedBySemester]
  );

  // State accordion terbuka/tertutup per semester (default semester 7 dan 6 terbuka)
  const [expandedSemesters, setExpandedSemesters] = useState<
    Record<number, boolean>
  >({
    7: true,
    6: true,
    5: false,
    4: false,
    3: false,
    2: false,
    1: false,
  });

  const toggleSemester = (sem: number) => {
    setExpandedSemesters((prev) => ({
      ...prev,
      [sem]: !prev[sem],
    }));
  };

  const handleSelectCourse = (course: MataKuliah) => {
    router.push({
      pathname: "/mata-kuliah/[kode]",
      params: { kode: course.kode },
    });
  };

  const sksDitempuh = useMemo(
    () =>
      calculateTotalSKS(
        mataKuliahList.filter((mk) => mk.status === "ditempuh")
      ),
    [mataKuliahList]
  );

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
      {/* Kartu Ringkasan Prestasi Akademik Kumulatif */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryTitleRow}>
          <Ionicons name="school" size={20} color={Colors.primary} />
          <Text style={styles.summaryTitle}>Ringkasan Riwayat Studi</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>IPK Kumulatif</Text>
            <Text style={styles.statNumber}>{ipk.toFixed(2)}</Text>
            <Text style={styles.statSub}>Skala 4.00</Text>
          </View>

          <View style={styles.statSeparator} />

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>SKS Lulus</Text>
            <Text style={styles.statNumber}>{totalSksLulus}</Text>
            <Text style={styles.statSub}>dari 144 SKS</Text>
          </View>

          <View style={styles.statSeparator} />

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>SKS Ditempuh</Text>
            <Text style={[styles.statNumber, { color: Colors.status.ditempuh.text }]}>
              {sksDitempuh}
            </Text>
            <Text style={styles.statSub}>Semester 7</Text>
          </View>
        </View>
      </View>

      {/* Daftar Semester Accordion (FR-06, S4) */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>Daftar Semester</Text>
        <Text style={styles.sectionSubtitle}>
          Ketuk semester untuk membuka/menutup
        </Text>
      </View>

      {isLoading && mataKuliahList.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat riwayat studi...</Text>
        </View>
      ) : (
        semesters.map((sem) => {
          const courses = groupedBySemester[sem] || [];
          const isExpanded = !!expandedSemesters[sem];
          const totalSks = calculateTotalSKS(courses);
          const semIps = calculateIPK(courses);
          const isCurrentSemester = sem === 7;

          return (
            <View key={sem} style={styles.semesterCard}>
              {/* Accordion Header */}
              <Pressable
                onPress={() => toggleSemester(sem)}
                accessibilityRole="button"
                accessibilityLabel={`Semester ${sem}, ${courses.length} mata kuliah, total ${totalSks} SKS. ${isExpanded ? "Buka" : "Tutup"}`}
                accessibilityHint="Membuka atau menutup daftar mata kuliah pada semester ini"
                style={({ pressed }) => [
                  styles.accordionHeader,
                  pressed && styles.accordionHeaderPressed,
                ]}
              >
                <View style={styles.accordionTitleRow}>
                  <View
                    style={[
                      styles.semesterDot,
                      isCurrentSemester && styles.currentSemesterDot,
                    ]}
                  />
                  <View>
                    <View style={styles.semesterLabelRow}>
                      <Text style={styles.semesterTitle}>Semester {sem}</Text>
                      {isCurrentSemester && (
                        <View style={styles.currentBadge}>
                          <Text style={styles.currentBadgeText}>
                            Aktif Berjalan
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.semesterMeta}>
                      {courses.length} Mata Kuliah • {totalSks} SKS
                      {!isCurrentSemester && semIps > 0
                        ? ` • IPS: ${semIps.toFixed(2)}`
                        : ""}
                    </Text>
                  </View>
                </View>

                <View style={styles.chevronWrapper}>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={Colors.textSecondary}
                  />
                </View>
              </Pressable>

              {/* Accordion Content: List Mata Kuliah */}
              {isExpanded && (
                <View style={styles.accordionContent}>
                  {courses.map((mk) => {
                    const isFailed = mk.status === "belum_lulus";
                    const isOngoing = mk.status === "ditempuh";

                    return (
                      <PressableCard
                        key={mk.kode}
                        onPress={() => handleSelectCourse(mk)}
                        accessibilityLabel={`Mata kuliah ${mk.nama}, kode ${mk.kode}, ${mk.sks} SKS, ${mk.wajib ? "Wajib" : "Pilihan"}${mk.nilai ? `, Nilai ${mk.nilai}` : ""}. Ketuk untuk melihat detail.`}
                        accessibilityHint="Membuka detail mata kuliah"
                        style={styles.courseItem}
                      >
                        <View style={styles.courseInfoCol}>
                          <View style={styles.courseTopBadges}>
                            <View style={styles.courseCodeBadge}>
                              <Text style={styles.courseCodeText}>
                                {mk.kode}
                              </Text>
                            </View>
                            {mk.wajib ? (
                              <View style={styles.wajibTag}>
                                <Text style={styles.wajibTagText}>Wajib</Text>
                              </View>
                            ) : (
                              <View style={styles.pilihanTag}>
                                <Text style={styles.pilihanTagText}>Pilihan</Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.courseNameText} numberOfLines={2}>
                            {mk.nama}
                          </Text>
                          <Text style={styles.courseSksText}>
                            {mk.sks} SKS
                          </Text>
                        </View>

                        <View style={styles.courseRightCol}>
                          {mk.nilai ? (
                            <View
                              style={[
                                styles.gradeBadge,
                                isFailed
                                  ? styles.gradeBadgeFailed
                                  : styles.gradeBadgePassed,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.gradeText,
                                  isFailed
                                    ? styles.gradeTextFailed
                                    : styles.gradeTextPassed,
                                ]}
                              >
                                {mk.nilai}
                              </Text>
                            </View>
                          ) : isOngoing ? (
                            <View style={styles.ongoingBadge}>
                              <Text style={styles.ongoingBadgeText}>
                                Aktif
                              </Text>
                            </View>
                          ) : null}
                          <Ionicons
                            name="chevron-forward"
                            size={16}
                            color={Colors.textMuted}
                          />
                        </View>
                      </PressableCard>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })
      )}
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
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: Spacing.xl,
  },
  summaryTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: Spacing.md,
  },
  summaryTitle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  statSub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statSeparator: {
    width: 1,
    height: 38,
    backgroundColor: Colors.border,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: Spacing.md,
  },
  sectionHeading: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  semesterCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    minHeight: 56,
  },
  accordionHeaderPressed: {
    backgroundColor: Colors.cardPressed,
  },
  accordionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  semesterDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.secondary,
    marginRight: Spacing.md,
  },
  currentSemesterDot: {
    backgroundColor: Colors.primary,
  },
  semesterLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  semesterTitle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
  },
  currentBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.primary,
  },
  semesterMeta: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  chevronWrapper: {
    padding: 4,
  },
  accordionContent: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: "#FAFAFA",
  },
  courseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  courseInfoCol: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  courseTopBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  courseCodeBadge: {
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  courseCodeText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.secondary,
  },
  wajibTag: {
    backgroundColor: Colors.badgeWajib.bg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  wajibTagText: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.badgeWajib.text,
  },
  pilihanTag: {
    backgroundColor: Colors.badgePilihan.bg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pilihanTagText: {
    fontSize: 9,
    fontWeight: "600",
    color: Colors.badgePilihan.text,
  },
  courseNameText: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  courseSksText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  courseRightCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  gradeBadge: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  gradeBadgePassed: {
    backgroundColor: Colors.status.lulus.bg,
  },
  gradeBadgeFailed: {
    backgroundColor: Colors.status.belum_lulus.bg,
    borderWidth: 1,
    borderColor: Colors.status.belum_lulus.border,
  },
  gradeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  gradeTextPassed: {
    color: Colors.status.lulus.text,
  },
  gradeTextFailed: {
    color: Colors.status.belum_lulus.text,
  },
  ongoingBadge: {
    backgroundColor: Colors.status.ditempuh.bg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ongoingBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.status.ditempuh.text,
  },
});
