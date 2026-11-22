import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, MinTouchSize, Spacing } from '../../src/constants/theme';
import { StatusMK } from '../../src/types';
import {
  fetchMataKuliah,
  getStats,
  subscribeSimulationState,
} from '../../src/data/mataKuliah';
import { CourseItem } from '../../src/components/CourseItem';
import { SegmentedTabs } from '../../src/components/SegmentedTabs';
import { CourseListSkeleton } from '../../src/components/Skeleton';

export default function MataKuliahListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();

  // Initial tab from params, defaulting to 'belum_lulus' per PRD Section 6.1
  const initialTab: StatusMK =
    params.tab === 'lulus' || params.tab === 'ditempuh' || params.tab === 'belum_lulus'
      ? params.tab
      : 'belum_lulus';

  const [activeTab, setActiveTab] = useState<StatusMK>(initialTab);
  const [onlyWajib, setOnlyWajib] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState(getStats());
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Sync tab if URL param changes
  useEffect(() => {
    if (params.tab && (params.tab === 'lulus' || params.tab === 'ditempuh' || params.tab === 'belum_lulus')) {
      setActiveTab(params.tab);
    }
  }, [params.tab]);

  // Load courses
  const loadData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchMataKuliah();
      setCourses(data);
      setStats(getStats(data));
    } catch (err: any) {
      setLoadError(err.message || 'Data belum bisa dimuat');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeSimulationState(() => {
      loadData(true);
    });
    return unsubscribe;
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData(true);
  };

  // Filtered & sorted courses
  const displayedCourses = useMemo(() => {
    let list = courses.filter((c) => c.status === activeTab);

    if (onlyWajib) {
      list = list.filter((c) => c.wajib);
    }

    // Sort: wajib first, then ascending semester
    return list.sort((a, b) => {
      if (a.wajib !== b.wajib) {
        return a.wajib ? -1 : 1;
      }
      return a.semester - b.semester;
    });
  }, [courses, activeTab, onlyWajib]);

  // Summary calculation for the active tab (e.g. '3 mata kuliah · 9 SKS')
  const activeTabTotalSks = useMemo(() => {
    const list = courses.filter((c) => c.status === activeTab);
    return list.reduce((sum, c) => sum + c.sks, 0);
  }, [courses, activeTab]);

  const tabsData = [
    { key: 'belum_lulus' as StatusMK, label: 'Belum Lulus', count: stats.countBelumLulus },
    { key: 'ditempuh' as StatusMK, label: 'Sedang Ditempuh', count: stats.countDitempuh },
    { key: 'lulus' as StatusMK, label: 'Lulus', count: stats.countLulus },
  ];

  const handleCoursePress = (kode: string) => {
    router.push({
      pathname: '/mata-kuliah/[kode]',
      params: { kode },
    });
  };

  return (
    <View style={styles.container}>
      {/* Segmented Tabs (Counts match dashboard) */}
      <SegmentedTabs
        tabs={tabsData}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
        }}
      />

      {/* Filter and Summary Bar */}
      <View style={styles.filterBar}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            {courses.filter((c) => c.status === activeTab).length} mata kuliah · {activeTabTotalSks} SKS
          </Text>
        </View>

        {/* Filter 'Hanya wajib' (FR-03) */}
        <Pressable
          onPress={() => setOnlyWajib(!onlyWajib)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: onlyWajib }}
          accessibilityLabel="Filter hanya mata kuliah wajib"
          style={({ pressed }) => [
            styles.filterChip,
            onlyWajib && styles.filterChipActive,
            { opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <Ionicons
            name={onlyWajib ? 'checkbox' : 'square-outline'}
            size={16}
            color={onlyWajib ? Colors.primary : Colors.textSecondary}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.filterChipText, onlyWajib && styles.filterChipTextActive]}>
            Hanya wajib
          </Text>
        </Pressable>
      </View>

      {/* Main Content */}
      {loading ? (
        <CourseListSkeleton />
      ) : loadError ? (
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={56} color={Colors.status.belumLulus} />
          <Text style={styles.errorTitle}>Data belum bisa dimuat</Text>
          <Text style={styles.errorSubtitle}>
            Periksa koneksi internet kamu, lalu coba lagi.
          </Text>
          <Pressable
            onPress={() => loadData()}
            accessibilityRole="button"
            accessibilityLabel="Coba lagi memuat data"
            style={({ pressed }) => [
              styles.retryButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.retryButtonText}>Coba lagi</Text>
          </Pressable>
        </View>
      ) : displayedCourses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name={
              activeTab === 'belum_lulus'
                ? 'checkmark-done-circle-outline'
                : 'file-tray-outline'
            }
            size={56}
            color={activeTab === 'belum_lulus' ? Colors.status.lulus : Colors.textSecondary}
          />
          <Text style={styles.emptyTitle}>
            {onlyWajib
              ? 'Tidak ada mata kuliah wajib'
              : activeTab === 'belum_lulus'
              ? 'Tidak ada mata kuliah yang belum lulus'
              : activeTab === 'ditempuh'
              ? 'Tidak ada mata kuliah sedang ditempuh'
              : 'Tidak ada mata kuliah lulus'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {onlyWajib
              ? 'Tidak ditemukan mata kuliah berlabel wajib pada status ini.'
              : activeTab === 'belum_lulus'
              ? 'Semua mata kuliah yang pernah kamu ambil sudah lulus.'
              : 'Belum ada mata kuliah yang terdaftar pada kategori ini.'}
          </Text>

          {onlyWajib ? (
            <Pressable
              onPress={() => setOnlyWajib(false)}
              accessibilityRole="button"
              accessibilityLabel="Tampilkan semua mata kuliah"
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>Tampilkan semua</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push('/(tabs)/riwayat')}
              accessibilityRole="button"
              accessibilityLabel="Buka halaman Riwayat Studi"
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>Lihat Riwayat Studi</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <FlatList
          data={displayedCourses}
          keyExtractor={(item) => item.kode}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          renderItem={({ item }) => (
            <CourseItem
              course={item}
              onPress={() => handleCoursePress(item.kode)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryContainer: {
    flex: 1,
  },
  summaryText: {
    fontSize: FontSize.secondary,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minHeight: 36,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: FontSize.secondary,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: FontSize.sectionTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    maxWidth: 280,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    minHeight: MinTouchSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.body,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: FontSize.sectionTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  errorSubtitle: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    maxWidth: 280,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    minHeight: MinTouchSize,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.body,
    fontWeight: '600',
  },
});
