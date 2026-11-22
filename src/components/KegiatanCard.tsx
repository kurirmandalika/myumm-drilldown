import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, MinTouchSize, Shadows, Spacing } from '../constants/theme';
import { Kegiatan } from '../types';
import {
  getDateBlock,
  formatDateTimeIndo,
  getKegiatanBadges,
} from '../data/kegiatan';

interface KegiatanCardProps {
  kegiatan: Kegiatan;
  hasPengingat?: boolean;
  onPress: () => void;
}

export const KegiatanCard: React.FC<KegiatanCardProps> = ({
  kegiatan,
  hasPengingat = false,
  onPress,
}) => {
  const dateBlock = getDateBlock(kegiatan.mulai);
  const badges = getKegiatanBadges(kegiatan);
  const formattedDateTime = formatDateTimeIndo(kegiatan.mulai);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${kegiatan.judul}, kategori ${kegiatan.kategori}, ${formattedDateTime}, tempat ${kegiatan.tempat}. Ketuk untuk melihat rincian kegiatan`}
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
      {/* Date Block on Left (SKILL.md §5a) */}
      <View style={styles.dateBlock}>
        <Text style={styles.dateDayText}>{dateBlock.day}</Text>
        <Text style={styles.dateMonthText}>{dateBlock.month}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Badges Row */}
        <View style={styles.badgeRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{kegiatan.kategori}</Text>
          </View>

          {badges.isHariIni && (
            <View style={[styles.statusBadge, styles.badgeHariIni]}>
              <Text style={styles.badgeHariIniText}>Hari ini</Text>
            </View>
          )}

          {!badges.isHariIni && badges.isBesok && (
            <View style={[styles.statusBadge, styles.badgeBesok]}>
              <Text style={styles.badgeBesokText}>Besok</Text>
            </View>
          )}

          {badges.isBaru && (
            <View style={[styles.statusBadge, styles.badgeBaru]}>
              <Text style={styles.badgeBaruText}>Baru</Text>
            </View>
          )}

          {hasPengingat && (
            <View style={styles.reminderIndicator}>
              <Ionicons name="notifications" size={13} color={Colors.primary} />
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={styles.titleText} numberOfLines={2}>
          {kegiatan.judul}
        </Text>

        {/* Time and Place Info */}
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={13} color={Colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={styles.metaText} numberOfLines={1}>
            {formattedDateTime.split('·')[1]?.trim() || formattedDateTime}
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
            {kegiatan.mode === 'daring' ? `Daring · ${kegiatan.tempat}` : kegiatan.tempat}
          </Text>
        </View>
      </View>

      {/* Chevron Signifier (SKILL.md §2) */}
      <View style={styles.chevronBox}>
        <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
    height: 52,
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
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
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
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeHariIni: {
    backgroundColor: '#FEE2E2',
  },
  badgeHariIniText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  badgeBesok: {
    backgroundColor: '#FEF3C7',
  },
  badgeBesokText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  badgeBaru: {
    backgroundColor: '#E0F2FE',
  },
  badgeBaruText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369A1',
  },
  reminderIndicator: {
    marginLeft: 2,
    paddingHorizontal: 4,
    paddingVertical: 2,
    backgroundColor: Colors.primaryLight,
    borderRadius: 4,
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
  chevronBox: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
});
