import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/theme";

export default function ProfilScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profil Pengguna</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
});
