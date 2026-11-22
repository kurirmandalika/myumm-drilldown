import React, { useRef } from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, MinTouchSize, Shadows, Spacing } from '../constants/theme';
import { StatusMK } from '../types';
import { Badge } from './Badge';

interface StatusCardProps {
  status: StatusMK;
  count: number;
  sks: number;
  onPress: () => void;
  disabled?: boolean;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  status,
  count,
  sks,
  onPress,
  disabled = false,
}) => {
  // Prevent double tap / double navigation
  const isNavigatingRef = useRef(false);

  const handlePress = () => {
    if (disabled || isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    onPress();
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 800);
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'lulus':
        return {
          title: 'Lulus',
          accentColor: Colors.status.lulus,
          bgAccent: Colors.status.lulusBg,
          icon: 'checkmark-circle' as const,
          desc: `${sks} SKS telah diselesaikan`,
          accessibilityLabel: `Lulus, ${count} mata kuliah, ${sks} SKS diselesaikan. Ketuk dua kali untuk melihat rincian`,
        };
      case 'belum_lulus':
        return {
          title: 'Belum Lulus',
          accentColor: Colors.status.belumLulus,
          bgAccent: Colors.status.belumLulusBg,
          icon: 'alert-circle' as const,
          desc: `${sks} SKS perlu perbaikan/ulang`,
          accessibilityLabel: `Belum Lulus, ${count} mata kuliah, ${sks} SKS belum terpenuhi. Ketuk dua kali untuk melihat rincian`,
        };
      case 'ditempuh':
        return {
          title: 'Sedang Ditempuh',
          accentColor: Colors.status.ditempuh,
          bgAccent: Colors.status.ditempuhBg,
          icon: 'time' as const,
          desc: `${sks} SKS semester berjalan`,
          accessibilityLabel: `Sedang Ditempuh, ${count} mata kuliah, ${sks} SKS semester berjalan. Ketuk dua kali untuk melihat rincian`,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={config.accessibilityLabel}
      accessibilityHint="Membuka daftar mata kuliah sesuai status ini"
      android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
      style={({ pressed }) => [
        styles.cardContainer,
        Shadows.card,
        {
          borderColor: pressed ? config.accentColor : Colors.border,
          backgroundColor: pressed ? Colors.cardPressed : Colors.cardBackground,
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
      ]}
    >
      <View style={[styles.leftAccentBar, { backgroundColor: config.accentColor }]} />

      <View style={styles.cardContent}>
        {/* Top row: Status badge + Accent Icon */}
        <View style={styles.topRow}>
          <Badge type={status} label={config.title} size="md" />
          <View style={[styles.iconCircle, { backgroundColor: config.bgAccent }]}>
            <Ionicons name={config.icon} size={18} color={config.accentColor} />
          </View>
        </View>

        {/* Center: Count and subtitle */}
        <View style={styles.numberRow}>
          <Text style={[styles.countText, { color: config.accentColor }]}>{count}</Text>
          <Text style={styles.unitText}>mata kuliah</Text>
        </View>

        <Text style={styles.descText}>{config.desc}</Text>

        <View style={styles.divider} />

        {/* Bottom row: Signifier 'Lihat rincian' + Chevron '›' */}
        <View style={styles.bottomRow}>
          <Text style={[styles.actionText, { color: config.accentColor }]}>Lihat rincian</Text>
          <View style={[styles.chevronContainer, { backgroundColor: config.bgAccent }]}>
            <Ionicons name="chevron-forward" size={16} color={config.accentColor} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.md,
    minHeight: MinTouchSize,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  leftAccentBar: {
    width: 6,
  },
  cardContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: Spacing.xs,
  },
  countText: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
    marginRight: Spacing.sm,
  },
  unitText: {
    fontSize: FontSize.body,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  descText: {
    fontSize: FontSize.secondary,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  actionText: {
    fontSize: FontSize.secondary,
    fontWeight: '600',
  },
  chevronContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
