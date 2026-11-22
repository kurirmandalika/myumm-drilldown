import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, MinTouchSize, Shadows, Spacing } from '../../src/constants/theme';
import { MataKuliah } from '../../src/types';
import {
  fetchMataKuliah,
  getStats,
  subscribeSimulationState,
} from '../../src/data/mataKuliah';
import { CourseItem } from '../../src/components/CourseItem';
import { Skeleton } from '../../src/components/Skeleton';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function RiwayatStudiScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState<MataKuliah[]>([]);
  const [stats, setStats] = useState(getStats());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Expanded semester keys (default: all expanded)
  const [expandedSemesters, setExpandedSemesters] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
  });

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

  const toggleSemester = (sem: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSemesters((prev) => ({
      ...prev,
      [sem]: !prev[sem],
    }));
  };

  // Group courses by semester
  const semesterGroups = useMemo(() => {
    const groups: Record<number, MataKuliah[]> = {};
    courses.forEach((c) => {
      if (!groups[c.semester]) {
        groups[c.semester] = [];
      }
      groups[c.semester].push(c);
    });
    return groups;
  }, [courses]);

  const sortedSemesters = useMemo(() => {
    return Object.keys(semesterGroups)
      .map(Number)
      .sort((a, b) => a - b);
  }, [semesterGroups]);

  const handleCoursePress = (kode: string) => {
    router.push({
      pathname: '/mata-kuliah/[kode]',
      params: { kode },
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingHeader}>
          <Skeleton width="100%" height={100} borderRadius={12} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={60} borderRadius={12} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={60} borderRadius={12} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={60} borderRadius={12} />
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="cloud-offline-outline" size={56} color={Colors.status.belumLulus} />
        <Text style={styles.errorTitle}>Data belum bisa dimuat</Text>
        <Text style={styles.errorSubtitle}>
          Periksa koneksi internet kamu, lalu coba lagi.
        </Text>
        <Pressable
          onPress={() => loadData()}
          accessibilityRole="button"
          accessibilityLabel="Coba lagi memuat riwayat studi"
          style={styles.retryButton}
        >
          <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.retryButtonText}>Coba lagi</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    >
      {/* Header Summary Card */}
      <View style={[styles.summaryCard, Shadows.card]}>
        <View style={styles.summaryTitleRow}>
          <Ionicons name="school" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.summaryTitle}>Ringkasan Akademik</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>IPK Kumulatif</Text>
            <Text style={[styles.metricValue, { color: Colors.primary }]}>{stats.ipk}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>SKS Lulus</Text>
            <Text style={[styles.metricValue, { color: Colors.status.lulus }]}>
              {stats.sksLulus} SKS
            </Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Belum Lulus</Text>
            <Text style={[styles.metricValue, { color: Colors.status.belumLulus }]}>
              {stats.sksBelumLulus} SKS
            </Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Ditempuh</Text>
            <Text style={[styles.metricValue, { color: Colors.status.ditempuh }]}>
              {stats.sksDitempuh} SKS
            </Text>
          </View>
        </View>
      </View>

      {/* Accordion List per Semester */}
      <View style={styles.semesterList}>
        {sortedSemesters.map((sem) => {
          const semCourses = semesterGroups[sem] || [];
          const totalSemSks = semCourses.reduce((sum, c) => sum + c.sks, 0);
          const isExpanded = !!expandedSemesters[sem];

          return (
            <View key={sem} style={[styles.semesterCard, Shadows.card]}>
              {/* Accordion Header (Pressable) */}
              <Pressable
                onPress={() => toggleSemester(sem)}
                accessibilityRole="button"
                accessibilityLabel={`Semester ${sem}, ${semCourses.length} mata kuliah, total ${totalSemSks} SKS. Ketuk untuk ${
                  isExpanded ? 'menutup' : 'membuka'
                }`}
                accessibilityState={{ expanded: isExpanded }}
                android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                style={({ pressed }) => [
                  styles.semesterHeader,
                  {
                    backgroundColor: pressed ? Colors.cardPressed : Colors.cardBackground,
                  },
                ]}
              >
                <View style={styles.semesterHeaderLeft}>
                  <View style={styles.semesterNumberBadge}>
                    <Text style={styles.semesterNumberText}>{sem}</Text>
                  </View>
                  <View>
                    <Text style={styles.semesterTitle}>Semester {sem}</Text>
                    <Text style={styles.semesterSubtitle}>
                      {semCourses.length} mata kuliah · {totalSemSks} SKS
                    </Text>
                  </View>
                </View>

                <View style={styles.chevronBox}>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={Colors.textSecondary}
                  />
                </View>
              </Pressable>

              {/* Accordion Content */}
              {isExpanded && (
                <View style={styles.semesterCoursesList}>
                  {semCourses.map((course) => (
                    <CourseItem
                      key={course.kode}
                      course={course}
                      showStatusBadge={true}
                      onPress={() => handleCoursePress(course.kode)}
                    />
                  ))}
                </View>
              )}
            </View>
          );
        })}
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
    paddingBottom: Spacing.xxl,
  },
  loadingHeader: {
    padding: Spacing.lg,
  },
  errorContainer: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
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
  summaryCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  summaryTitle: {
    fontSize: FontSize.sectionTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  metricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  metricLabel: {
    fontSize: FontSize.badge,
    color: Colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: FontSize.body,
    fontWeight: '700',
    textAlign: 'center',
  },
  semesterList: {
    gap: Spacing.md,
  },
  semesterCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  semesterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    minHeight: MinTouchSize,
  },
  semesterHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  semesterNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  semesterNumberText: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.primary,
  },
  semesterTitle: {
    fontSize: FontSize.sectionTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  semesterSubtitle: {
    fontSize: FontSize.secondary,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  chevronBox: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  semesterCoursesList: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
    backgroundColor: '#FAFAFB',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
