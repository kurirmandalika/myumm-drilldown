import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors, FontSize, MinTouchSize, Spacing } from '../constants/theme';
import { StatusMK } from '../types';

interface TabItem {
  key: StatusMK;
  label: string;
  count: number;
}

interface SegmentedTabsProps {
  tabs: TabItem[];
  activeTab: StatusMK;
  onTabChange: (tab: StatusMK) => void;
}

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabChange(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tab.label}, ${tab.count} mata kuliah`}
              style={({ pressed }) => [
                styles.tabButton,
                isActive && styles.activeTabButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {tab.label}
              </Text>
              <View
                style={[
                  styles.countBadge,
                  isActive ? styles.activeCountBadge : styles.inactiveCountBadge,
                ]}
              >
                <Text
                  style={[
                    styles.countBadgeText,
                    isActive ? styles.activeCountBadgeText : styles.inactiveCountBadgeText,
                  ]}
                >
                  {tab.count}
                </Text>
              </View>
              {isActive && <View style={styles.activeIndicator} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  scrollContent: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.sm,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    minHeight: MinTouchSize,
    position: 'relative',
    marginRight: Spacing.xs,
  },
  activeTabButton: {},
  tabLabel: {
    fontSize: FontSize.body,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginRight: 6,
  },
  activeTabLabel: {
    fontWeight: '700',
    color: Colors.primary,
  },
  countBadge: {
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCountBadge: {
    backgroundColor: Colors.primaryLight,
  },
  inactiveCountBadge: {
    backgroundColor: '#EEEEEE',
  },
  countBadgeText: {
    fontSize: FontSize.badge,
    fontWeight: '700',
  },
  activeCountBadgeText: {
    color: Colors.primary,
  },
  inactiveCountBadgeText: {
    color: Colors.textSecondary,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: Spacing.md,
    right: Spacing.md,
    height: 3,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
