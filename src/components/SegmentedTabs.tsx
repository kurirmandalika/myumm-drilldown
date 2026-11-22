import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { StatusMK } from "../types";
import { Colors, Spacing, Typography } from "../constants/theme";

interface TabItem {
  id: StatusMK;
  label: string;
  count: number;
}

interface SegmentedTabsProps {
  activeTab: StatusMK;
  onTabChange: (tab: StatusMK) => void;
  counts: {
    lulus: number;
    belum_lulus: number;
    ditempuh: number;
  };
}

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const tabs: TabItem[] = [
    {
      id: "belum_lulus",
      label: "Belum Lulus",
      count: counts.belum_lulus,
    },
    {
      id: "ditempuh",
      label: "Ditempuh",
      count: counts.ditempuh,
    },
    {
      id: "lulus",
      label: "Lulus",
      count: counts.lulus,
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`Tab ${tab.label}, ${tab.count} mata kuliah`}
            style={[
              styles.tabButton,
              isActive && styles.activeTabButton,
              isActive && tab.id === "belum_lulus" && styles.activeTabBelumLulus,
              isActive && tab.id === "ditempuh" && styles.activeTabDitempuh,
              isActive && tab.id === "lulus" && styles.activeTabLulus,
            ]}
          >
            <Text
              style={[
                styles.tabLabel,
                isActive && styles.activeTabLabel,
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
            <View
              style={[
                styles.countBadge,
                isActive && styles.activeCountBadge,
              ]}
            >
              <Text
                style={[
                  styles.countText,
                  isActive && styles.activeCountText,
                ]}
              >
                {tab.count}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
    padding: 4,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 8,
    gap: 6,
  },
  activeTabButton: {
    backgroundColor: Colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeTabBelumLulus: {
    borderBottomWidth: 2.5,
    borderBottomColor: Colors.status.belum_lulus.text,
  },
  activeTabDitempuh: {
    borderBottomWidth: 2.5,
    borderBottomColor: Colors.status.ditempuh.text,
  },
  activeTabLulus: {
    borderBottomWidth: 2.5,
    borderBottomColor: Colors.status.lulus.text,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  activeTabLabel: {
    color: Colors.textPrimary,
    fontWeight: "700",
  },
  countBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  activeCountBadge: {
    backgroundColor: Colors.secondaryLight,
  },
  countText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  activeCountText: {
    color: Colors.primary,
  },
});
