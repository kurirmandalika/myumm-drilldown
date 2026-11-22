import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors, FontSize, Spacing } from '../../src/constants/theme';

export default function DetailMataKuliahScreen() {
  const { kode } = useLocalSearchParams<{ kode: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detail Mata Kuliah</Text>
      <Text style={styles.text}>Kode MK: {kode}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.screenTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  text: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
