import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { Colors, FontSize, MinTouchSize, Shadows, Spacing } from '../../src/constants/theme';
import {
  fetchKegiatanDetail,
  formatDateTimeIndo,
  getStoredPengingatById,
  saveStoredPengingat,
  removeStoredPengingat,
} from '../../src/data/kegiatan';
import { Kegiatan, Pengingat } from '../../src/types';
import { Skeleton } from '../../src/components/Skeleton';
import { ErrorState } from '../../src/components/StateView';
import { ReminderBottomSheet } from '../../src/components/ReminderBottomSheet';
import { ReminderConfirmationModal } from '../../src/components/ReminderConfirmationModal';

export default function DetailKegiatanScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [kegiatan, setKegiatan] = useState<Kegiatan | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Reminder states (FR-05, FR-06)
  const [activePengingat, setActivePengingat] = useState<Pengingat | undefined>(undefined);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [recentSavedPengingat, setRecentSavedPengingat] = useState<Pengingat | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setLoadError(null);
    try {
      const [data, pengingat] = await Promise.all([
        fetchKegiatanDetail(id),
        getStoredPengingatById(id),
      ]);

      if (data) {
        setKegiatan(data);
        setActivePengingat(pengingat);
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenRegisterLink = async () => {
    if (!kegiatan?.tautanPendaftaran) return;

    if (Platform.OS === 'web') {
      window.open(kegiatan.tautanPendaftaran, '_blank');
    } else {
      try {
        await WebBrowser.openBrowserAsync(kegiatan.tautanPendaftaran);
      } catch (err) {
        Alert.alert('Informasi Tautan', kegiatan.tautanPendaftaran);
      }
    }
  };

  const handleSaveReminder = async (waktu: '1_hari' | '3_jam' | '1_jam') => {
    if (!kegiatan) return;
    try {
      const saved = await saveStoredPengingat(kegiatan.id, waktu);
      setActivePengingat(saved);
      setRecentSavedPengingat(saved);
      setSheetVisible(false);
      // Show confirmation modal (K5)
      setConfirmationVisible(true);
    } catch {
      Alert.alert('Kesalahan', 'Gagal menyimpan pengingat.');
    }
  };

  const handleDeleteReminder = async () => {
    if (!kegiatan) return;
    try {
      await removeStoredPengingat(kegiatan.id);
      setActivePengingat(undefined);
      setSheetVisible(false);
      showToast('Pengingat dihapus');
    } catch {
      Alert.alert('Kesalahan', 'Gagal menghapus pengingat.');
    }
  };

  const handleGoToKegiatanSaya = () => {
    setConfirmationVisible(false);
    router.push('/kegiatan/saya');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.appBar}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.appBarTitle}>Detail Kegiatan</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Skeleton width={110} height={26} borderRadius={6} style={{ marginBottom: 12 }} />
          <Skeleton width="90%" height={28} style={{ marginBottom: 8 }} />
          <Skeleton width="75%" height={28} style={{ marginBottom: 20 }} />
          <Skeleton width="100%" height={140} borderRadius={12} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={120} borderRadius={12} />
        </View>
      </SafeAreaView>
    );
  }

  if (loadError || !kegiatan) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.appBar}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.appBarTitle}>Detail Kegiatan</Text>
        </View>
        <ErrorState
          title="Data belum bisa dimuat"
          message={loadError || 'Kegiatan prodi tidak ditemukan.'}
          onRetry={loadDetail}
        />
      </SafeAreaView>
    );
  }

  const formattedDateTime = formatDateTimeIndo(kegiatan.mulai);

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
        <Text style={styles.appBarTitle}>Detail Kegiatan</Text>
      </View>

      {/* Toast Notification */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Ionicons name="information-circle" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Header Card */}
        <View style={[styles.mainCard, Shadows.card]}>
          {/* Badge Row: Category & Mode */}
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{kegiatan.kategori}</Text>
            </View>

            <View
              style={[
                styles.modeBadge,
                kegiatan.mode === 'daring' ? styles.modeDaring : styles.modeLuring,
              ]}
            >
              <Ionicons
                name={kegiatan.mode === 'daring' ? 'videocam-outline' : 'business-outline'}
                size={12}
                color={kegiatan.mode === 'daring' ? '#0369A1' : '#15803D'}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.modeBadgeText,
                  { color: kegiatan.mode === 'daring' ? '#0369A1' : '#15803D' },
                ]}
              >
                {kegiatan.mode === 'daring' ? 'Daring' : 'Luring'}
              </Text>
            </View>

            {/* Registration Status Badge (K3, FR-04) */}
            <View
              style={[
                styles.statusBadge,
                kegiatan.statusPendaftaran === 'dibuka'
                  ? styles.statusDibuka
                  : kegiatan.statusPendaftaran === 'ditutup'
                  ? styles.statusDitutup
                  : styles.statusTanpa,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  kegiatan.statusPendaftaran === 'dibuka'
                    ? styles.statusDibukaText
                    : kegiatan.statusPendaftaran === 'ditutup'
                    ? styles.statusDitutupText
                    : styles.statusTanpaText,
                ]}
              >
                {kegiatan.statusPendaftaran === 'dibuka'
                  ? 'Pendaftaran Dibuka'
                  : kegiatan.statusPendaftaran === 'ditutup'
                  ? 'Pendaftaran Ditutup'
                  : 'Tanpa Pendaftaran'}
              </Text>
            </View>
          </View>

          {/* Activity Title */}
          <Text style={styles.titleText}>{kegiatan.judul}</Text>

          <View style={styles.divider} />

          {/* Schedule Info List */}
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>Tanggal & Waktu</Text>
                <Text style={styles.infoValue}>{formattedDateTime}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Ionicons
                  name={kegiatan.mode === 'daring' ? 'videocam-outline' : 'location-outline'}
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>Tempat / Lokasi</Text>
                <Text style={styles.infoValue}>{kegiatan.tempat}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Ionicons name="people-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>Penyelenggara</Text>
                <Text style={styles.infoValue}>{kegiatan.penyelenggara}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description Card */}
        <View style={[styles.descCard, Shadows.card]}>
          <Text style={styles.sectionTitle}>Deskripsi Kegiatan</Text>
          <Text style={styles.descBody}>{kegiatan.deskripsi}</Text>
        </View>

        {/* Buttons Section (K3, FR-04, FR-05) */}
        <View style={styles.actionContainer}>
          {/* Primary Button: "Ingatkan saya" / "Pengingat aktif · Ubah" (SKILL.md §5a) */}
          <Pressable
            onPress={() => setSheetVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={
              activePengingat
                ? 'Pengingat aktif, ketuk untuk mengubah atau menghapus'
                : 'Ingatkan saya untuk kegiatan ini'
            }
            style={({ pressed }) => [
              activePengingat ? styles.reminderActiveButton : styles.reminderButton,
              Shadows.card,
              { opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Ionicons
              name={activePengingat ? 'notifications' : 'notifications-outline'}
              size={20}
              color={activePengingat ? Colors.primary : '#FFFFFF'}
              style={{ marginRight: 8 }}
            />
            <Text
              style={
                activePengingat
                  ? styles.reminderActiveButtonText
                  : styles.reminderButtonText
              }
            >
              {activePengingat ? 'Pengingat aktif · Ubah' : 'Ingatkan saya'}
            </Text>
          </Pressable>

          {/* Secondary Button: "Daftar" - ONLY shown if status is 'dibuka' and has link (FR-04) */}
          {kegiatan.statusPendaftaran === 'dibuka' && kegiatan.tautanPendaftaran && (
            <Pressable
              onPress={handleOpenRegisterLink}
              accessibilityRole="button"
              accessibilityLabel={`Buka tautan pendaftaran untuk ${kegiatan.judul}`}
              style={({ pressed }) => [
                styles.registerButton,
                Shadows.card,
                { opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Ionicons name="open-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.registerButtonText}>Daftar Kegiatan</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* K4: Bottom Sheet Atur Pengingat */}
      <ReminderBottomSheet
        visible={sheetVisible}
        kegiatan={kegiatan}
        existingPengingat={activePengingat}
        onClose={() => setSheetVisible(false)}
        onSave={handleSaveReminder}
        onDelete={handleDeleteReminder}
      />

      {/* K5: Konfirmasi Pengingat */}
      {recentSavedPengingat && (
        <ReminderConfirmationModal
          visible={confirmationVisible}
          kegiatan={kegiatan}
          pengingat={recentSavedPengingat}
          onClose={() => setConfirmationVisible(false)}
          onGoToKegiatanSaya={handleGoToKegiatanSaya}
        />
      )}
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
  loadingContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.background,
    flex: 1,
  },
  mainCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: FontSize.badge,
    fontWeight: '700',
    color: Colors.primary,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  modeLuring: {
    backgroundColor: '#DCFCE7',
  },
  modeDaring: {
    backgroundColor: '#E0F2FE',
  },
  modeBadgeText: {
    fontSize: FontSize.badge,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: FontSize.badge,
    fontWeight: '600',
  },
  statusDibuka: {
    backgroundColor: '#DCFCE7',
  },
  statusDibukaText: {
    fontSize: FontSize.badge,
    fontWeight: '700',
    color: '#15803D',
  },
  statusDitutup: {
    backgroundColor: '#FEE2E2',
  },
  statusDitutupText: {
    fontSize: FontSize.badge,
    fontWeight: '700',
    color: '#B91C1C',
  },
  statusTanpa: {
    backgroundColor: '#F1F5F9',
  },
  statusTanpaText: {
    fontSize: FontSize.badge,
    fontWeight: '600',
    color: Colors.textSecondary,
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
  actionContainer: {
    gap: Spacing.sm,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: Spacing.md,
    minHeight: MinTouchSize,
  },
  reminderButtonText: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reminderActiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: Spacing.md,
    minHeight: MinTouchSize,
  },
  reminderActiveButtonText: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.primary,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingVertical: Spacing.md,
    minHeight: MinTouchSize,
  },
  registerButtonText: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
