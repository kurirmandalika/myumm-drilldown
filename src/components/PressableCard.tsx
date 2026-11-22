import React, { useState, useCallback } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
  Platform,
  StyleSheet,
} from "react-native";
import { Colors } from "../constants/theme";

interface PressableCardProps extends Omit<PressableProps, "style"> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  debounceMs?: number;
}

/**
 * Komponen pembungkus sentuhan dengan umpan balik visual langsung (< 100ms)
 * dan proteksi double-tap (FR-05, UXR-02)
 */
export const PressableCard: React.FC<PressableCardProps> = ({
  children,
  style,
  pressedStyle,
  onPress,
  debounceMs = 600,
  accessibilityRole = "button",
  accessibilityLabel,
  accessibilityHint,
  ...rest
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePress = useCallback(() => {
    if (isProcessing) return;
    setIsProcessing(true);
    if (onPress) {
      onPress();
    }
    setTimeout(() => {
      setIsProcessing(false);
    }, debounceMs);
  }, [isProcessing, onPress, debounceMs]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      android_ripple={{
        color: Colors.ripple,
        borderless: false,
      }}
      style={({ pressed }) => [
        styles.base,
        style,
        pressed && (pressedStyle || styles.defaultPressed),
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 44, // Target sentuh minimal 44pt (WCAG AA)
  },
  defaultPressed: {
    opacity: Platform.OS === "ios" ? 0.75 : 0.9,
    transform: [{ scale: 0.985 }],
  },
});
