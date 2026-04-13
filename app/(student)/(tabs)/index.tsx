import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useUser } from '@/context/UserContext';

const BURNT_ORANGE = '#BF5700';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function isSureWalkOpen() {
  const now = new Date();
  return now.getHours() >= 20;
}

function getCountdown() {
  const now = new Date();
  const open = new Date();
  open.setHours(20, 0, 0, 0);
  if (now >= open) return null;
  const diff = open.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export default function HomeScreen() {
  const router = useRouter();
  const { userProfile, firebaseUser } = useUser();
  const [activeRide, setActiveRide] = useState<any>(null);
  const [countdown, setCountdown] = useState(getCountdown());
  const sureWalkOpen = isSureWalkOpen();

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getCountdown()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!firebaseUser) return;
    async function fetchActiveRide() {
      try {
        const q = query(
          collection(db, 'rideRequests'),
          where('uid', '==', firebaseUser!.uid),
          where('status', 'in', ['pending', 'accepted', 'enRoute']),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        const snap = await getDocs(q);
        if (!snap.empty) setActiveRide({ id: snap.docs[0].id, ...snap.docs[0].data() });
        else setActiveRide(null);
      } catch (e) {
        console.warn('fetchActiveRide error:', e);
      }
    }
    fetchActiveRide();
  }, [firebaseUser]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={[BURNT_ORANGE, '#d4733a', '#f5ede6']} locations={[0, 0.35, 1]} style={styles.gradient}>
        <Animated.View entering={FadeInUp.duration(450)} style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.name}>{userProfile?.firstName ?? 'Longhorn'} 🤘</Text>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {activeRide && (
            <Animated.View entering={FadeInDown.delay(60).duration(400)}>
              <TouchableOpacity style={styles.activeRideBanner} onPress={() => router.push(`/(student)/ride-status/${activeRide.id}`)}>
                <View>
                  <Text style={styles.activeBannerLabel}>Active Ride</Text>
                  <Text style={styles.activeBannerStatus}>{activeRide.status === 'pending' ? '⏳ Waiting for acceptance...' : activeRide.status === 'accepted' ? '✅ Accepted — driver coming' : '🚗 Driver en route'}</Text>
                </View>
                <Text style={styles.activeBannerChevron}>›</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(120).duration(450)}>
            <TouchableOpacity
              style={[styles.serviceCard, !sureWalkOpen && styles.serviceCardDimmed]}
              onPress={() => router.push('/(student)/(tabs)/request')}
              activeOpacity={0.85}
            >
              <Text style={styles.serviceIcon}>🚶</Text>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>SureWalk</Text>
                <Text style={styles.serviceDesc}>Safety escort anywhere on campus</Text>
                {!sureWalkOpen && countdown ? (
                  <View style={styles.closedBadge}>
                    <Text style={styles.closedBadgeText}>Opens in {countdown}</Text>
                  </View>
                ) : (
                  <View style={styles.openBadge}>
                    <Text style={styles.openBadgeText}>Open Now</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardChevron}>›</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(450)}>
            <TouchableOpacity style={styles.serviceCard} onPress={() => router.push('/(student)/(tabs)/request')} activeOpacity={0.85}>
              <Text style={styles.serviceIcon}>🚐</Text>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>PTS Pickup</Text>
                <Text style={styles.serviceDesc}>Medical, disability, or essential trips</Text>
                <View style={styles.openBadge}>
                  <Text style={styles.openBadgeText}>Available</Text>
                </View>
              </View>
              <Text style={styles.cardChevron}>›</Text>
            </TouchableOpacity>
          </Animated.View>

          {userProfile?.adaRequired && (
            <Animated.View entering={FadeInDown.delay(280).duration(400)} style={styles.adaBadge}>
              <Text style={styles.adaBadgeText}>♿ ADA Accommodation Active — profile auto-fills your requests</Text>
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
  header: { paddingTop: 36, paddingBottom: 16, paddingHorizontal: 24 },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '500' },
  name: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: 0.2 },
  body: { paddingHorizontal: 20, paddingBottom: 20 },
  activeRideBanner: { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 16, padding: 16, marginBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, borderWidth: 1, borderColor: 'rgba(191,87,0,0.3)' },
  activeBannerLabel: { fontSize: 11, fontWeight: '700', color: BURNT_ORANGE, textTransform: 'uppercase', letterSpacing: 0.5 },
  activeBannerStatus: { fontSize: 14, color: '#1A1A1A', fontWeight: '600', marginTop: 2 },
  activeBannerChevron: { fontSize: 22, color: BURNT_ORANGE },
  serviceCard: { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 18, padding: 18, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  serviceCardDimmed: { opacity: 0.75 },
  serviceIcon: { fontSize: 36, marginRight: 16 },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  serviceDesc: { fontSize: 13, color: '#666', marginTop: 2 },
  openBadge: { backgroundColor: '#E8F5E9', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginTop: 6, alignSelf: 'flex-start' },
  openBadgeText: { fontSize: 11, color: '#2E7D32', fontWeight: '700' },
  closedBadge: { backgroundColor: '#FFF3E0', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginTop: 6, alignSelf: 'flex-start' },
  closedBadgeText: { fontSize: 11, color: '#E65100', fontWeight: '700' },
  cardChevron: { fontSize: 22, color: '#AAAAAA' },
  adaBadge: { backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(191,87,0,0.3)', marginTop: 4 },
  adaBadgeText: { fontSize: 13, color: '#7A3500', fontWeight: '500', textAlign: 'center' },
});
