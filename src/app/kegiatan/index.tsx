import React from "react";
import { ScrollView, View, StyleSheet, RefreshControl, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAcademic } from "../../context/AcademicContext";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { ProdiActivitySection } from "../../components/ProdiActivitySection";
import { PressableCard } from "../../components/PressableCard";

export default function KegiatanListScreen() {
  const router = useRouter();
  const { kegiatanProdiList, isLoading, error, refreshData } = useAcademic();

  const [activeTab, setActiveTab] = React.useState<'akanDatang' | 'selesai'>('akanDatang');
  const [filter, setFilter] = React.useState<string>('Semua');

  const handleSelectKegiatan = (kegiatan: any) => {
    router.push({ pathname: "/kegiatan/[id]", params: { id: kegiatan.id } });
  };

  const filteredList = kegiatanProdiList.filter((k) => {
    const now = new Date();
    const kegiatanDate = new Date(k.tanggal);
    const isUpcoming = kegiatanDate >= now;
    const tabMatch = activeTab === 'akanDatang' ? isUpcoming : !isUpcoming;
    const filterMatch = filter === 'Semua' || k.kategori === filter;
    return tabMatch && filterMatch;
  });

  const categories = ['Semua', 'Seminar', 'Workshop', 'Kuliah Tamu', 'Lomba', 'Akademik'];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refreshData} tintColor={Colors.primary} colors={[Colors.primary]} />
      }
    >
      <View style={styles.header}>
        <Ionicons name="calendar-outline" size={24} color={Colors.primary} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Jadwal Kegiatan Prodi</Text>
          <Text style={styles.subtitle}>Semua agenda kegiatan prodi</Text>
        </View>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <Pressable style={styles.tabItem} onPress={() => setActiveTab('akanDatang')}>
          <Text style={activeTab === 'akanDatang' ? styles.tabActive : styles.tabInactive}>Akan Datang</Text>
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => setActiveTab('selesai')}>
          <Text style={activeTab === 'selesai' ? styles.tabActive : styles.tabInactive}>Selesai</Text>
        </Pressable>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {categories.map((cat) => (
          <Pressable key={cat} style={[styles.filterChip, filter === cat && styles.filterChipActive]} onPress={() => setFilter(cat)}>
            <Text style={styles.filterText}>{cat}</Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      {error ? (
        <Text style={styles.error}>Gagal memuat data kegiatan.</Text>
      ) : isLoading && filteredList.length === 0 ? (
        <Text style={styles.loading}>Memuat...</Text>
      ) : filteredList.length === 0 ? (
        <Text style={styles.empty}>Tidak ada kegiatan untuk ditampilkan.</Text>
      ) : (
        filteredList.map((k) => (
          <PressableCard key={k.id} onPress={() => handleSelectKegiatan(k)} style={styles.activityCard}>
            <View style={styles.cardHeader}>
              <View style={styles.dateTag}>
                <Ionicons name="time-outline" size={12} color={Colors.primary} />
                <Text style={styles.dateText}>{k.tanggal}</Text>
                {new Date(k.ditambahkanPada).getTime() && (new Date().getTime() - new Date(k.ditambahkanPada).getTime()) / (1000*60*60*24) <= 3 && (
                  <Text style={styles.newBadge}>Baru</Text>
                )}
              </View>
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
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  contentContainer: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  header: { flexDirection: "row", alignItems: "center", marginBottom: Spacing.lg },
  titleContainer: { marginLeft: Spacing.sm },
  title: { ...Typography.title, color: Colors.textPrimary },
  subtitle: { ...Typography.caption, color: Colors.textMuted },
  tabBar: { flexDirection: "row", justifyContent: "center", marginBottom: Spacing.md },
  tabItem: { marginHorizontal: Spacing.sm },
  tabActive: { ...Typography.subtitle, color: Colors.primary },
  tabInactive: { ...Typography.subtitle, color: Colors.textMuted },
  filterRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: Spacing.md },
  filterChip: { paddingHorizontal: Spacing.sm, paddingVertical: 4, backgroundColor: Colors.surface, borderRadius: 12, margin: 2 },
  filterChipActive: { backgroundColor: Colors.primaryLight },
  filterText: { ...Typography.caption, color: Colors.textPrimary },
  activityCard: { backgroundColor: Colors.card, borderRadius: 12, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  dateTag: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateText: { fontSize: 11, fontWeight: "600", color: Colors.primary },
  newBadge: { ...Typography.captionMedium, color: Colors.textInverse, backgroundColor: Colors.accent, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 4 },
  activityTitle: { ...Typography.bodyMedium, color: Colors.textPrimary, marginBottom: 8 },
  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  locationGroup: { flexDirection: "row", alignItems: "center", gap: 4, flex: 1, marginRight: Spacing.sm },
  locationText: { ...Typography.caption, color: Colors.textMuted, flex: 1 },
  viewDetailText: { ...Typography.captionMedium, color: Colors.primary },
  error: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.lg },
  loading: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.lg },
  empty: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.lg },
});