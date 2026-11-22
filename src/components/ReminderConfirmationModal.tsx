import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, MinTouchSize, Shadows, Spacing } from '../constants/theme';
import { Kegiatan, Pengingat } from '../types';
import { formatDateOnlyIndo } from '../data/kegiatan';

interface ReminderConfirmationModalProps {
  visible: boolean;
  kegiatan: Kegiatan;
  pengingat: Pengingat;
  onClose: () => void;
  onGoToKegiatanSaya: () => void;
}

export const ReminderConfirmationModal: React.FC<ReminderConfirmationModalProps> = ({
  visible,
  kegiatan,
  pengingat,
  onClose,
  onGoToKegiatanSaya,
}) => {
  if (!visible) return null;

  const waktuTeks =
    pengingat.waktu === '1_hari'
      ? '1 hari'
      : pengingat.waktu === '3_jam'
      ? '3 jam'
      : '1 jam';

  const tanggalTeks = formatDateOnlyIndo(kegiatan.mulai);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.dialogCard, Shadows.card]}>
          {/* Success Check Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={32} color="#1E7B4F" />
          </View>

          <Text style={styles.title}>Pengingat disimpan</Text>

          {/* Detailed summary mentioning what and when per SKILL.md §5a & PRD §7 K5 */}
          <Text style={styles.summaryText}>
            Kamu akan diingatkan <Text style={styles.highlightText}>{waktuTeks} sebelum</Text>{' '}
            <Text style={styles.highlightText}>{kegiatan.judul}</Text>, {tanggalTeks}.
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={onGoToKegiatanSaya}
              accessibilityRole="button"
              accessibilityLabel="Buka halaman Kegiatan Saya"
              style={({ pressed }) => [
                styles.primaryButton,
                { opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text style={styles.primaryButtonText}>Lihat Kegiatan Saya</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </Pressable>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Kembali ke kegiatan"
              style={({ pressed }) => [
                styles.secondaryButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={styles.secondaryButtonText}>Kembali ke kegiatan</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  summaryText: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  highlightText: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  buttonContainer: {
    width: '100%',
    gap: Spacing.sm,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minHeight: MinTouchSize,
    paddingVertical: Spacing.md,
  },
  primaryButtonText: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    minHeight: MinTouchSize,
    paddingVertical: Spacing.sm,
  },
  secondaryButtonText: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
