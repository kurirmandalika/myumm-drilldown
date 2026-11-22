import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusMK } from "../types";
import { Colors, Spacing, Typography } from "../constants/theme";
import { PressableCard } from "./PressableCard";

interface StatusSummaryCardProps {
  status: StatusMK;
  count: number;
  totalSks: number;
  onPress: () => void;
}

const STATUS_CONFIG: Record<
  StatusMK,
  {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    badgeBg: string;
    badgeText: string;
    borderColor: string;
    subText: string;
  }
> = {
  belum_lulus: {
    title: "Belum Lulus",
    icon: "alert-circle",
    badgeBg: Colors.status.belum_lulus.bg,
    badgeText: Colors.status.belum_lulus.text,
    borderColor: Colors.status.belum_lulus.border,
    subText: "Mata kuliah perlu diulang / perbaikan",
  },
  ditempuh: {
    title: "Sedang Ditempuh",
    icon: "time",
    badgeBg: Colors.status.ditempuh.bg,
    badgeText: Colors.status.ditempuh.text,
    borderColor: Colors.status.ditempuh.border,
    subText: "Mata kuliah semester aktif saat ini",
  },
  lulus: {
    title: "Lulus",
    icon: "checkmark-circle",
    badgeBg: Colors.status.lulus.bg,
    badgeText: Colors.status.lulus.text,
    borderColor: Colors.status.lulus.border,
    subText: "Mata kuliah telah memenuhi syarat lulus",
  },
};

export const StatusSummaryCard: React.FC<StatusSummaryCardProps> = ({
  status,
  count,
  totalSks,
  onPress,
}) => {
  const config = STATUS_CONFIG[status];

  return (
    <PressableCard
      onPress={onPress}
      accessibilityLabel={`Kartu ringkasan ${config.title}, ${count} mata kuliah, total ${totalSks} SKS. Ketuk untuk melihat rincian.`}
      accessibilityHint={`Membuka daftar mata kuliah ${config.title}`}
      style={[styles.card, { borderColor: config.borderColor }]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <View style={[styles.iconWrapper, { backgroundColor: config.badgeBg }]}>
            <Ionicons name={config.icon} size={22} color={config.badgeText} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>{config.title}</Text>
            <Text style={styles.cardSubtitle}>{config.subText}</Text>
          </View>
        </View>

        {/* Angka jumlah mata kuliah */}
        <View style={[styles.countBadge, { backgroundColor: config.badgeBg }]}>
          <Text style={[styles.countNumber, { color: config.badgeText }]}>
            {count}
          </Text>
          <Text style={[styles.countUnit, { color: config.badgeText }]}>
            MK
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Baris bawah: SKS info & Affordance "Lihat rincian ›" */}
      <View style={styles.bottomRow}>
        <Text style={styles.sksText}>Total {totalSks} SKS</Text>
        <View style={styles.affordanceContainer}>
          <Text style={[styles.affordanceText, { color: config.badgeText }]}>
            Lihat rincian
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={config.badgeText}
            style={styles.chevron}
          />
        </View>
      </View>
    </PressableCard>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: Spacing.md,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  countBadge: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    minWidth: 54,
  },
  countNumber: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 26,
  },
  countUnit: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.md,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sksText: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
  },
  affordanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  affordanceText: {
    ...Typography.captionMedium,
    marginRight: 2,
  },
  chevron: {
    marginTop: 1,
  },
});
