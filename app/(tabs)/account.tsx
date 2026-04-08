import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { GlassCard } from '@/components/ui/glass-card';
import { useUser } from '@/context/UserContext';

const BURNT_ORANGE = '#BF5700';

export default function AccountScreen() {
  const { userInfo } = useUser();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={[BURNT_ORANGE, '#d4733a', '#f5ede6']}
        locations={[0, 0.35, 1]}
        style={styles.gradient}
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(450)} style={styles.header}>
          <Text style={styles.headerText}>My Account</Text>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.body}>
          {userInfo ? (
            <>
              <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>
                  {(userInfo.email?.[0] ?? '?').toUpperCase()}
                </Text>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(160).duration(400)} style={styles.cardWrapper}>
                <GlassCard>
                  <Text style={styles.cardLabel}>Role</Text>
                  <Text style={styles.cardValue}>
                    {userInfo.role === 'employee' ? 'Employee' : 'Student'}
                  </Text>
                </GlassCard>
              </Animated.View>

              {userInfo.username ? (
                <Animated.View entering={FadeInDown.delay(240).duration(400)} style={styles.cardWrapper}>
                  <GlassCard>
                    <Text style={styles.cardLabel}>Username</Text>
                    <Text style={styles.cardValue}>{userInfo.username}</Text>
                  </GlassCard>
                </Animated.View>
              ) : null}

              <Animated.View entering={FadeInDown.delay(320).duration(400)} style={styles.cardWrapper}>
                <GlassCard>
                  <Text style={styles.cardLabel}>Email</Text>
                  <Text style={styles.cardValue}>{userInfo.email}</Text>
                </GlassCard>
              </Animated.View>
            </>
          ) : (
            <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👤</Text>
              <Text style={styles.emptyTitle}>No account yet</Text>
              <Text style={styles.emptySubtitle}>
                Go to Home and choose your role to sign up or log in.
              </Text>
            </Animated.View>
          )}
        </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 40,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarInitial: { color: '#fff', fontSize: 38, fontWeight: '700', fontFamily: 'SourceSans3_700Bold' },
  cardWrapper: { width: '100%' },
  cardLabel: {
    fontSize: 12,
    color: BURNT_ORANGE,
    fontWeight: '700',
    fontFamily: 'SourceSans3_700Bold',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardValue: { fontSize: 17, color: '#1a1a1a', fontWeight: '500', fontFamily: 'SourceSans3_500Medium' },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 10, fontFamily: 'SourceSans3_700Bold' },
  emptySubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 22, fontFamily: 'SourceSans3_400Regular' },
});
