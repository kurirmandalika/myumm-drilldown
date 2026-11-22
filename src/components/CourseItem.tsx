import React, { useRef } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, MinTouchSize, Shadows, Spacing } from '../constants/theme';
import { MataKuliah } from '../types';
import { Badge } from './Badge';

interface CourseItemProps {
  course: MataKuliah;
  onPress: () => void;
  showStatusBadge?: boolean;
}

export const CourseItem: React.FC<CourseItemProps> = ({
  course,
  onPress,
  showStatusBadge = false,
}) => {
  const isNavigatingRef = useRef(false);

  const handlePress = () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    onPress();
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 700);
  };

  const getStatusLabel = () => {
    switch (course.status) {
      case 'lulus':
        return 'Lulus';
      case 'belum_lulus':
        return 'Belum Lulus';
      case 'ditempuh':
        return 'Sedang Ditempuh';
    }
  };

  const accessibilityLabel = `${course.nama}, kode ${course.kode}, ${course.sks} SKS, Semester ${course.semester}, ${
    course.wajib ? 'Mata Kuliah Wajib' : 'Mata Kuliah Pilihan'
  }${course.nilai ? `, Nilai ${course.nilai}` : ''}, status ${getStatusLabel()}. Ketuk untuk melihat rincian`;

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Buka rincian mata kuliah dan daftar prasyarat"
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
      style={({ pressed }) => [
        styles.container,
        Shadows.card,
        {
          backgroundColor: pressed ? Colors.cardPressed : Colors.cardBackground,
          opacity: pressed ? 0.88 : 1,
          borderColor: pressed ? Colors.primary : Colors.border,
        },
      ]}
    >
      <View style={styles.contentLeft}>
        {/* 1. Nama mata kuliah (teks tebal, 16) */}
        <Text style={styles.title} numberOfLines={2}>
          {course.nama}
        </Text>

        {/* 2. Kode · SKS · Semester (teks sekunder, 13) */}
        <Text style={styles.subtitle}>
          {course.kode} · {course.sks} SKS · Semester {course.semester}
        </Text>

        {/* Tags row: Wajib/Pilihan badge + optional status badge */}
        <View style={styles.tagRow}>
          <Badge
            type={course.wajib ? 'wajib' : 'pilihan'}
            label={course.wajib ? 'Wajib' : 'Pilihan'}
            size="sm"
          />
          {showStatusBadge && (
            <View style={{ marginLeft: Spacing.xs }}>
              <Badge type={course.status} size="sm" />
            </View>
          )}
          {course.prasyarat.length > 0 && (
            <View style={styles.prasyaratChip}>
              <Ionicons name="git-network-outline" size={11} color={Colors.textSecondary} style={{ marginRight: 2 }} />
              <Text style={styles.prasyaratText}>{course.prasyarat.length} Prasyarat</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.contentRight}>
        {/* Nilai bila ada */}
        {course.nilai ? (
          <View style={styles.gradeBox}>
            <Text style={styles.gradeLabel}>Nilai</Text>
            <Text
              style={[
                styles.gradeValue,
                {
                  color:
                    course.status === 'lulus'
                      ? Colors.status.lulus
                      : Colors.status.belumLulus,
                },
              ]}
            >
              {course.nilai}
            </Text>
          </View>
        ) : null}

        {/* 4. Chevron '›' */}
        <View style={styles.chevronBox}>
          <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    minHeight: MinTouchSize,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentLeft: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  title: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.secondary,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  prasyaratChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  prasyaratText: {
    fontSize: FontSize.badge,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  contentRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeBox: {
    alignItems: 'center',
    marginRight: Spacing.sm,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minWidth: 42,
  },
  gradeLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  gradeValue: {
    fontSize: FontSize.body,
    fontWeight: '700',
  },
  chevronBox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
