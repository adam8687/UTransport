import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const BURNT_ORANGE = '#BF5700';

interface TabItemProps {
  route: any;
  descriptor: any;
  navigation: any;
  isFocused: boolean;
}

function TabItem({ route, descriptor, navigation, isFocused }: TabItemProps) {
  const pillScale = useSharedValue(isFocused ? 1 : 0.4);
  const pillOpacity = useSharedValue(isFocused ? 1 : 0);
  const iconScale = useSharedValue(isFocused ? 1.12 : 1);
  const iconTranslate = useSharedValue(isFocused ? -2 : 0);

  useEffect(() => {
    pillScale.value = withSpring(isFocused ? 1 : 0.4, { damping: 18, stiffness: 220 });
    pillOpacity.value = withTiming(isFocused ? 1 : 0, { duration: 180 });
    iconScale.value = withSpring(isFocused ? 1.12 : 1, { damping: 16, stiffness: 240 });
    iconTranslate.value = withSpring(isFocused ? -2 : 0, { damping: 16, stiffness: 240 });
  }, [isFocused]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: pillScale.value }],
    opacity: pillOpacity.value,
  }));

  const iconContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }, { translateY: iconTranslate.value }],
  }));

  const onPress = () => {
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      navigation.navigate(route.name, route.params);
    }
  };

  const { options } = descriptor;
  const label: string = (options.tabBarLabel as string) ?? (options.title as string) ?? route.name;

  return (
    <Pressable onPress={onPress} style={styles.tabItem}>
      {/* Floating active indicator pill */}
      <Animated.View style={[styles.activePill, pillStyle]} />

      {/* Icon */}
      <Animated.View style={iconContainerStyle}>
        {options.tabBarIcon?.({
          color: isFocused ? BURNT_ORANGE : 'rgba(60,60,67,0.38)',
          focused: isFocused,
          size: 24,
        })}
      </Animated.View>

      {/* Label */}
      <Text
        numberOfLines={1}
        style={[styles.tabLabel, isFocused && styles.tabLabelActive]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const visibleRoutes = state.routes.filter((route) => {
    const opts = descriptors[route.key].options as any;
    // hide routes where href is explicitly null (Expo Router convention)
    return opts.href !== null;
  });

  return (
    <View
      style={[styles.outerContainer, { bottom: insets.bottom + 12 }]}
      pointerEvents="box-none"
    >
      <BlurView
        intensity={Platform.OS === 'ios' ? 80 : 60}
        tint={Platform.OS === 'ios' ? 'systemChromeMaterial' : 'light'}
        style={styles.pill}
      >
        {/* Inner tint overlay for the warm glass look */}
        <View style={styles.pillTint} pointerEvents="none" />

        {visibleRoutes.map((route) => {
          const isFocused = state.routes[state.index].key === route.key;
          return (
            <TabItem
              key={route.key}
              route={route}
              descriptor={descriptors[route.key]}
              navigation={navigation}
              isFocused={isFocused}
            />
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  pill: {
    flexDirection: 'row',
    borderRadius: 36,
    overflow: 'hidden',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    // Floating shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
    elevation: 14,
  },
  pillTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    minHeight: 58,
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    width: '82%',
    height: '100%',
    borderRadius: 28,
    backgroundColor: 'rgba(191,87,0,0.1)',
    // Subtle inner border
    borderWidth: 1,
    borderColor: 'rgba(191,87,0,0.18)',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 3,
    color: 'rgba(60,60,67,0.45)',
    fontWeight: '500',
    fontFamily: 'SourceSans3_500Medium',
    letterSpacing: 0.1,
  },
  tabLabelActive: {
    color: BURNT_ORANGE,
    fontWeight: '700',
    fontFamily: 'SourceSans3_700Bold',
  },
});
