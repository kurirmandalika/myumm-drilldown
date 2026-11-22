import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "../constants/theme";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

/**
 * Komponen State Kosong dengan pesan informatif dan satu aksi lanjutan (FR-07, UXR-06)
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "file-tray-outline",
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={36} color={Colors.primary} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
        >
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color={Colors.textInverse}
            style={styles.actionIcon}
          />
        </Pressable>
      )}

      {secondaryActionLabel && onSecondaryAction && (
        <Pressable
          onPress={onSecondaryAction}
          accessibilityRole="button"
          accessibilityLabel={secondaryActionLabel}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>{secondaryActionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 6,
  },
  description: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Spacing.lg,
    maxWidth: 280,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minHeight: 44,
  },
  actionButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  actionButtonText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: "600",
  },
  actionIcon: {
    marginLeft: 6,
  },
  secondaryButton: {
    marginTop: Spacing.sm,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
});
