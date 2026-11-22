import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, MinTouchSize, Shadows, Spacing } from '../../src/constants/theme';
import {
  DUMMY_MAHASISWA,
  simulationState,
  setSimulateLoadError,
  setSimulateEmptyBelumLulus,
  resetSimulationState,
  subscribeSimulationState,
} from '../../src/data/mataKuliah';

export default function ProfilScreen() {
  const [simulateError, setSimulateError] = useState(simulationState.simulateLoadError);
  const [simulateEmpty, setSimulateEmpty] = useState(simulationState.simulateEmptyBelumLulus);

  useEffect(() => {
    const unsubscribe = subscribeSimulationState(() => {
      setSimulateError(simulationState.simulateLoadError);
      setSimulateEmpty(simulationState.simulateEmptyBelumLulus);
    });
    return unsubscribe;
  }, []);

  const handleToggleError = (val: boolean) => {
    setSimulateLoadError(val);
  };

  const handleToggleEmpty = (val: boolean) => {
    setSimulateEmptyBelumLulus(val);
  };

  const handleReset = () => {
    resetSimulationState();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Student Profile Info Card */}
      <View style={[styles.card, Shadows.card]}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Ionicons name="person" size={40} color={Colors.primary} />
          </View>
          <View style={styles.profileNameBox}>
            <Text style={styles.studentName}>{DUMMY_MAHASISWA.nama}</Text>
            <Text style={styles.studentNIM}>{DUMMY_MAHASISWA.nim}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>Mahasiswa {DUMMY_MAHASISWA.statusAkademik}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailList}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Program Studi</Text>
            <Text style={styles.detailValue}>{DUMMY_MAHASISWA.prodi}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fakultas</Text>
            <Text style={styles.detailValue}>{DUMMY_MAHASISWA.fakultas}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Semester</Text>
            <Text style={styles.detailValue}>Semester {DUMMY_MAHASISWA.semester}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dosen PA</Text>
            <Text style={styles.detailValue} numberOfLines={2}>
              {DUMMY_MAHASISWA.dosenPA}
            </Text>
          </View>
        </View>
      </View>

      {/* FR-07 Demo State Simulation Section */}
      <View style={[styles.sectionTitleRow, { marginTop: Spacing.lg }]}>
        <Ionicons name="construct-outline" size={20} color={Colors.primary} style={{ marginRight: 6 }} />
        <Text style={styles.sectionTitle}>Simulasi Pengujian State (FR-07)</Text>
      </View>
      <Text style={styles.sectionSubtitle}>
        Fitur ini disediakan khusus untuk mendemonstrasikan penanganan kondisi gagal dan kosong pada evaluasi usability prototype.
      </Text>

      <View style={[styles.card, Shadows.card, { marginTop: Spacing.sm }]}>
        {/* Toggle 1: Simulasikan gagal memuat */}
        <View style={styles.switchRow}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchLabel}>Simulasikan gagal memuat</Text>
            <Text style={styles.switchDesc}>
              Memicu error jaringan simulasi saat memuat data mata kuliah, sehingga tampilan gagal dan tombol "Coba lagi" muncul.
            </Text>
          </View>
          <Switch
            value={simulateError}
            onValueChange={handleToggleError}
            trackColor={{ false: '#D1D5DB', true: Colors.status.belumLulus }}
            thumbColor={simulateError ? '#FFFFFF' : '#F4F3F4'}
            accessibilityLabel="Simulasikan gagal memuat data"
          />
        </View>

        <View style={styles.divider} />

        {/* Toggle 2: Simulasikan belum lulus kosong */}
        <View style={styles.switchRow}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchLabel}>Simulasikan belum lulus kosong</Text>
            <Text style={styles.switchDesc}>
              Mengosongkan daftar mata kuliah belum lulus untuk mendemonstrasikan state positif ("Tidak ada mata kuliah yang belum lulus") beserta tombol aksi lanjutan.
            </Text>
          </View>
          <Switch
            value={simulateEmpty}
            onValueChange={handleToggleEmpty}
            trackColor={{ false: '#D1D5DB', true: Colors.status.lulus }}
            thumbColor={simulateEmpty ? '#FFFFFF' : '#F4F3F4'}
            accessibilityLabel="Simulasikan kondisi tidak ada mata kuliah belum lulus"
          />
        </View>

        <View style={styles.divider} />

        {/* Reset button */}
        <Pressable
          onPress={handleReset}
          accessibilityRole="button"
          accessibilityLabel="Reset simulasi ke kondisi normal"
          style={({ pressed }) => [
            styles.resetButton,
            { opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <Ionicons name="reload-outline" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.resetButtonText}>Kembalikan ke Kondisi Normal</Text>
        </Pressable>
      </View>

      {/* Info Prototype */}
      <View style={styles.prototypeNotice}>
        <Ionicons name="information-circle-outline" size={18} color={Colors.textSecondary} />
        <Text style={styles.prototypeNoticeText}>
          myUMM Student Prototype — Modul Drill-down Status Mata Kuliah.{'\n'}
          Rekayasa Interaksi, Universitas Muhammadiyah Malang.
        </Text>
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
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  profileNameBox: {
    flex: 1,
  },
  studentName: {
    fontSize: FontSize.sectionTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  studentNIM: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#EDF7ED',
    borderWidth: 1,
    borderColor: '#B7EB8F',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  statusBadgeText: {
    fontSize: FontSize.badge,
    fontWeight: '600',
    color: Colors.status.lulus,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  detailList: {
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: FontSize.secondary,
    color: Colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1.5,
    textAlign: 'right',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
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
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MinTouchSize,
  },
  switchInfo: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  switchLabel: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  switchDesc: {
    fontSize: FontSize.secondary,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    minHeight: MinTouchSize,
  },
  resetButtonText: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.primary,
  },
  prototypeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: '#EDEDF0',
    borderRadius: 8,
    marginTop: Spacing.sm,
  },
  prototypeNoticeText: {
    fontSize: FontSize.badge,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    lineHeight: 18,
    flex: 1,
  },
});
