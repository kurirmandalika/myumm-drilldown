import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Mahasiswa } from "../types";
import { Colors, Spacing, Typography } from "../constants/theme";

interface AcademicHeaderProps {
  mahasiswa: Mahasiswa;
  ipk: number;
  totalSksLulus: number;
}

export const AcademicHeader: React.FC<AcademicHeaderProps> = ({
  mahasiswa,
  ipk,
  totalSksLulus,
}) => {
  return (
    <View style={styles.headerContainer}>
      {/* Top Banner Branding */}
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Ionicons name="school" size={20} color={Colors.textInverse} />
          <Text style={styles.brandTitle}>myUMM Student</Text>
        </View>
        <View style={styles.semesterBadge}>
          <Text style={styles.semesterText}>
            Semester {mahasiswa.semesterAktif}
          </Text>
        </View>
      </View>

      {/* Profil Mahasiswa */}
      <View style={styles.profileSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>
            {mahasiswa.nama.charAt(0)}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.studentName} numberOfLines={1}>
            {mahasiswa.nama}
          </Text>
          <Text style={styles.studentNim}>
            NIM: {mahasiswa.nim} • {mahasiswa.prodi}
          </Text>
          <Text style={styles.studentPA} numberOfLines={1}>
            PA: {mahasiswa.dosenPA}
          </Text>
        </View>
      </View>

      {/* Kartu Informasi Akademik Statis (Murni Info, Bukan Tombol - FR-01) */}
      <View
        style={styles.staticAcademicInfo}
        accessibilityRole="summary"
        accessibilityLabel={`Informasi akademik: IPK ${ipk.toFixed(2)}, Total SKS lulus ${totalSksLulus} SKS`}
      >
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>IPK Kumulatif</Text>
          <View style={styles.statValueRow}>
            <Ionicons name="ribbon-outline" size={16} color={Colors.primary} />
            <Text style={styles.statValue}>{ipk.toFixed(2)}</Text>
          </View>
          <Text style={styles.statNote}>Skala 4.00</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total SKS Lulus</Text>
          <View style={styles.statValueRow}>
            <Ionicons name="book-outline" size={16} color={Colors.primary} />
            <Text style={styles.statValue}>{totalSksLulus}</Text>
          </View>
          <Text style={styles.statNote}>dari syarat 144 SKS</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.primary,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  logoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textInverse,
    letterSpacing: 0.5,
  },
  semesterBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  semesterText: {
    ...Typography.captionMedium,
    color: Colors.textInverse,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
  },
  profileInfo: {
    flex: 1,
  },
  studentName: {
    ...Typography.title,
    color: Colors.textInverse,
  },
  studentNim: {
    ...Typography.caption,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 2,
  },
  studentPA: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.75)",
    marginTop: 1,
  },
  // Stat Card Murni Info (Tampilan datar/non-elevated, tanpa chevron/affordance tekan)
  staticAcademicInfo: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  statNote: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 38,
    backgroundColor: Colors.border,
  },
});
