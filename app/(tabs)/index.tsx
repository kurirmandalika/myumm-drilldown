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
import {
  DUMMY_MAHASISWA,
  DUMMY_KEGIATAN,
  getStats,
  subscribeSimulationState,
} from '../../src/data/mataKuliah';
import { StatusMK } from '../../src/types';

export default function DashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState(getStats());
  const [refreshing, setRefreshing] = useState(false);

  // Subscribe to simulation changes (e.g. from Profil tab)
  useEffect(() => {
    const unsubscribe = subscribeSimulationState(() => {
      setStats(getStats());
    });
    return unsubscribe;
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setStats(getStats());
      setRefreshing(false);
    }, 600);
  }, []);

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

        {/* 3 Interactive Cards (FR-01, FR-05) */}
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

        {/* Section: Jadwal Kegiatan Prodi (FR-08) */}
        <View style={[styles.sectionHeader, { marginTop: Spacing.xl }]}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>Jadwal Kegiatan Prodi</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Agenda akademik dan kegiatan penting Program Studi Informatika
          </Text>
        </View>

        <View style={styles.kegiatanList}>
          {DUMMY_KEGIATAN.map((kegiatan) => (
            <Pressable
              key={kegiatan.id}
              onPress={() => handleKegiatanPress(kegiatan.id)}
              accessibilityRole="button"
              accessibilityLabel={`${kegiatan.judul}, tanggal ${kegiatan.tanggal}, tempat ${kegiatan.tempat}. Ketuk untuk melihat rincian kegiatan`}
              android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
              style={({ pressed }) => [
                styles.kegiatanCard,
                Shadows.card,
                {
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: pressed ? Colors.cardPressed : Colors.cardBackground,
                },
              ]}
            >
              <View style={styles.kegiatanContent}>
                <View style={styles.kegiatanCategoryBadge}>
                  <Text style={styles.kegiatanCategoryText}>{kegiatan.kategori}</Text>
                </View>
                <Text style={styles.kegiatanTitle} numberOfLines={2}>
                  {kegiatan.judul}
                </Text>
                <View style={styles.kegiatanMetaRow}>
                  <Ionicons name="time-outline" size={14} color={Colors.textSecondary} style={{ marginRight: 4 }} />
                  <Text style={styles.kegiatanMetaText}>{kegiatan.tanggal}</Text>
                </View>
                <View style={styles.kegiatanMetaRow}>
                  <Ionicons name="location-outline" size={14} color={Colors.textSecondary} style={{ marginRight: 4 }} />
                  <Text style={styles.kegiatanMetaText} numberOfLines={1}>
                    {kegiatan.tempat}
                  </Text>
                </View>
              </View>
              {/* Chevron signifier */}
              <View style={styles.kegiatanChevron}>
                <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
              </View>
            </Pressable>
          ))}
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
  kegiatanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    minHeight: MinTouchSize,
  },
  kegiatanContent: {
    flex: 1,
  },
  kegiatanCategoryBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
  },
  kegiatanCategoryText: {
    fontSize: FontSize.badge,
    fontWeight: '600',
    color: Colors.primary,
  },
  kegiatanTitle: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  kegiatanMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  kegiatanMetaText: {
    fontSize: FontSize.secondary,
    color: Colors.textSecondary,
  },
  kegiatanChevron: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: Spacing.sm,
  },
});
