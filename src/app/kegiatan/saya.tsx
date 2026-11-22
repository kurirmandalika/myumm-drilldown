import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  RefreshControl,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAcademic } from "../../context/AcademicContext";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { getAllPengingat, formatWaktuPengingat } from "../../utils/pengingat";
import { Pengingat, KegiatanProdi } from "../../types";
import { PressableCard } from "../../components/PressableCard";

export default function KegiatanSayaScreen() {
  const router = useRouter();
  const { kegiatanProdiList } = useAcademic();

  const [pengingats, setPengingats] = useState<Pengingat[]>([]);
  const [loading, setLoading] = useState(true);

  const muatPengingat = useCallback(async () => {
    setLoading(true);
    const all = await getAllPengingat();
    setPengingats(all);
    setLoading(false);
  }, []);

  useEffect(() => { muatPengingat(); }, [muatPengingat]);

  // Gabungkan pengingat dengan data kegiatan, sort by tanggal (terdekat dulu)
  const kegiatanDenganPengingat: Array<{ kegiatan: KegiatanProdi; pengingat: Pengingat }> =
    pengingats
      .map((p) => {
        const kegiatan = kegiatanProdiList.find((k) => k.id === p.kegiatanId);
        return kegiatan ? { kegiatan, pengingat: p } : null;
      })
      .filter((x): x is { kegiatan: KegiatanProdi; pengingat: Pengingat } => x !== null)
      .sort(
        (a, b) =>
          new Date(a.kegiatan.mulai).getTime() - new Date(b.kegiatan.mulai).getTime()
      );

  return (
    <>
      <Stack.Screen options={{ title: "Kegiatan Saya", headerBackTitle: "Kembali" }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={muatPengingat} tintColor={Colors.primary} />
        }
      >
        <Text style={styles.subtitle}>
          Kegiatan yang kamu beri pengingat akan tampil di sini.
        </Text>

        {loading ? (
          <Text style={styles.loadingText}>Memuat...</Text>
        ) : kegiatanDenganPengingat.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Belum Ada Pengingat</Text>
            <Text style={styles.emptyDesc}>
              Kamu belum menyimpan pengingat untuk kegiatan apapun.
            </Text>
            <Pressable
              style={styles.exploreBtn}
              onPress={() => router.push("/kegiatan" as any)}
              accessibilityRole="button"
              accessibilityLabel="Jelajahi kegiatan"
            >
              <Ionicons name="calendar-outline" size={16} color={Colors.textInverse} />
              <Text style={styles.exploreBtnText}>Jelajahi kegiatan</Text>
            </Pressable>
          </View>
        ) : (
          kegiatanDenganPengingat.map(({ kegiatan, pengingat }) => (
            <PressableCard
              key={kegiatan.id}
              onPress={() =>
                router.push({ pathname: "/kegiatan/[id]", params: { id: kegiatan.id } })
              }
              style={styles.card}
              accessibilityLabel={`Kegiatan: ${kegiatan.judul}. Pengingat ${formatWaktuPengingat(pengingat.waktu)}.`}
            >
              <View style={styles.cardHeader}>
                <View style={styles.penginatBadge}>
                  <Ionicons name="notifications" size={12} color={Colors.primary} />
                  <Text style={styles.penginatText}>
                    Diingatkan {formatWaktuPengingat(pengingat.waktu)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </View>
              <Text style={styles.judulText} numberOfLines={2}>{kegiatan.judul}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.metaText}>{kegiatan.tanggal}</Text>
                <Ionicons name="location-outline" size={13} color={Colors.textMuted} style={styles.metaIcon} />
                <Text style={styles.metaText} numberOfLines={1}>{kegiatan.tempat}</Text>
              </View>
            </PressableCard>
          ))
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  contentContainer: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  subtitle: { ...Typography.caption, color: Colors.textMuted, marginBottom: Spacing.lg },
  loadingText: { ...Typography.body, color: Colors.textMuted, textAlign: "center", marginTop: Spacing.xl },
  emptyContainer: { alignItems: "center", paddingVertical: Spacing.xxxl, paddingHorizontal: Spacing.lg },
  emptyTitle: { ...Typography.subtitle, color: Colors.textPrimary, marginTop: Spacing.md },
  emptyDesc: { ...Typography.body, color: Colors.textMuted, textAlign: "center", marginTop: Spacing.xs, marginBottom: Spacing.lg },
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderRadius: 8,
    minHeight: 44,
  },
  exploreBtnText: { ...Typography.bodyMedium, color: Colors.textInverse },
  card: {
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
    marginBottom: 8,
  },
  penginatBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  penginatText: { ...Typography.captionMedium, color: Colors.primary },
  judulText: { ...Typography.bodyMedium, color: Colors.textPrimary, marginBottom: 8 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, flexWrap: "wrap" },
  metaIcon: { marginLeft: 8 },
  metaText: { ...Typography.caption, color: Colors.textMuted },
});
