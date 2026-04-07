import { BlurView } from 'expo-blur';
import React, { useCallback } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface GlassButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  tint?: 'light' | 'dark' | 'orange';
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function GlassButton({ label, onPress, style, tint = 'light' }: GlassButtonProps) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  const onPressIn = useCallback(() => {
    scale.value = withSpring(0.91, { damping: 22, stiffness: 420 });
    glow.value = withTiming(0.38, { duration: 55 });
  }, [scale, glow]);

  const onPressOut = useCallback(() => {
    // Squish → slight overshoot → settle
    scale.value = withSequence(
      withSpring(1.06, { damping: 8, stiffness: 220 }),
      withSpring(1, { damping: 14, stiffness: 180 })
    );
    glow.value = withTiming(0, { duration: 280 });
  }, [scale, glow]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));

  const isOrange = tint === 'orange';

  return (
    <AnimatedTouchable
      activeOpacity={1}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.wrapper, style, animStyle]}
    >
      {Platform.OS !== 'web' ? (
        <BlurView
          intensity={isOrange ? 0 : 60}
          tint="light"
          style={[styles.blur, isOrange && styles.orangeFill]}
        >
          <Text style={[styles.label, isOrange && styles.labelLight]}>{label}</Text>
          {/* Glow flash overlay */}
          <Animated.View style={[styles.glowOverlay, glowStyle]} pointerEvents="none" />
        </BlurView>
      ) : (
        /* Web fallback — no BlurView */
        <View style={[styles.blur, isOrange && styles.orangeFill]}>
          <Text style={[styles.label, isOrange && styles.labelLight]}>{label}</Text>
          <Animated.View style={[styles.glowOverlay, glowStyle]} pointerEvents="none" />
        </View>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    // Glass border
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    marginVertical: 8,
  },
  blur: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.45)',
    overflow: 'hidden',
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  orangeFill: {
    backgroundColor: '#BF5700',
  },
  label: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.2,
  },
  labelLight: {
    color: '#fff',
  },
});
