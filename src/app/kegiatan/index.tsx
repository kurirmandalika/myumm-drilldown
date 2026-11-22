import React, { useMemo } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  RefreshControl,
  Text,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAcademic } from "../../context/AcademicContext";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { PressableCard } from "../../components/PressableCard";
import { KegiatanProdi } from "../../types";
import { formatWaktuRelative, getLabelKegiatan, getAllPengingat } from "../../utils/pengingat";

type TabType = "akanDatang" | "selesai";
type FilterType = "Semua" | "Seminar" | "Workshop" | "Kuliah Tamu" | "Lomba" | "Akademik";

function getGroupLabel(k: KegiatanProdi): string {
  const now = new Date();
  const mulai = new Date(k.mulai);
  const diffMs = mulai.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) {
    // Selesai
    if (diffDays > -7) return "Minggu lalu";
    if (diffDays > -30) return "Bulan ini";
    return "Lebih lama";
  }
  if (diffDays <= 7) return "Minggu ini";
  if (diffDays <= 14) return "Minggu depan";
  if (diffDays <= 30) return "Bulan ini";
  return "Nanti";
}

const GROUP_ORDER_UPCOMING = ["Minggu ini", "Minggu depan", "Bulan ini", "Nanti"];
const GROUP_ORDER_PAST = ["Minggu lalu", "Bulan ini", "Lebih lama"];

