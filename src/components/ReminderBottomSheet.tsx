import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, MinTouchSize, Shadows, Spacing } from '../constants/theme';
import { Kegiatan, Pengingat } from '../types';

interface ReminderBottomSheetProps {
  visible: boolean;
  kegiatan: Kegiatan;
  existingPengingat?: Pengingat;
  onClose: () => void;
  onSave: (waktu: '1_hari' | '3_jam' | '1_jam') => void;
  onDelete?: () => void;
}

const WAKTU_OPTIONS: { id: '1_hari' | '3_jam' | '1_jam'; label: string }[] = [
  { id: '1_hari', label: '1 hari sebelumnya' },
  { id: '3_jam', label: '3 jam sebelumnya' },
  { id: '1_jam', label: '1 jam sebelumnya' },
];

export const ReminderBottomSheet: React.FC<ReminderBottomSheetProps> = ({
  visible,
  kegiatan,
  existingPengingat,
  onClose,
  onSave,
  onDelete,
}) => {
  const [selectedWaktu, setSelectedWaktu] = useState<'1_hari' | '3_jam' | '1_jam'>('1_hari');

  useEffect(() => {
    if (existingPengingat) {
      setSelectedWaktu(existingPengingat.waktu);
    } else {
      setSelectedWaktu('1_hari');
    }
  }, [existingPengingat, visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.sheetContainer, Shadows.card]}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.headerIndicator} />
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetTitle}>
                  {existingPengingat ? 'Ubah Pengingat' : 'Atur Pengingat'}
                </Text>
                <Text style={styles.kegiatanTitle} numberOfLines={1}>
                  {kegiatan.judul}
                </Text>
              </View>
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Tutup pengaturan pengingat"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </Pressable>
            </View>
          </View>

          {/* Options List (Radio Buttons per PRD §7 K4 & SKILL.md §5a) */}
          <View style={styles.optionsList}>
            <Text style={styles.sectionLabel}>Pilih waktu pengingat:</Text>

            {WAKTU_OPTIONS.map((opt) => {
              const isSelected = selectedWaktu === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => setSelectedWaktu(opt.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`Ingatkan ${opt.label}`}
                  style={({ pressed }) => [
                    styles.radioItem,
                    isSelected && styles.radioItemSelected,
                    { opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected && <View style={styles.radioInnerDot} />}
                  </View>
                  <Text style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => onSave(selectedWaktu)}
              accessibilityRole="button"
              accessibilityLabel="Simpan pengingat kegiatan"
              style={({ pressed }) => [
                styles.saveButton,
                { opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Ionicons name="notifications" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.saveButtonText}>Simpan pengingat</Text>
            </Pressable>

            {existingPengingat && onDelete && (
              <Pressable
                onPress={onDelete}
                accessibilityRole="button"
                accessibilityLabel="Hapus pengingat ini"
                style={({ pressed }) => [
                  styles.deleteButton,
                  { opacity: pressed ? 0.75 : 1 },
                ]}
              >
                <Ionicons name="trash-outline" size={18} color="#DC2626" style={{ marginRight: 6 }} />
                <Text style={styles.deleteButtonText}>Hapus pengingat</Text>
              </Pressable>
            )}

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Batal atur pengingat"
              style={({ pressed }) => [
                styles.cancelButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 36 : Spacing.xl,
  },
  headerIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  sheetHeader: {
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    fontSize: FontSize.sectionTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  kegiatanTitle: {
    fontSize: FontSize.secondary,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsList: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: FontSize.secondary,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    minHeight: MinTouchSize,
  },
  radioItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  radioCircleSelected: {
    borderColor: Colors.primary,
  },
  radioInnerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  radioLabel: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  radioLabelSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  buttonContainer: {
    gap: Spacing.xs,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minHeight: MinTouchSize,
    paddingVertical: Spacing.md,
  },
  saveButtonText: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    minHeight: MinTouchSize,
    paddingVertical: Spacing.md,
    marginTop: 4,
  },
  deleteButtonText: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: '#DC2626',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MinTouchSize,
    paddingVertical: Spacing.sm,
  },
  cancelButtonText: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
