import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { GlassButton } from '@/components/ui/glass-button';
import { useUser } from '@/context/UserContext';

const BURNT_ORANGE = '#BF5700';

export default function HomeScreen() {
  const router = useRouter();
  const { hasSignedUp } = useUser();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={[BURNT_ORANGE, '#d4733a', '#f5ede6']}
        locations={[0, 0.38, 1]}
        style={styles.gradient}
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
          <Text style={styles.headerTitle}>UT Transportation</Text>
        </Animated.View>

        {/* Description glass card */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.descriptionWrapper}>
          <BlurView intensity={50} tint="light" style={styles.descriptionBlur}>
            <Text style={styles.descriptionText}>
              Request a safe ride anywhere on campus
            </Text>
          </BlurView>
        </Animated.View>

        {/* Buttons */}
        <Animated.View entering={FadeInDown.delay(220).duration(500)} style={styles.body}>
          <GlassButton
            label="For Students"
            onPress={() => router.push('/(tabs)/login')}
          />
          <Text style={styles.orText}>or</Text>
          <GlassButton
            label="For Employees"
            onPress={() =>
              hasSignedUp
                ? router.push('/(tabs)/login')
                : router.push('/(tabs)/sign-up')
            }
          />
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
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  descriptionWrapper: {
    marginHorizontal: 32,
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  descriptionBlur: {
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  descriptionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  body: {
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  orText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginVertical: 2,
  },
});
