import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors, Spacing } from "../constants/theme";

export const CourseSkeleton: React.FC = () => {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.topRow}>
        <View style={styles.codePlaceholder} />
        <View style={styles.tagPlaceholder} />
      </View>
      <View style={styles.titlePlaceholder} />
      <View style={styles.titlePlaceholderShort} />
      <View style={styles.bottomRow}>
        <View style={styles.metaPlaceholder} />
        <View style={styles.badgePlaceholder} />
      </View>
    </View>
  );
};

export const DashboardCardSkeleton: React.FC = () => {
  return (
    <View style={styles.dashCard}>
      <View style={styles.dashTopRow}>
        <View style={styles.dashIconPlaceholder} />
        <View style={styles.dashTitlePlaceholder} />
        <View style={styles.dashBadgePlaceholder} />
      </View>
      <View style={styles.dashDivider} />
      <View style={styles.dashBottomRow}>
        <View style={styles.dashMetaPlaceholder} />
        <View style={styles.dashActionPlaceholder} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  codePlaceholder: {
    width: 60,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
  tagPlaceholder: {
    width: 48,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#EDF2F7",
  },
  titlePlaceholder: {
    width: "80%",
    height: 16,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
    marginBottom: 6,
  },
  titlePlaceholderShort: {
    width: "50%",
    height: 14,
    borderRadius: 4,
    backgroundColor: "#EDF2F7",
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaPlaceholder: {
    width: 90,
    height: 14,
    borderRadius: 4,
    backgroundColor: "#EDF2F7",
  },
  badgePlaceholder: {
    width: 36,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#E2E8F0",
  },
  dashCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dashTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dashIconPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    marginRight: Spacing.md,
  },
  dashTitlePlaceholder: {
    flex: 1,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
  dashBadgePlaceholder: {
    width: 50,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#EDF2F7",
    marginLeft: Spacing.md,
  },
  dashDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.md,
  },
  dashBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dashMetaPlaceholder: {
    width: 80,
    height: 14,
    borderRadius: 4,
    backgroundColor: "#EDF2F7",
  },
  dashActionPlaceholder: {
    width: 90,
    height: 14,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
});
