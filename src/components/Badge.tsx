import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { StatusMK } from '../types';

interface BadgeProps {
  type: StatusMK | 'wajib' | 'pilihan';
  label?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ type, label, size = 'sm' }) => {
  let bg = Colors.pilihan.bg;
  let text = Colors.pilihan.text;
  let border = Colors.pilihan.border;
  let defaultLabel = 'Pilihan';

  switch (type) {
    case 'lulus':
      bg = Colors.status.lulusBg;
      text = Colors.status.lulus;
      border = Colors.status.lulusBorder;
      defaultLabel = 'Lulus';
      break;
    case 'belum_lulus':
      bg = Colors.status.belumLulusBg;
      text = Colors.status.belumLulus;
      border = Colors.status.belumLulusBorder;
      defaultLabel = 'Belum Lulus';
      break;
    case 'ditempuh':
      bg = Colors.status.ditempuhBg;
      text = Colors.status.ditempuh;
      border = Colors.status.ditempuhBorder;
      defaultLabel = 'Sedang Ditempuh';
      break;
    case 'wajib':
      bg = Colors.wajib.bg;
      text = Colors.wajib.text;
      border = Colors.wajib.border;
      defaultLabel = 'Wajib';
      break;
    case 'pilihan':
      bg = Colors.pilihan.bg;
      text = Colors.pilihan.text;
      border = Colors.pilihan.border;
      defaultLabel = 'Pilihan';
      break;
  }

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          borderColor: border,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? 8 : 10,
        },
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${label || defaultLabel}`}
    >
      <Text
        style={[
          styles.text,
          {
            color: text,
            fontSize: isSmall ? FontSize.badge : FontSize.secondary,
          },
        ]}
      >
        {label || defaultLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
