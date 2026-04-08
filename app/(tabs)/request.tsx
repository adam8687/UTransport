import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { GlassButton } from '@/components/ui/glass-button';

const BURNT_ORANGE = '#BF5700';

export default function RequestScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={[BURNT_ORANGE, '#d4733a', '#f5ede6']}
        locations={[0, 0.4, 1]}
        style={styles.gradient}
      >
        <Animated.View entering={FadeInUp.duration(450)} style={styles.header}>
          <Text style={styles.headerText}>SureWalk</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.body}>
          <Text style={styles.promptText}>Need a safety escort?</Text>
          <Text style={styles.subText}>
            Tap below and a SureWalk team member{'\n'}will walk with you to your destination.
          </Text>
          <GlassButton label="Request" onPress={() => {}} tint="orange" style={styles.requestBtn} />
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BURNT_ORANGE },
  gradient: { flex: 1 },
  header: {
    paddingTop: 36,
    paddingBottom: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'SourceSans3_800ExtraBold',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  promptText: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'SourceSans3_700Bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subText: {
    fontSize: 15,
    fontFamily: 'SourceSans3_400Regular',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 48,
  },
  requestBtn: {
    width: '70%',
  },
});
