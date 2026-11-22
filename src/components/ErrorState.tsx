import React from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "../constants/theme";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

/**
 * Komponen State Gagal dengan pesan penyebab dan tombol aksi Coba Lagi (FR-07, UXR-06)
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Gagal Memuat Data",
  message = "Terjadi gangguan saat mengambil data dari server kampus. Periksa koneksi internet Anda dan coba lagi.",
  onRetry,
  isRetrying = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="cloud-offline-outline" size={40} color={Colors.primary} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <Pressable
        onPress={onRetry}
        disabled={isRetrying}
        accessibilityRole="button"
        accessibilityLabel="Coba lagi memuat data"
        style={({ pressed }) => [
          styles.retryButton,
          pressed && styles.retryButtonPressed,
          isRetrying && styles.retryButtonDisabled,
        ]}
      >
        {isRetrying ? (
          <ActivityIndicator size="small" color={Colors.textInverse} />
        ) : (
          <>
            <Ionicons
              name="refresh-outline"
              size={18}
              color={Colors.textInverse}
            />
            <Text style={styles.retryText}>Coba Lagi</Text>
          </>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.status.belum_lulus.border,
    marginVertical: Spacing.md,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.status.belum_lulus.bg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Spacing.xl,
    maxWidth: 300,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    minHeight: 44,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  retryButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  retryButtonDisabled: {
    opacity: 0.6,
  },
  retryText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: "700",
  },
});
