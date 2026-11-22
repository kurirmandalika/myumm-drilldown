import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.textOnPrimary,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerBackTitle: 'Kembali',
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="mata-kuliah/index"
          options={{
            title: 'Daftar Mata Kuliah',
          }}
        />
        <Stack.Screen
          name="mata-kuliah/[kode]"
          options={{
            title: 'Detail Mata Kuliah',
          }}
        />
        <Stack.Screen
          name="kegiatan/[id]"
          options={{
            title: 'Detail Kegiatan Prodi',
          }}
        />
      </Stack>
    </>
  );
}
