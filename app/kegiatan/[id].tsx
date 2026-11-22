import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { Colors, FontSize, MinTouchSize, Shadows, Spacing } from '../../src/constants/theme';
import { fetchKegiatanById } from '../../src/data/mataKuliah';
import { KegiatanProdi } from '../../src/types';
import { Skeleton } from '../../src/components/Skeleton';
import { ErrorState } from '../../src/components/StateView';

export default function DetailKegiatanScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [kegiatan, setKegiatan] = useState<KegiatanProdi | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchKegiatanById(id);
      if (data) {
        setKegiatan(data);
      } else {
        setLoadError('Kegiatan tidak ditemukan.');
      }
    } catch (err: any) {
      setLoadError(err.message || 'Gagal memuat detail kegiatan.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const handleOpenLink = async () => {
    if (!kegiatan?.tautanDaftar) return;

    if (Platform.OS === 'web') {
      window.open(kegiatan.tautanDaftar, '_blank');
    } else {
      try {
        await WebBrowser.openBrowserAsync(kegiatan.tautanDaftar);
      } catch (err) {
        Alert.alert('Informasi Tautan', kegiatan.tautanDaftar);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Skeleton width={100} height={24} borderRadius={6} style={{ marginBottom: 12 }} />
          <Skeleton width="90%" height={28} style={{ marginBottom: 8 }} />
          <Skeleton width="75%" height={28} style={{ marginBottom: 20 }} />
          <Skeleton width="100%" height={120} borderRadius={12} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={100} borderRadius={12} />
        </View>
      </View>
    );
  }

  if (loadError || !kegiatan) {
    return (
      <View style={styles.container}>
        <ErrorState
          title="Data belum bisa dimuat"
          message={loadError || 'Kegiatan prodi tidak ditemukan.'}
          onRetry={loadDetail}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <View style={[styles.mainCard, Shadows.card]}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{kegiatan.kategori}</Text>
        </View>

        <Text style={styles.titleText}>{kegiatan.judul}</Text>

        <View style={styles.divider} />

        {/* Schedule Info List */}
        <View style={styles.infoList}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>Tanggal</Text>
              <Text style={styles.infoValue}>{kegiatan.tanggal}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="time-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>Waktu Pelaksanaan</Text>
              <Text style={styles.infoValue}>{kegiatan.waktu}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>Lokasi / Tempat</Text>
              <Text style={styles.infoValue}>{kegiatan.tempat}</Text>
            </View>
          </View>

          {kegiatan.narasumber && (
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Ionicons name="person-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>Narasumber / Penyelenggara</Text>
                <Text style={styles.infoValue}>{kegiatan.narasumber}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Description Card */}
      <View style={[styles.descCard, Shadows.card]}>
        <Text style={styles.sectionTitle}>Deskripsi Kegiatan</Text>
        <Text style={styles.descBody}>{kegiatan.deskripsi}</Text>
      </View>

      {/* Action Button: Register / More Info */}
      {kegiatan.tautanDaftar && (
        <Pressable
          onPress={handleOpenLink}
          accessibilityRole="button"
          accessibilityLabel={`Buka formulir pendaftaran untuk ${kegiatan.judul}`}
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
          style={({ pressed }) => [
            styles.actionButton,
            Shadows.card,
            { opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Ionicons name="open-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.actionButtonText}>Buka Tautan Pendaftaran</Text>
        </Pressable>
      )}
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
    padding: Spacing.lg,
  },
  mainCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  categoryBadge: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  categoryBadgeText: {
    fontSize: FontSize.badge,
    fontWeight: '700',
    color: Colors.primary,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.lg,
  },
  infoList: {
    gap: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  infoTextBox: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSize.secondary,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  descCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.sectionTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  descBody: {
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    minHeight: MinTouchSize,
  },
  actionButtonText: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
