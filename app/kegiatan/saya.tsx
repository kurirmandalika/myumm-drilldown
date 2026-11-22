import React, { useState, useEffect, useCallback } from 'react';
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
import { Kegiatan, Pengingat } from '../../src/types';
import {
  fetchKegiatanList,
  getStoredPengingatList,
  removeStoredPengingat,
  formatDateTimeIndo,
  getDateBlock,
} from '../../src/data/kegiatan';
import { Skeleton } from '../../src/components/Skeleton';
import { EmptyState } from '../../src/components/StateView';

interface KegiatanWithReminder {
  kegiatan: Kegiatan;
  pengingat: Pengingat;
}

export default function KegiatanSayaScreen() {
  const router = useRouter();

  const [items, setItems] = useState<KegiatanWithReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [allKegiatanRes, pengingatList] = await Promise.all([
        fetchKegiatanList(false, 300),
        getStoredPengingatList(),
      ]);

      const matched: KegiatanWithReminder[] = [];
      pengingatList.forEach((p) => {
        const found = allKegiatanRes.data.find((k) => k.id === p.kegiatanId);
        if (found) {
          matched.push({ kegiatan: found, pengingat: p });
        }
      });

      // Sort closest first
      matched.sort(
        (a, b) =>
          new Date(a.kegiatan.mulai).getTime() - new Date(b.kegiatan.mulai).getTime()
      );

      setItems(matched);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenDetail = (id: string) => {
    router.push({
      pathname: '/kegiatan/[id]',
      params: { id },
    });
  };

  const handleRemoveReminder = async (kegiatanId: string) => {
    try {
      await removeStoredPengingat(kegiatanId);
      setItems((prev) => prev.filter((item) => item.kegiatan.id !== kegiatanId));
      showToast('Pengingat dihapus');
    } catch {
      // Ignore
    }
  };

  const getWaktuLabel = (w: '1_hari' | '3_jam' | '1_jam') => {
    switch (w) {
      case '1_hari':
        return '1 hari sebelumnya';
      case '3_jam':
        return '3 jam sebelumnya';
      case '1_jam':
        return '1 jam sebelumnya';
      default:
        return 'Sebelum acara';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* App Bar (SKILL.md §8) */}
      <View style={styles.appBar}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke layar sebelumnya"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.appBarTitle}>Kegiatan Saya</Text>
          <Text style={styles.appBarSubtitle}>
            {items.length} kegiatan tersimpan dalam pengingat
          </Text>
        </View>
      </View>

      {/* Toast Feedback */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Ionicons name="information-circle" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Content */}
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
        {loading ? (
          <View style={{ gap: Spacing.md }}>
            <Skeleton width="100%" height={100} borderRadius={12} />
            <Skeleton width="100%" height={100} borderRadius={12} />
          </View>
        ) : items.length === 0 ? (
          // Empty state matching SKILL.md §5a
          <EmptyState
            title="Belum ada pengingat"
            message="Tekan Ingatkan saya di halaman kegiatan agar tidak terlewat."
            actionLabel="Jelajahi kegiatan"
            onAction={() => router.push('/(tabs)/kegiatan')}
          />
        ) : (
          items.map(({ kegiatan, pengingat }) => {
            const dateBlock = getDateBlock(kegiatan.mulai);
            const formatted = formatDateTimeIndo(kegiatan.mulai);

            return (
              <Pressable
                key={kegiatan.id}
                onPress={() => handleOpenDetail(kegiatan.id)}
                accessibilityRole="button"
                accessibilityLabel={`${kegiatan.judul}, diingatkan ${getWaktuLabel(
                  pengingat.waktu
                )}. Ketuk untuk membuka detail kegiatan`}
                android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                style={({ pressed }) => [
                  styles.card,
                  Shadows.card,
                  {
                    opacity: pressed ? 0.8 : 1,
                    backgroundColor: pressed ? Colors.cardPressed : Colors.cardBackground,
                  },
                ]}
              >
                {/* Date Block */}
                <View style={styles.dateBlock}>
                  <Text style={styles.dateDayText}>{dateBlock.day}</Text>
                  <Text style={styles.dateMonthText}>{dateBlock.month}</Text>
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                  {/* Category & Reminder Tag */}
                  <View style={styles.tagRow}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{kegiatan.kategori}</Text>
                    </View>

                    <View style={styles.reminderBadge}>
                      <Ionicons name="notifications" size={12} color={Colors.primary} style={{ marginRight: 4 }} />
                      <Text style={styles.reminderBadgeText}>
                        {getWaktuLabel(pengingat.waktu)}
                      </Text>
                    </View>
                  </View>

                  {/* Title */}
                  <Text style={styles.titleText} numberOfLines={2}>
                    {kegiatan.judul}
                  </Text>

                  {/* Date & Location */}
                  <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={13} color={Colors.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={styles.metaText} numberOfLines={1}>
                      {formatted}
                    </Text>
                  </View>

                  <View style={styles.metaRow}>
                    <Ionicons
                      name={kegiatan.mode === 'daring' ? 'videocam-outline' : 'location-outline'}
                      size={13}
                      color={Colors.textSecondary}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.metaText} numberOfLines={1}>
                      {kegiatan.tempat}
                    </Text>
                  </View>
                </View>

                {/* Quick Remove Button & Chevron */}
                <View style={styles.actionColumn}>
                  <Pressable
                    onPress={() => handleRemoveReminder(kegiatan.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Hapus pengingat untuk ${kegiatan.judul}`}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={styles.trashIconButton}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </Pressable>
                  <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} style={{ marginTop: 12 }} />
                </View>
              </Pressable>
            );
          })
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    minHeight: MinTouchSize,
  },
  dateBlock: {
    width: 48,
    height: 54,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  dateDayText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: 22,
  },
  dateMonthText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  cardContent: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  reminderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  reminderBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  titleText: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  actionColumn: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: Spacing.xs,
  },
  trashIconButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