export default function KegiatanListScreen() {
  const router = useRouter();
  const {
    kegiatanProdiList,
    isKegiatanLoading,
    kegiatanError,
    kegiatanLastRefresh,
    hasCachedKegiatan,
    refreshKegiatan,
  } = useAcademic();

  const [activeTab, setActiveTab] = React.useState<TabType>("akanDatang");
  const [filter, setFilter] = React.useState<FilterType>("Semua");
  const [pengingatIds, setPengingatIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    getAllPengingat().then((list) => {
      setPengingatIds(new Set(list.map((p) => p.kegiatanId)));
    });
  }, [kegiatanProdiList]);

  const categories: FilterType[] = ["Semua", "Seminar", "Workshop", "Kuliah Tamu", "Lomba", "Akademik"];

  const handleSelectKegiatan = (kegiatan: KegiatanProdi) => {
    router.push({ pathname: "/kegiatan/[id]", params: { id: kegiatan.id } });
  };

  const handleKegiatanSaya = () => {
    router.push("/kegiatan/saya" as any);
  };

  const { grouped, counts } = useMemo(() => {
    const now = new Date();
    const upcoming = kegiatanProdiList
      .filter((k) => new Date(k.mulai) >= now)
      .sort((a, b) => new Date(a.mulai).getTime() - new Date(b.mulai).getTime());
    const past = kegiatanProdiList
      .filter((k) => new Date(k.mulai) < now)
      .sort((a, b) => new Date(b.mulai).getTime() - new Date(a.mulai).getTime());

    const source = activeTab === "akanDatang" ? upcoming : past;
    const filtered = source.filter(
      (k) => filter === "Semua" || k.kategori === filter
    );

    const groups: Record<string, KegiatanProdi[]> = {};
    for (const k of filtered) {
      const label = getGroupLabel(k);
      if (!groups[label]) groups[label] = [];
      groups[label].push(k);
    }

    const groupOrder = activeTab === "akanDatang" ? GROUP_ORDER_UPCOMING : GROUP_ORDER_PAST;

    return {
      grouped: groupOrder
        .filter((g) => groups[g])
        .map((g) => ({ label: g, items: groups[g] })),
      counts: { akanDatang: upcoming.length, selesai: past.length },
    };
  }, [kegiatanProdiList, activeTab, filter]);

  const diperbarui = formatWaktuRelative(kegiatanLastRefresh);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isKegiatanLoading}
          onRefresh={refreshKegiatan}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Jadwal Kegiatan Prodi</Text>
          <Text style={styles.subtitle}>Diperbarui {diperbarui}</Text>
        </View>
        <Pressable
          style={styles.sayaBtn}
          onPress={handleKegiatanSaya}
          accessibilityRole="button"
          accessibilityLabel="Buka Kegiatan Saya"
        >
          <Ionicons name="notifications-outline" size={16} color={Colors.primary} />
          <Text style={styles.sayaBtnText}>Saya</Text>
        </Pressable>
      </View>

      {/* Banner cache (FR-08) */}
      {hasCachedKegiatan && kegiatanError && (
        <View style={styles.cacheBanner}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.secondary} />
          <Text style={styles.cacheBannerText}>
            Menampilkan data terakhir (diperbarui {diperbarui}).{" "}
          </Text>
          <Pressable onPress={refreshKegiatan}>
            <Text style={styles.cacheRetry}>Coba lagi</Text>
          </Pressable>
        </View>
      )}

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabItem, activeTab === "akanDatang" && styles.tabItemActive]}
          onPress={() => setActiveTab("akanDatang")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "akanDatang" }}
        >
          <Text style={activeTab === "akanDatang" ? styles.tabActive : styles.tabInactive}>
            Akan Datang ({counts.akanDatang})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabItem, activeTab === "selesai" && styles.tabItemActive]}
          onPress={() => setActiveTab("selesai")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "selesai" }}
        >
          <Text style={activeTab === "selesai" ? styles.tabActive : styles.tabInactive}>
            Selesai ({counts.selesai})
          </Text>
        </Pressable>
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <View style={styles.filterRow}>
          {categories.map((cat) => (
            <Pressable
              key={cat}
              style={[styles.filterChip, filter === cat && styles.filterChipActive]}
              onPress={() => setFilter(cat)}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === cat }}
            >
              <Text style={[styles.filterText, filter === cat && styles.filterTextActive]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* State: Error tanpa cache */}
      {kegiatanError && !hasCachedKegiatan ? (
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.errorTitle}>Gagal Memuat Kegiatan</Text>
          <Text style={styles.errorDesc}>{kegiatanError}</Text>
          <Pressable style={styles.retryBtn} onPress={refreshKegiatan} accessibilityRole="button">
            <Ionicons name="refresh-outline" size={16} color={Colors.textInverse} />
            <Text style={styles.retryBtnText}>Coba lagi</Text>
          </Pressable>
        </View>
      ) : isKegiatanLoading && kegiatanProdiList.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Memuat jadwal kegiatan...</Text>
        </View>
      ) : grouped.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Tidak Ada Kegiatan</Text>
          <Text style={styles.emptyDesc}>
            {activeTab === "akanDatang"
              ? "Belum ada kegiatan akan datang. Tarik layar ke bawah untuk memperbarui."
              : "Belum ada kegiatan yang sudah selesai."}
          </Text>
          {activeTab === "selesai" && (
            <Pressable
              style={styles.retryBtn}
              onPress={() => setActiveTab("akanDatang")}
              accessibilityRole="button"
            >
              <Text style={styles.retryBtnText}>Lihat Akan Datang</Text>
            </Pressable>
          )}
        </View>
      ) : (
        grouped.map(({ label, items }) => (
          <View key={label}>
            <Text style={styles.groupLabel}>{label}</Text>
            {items.map((k) => {
              const badge = getLabelKegiatan(k.mulai, k.ditambahkanPada);
              return (
                <PressableCard
                  key={k.id}
                  onPress={() => handleSelectKegiatan(k)}
                  style={styles.activityCard}
                  accessibilityLabel={`Kegiatan: ${k.judul}, tanggal ${k.tanggal}. Ketuk untuk melihat detail.`}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.dateTag}>
                      <Ionicons name="time-outline" size={12} color={Colors.primary} />
                      <Text style={styles.dateText}>{k.tanggal}</Text>
                      {badge && (
                        <View
                          style={[
                            styles.badgeContainer,
                            badge === "Hari ini" && styles.badgeHariIni,
                            badge === "Besok" && styles.badgeBesok,
                            badge === "Baru" && styles.badgeBaru,
                          ]}
                        >
                          <Text style={styles.badgeText}>{badge}</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.kategoriTag}>
                      <Text style={styles.kategoriText}>{k.kategori}</Text>
                    </View>
                    {pengingatIds.has(k.id) && (
                      <View style={styles.bellBadge}>
                        <Ionicons name="notifications" size={13} color={Colors.primary} />
                      </View>
                    )}
                    <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                  </View>
                  <Text style={styles.activityTitle} numberOfLines={2}>{k.judul}</Text>
                  <View style={styles.footerRow}>
                    <View style={styles.locationGroup}>
                      <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
                      <Text style={styles.locationText} numberOfLines={1}>{k.tempat}</Text>
                    </View>
                    <Text style={styles.viewDetailText}>Detail ›</Text>
                  </View>
                </PressableCard>
              );
            })}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  contentContainer: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  title: { ...Typography.title, color: Colors.textPrimary },
  subtitle: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  sayaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    minHeight: 44,
  },
  sayaBtnText: { ...Typography.captionMedium, color: Colors.primary },
  cacheBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondaryLight,
    borderRadius: 8,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    flexWrap: "wrap",
  },
  cacheBannerText: { ...Typography.caption, color: Colors.secondary, flex: 1, marginLeft: 4 },
  cacheRetry: { ...Typography.captionMedium, color: Colors.primary },
  tabBar: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 10,
    marginBottom: Spacing.sm,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabItem: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 8 },
  tabItemActive: { backgroundColor: Colors.primary },
  tabActive: { ...Typography.captionMedium, color: Colors.textInverse },
  tabInactive: { ...Typography.captionMedium, color: Colors.textMuted },
  filterScroll: { marginBottom: Spacing.sm },
  filterRow: { flexDirection: "row", paddingVertical: 2 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    marginRight: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 44,
    justifyContent: "center",
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { ...Typography.caption, color: Colors.textSecondary },
  filterTextActive: { color: Colors.textInverse },
  groupLabel: {
    ...Typography.captionMedium,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
    flexWrap: "wrap",
    gap: 4,
  },
  dateTag: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateText: { fontSize: 11, fontWeight: "600", color: Colors.primary },
  badgeContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  badgeHariIni: { backgroundColor: "#10B981" },
  badgeBesok: { backgroundColor: "#3B82F6" },
  badgeBaru: { backgroundColor: Colors.accent },
  badgeText: { ...Typography.captionMedium, color: Colors.textInverse },
  kategoriTag: {
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bellBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  kategoriText: { ...Typography.captionMedium, color: Colors.secondary, fontSize: 10 },
  activityTitle: { ...Typography.bodyMedium, color: Colors.textPrimary, marginBottom: 8 },
  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  locationGroup: { flexDirection: "row", alignItems: "center", gap: 4, flex: 1, marginRight: Spacing.sm },
  locationText: { ...Typography.caption, color: Colors.textMuted, flex: 1 },
  viewDetailText: { ...Typography.captionMedium, color: Colors.primary },
  errorContainer: {
    alignItems: "center",
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },
  errorTitle: { ...Typography.subtitle, color: Colors.textPrimary, marginTop: Spacing.md },
  errorDesc: { ...Typography.body, color: Colors.textMuted, textAlign: "center", marginTop: Spacing.xs, marginBottom: Spacing.lg },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: 8,
    minHeight: 44,
  },
  retryBtnText: { ...Typography.captionMedium, color: Colors.textInverse },
  loadingContainer: { alignItems: "center", paddingVertical: Spacing.xxxl },
  loadingText: { ...Typography.body, color: Colors.textMuted },
  emptyContainer: { alignItems: "center", paddingVertical: Spacing.xxxl, paddingHorizontal: Spacing.lg },
  emptyTitle: { ...Typography.subtitle, color: Colors.textPrimary, marginTop: Spacing.md },
  emptyDesc: { ...Typography.body, color: Colors.textMuted, textAlign: "center", marginTop: Spacing.xs, marginBottom: Spacing.lg },
});
