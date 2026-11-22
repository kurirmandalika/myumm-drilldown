import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAcademic } from "../../context/AcademicContext";
import { Colors, Spacing, Typography } from "../../constants/theme";

export default function DetailKegiatanProdiScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { kegiatanProdiList } = useAcademic();

  const kegiatan = kegiatanProdiList.find((k) => k.id === id);

  if (!kegiatan) {
    return (
      <View style={styles.notFoundContainer}>
        <Stack.Screen options={{ title: "Kegiatan Prodi" }} />
        <Ionicons
          name="calendar-clear-outline"
          size={56}
          color={Colors.primary}
        />
        <Text style={styles.notFoundTitle}>Kegiatan Tidak Ditemukan</Text>
        <Text style={styles.notFoundDesc}>
          Informasi agenda prodi yang Anda pilih tidak tersedia atau telah
          berakhir.
        </Text>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke Beranda"
        >
          <Text style={styles.backButtonText}>Kembali ke Beranda</Text>
        </Pressable>
      </View>
    );
  }

  const handleAddToCalendar = () => {
    Alert.alert(
      "Pengingat Disimpan",
      `Agenda "${kegiatan.judul}" pada ${kegiatan.tanggal} telah ditambahkan ke pengingat kalender ponsel Anda.`
    );
  };

  const handleShare = () => {
    Alert.alert(
      "Bagikan Agenda",
      `Tautan informasi agenda prodi "${kegiatan.judul}" telah disalin ke papan klip.`
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          title: "Detail Kegiatan Prodi",
          headerBackTitle: "Kembali",
        }}
      />

      {/* Main Card */}
      <View style={styles.mainCard}>
        {/* Badge Penyelenggara */}
        <View style={styles.organizerRow}>
          <View style={styles.organizerBadge}>
            <Ionicons name="business" size={13} color={Colors.primary} />
            <Text style={styles.organizerText}>{kegiatan.penyelenggara}</Text>
          </View>
        </View>

        {/* Judul Kegiatan */}
        <Text style={styles.title}>{kegiatan.judul}</Text>

        {/* Waktu & Lokasi Detail Box */}
        <View style={styles.detailBox}>
          {/* Tanggal */}
          <View style={styles.metaRow}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="calendar"
                size={18}
                color={Colors.primary}
              />
            </View>
            <View style={styles.metaTextCol}>
              <Text style={styles.metaLabel}>Tanggal Pelaksanaan</Text>
              <Text style={styles.metaValue}>{kegiatan.tanggal}</Text>
            </View>
          </View>

          <View style={styles.metaDivider} />

          {/* Waktu */}
          <View style={styles.metaRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="time" size={18} color={Colors.primary} />
            </View>
            <View style={styles.metaTextCol}>
              <Text style={styles.metaLabel}>Waktu Kegiatan</Text>
              <Text style={styles.metaValue}>{kegiatan.waktu}</Text>
            </View>
          </View>

          <View style={styles.metaDivider} />

          {/* Tempat */}
          <View style={styles.metaRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={18} color={Colors.primary} />
            </View>
            <View style={styles.metaTextCol}>
              <Text style={styles.metaLabel}>Tempat / Media</Text>
              <Text style={styles.metaValue}>{kegiatan.tempat}</Text>
            </View>
          </View>
        </View>

        {/* Deskripsi Lengkap */}
        <View style={styles.descSection}>
          <Text style={styles.sectionHeaderTitle}>Deskripsi Kegiatan</Text>
          <Text style={styles.descContent}>{kegiatan.deskripsi}</Text>
        </View>

        {/* Tombol Aksi */}
        <View style={styles.actionButtonsRow}>
          <Pressable
            style={styles.calendarBtn}
            onPress={handleAddToCalendar}
            accessibilityRole="button"
            accessibilityLabel="Simpan agenda ke kalender"
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={Colors.textInverse}
            />
            <Text style={styles.calendarBtnText}>Simpan Pengingat</Text>
          </Pressable>

          <Pressable
            style={styles.shareBtn}
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel="Bagikan info kegiatan prodi"
          >
            <Ionicons
              name="share-social-outline"
              size={18}
              color={Colors.primary}
            />
          </Pressable>
        </View>
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
  mainCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  organizerRow: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
  },
  organizerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  organizerText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.primary,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    lineHeight: 26,
    marginBottom: Spacing.lg,
  },
  detailBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  metaTextCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  metaValue: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  metaDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 4,
  },
  descSection: {
    marginBottom: Spacing.xl,
  },
  sectionHeaderTitle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  descContent: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  calendarBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    minHeight: 44,
  },
  calendarBtnText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: "600",
  },
  shareBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
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
  notFoundDesc: {
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
