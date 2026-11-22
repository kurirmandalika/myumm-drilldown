import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MataKuliah } from "../types";
import { Colors, Spacing, Typography } from "../constants/theme";
import { PressableCard } from "./PressableCard";

interface CourseListItemProps {
  course: MataKuliah;
  onPress: () => void;
}

export const CourseListItem: React.FC<CourseListItemProps> = ({
  course,
  onPress,
}) => {
  const isFailed = course.status === "belum_lulus";
  const isOngoing = course.status === "ditempuh";

  return (
    <PressableCard
      onPress={onPress}
      accessibilityLabel={`Mata kuliah ${course.nama}, kode ${course.kode}, ${course.sks} SKS, semester ${course.semester}, ${course.wajib ? "Wajib" : "Pilihan"}${course.nilai ? `, Nilai ${course.nilai}` : ""}. Ketuk untuk melihat detail.`}
      accessibilityHint="Membuka detail mata kuliah dan prasyarat"
      style={styles.container}
    >
      <View style={styles.mainRow}>
        <View style={styles.infoCol}>
          {/* Baris Kode & Badges */}
          <View style={styles.badgeRow}>
            <View style={styles.codeBadge}>
              <Text style={styles.codeText}>{course.kode}</Text>
            </View>

            {course.wajib ? (
              <View style={[styles.tagBadge, styles.wajibBadge]}>
                <Text style={styles.wajibText}>Wajib</Text>
              </View>
            ) : (
              <View style={[styles.tagBadge, styles.pilihanBadge]}>
                <Text style={styles.pilihanText}>Pilihan</Text>
              </View>
            )}

            {course.prasyarat.length > 0 && (
              <View style={[styles.tagBadge, styles.prasyaratBadge]}>
                <Ionicons
                  name="git-branch-outline"
                  size={11}
                  color={Colors.badgePrasyarat.text}
                />
                <Text style={styles.prasyaratText}>
                  {course.prasyarat.length} Prasyarat
                </Text>
              </View>
            )}
          </View>

          {/* Nama Mata Kuliah */}
          <Text style={styles.courseName} numberOfLines={2}>
            {course.nama}
          </Text>

          {/* Info SKS & Semester */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons
                name="book-outline"
                size={13}
                color={Colors.textMuted}
              />
              <Text style={styles.metaText}>{course.sks} SKS</Text>
            </View>
            <Text style={styles.metaDot}>•</Text>
            <View style={styles.metaItem}>
              <Ionicons
                name="calendar-outline"
                size={13}
                color={Colors.textMuted}
              />
              <Text style={styles.metaText}>Semester {course.semester}</Text>
            </View>
          </View>
        </View>

        {/* Kolom Kanan: Nilai & Chevron */}
        <View style={styles.rightCol}>
          {course.nilai ? (
            <View
              style={[
                styles.gradeBadge,
                isFailed ? styles.gradeBadgeFailed : styles.gradeBadgePassed,
              ]}
            >
              <Text style={styles.gradeLabel}>Nilai</Text>
              <Text
                style={[
                  styles.gradeValue,
                  isFailed ? styles.gradeValueFailed : styles.gradeValuePassed,
                ]}
              >
                {course.nilai}
              </Text>
            </View>
          ) : isOngoing ? (
            <View style={[styles.gradeBadge, styles.gradeBadgeOngoing]}>
              <Ionicons
                name="time-outline"
                size={14}
                color={Colors.status.ditempuh.text}
              />
              <Text style={styles.ongoingText}>Aktif</Text>
            </View>
          ) : null}

          <Ionicons
            name="chevron-forward"
            size={18}
            color={Colors.textMuted}
            style={styles.chevron}
          />
        </View>
      </View>
    </PressableCard>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoCol: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 6,
  },
  codeBadge: {
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codeText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.secondary,
  },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  wajibBadge: {
    backgroundColor: Colors.badgeWajib.bg,
    borderWidth: 0.5,
    borderColor: Colors.badgeWajib.border,
  },
  wajibText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.badgeWajib.text,
  },
  pilihanBadge: {
    backgroundColor: Colors.badgePilihan.bg,
  },
  pilihanText: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.badgePilihan.text,
  },
  prasyaratBadge: {
    backgroundColor: Colors.badgePrasyarat.bg,
  },
  prasyaratText: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.badgePrasyarat.text,
  },
  courseName: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  metaDot: {
    marginHorizontal: 6,
    color: Colors.textMuted,
    fontSize: 10,
  },
  rightCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  gradeBadge: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 44,
  },
  gradeBadgePassed: {
    backgroundColor: Colors.status.lulus.bg,
  },
  gradeBadgeFailed: {
    backgroundColor: Colors.status.belum_lulus.bg,
    borderWidth: 1,
    borderColor: Colors.status.belum_lulus.border,
  },
  gradeBadgeOngoing: {
    backgroundColor: Colors.status.ditempuh.bg,
    flexDirection: "row",
    gap: 4,
  },
  gradeLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  gradeValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  gradeValuePassed: {
    color: Colors.status.lulus.text,
  },
  gradeValueFailed: {
    color: Colors.status.belum_lulus.text,
  },
  ongoingText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.status.ditempuh.text,
  },
  chevron: {
    marginLeft: 2,
  },
});
