import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, MinTouchSize, Shadows, Spacing } from '../../src/constants/theme';
import { StatusCard } from '../../src/components/StatusCard';
import { KegiatanCard } from '../../src/components/KegiatanCard';
import { Skeleton } from '../../src/components/Skeleton';
import {
  DUMMY_MAHASISWA,
  getStats,
  subscribeSimulationState,
} from '../../src/data/mataKuliah';
import {
  fetchKegiatanList,
  formatRelativeTime,
  getStoredPengingatList,
  subscribeKegiatanSimulation,
} from '../../src/data/kegiatan';
import { StatusMK, Kegiatan } from '../../src/types';

export default function DashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState(getStats());
  const [refreshing, setRefreshing] = useState(false);
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [kegiatanLoading, setKegiatanLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [activeReminders, setActiveReminders] = useState<string[]>([]);

  const loadKegiatan = useCallback(async (isRefresh = false) => {
    try {
      const [res, pengingat] = await Promise.all([
        fetchKegiatanList(isRefresh, isRefresh ? 500 : 300),
        getStoredPengingatList(),
      ]);
      setKegiatanList(res.data);
      setLastUpdated(res.lastUpdated);
      setActiveReminders(pengingat.map((p) => p.kegiatanId));
    } catch {
      // Fallback silently on dashboard
    } finally {
      setKegiatanLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKegiatan();

    const unsubMK = subscribeSimulationState(() => {
      setStats(getStats());
    });
    const unsubKeg = subscribeKegiatanSimulation(() => {
      loadKegiatan(false);
    });

    return () => {
      unsubMK();
      unsubKeg();
    };
  }, [loadKegiatan]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setStats(getStats());
    await loadKegiatan(true);
    setRefreshing(false);
  }, [loadKegiatan]);

  const handleCardPress = (status: StatusMK) => {
    router.push({
      pathname: '/mata-kuliah',
      params: { tab: status },
    });
  };

  const handleKegiatanPress = (id: string) => {
    router.push({
      pathname: '/kegiatan/[id]',
      params: { id },
    });
  };

  const handleLihatSemuaKegiatan = () => {
    router.push('/(tabs)/kegiatan');
  };

  // Filter 3 upcoming activities closest to now (FR-01)
  const now = Date.now();
  const upcomingKegiatan = kegiatanList
    .filter((k) => new Date(k.mulai).getTime() >= now)
    .sort((a, b) => new Date(a.mulai).getTime() - new Date(b.mulai).getTime())
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea}>
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
        {/* Header Mahasiswa */}
        <View style={styles.headerBanner}>
          <View style={styles.headerTop}>
            <View style={styles.headerInfo}>
              <Text style={styles.greetingText}>Halo, {DUMMY_MAHASISWA.nama.split(' ')[0]}!</Text>
              <Text style={styles.nimText}>{DUMMY_MAHASISWA.nim}</Text>
              <Text style={styles.prodiText}>
                {DUMMY_MAHASISWA.prodi} · Semester {DUMMY_MAHASISWA.semester}
              </Text>
            </View>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={28} color={Colors.primary} />
            </View>
          </View>

          {/* Quick Stat Chips inside Header */}
          <View style={styles.chipRow}>
            <View style={styles.statChip}>
              <Text style={styles.chipLabel}>IPK Kumulatif</Text>
              <Text style={styles.chipValue}>{stats.ipk}</Text>
            </View>
            <View style={styles.statChipDivider} />
            <View style={styles.statChip}>
              <Text style={styles.chipLabel}>Total SKS Lulus</Text>
              <Text style={styles.chipValue}>{stats.sksLulus} SKS</Text>
            </View>
            <View style={styles.statChipDivider} />
            <View style={styles.statChip}>
              <Text style={styles.chipLabel}>Status Akademik</Text>
              <Text style={[styles.chipValue, { color: '#4ADE80' }]}>
                {DUMMY_MAHASISWA.statusAkademik}
              </Text>
            </View>
          </View>
        </View>

        {/* Section: Kartu Ringkasan Status Mata Kuliah */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="layers-outline" size={20} color={Colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>Status Mata Kuliah</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Ketuk kartu untuk melihat daftar nama mata kuliah dan rinciannya
          </Text>
        </View>

        {/* 3 Interactive Cards (v1 preserved) */}
        <View style={styles.cardsContainer}>
          <StatusCard
            status="belum_lulus"
            count={stats.countBelumLulus}
            sks={stats.sksBelumLulus}
            onPress={() => handleCardPress('belum_lulus')}
          />
          <StatusCard
            status="ditempuh"
            count={stats.countDitempuh}
            sks={stats.sksDitempuh}
            onPress={() => handleCardPress('ditempuh')}
          />
          <StatusCard
            status="lulus"
            count={stats.countLulus}
            sks={stats.sksLulus}
            onPress={() => handleCardPress('lulus')}
          />
        </View>

        {/* Static Informational Card (Non-clickable, no shadow, flat per SKILL.md) */}
        <View style={styles.staticInfoCard}>
          <View style={styles.staticInfoHeader}>
            <Ionicons name="information-circle" size={20} color={Colors.textSecondary} />
            <Text style={styles.staticInfoTitle}>Informasi Rencana Studi</Text>
          </View>
          <Text style={styles.staticInfoBody}>
            Pastikan seluruh mata kuliah wajib yang belum lulus telah diperiksa sebelum masa penyusunan KRS dibuka.
            Kamu juga dapat meninjau riwayat lengkap melalui menu Riwayat Studi di bawah.
          </Text>
        </View>

        {/* Section: Jadwal Kegiatan Prodi (K1, FR-01, FR-03, FR-11) */}
        <View style={[styles.sectionHeader, { marginTop: Spacing.xl }]}>
          <View style={styles.kegiatanHeaderRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="calendar-outline" size={20} color={Colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.sectionTitle}>Jadwal Kegiatan Prodi</Text>
              </View>
              {/* Keterangan "Diperbarui [waktu]" (SKILL.md §5a, FR-03) */}
              <Text style={styles.sectionSubtitle}>
                Diperbarui {formatRelativeTime(lastUpdated)}
              </Text>
            </View>

            {/* Tautan "Lihat semua ›" ke K2 (FR-01, ≤ 2 ketukan) */}
            <Pressable
              onPress={handleLihatSemuaKegiatan}
              accessibilityRole="button"
              accessibilityLabel="Lihat semua jadwal kegiatan prodi"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={({ pressed }) => [
                styles.lihatSemuaButton,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Text style={styles.lihatSemuaText}>Lihat semua</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
            </Pressable>
          </View>
        </View>

        {/* 3 Kegiatan Terdekat (FR-01) */}
        <View style={styles.kegiatanList}>
          {kegiatanLoading ? (
            <View style={{ gap: Spacing.md }}>
              <Skeleton width="100%" height={90} borderRadius={12} />
              <Skeleton width="100%" height={90} borderRadius={12} />
              <Skeleton width="100%" height={90} borderRadius={12} />
            </View>
          ) : upcomingKegiatan.length > 0 ? (
            upcomingKegiatan.map((kegiatan) => (
              <KegiatanCard
                key={kegiatan.id}
                kegiatan={kegiatan}
                hasPengingat={activeReminders.includes(kegiatan.id)}
                onPress={() => handleKegiatanPress(kegiatan.id)}
              />
            ))
          ) : (
            <View style={styles.emptyKegiatanBox}>
              <Ionicons name="calendar-outline" size={32} color={Colors.textSecondary} style={{ marginBottom: 6 }} />
              <Text style={styles.emptyKegiatanTitle}>Belum ada kegiatan terdekat</Text>
              <Text style={styles.emptyKegiatanDesc}>
                Semua kegiatan baru dari prodi akan muncul di sini.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: Spacing.xxl,
  },
  headerBanner: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'android' ? 24 : 12,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerInfo: {
    flex: 1,
  },
  greetingText: {
    fontSize: FontSize.screenTitle,
    fontWeight: '700',
    color: Colors.textOnPrimary,
    letterSpacing: -0.3,
  },
  nimText: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  prodiText: {
    fontSize: FontSize.secondary,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 12,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statChip: {
    flex: 1,
    alignItems: 'center',
  },
  statChipDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  chipLabel: {
    fontSize: FontSize.badge,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 2,
  },
  chipValue: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.textOnPrimary,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  kegiatanHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FontSize.sectionTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: FontSize.secondary,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  lihatSemuaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MinTouchSize,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  lihatSemuaText: {
    fontSize: FontSize.secondary,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 2,
  },
  cardsContainer: {
    paddingHorizontal: Spacing.lg,
  },
  staticInfoCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    padding: Spacing.lg,
    backgroundColor: '#EDEDF0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFDFE4',
  },
  staticInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  staticInfoTitle: {
    fontSize: FontSize.secondary,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  staticInfoBody: {
    fontSize: FontSize.secondary,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  kegiatanList: {
    paddingHorizontal: Spacing.lg,
  },
  emptyKegiatanBox: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyKegiatanTitle: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  emptyKegiatanDesc: {
    fontSize: FontSize.secondary,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
