import React from "react";
import { ScrollView, View, StyleSheet, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAcademic } from "../../context/AcademicContext";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { ProdiActivitySection } from "../../components/ProdiActivitySection";

export default function KegiatanListScreen() {
  const router = useRouter();
  const {
    kegiatanProdiList,
    isLoading,
    error,
    refreshData,
  } = useAcademic();

  const handleSelectKegiatan = (kegiatan: any) => {
    router.push({ pathname: "/kegiatan/[id]", params: { id: kegiatan.id } });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshData}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
    >
      <View style={styles.header}>
        <Ionicons name="calendar-outline" size={24} color={Colors.primary} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Jadwal Kegiatan Prodi</Text>
          <Text style={styles.subtitle}>Semua agenda kegiatan prodi</Text>
        </View>
      </View>

      <ProdiActivitySection
        kegiatanList={kegiatanProdiList}
        onSelectKegiatan={handleSelectKegiatan}
      />
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
    paddingBottom: Spacing.xxxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  titleContainer: {
    marginLeft: Spacing.sm,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});