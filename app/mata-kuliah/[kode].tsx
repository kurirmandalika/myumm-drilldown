import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, MinTouchSize, Shadows, Spacing } from '../../src/constants/theme';
import {
  fetchMataKuliahByKode,
  getPrasyaratDetails,
  getDependentCourses,
} from '../../src/data/mataKuliah';
import { MataKuliah } from '../../src/types';
import { Badge } from '../../src/components/Badge';
import { Skeleton } from '../../src/components/Skeleton';

export default function DetailMataKuliahScreen() {
  const router = useRouter();
  const { kode } = useLocalSearchParams<{ kode: string }>();

  const [course, setCourse] = useState<MataKuliah | undefined>(undefined);
  const [prerequisites, setPrerequisites] = useState<MataKuliah[]>([]);
  const [dependents, setDependents] = useState<MataKuliah[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadCourseDetail = useCallback(async () => {
    if (!kode) return;
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchMataKuliahByKode(kode);
      if (data) {
        setCourse(data);
        setPrerequisites(getPrasyaratDetails(data.prasyarat));
        setDependents(getDependentCourses(data.kode));
      } else {
        setLoadError('Mata kuliah tidak ditemukan.');
      }
    } catch (err: any) {
      setLoadError(err.message || 'Gagal memuat detail mata kuliah.');
    } finally {
      setLoading(false);
    }
  }, [kode]);

  useEffect(() => {
    loadCourseDetail();
  }, [loadCourseDetail]);

  const handleNavigateToCourse = (targetKode: string) => {
    router.push({
      pathname: '/mata-kuliah/[kode]',
      params: { kode: targetKode },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <Skeleton width="60%" height={24} style={{ marginBottom: 12 }} />
          <Skeleton width="90%" height={28} style={{ marginBottom: 16 }} />
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
            <Skeleton width={80} height={24} borderRadius={6} />
            <Skeleton width={70} height={24} borderRadius={6} />
          </View>
          <Skeleton width="100%" height={80} borderRadius={8} />
        </View>
      </View>
    );
  }

  if (loadError || !course) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={56} color={Colors.status.belumLulus} />
        <Text style={styles.errorTitle}>Data belum bisa dimuat</Text>
        <Text style={styles.errorSubtitle}>
          {loadError || 'Mata kuliah dengan kode tersebut tidak ditemukan.'}
        </Text>
        <Pressable
          onPress={loadCourseDetail}
          accessibilityRole="button"
          accessibilityLabel="Coba lagi memuat detail"
          style={styles.retryButton}
        >
          <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.retryButtonText}>Coba lagi</Text>
        </Pressable>
      </View>
    );
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'lulus':
        return 'Lulus';
      case 'belum_lulus':
        return 'Belum Lulus';
      case 'ditempuh':
        return 'Sedang Ditempuh';
      default:
        return status;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card: Code, Name, Badges */}
      <View style={[styles.mainCard, Shadows.card]}>
        <View style={styles.headerTop}>
          <Text style={styles.kodeText}>{course.kode}</Text>
          <Badge type={course.status} size="md" />
        </View>

        <Text style={styles.namaText}>{course.nama}</Text>

        <View style={styles.badgeRow}>
          <Badge
            type={course.wajib ? 'wajib' : 'pilihan'}
            label={course.wajib ? 'Mata Kuliah Wajib' : 'Mata Kuliah Pilihan'}
            size="md"
          />
        </View>

        {/* Warning Banner if Belum Lulus & Wajib */}
        {course.status === 'belum_lulus' && (
          <View style={styles.warningBanner}>
            <Ionicons name="alert-circle" size={20} color={Colors.status.belumLulus} />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Perhatian untuk Pengisian KRS</Text>
              <Text style={styles.warningBody}>
                Mata kuliah ini berstatus Belum Lulus.
                {course.wajib
                  ? ' Karena berstatus WAJIB, mata kuliah ini sangat disarankan untuk diprogram ulang pada KRS semester berikutnya agar syarat kelulusan terpenuhi.'
                  : ' Kamu dapat mengulang mata kuliah ini atau memilih mata kuliah pilihan lain.'}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Grid Info: SKS, Semester, Nilai, Dosen */}
      <View style={styles.infoGrid}>
        <View style={[styles.infoTile, Shadows.card]}>
          <Text style={styles.infoTileLabel}>Bobot SKS</Text>
          <Text style={styles.infoTileValue}>{course.sks} SKS</Text>
        </View>
        <View style={[styles.infoTile, Shadows.card]}>
          <Text style={styles.infoTileLabel}>Semester Kurikulum</Text>
          <Text style={styles.infoTileValue}>Semester {course.semester}</Text>
        </View>
        <View style={[styles.infoTile, Shadows.card]}>
          <Text style={styles.infoTileLabel}>Nilai Akhir</Text>
          <Text
            style={[
              styles.infoTileValue,
              {
                color:
                  course.status === 'lulus'
                    ? Colors.status.lulus
                    : course.status === 'belum_lulus'
                    ? Colors.status.belumLulus
                    : Colors.status.ditempuh,
              },
            ]}
          >
            {course.nilai ? course.nilai : '-'}
          </Text>
        </View>
        <View style={[styles.infoTile, Shadows.card]}>
          <Text style={styles.infoTileLabel}>Status Mata Kuliah</Text>
          <Text style={styles.infoTileValue}>{getStatusText(course.status)}</Text>
        </View>
      </View>

      {/* Dosen Pengampu & Deskripsi */}
      <View style={[styles.sectionCard, Shadows.card]}>
        <Text style={styles.sectionTitle}>Dosen Pengampu</Text>
        <View style={styles.dosenRow}>
          <Ionicons name="person-circle-outline" size={22} color={Colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.dosenText}>{course.dosenPengampu || 'Tim Dosen Informatika'}</Text>
        </View>

        <View style={styles.cardDivider} />

        <Text style={styles.sectionTitle}>Deskripsi Mata Kuliah</Text>
        <Text style={styles.deskripsiText}>
          {course.deskripsi || 'Deskripsi silabus mata kuliah belum tersedia.'}
        </Text>
      </View>

      {/* Prasyarat Mata Kuliah Ini */}
      <View style={[styles.sectionCard, Shadows.card]}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="git-branch-outline" size={20} color={Colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitle}>Mata Kuliah Prasyarat</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Mata kuliah yang wajib diselesaikan sebelum mengambil {course.nama}
        </Text>

        {prerequisites.length === 0 ? (
          <View style={styles.emptyPrasyaratBox}>
            <Ionicons name="checkmark-circle-outline" size={20} color={Colors.status.lulus} />
            <Text style={styles.emptyPrasyaratText}>
              Tidak ada mata kuliah prasyarat untuk mata kuliah ini.
            </Text>
          </View>
        ) : (
          prerequisites.map((req) => (
            <Pressable
              key={req.kode}
              onPress={() => handleNavigateToCourse(req.kode)}
              accessibilityRole="button"
              accessibilityLabel={`Prasyarat: ${req.nama}, status ${getStatusText(req.status)}. Ketuk untuk melihat rincian`}
              style={({ pressed }) => [
                styles.relationItem,
                {
                  backgroundColor: pressed ? Colors.cardPressed : '#F9FAFB',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View style={styles.relationLeft}>
                <Text style={styles.relationKode}>{req.kode}</Text>
                <Text style={styles.relationNama}>{req.nama}</Text>
                <Text style={styles.relationMeta}>{req.sks} SKS · Semester {req.semester}</Text>
              </View>
              <View style={styles.relationRight}>
                <Badge type={req.status} size="sm" />
                <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} style={{ marginLeft: 6 }} />
              </View>
            </Pressable>
          ))
        )}
      </View>

      {/* Mata Kuliah Lanjutan yang Membutuhkan MK Ini */}
      <View style={[styles.sectionCard, Shadows.card]}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="arrow-forward-circle-outline" size={20} color={Colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitle}>Prasyarat untuk Mata Kuliah Lain</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Mata kuliah lanjutan yang membutuhkan {course.nama} sebagai syarat
        </Text>

        {dependents.length === 0 ? (
          <View style={styles.emptyPrasyaratBox}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.emptyPrasyaratText}>
              Tidak ada mata kuliah lain yang mensyaratkan mata kuliah ini.
            </Text>
          </View>
        ) : (
          dependents.map((dep) => (
            <Pressable
              key={dep.kode}
              onPress={() => handleNavigateToCourse(dep.kode)}
              accessibilityRole="button"
              accessibilityLabel={`Mata kuliah lanjutan: ${dep.nama}, status ${getStatusText(dep.status)}. Ketuk untuk melihat rincian`}
              style={({ pressed }) => [
                styles.relationItem,
                {
                  backgroundColor: pressed ? Colors.cardPressed : '#F9FAFB',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View style={styles.relationLeft}>
                <Text style={styles.relationKode}>{dep.kode}</Text>
                <Text style={styles.relationNama}>{dep.nama}</Text>
                <Text style={styles.relationMeta}>
                  {dep.sks} SKS · Semester {dep.semester} · {dep.wajib ? 'Wajib' : 'Pilihan'}
                </Text>
              </View>
              <View style={styles.relationRight}>
                <Badge type={dep.status} size="sm" />
                <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} style={{ marginLeft: 6 }} />
              </View>
            </Pressable>
          ))
        )}
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
  loadingContainer: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  loadingCard: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.lg,
    borderRadius: 12,
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
  mainCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  kodeText: {
    fontSize: FontSize.secondary,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  namaText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 28,
    marginBottom: Spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  warningBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.status.belumLulusBg,
    borderWidth: 1,
    borderColor: Colors.status.belumLulusBorder,
    borderRadius: 8,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  warningContent: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  warningTitle: {
    fontSize: FontSize.secondary,
    fontWeight: '700',
    color: Colors.status.belumLulus,
    marginBottom: 2,
  },
  warningBody: {
    fontSize: FontSize.secondary,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  infoTile: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  infoTileLabel: {
    fontSize: FontSize.badge,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  infoTileValue: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: FontSize.sectionTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: FontSize.secondary,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  dosenRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dosenText: {
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  deskripsiText: {
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  emptyPrasyaratBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.md,
  },
  emptyPrasyaratText: {
    fontSize: FontSize.secondary,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  relationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.sm,
    minHeight: MinTouchSize,
  },
  relationLeft: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  relationKode: {
    fontSize: FontSize.badge,
    fontWeight: '700',
    color: Colors.primary,
  },
  relationNama: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginVertical: 2,
  },
  relationMeta: {
    fontSize: FontSize.secondary,
    color: Colors.textSecondary,
  },
  relationRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
