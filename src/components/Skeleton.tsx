import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing } from '../constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 6,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const CourseListSkeleton: React.FC = () => {
  return (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.cardSkeleton}>
          <Skeleton width="75%" height={20} style={{ marginBottom: 8 }} />
          <Skeleton width="45%" height={14} style={{ marginBottom: 12 }} />
          <View style={styles.rowSkeleton}>
            <Skeleton width={60} height={20} borderRadius={6} style={{ marginRight: 8 }} />
            <Skeleton width={80} height={20} borderRadius={6} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E0E0E0',
  },
  skeletonContainer: {
    padding: Spacing.lg,
  },
  cardSkeleton: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  rowSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
