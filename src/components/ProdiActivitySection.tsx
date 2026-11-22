import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KegiatanProdi } from "../types";
import { Colors, Spacing, Typography } from "../constants/theme";
import { PressableCard } from "./PressableCard";

interface ProdiActivitySectionProps {
  kegiatanList: KegiatanProdi[];
  onSelectKegiatan: (kegiatan: KegiatanProdi) => void;
}

export const ProdiActivitySection: React.FC<ProdiActivitySectionProps> = ({
  kegiatanList,
  onSelectKegiatan,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerTitleGroup}>
          <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Jadwal Kegiatan Prodi</Text>
        </View>
        <Text style={styles.sectionBadge}>{kegiatanList.length} Agenda</Text>
      </View>

      {kegiatanList.map((kegiatan) => {
        const isNew = (() => {
          const added = new Date(kegiatan.ditambahkanPada);
          const diffDays = (Date.now() - added.getTime()) / (1000 * 60 * 60 * 24);
          return diffDays <= 3;
        })();
        return (
          <PressableCard
            key={kegiatan.id}
            onPress={() => onSelectKegiatan(kegiatan)}
            accessibilityLabel={`Agenda prodi: ${kegiatan.judul}, tanggal ${kegiatan.tanggal}. Ketuk untuk melihat detail.`}
            accessibilityHint="Membuka detail kegiatan prodi"
            style={styles.activityCard}
          >
            <View style={styles.cardHeader}>
              <View style={styles.dateTag}>
                <Ionicons name="time-outline" size={12} color={Colors.primary} />
                <Text style={styles.dateText}>{kegiatan.tanggal}</Text>
                {isNew && <Text style={styles.newBadge}>Baru</Text>}
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={Colors.textMuted}
              />
            </View>

            <Text style={styles.activityTitle} numberOfLines={2}>
              {kegiatan.judul}
            </Text>

            <View style={styles.footerRow}>
              <View style={styles.locationGroup}>
                <Ionicons
                  name="location-outline"
                  size={13}
                  color={Colors.textMuted}
                />
                <Text style={styles.locationText} numberOfLines={1}>
                  {kegiatan.tempat}
                </Text>
              </View>
              <Text style={styles.viewDetailText}>Detail ›</Text>
            </View>
          </PressableCard>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  headerTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
  },
  sectionBadge: {
    ...Typography.captionMedium,
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activityCard: {
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  dateTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.primary,
  },
  activityTitle: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    marginRight: Spacing.sm,
  },
  locationText: {
    ...Typography.caption,
    color: Colors.textMuted,
    flex: 1,
  },
  viewDetailText: {
    ...Typography.captionMedium,
    color: Colors.primary,
  },
  newBadge: {
    ...Typography.captionMedium,
    color: Colors.textInverse,
    backgroundColor: Colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
});
