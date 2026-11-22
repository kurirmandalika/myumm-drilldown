import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Pressable,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, MinTouchSize, Shadows, Spacing } from '../../src/constants/theme';
import { Kegiatan, KategoriKegiatan } from '../../src/types';
import { KegiatanCard } from '../../src/components/KegiatanCard';
import { Skeleton } from '../../src/components/Skeleton';
import { EmptyState, ErrorState } from '../../src/components/StateView';
import {
  fetchKegiatanList,
  formatRelativeTime,
  getStoredPengingatList,
  groupKegiatanByPeriod,
  subscribeKegiatanSimulation,
} from '../../src/data/kegiatan';

type TabKegiatan = 'akan_datang' | 'selesai';
const KATEGORI_OPTIONS: ('Semua' | KategoriKegiatan)[] = [
  'Semua',
  'Seminar',
  'Workshop',
  'Kuliah Tamu',
  'Lomba',
  'Akademik',
];

export default function KegiatanListScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKegiatan>('akan_datang');
  const [selectedKategori, setSelectedKategori] = useState<'Semua' | KategoriKegiatan>('Semua');
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [isFromCache, setIsFromCache] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeReminders, setActiveReminders] = useState<string[]>([]);

  const loadData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setLoadError(null);

    try {
      const [res, pengingat] = await Promise.all([
        fetchKegiatanList(isRefresh, isRefresh ? 600 : 400),
        getStoredPengingatList(),
      ]);

      setKegiatanList(res.data);
      setLastUpdated(res.lastUpdated);
      setIsFromCache(res.isFromCache);
      setActiveReminders(pengingat.map((p) => p.kegiatanId));

      if (isRefresh) {
        if (res.addedNewOnRefresh) {
          showToast('1 kegiatan baru ditambahkan');
        } else {
          showToast('Jadwal sudah yang terbaru');
        }
      }
    } catch (err: any) {
      setLoadError(err.message || 'Kegiatan belum bisa dimuat. Periksa koneksi internet kamu, lalu coba lagi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeKegiatanSimulation(() => {
      loadData(false);
    });
    return unsubscribe;
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData(true);
  };

  const handleKegiatanPress = (id: string) => {
    router.push({
      pathname: '/kegiatan/[id]',
      params: { id },
    });
  };

  const handleOpenKegiatanSaya = () => {
    router.push('/kegiatan/saya');
  };

  // Filter Upcoming vs Past (Akan Datang vs Selesai)
  const now = Date.now();
  const akanDatangList = useMemo(
    () =>
      kegiatanList
        .filter((k) => new Date(k.mulai).getTime() >= now)
        .sort((a, b) => new Date(a.mulai).getTime() - new Date(b.mulai).getTime()),
    [kegiatanList, now]
  );

  const selesaiList = useMemo(
    () =>
      kegiatanList
        .filter((k) => new Date(k.mulai).getTime() < now)
        .sort((a, b) => new Date(b.mulai).getTime() - new Date(a.mulai).getTime()),
    [kegiatanList, now]
  );

  // Apply Category Filter (FR-02)
  const filteredList = useMemo(() => {
    const base = activeTab === 'akan_datang' ? akanDatangList : selesaiList;
    if (selectedKategori === 'Semua') return base;
    return base.filter((k) => k.kategori === selectedKategori);
  }, [activeTab, akanDatangList, selesaiList, selectedKategori]);

  // Group by period if Akan Datang (SKILL.md §5a: "Minggu ini", "Minggu depan", "Bulan ini", "Nanti")
  const groupedUpcoming = useMemo(() => {
    if (activeTab !== 'akan_datang') return [];
    return groupKegiatanByPeriod(filteredList);
  }, [activeTab, filteredList]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* App Bar (K2, SKILL.md §8) */}
      <View style={styles.appBar}>
        <View style={styles.appBarTitleRow}>
          {router.canGoBack() && (
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Kembali ke layar sebelumnya"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.appBarTitle}>Jadwal Kegiatan Prodi</Text>
            <Text style={styles.appBarSubtitle}>
              Diperbarui {formatRelativeTime(lastUpdated)}
            </Text>
          </View>
        </View>

        {/* Tautan / Tombol Kegiatan Saya di App Bar (PRD §7 K2) */}
        <Pressable
          onPress={handleOpenKegiatanSaya}
          accessibilityRole="button"
          accessibilityLabel={`Buka Kegiatan Saya, ${activeReminders.length} pengingat aktif`}
          style={({ pressed }) => [
            styles.kegiatanSayaButton,
            { opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <Ionicons name="notifications-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.kegiatanSayaText}>Kegiatan Saya</Text>
          {activeReminders.length > 0 && (
            <View style={styles.reminderBadge}>
              <Text style={styles.reminderBadgeText}>{activeReminders.length}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Banner Data Tersimpan / Offline Cache (FR-08, SKILL.md §5a) */}
      {isFromCache && (
        <View style={styles.cacheBanner}>
          <Ionicons name="cloud-offline-outline" size={18} color="#92400E" style={{ marginRight: 8 }} />
          <Text style={styles.cacheBannerText}>
            Menampilkan data terakhir (diperbarui {formatRelativeTime(lastUpdated)}).
          </Text>
          <Pressable
            onPress={onRefresh}
            accessibilityRole="button"
            accessibilityLabel="Coba lagi memuat kegiatan terbaru"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.cacheBannerAction}>Coba lagi</Text>
          </Pressable>
        </View>
      )}

      {/* In-app Toast message after pull-to-refresh (SKILL.md §5a) */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Tab Segment: Akan Datang / Selesai (FR-02) */}
      <View style={styles.tabContainer}>
        <Pressable
          onPress={() => setActiveTab('akan_datang')}
          accessibilityRole="tab"
          accessibilityLabel={`Tab Akan Datang, ${akanDatangList.length} kegiatan`}
          style={[styles.tabButton, activeTab === 'akan_datang' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabText, activeTab === 'akan_datang' && styles.tabTextActive]}>
            Akan Datang ({akanDatangList.length})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('selesai')}
          accessibilityRole="tab"
          accessibilityLabel={`Tab Selesai, ${selesaiList.length} kegiatan`}
          style={[styles.tabButton, activeTab === 'selesai' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabText, activeTab === 'selesai' && styles.tabTextActive]}>
            Selesai ({selesaiList.length})
          </Text>
        </Pressable>
      </View>

      {/* Filter Chips Kategori (FR-02) */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {KATEGORI_OPTIONS.map((kat) => {
            const isSelected = selectedKategori === kat;
            return (
              <Pressable
                key={kat}
                onPress={() => setSelectedKategori(kat)}
                accessibilityRole="button"
                accessibilityLabel={`Filter kategori ${kat}`}
                style={({ pressed }) => [
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                  { opacity: pressed ? 0.75 : 1 },
                ]}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {kat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.contentArea}
        contentContainerStyle={styles.scrollContent}
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
        {loading ? (
          <View style={{ gap: Spacing.md, paddingHorizontal: Spacing.lg }}>
            <Skeleton width="100%" height={92} borderRadius={12} />
            <Skeleton width="100%" height={92} borderRadius={12} />
            <Skeleton width="100%" height={92} borderRadius={12} />
            <Skeleton width="100%" height={92} borderRadius={12} />
          </View>
        ) : loadError && !isFromCache ? (
          <ErrorState
            title="Kegiatan belum bisa dimuat"
            message={loadError}
            onRetry={() => loadData(false)}
          />
        ) : filteredList.length === 0 ? (
          <EmptyState
            title={
              selectedKategori !== 'Semua'
                ? `Tidak ada kegiatan kategori ${selectedKategori}`
                : activeTab === 'akan_datang'
                ? 'Belum ada kegiatan terjadwal'
                : 'Belum ada riwayat kegiatan selesai'
            }
            message={
              selectedKategori !== 'Semua'
                ? 'Coba pilih kategori lain atau reset filter untuk melihat semua kegiatan prodi.'
                : activeTab === 'akan_datang'
                ? 'Kegiatan baru dari prodi akan muncul di sini.'
                : 'Kegiatan prodi yang telah selesai dilaksanakan akan diarsipkan di sini.'
            }
            actionLabel={
              selectedKategori !== 'Semua'
                ? 'Tampilkan Semua Kategori'
                : activeTab === 'akan_datang'
                ? 'Lihat kegiatan selesai'
                : 'Lihat Kegiatan Akan Datang'
            }
            onAction={
              selectedKategori !== 'Semua'
                ? () => setSelectedKategori('Semua')
                : activeTab === 'akan_datang'
                ? () => setActiveTab('selesai')
                : () => setActiveTab('akan_datang')
            }
          />
        ) : activeTab === 'akan_datang' ? (
          // Grouped list for Akan Datang (FR-02)
          groupedUpcoming.map((group) => (
            <View key={group.period} style={styles.groupSection}>
              <View style={styles.groupHeaderRow}>
                <Ionicons name="time-outline" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.groupHeaderText}>{group.period}</Text>
                <Text style={styles.groupCountText}>({group.items.length})</Text>
              </View>

              <View style={styles.groupList}>
                {group.items.map((item) => (
                  <KegiatanCard
                    key={item.id}
                    kegiatan={item}
                    hasPengingat={activeReminders.includes(item.id)}
                    onPress={() => handleKegiatanPress(item.id)}
                  />
                ))}
              </View>
            </View>
          ))
        ) : (
          // Flat sorted list for Selesai (latest first, FR-02)
          <View style={styles.groupList}>
            {filteredList.map((item) => (
              <KegiatanCard
                key={item.id}
                kegiatan={item}
                hasPengingat={activeReminders.includes(item.id)}
                onPress={() => handleKegiatanPress(item.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  appBar: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appBarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  appBarSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  kegiatanSayaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    minHeight: 36,
  },
  kegiatanSayaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reminderBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  reminderBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  cacheBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
  },
  cacheBannerText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
    lineHeight: 16,
  },
  cacheBannerAction: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
    textDecorationLine: 'underline',
    marginLeft: 8,
  },
  toastContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 80 : 70,
    alignSelf: 'center',
    zIndex: 99,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    ...Shadows.card,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    minHeight: MinTouchSize,
    justifyContent: 'center',
  },
  tabButtonActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingVertical: 8,
  },
  filterScrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    minHeight: 32,
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  contentArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  groupSection: {
    marginBottom: Spacing.lg,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  groupHeaderText: {
    fontSize: FontSize.sectionTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  groupCountText: {
    fontSize: FontSize.secondary,
    color: Colors.textSecondary,
    marginLeft: 4,
    fontWeight: '600',
  },
  groupList: {
    paddingHorizontal: Spacing.lg,
  },
});
