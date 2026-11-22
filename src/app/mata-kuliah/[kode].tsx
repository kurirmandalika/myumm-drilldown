import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAcademic } from "../../context/AcademicContext";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { getStatusLabel, BOBOT_NILAI } from "../../utils/academic";
import { PressableCard } from "../../components/PressableCard";

export default function DetailMataKuliahScreen() {
  const router = useRouter();
  const { kode } = useLocalSearchParams<{ kode: string }>();
  const {
    getCourseByCode,
    getDependentCourses,
    getPrerequisitesDetail,
  } = useAcademic();

  const course = kode ? getCourseByCode(kode) : undefined;

  if (!course) {
    return (
      <View style={styles.notFoundContainer}>
        <Stack.Screen options={{ title: "Detail Mata Kuliah" }} />
        <Ionicons name="alert-circle-outline" size={54} color={Colors.primary} />
        <Text style={styles.notFoundTitle}>Mata Kuliah Tidak Ditemukan</Text>
        <Text style={styles.notFoundSubtitle}>
          Kode mata kuliah &quot;{kode}&quot; tidak terdaftar pada kurikulum.
        </Text>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke halaman sebelumnya"
        >
          <Text style={styles.backButtonText}>Kembali ke Daftar</Text>
        </Pressable>
      </View>
    );
  }

  const prerequisites = getPrerequisitesDetail(course);
  const dependentCourses = getDependentCourses(course.kode);

  const isLulus = course.status === "lulus";
  const isBelumLulus = course.status === "belum_lulus";
  const isDitempuh = course.status === "ditempuh";

  const statusStyle = isLulus
    ? Colors.status.lulus
    : isBelumLulus
    ? Colors.status.belum_lulus
    : Colors.status.ditempuh;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          title: course.kode,
          headerBackTitle: "Kembali",
        }}
      />

      {/* Hero Card Header */}
      <View
        style={[
          styles.heroCard,
          { borderColor: statusStyle.border },
        ]}
      >
        <View style={styles.heroTopRow}>
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>{course.kode}</Text>
          </View>

          {/* Badge Status */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.bg, borderColor: statusStyle.border },
            ]}
          >
            <Ionicons
              name={
                isLulus
                  ? "checkmark-circle"
                  : isBelumLulus
                  ? "alert-circle"
                  : "time"
              }
              size={14}
              color={statusStyle.text}
            />
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {getStatusLabel(course.status)}
            </Text>
          </View>
        </View>

        {/* Nama Lengkap MK */}
        <Text style={styles.courseTitle}>{course.nama}</Text>

        {/* SKS & Jenis MK */}
        <View style={styles.tagsRow}>
          <View
            style={[
              styles.categoryBadge,
              course.wajib ? styles.wajibBadge : styles.pilihanBadge,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                course.wajib ? styles.wajibText : styles.pilihanText,
              ]}
            >
              {course.wajib ? "Mata Kuliah Wajib" : "Mata Kuliah Pilihan"}
            </Text>
          </View>

          <View style={styles.semesterTag}>
            <Ionicons name="calendar-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.semesterTagText}>
              Kurikulum Semester {course.semester}
            </Text>
          </View>
        </View>
      </View>

      {/* Grid Informasi Nilai & SKS */}
      <View style={styles.infoGrid}>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Beban SKS</Text>
          <Text style={styles.gridValue}>{course.sks} SKS</Text>
          <Text style={styles.gridSub}>Kredit Akademik</Text>
        </View>

        <View style={styles.gridDivider} />

        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Nilai Akhir</Text>
          <Text
            style={[
              styles.gridValue,
              isLulus
                ? { color: Colors.status.lulus.text }
                : isBelumLulus
                ? { color: Colors.status.belum_lulus.text }
                : { color: Colors.status.ditempuh.text },
            ]}
          >
            {course.nilai ? course.nilai : "Sedang Berjalan"}
          </Text>
          <Text style={styles.gridSub}>
            {course.nilai && BOBOT_NILAI[course.nilai] !== undefined
              ? `Bobot: ${BOBOT_NILAI[course.nilai].toFixed(1)}`
              : "Semester Aktif"}
          </Text>
        </View>

        <View style={styles.gridDivider} />

        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Status Kelulusan</Text>
          <Text
            style={[
              styles.gridValue,
              { fontSize: 14, marginTop: 4 },
              isLulus
                ? { color: Colors.status.lulus.text }
                : isBelumLulus
                ? { color: Colors.status.belum_lulus.text }
                : { color: Colors.status.ditempuh.text },
            ]}
          >
            {isLulus
              ? "Memenuhi Syarat"
              : isBelumLulus
              ? "Wajib Diulang"
              : "Ditempuh"}
          </Text>
          <Text style={styles.gridSub}>
            {course.wajib ? "Syarat Yudisium" : "Penambah SKS"}
          </Text>
        </View>
      </View>

      {/* Catatan / Rekomendasi KRS */}
      {isBelumLulus && (
        <View style={styles.advisoryCard}>
          <Ionicons name="warning" size={22} color={Colors.status.belum_lulus.text} />
          <View style={styles.advisoryTextContainer}>
            <Text style={styles.advisoryTitle}>Penting untuk KRS Semester Berikutnya</Text>
            <Text style={styles.advisoryDesc}>
              Mata kuliah ini bernilai {course.nilai} (di bawah standar lulus C).
              {course.wajib
                ? " Karena merupakan mata kuliah WAJIB, Anda harus memprogram ulang mata kuliah ini untuk memenuhi syarat kelulusan program studi."
                : " Anda disarankan mengulang atau mengambil mata kuliah pilihan alternatif untuk memperbaiki perolehan nilai."}
            </Text>
          </View>
        </View>
      )}

      {/* Bagian 1: Daftar Prasyarat Mata Kuliah Ini */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="git-pull-request-outline" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Prasyarat Mata Kuliah Ini</Text>
          </View>
          <Text style={styles.sectionCount}>
            {course.prasyarat.length} Prasyarat
          </Text>
        </View>

        {course.prasyarat.length === 0 ? (
          <View style={styles.emptyPrereqBox}>
            <Ionicons name="checkmark-done" size={20} color={Colors.status.lulus.text} />
            <Text style={styles.emptyPrereqText}>
              Mata kuliah ini tidak memiliki mata kuliah prasyarat.
            </Text>
          </View>
        ) : (
          prerequisites.map((prereq) => {
            const prereqFulfilled = prereq.fulfilled;
            return (
              <PressableCard
                key={prereq.kode}
                onPress={() => {
                  if (prereq.course) {
                    router.push({
                      pathname: "/mata-kuliah/[kode]",
                      params: { kode: prereq.course.kode },
                    });
                  }
                }}
                accessibilityLabel={`Prasyarat ${prereq.kode}: ${prereq.course?.nama || "Mata kuliah"}, status ${prereqFulfilled ? "Sudah lulus" : "Belum terpenuhi"}`}
                accessibilityHint="Ketuk untuk melihat detail mata kuliah prasyarat ini"
                style={styles.prereqCard}
              >
                <View style={styles.prereqLeft}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor: prereqFulfilled
                          ? Colors.status.lulus.text
                          : Colors.status.belum_lulus.text,
                      },
                    ]}
                  />
                  <View style={styles.prereqInfo}>
                    <Text style={styles.prereqCode}>{prereq.kode}</Text>
                    <Text style={styles.prereqName}>
                      {prereq.course?.nama || "Mata Kuliah Terkait"}
                    </Text>
                  </View>
                </View>

                <View style={styles.prereqRight}>
                  <View
                    style={[
                      styles.prereqStatusBadge,
                      {
                        backgroundColor: prereqFulfilled
                          ? Colors.status.lulus.bg
                          : Colors.status.belum_lulus.bg,
                      },
                    ]}
                  >
                    <Ionicons
                      name={prereqFulfilled ? "checkmark" : "close"}
                      size={12}
                      color={
                        prereqFulfilled
                          ? Colors.status.lulus.text
                          : Colors.status.belum_lulus.text
                      }
                    />
                    <Text
                      style={[
                        styles.prereqStatusText,
                        {
                          color: prereqFulfilled
                            ? Colors.status.lulus.text
                            : Colors.status.belum_lulus.text,
                        },
                      ]}
                    >
                      {prereqFulfilled ? "Terpenuhi" : "Belum Lulus"}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={Colors.textMuted}
                  />
                </View>
              </PressableCard>
            );
          })
        )}
      </View>

      {/* Bagian 2: Mata Kuliah yang Membutuhkan Mata Kuliah Ini */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="arrow-forward-circle-outline" size={18} color={Colors.secondary} />
            <Text style={styles.sectionTitle}>
              Prasyarat untuk Mata Kuliah Lain
            </Text>
          </View>
          <Text style={styles.sectionCount}>
            {dependentCourses.length} Mata Kuliah
          </Text>
        </View>

        {dependentCourses.length === 0 ? (
          <View style={styles.emptyPrereqBox}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.textMuted} />
            <Text style={styles.emptyPrereqText}>
              Tidak ada mata kuliah lanjutan yang mensyaratkan mata kuliah ini.
            </Text>
          </View>
        ) : (
          dependentCourses.map((dep) => (
            <PressableCard
              key={dep.kode}
              onPress={() => {
                router.push({
                  pathname: "/mata-kuliah/[kode]",
                  params: { kode: dep.kode },
                });
              }}
              accessibilityLabel={`Mata kuliah lanjutan: ${dep.nama}, kode ${dep.kode}, semester ${dep.semester}. Ketuk untuk melihat detail.`}
              accessibilityHint="Membuka detail mata kuliah lanjutan"
              style={styles.prereqCard}
            >
              <View style={styles.prereqLeft}>
                <View style={styles.prereqInfo}>
                  <View style={styles.depCodeRow}>
                    <Text style={styles.prereqCode}>{dep.kode}</Text>
                    <Text style={styles.depSemester}>
                      • Sem {dep.semester}
                    </Text>
                    {dep.wajib && (
                      <View style={styles.miniWajibTag}>
                        <Text style={styles.miniWajibText}>Wajib</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.prereqName}>{dep.nama}</Text>
                </View>
              </View>

              <View style={styles.prereqRight}>
                <Text style={styles.depSksText}>{dep.sks} SKS</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.textMuted}
                />
              </View>
            </PressableCard>
          ))
        )}
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
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: Spacing.md,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  codeBadge: {
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  codeText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.secondary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  courseTitle: {
    ...Typography.header,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
  },
  wajibBadge: {
    backgroundColor: Colors.badgeWajib.bg,
    borderWidth: 0.5,
    borderColor: Colors.badgeWajib.border,
  },
  wajibText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.badgeWajib.text,
  },
  pilihanBadge: {
    backgroundColor: Colors.badgePilihan.bg,
  },
  pilihanText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.badgePilihan.text,
  },
  semesterTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  semesterTagText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  infoGrid: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    alignItems: "center",
  },
  gridItem: {
    flex: 1,
    alignItems: "center",
  },
  gridLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  gridSub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  gridDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  advisoryCard: {
    flexDirection: "row",
    backgroundColor: Colors.status.belum_lulus.bg,
    borderWidth: 1,
    borderColor: Colors.status.belum_lulus.border,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: 12,
  },
  advisoryTextContainer: {
    flex: 1,
  },
  advisoryTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.status.belum_lulus.text,
    marginBottom: 2,
  },
  advisoryDesc: {
    ...Typography.caption,
    color: "#7F1D1D",
    lineHeight: 18,
  },
  sectionContainer: {
    marginTop: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
  },
  sectionCount: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  emptyPrereqBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyPrereqText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
  },
  prereqCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 10,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  prereqLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.md,
  },
  prereqInfo: {
    flex: 1,
  },
  prereqCode: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.secondary,
  },
  prereqName: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginTop: 1,
  },
  prereqRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  prereqStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  prereqStatusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  depCodeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  depSemester: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  miniWajibTag: {
    backgroundColor: Colors.badgeWajib.bg,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  miniWajibText: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.badgeWajib.text,
  },
  depSksText: {
    ...Typography.captionMedium,
    color: Colors.textMuted,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  notFoundTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  notFoundSubtitle: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.textInverse,
    fontWeight: "600",
  },
});
