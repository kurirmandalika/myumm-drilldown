import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AcademicProvider } from "../context/AcademicContext";
import { Colors } from "../constants/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AcademicProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.textInverse,
            headerTitleStyle: {
              fontWeight: "600",
            },
            contentStyle: {
              backgroundColor: Colors.background,
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="mata-kuliah/index"
            options={{ title: "Daftar Mata Kuliah" }}
          />
          <Stack.Screen
            name="mata-kuliah/[kode]"
            options={{ title: "Detail Mata Kuliah" }}
          />
          <Stack.Screen
            name="kegiatan/index"
            options={{ title: "Jadwal Kegiatan Prodi" }}
          />
          <Stack.Screen
            name="kegiatan/[id]"
            options={{ title: "Detail Kegiatan" }}
          />
          <Stack.Screen
            name="kegiatan/saya"
            options={{ title: "Kegiatan Saya" }}
          />
        </Stack>
      </AcademicProvider>
    </SafeAreaProvider>
  );
}
