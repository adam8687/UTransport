import { UTHeader } from '@/components/ui/ut-header';
import { useUser } from '@/context/UserContext';
import { db } from '@/firebaseConfig';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Dimensions, Image, Modal, SafeAreaView, StatusBar,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Animated, {
  FadeInDown, useAnimatedStyle, useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const BURNT_ORANGE = '#BF5700';
const CHARCOAL     = '#1A1A1A';
const GREEN        = '#2E7D32';
const SCREEN_W     = Dimensions.get('window').width;

const TOTAL_ETA_S = 20;
const ETA_STEP_S  = 5;
const TICK_MS     = 100;

const DRIVER_SPAWN  = { latitude: 30.284500, longitude: -97.737349 };
const JESTER_PICKUP = { latitude: 30.282179, longitude: -97.737517 };
const FULL_ROUTE    = [
  DRIVER_SPAWN,
  { latitude: 30.283977, longitude: -97.737349 },
  { latitude: 30.283300, longitude: -97.737370 },
  { latitude: 30.282700, longitude: -97.737430 },
  { latitude: 30.282350, longitude: -97.737490 },
  JESTER_PICKUP,
];

const _routeDist = FULL_ROUTE.slice(1).reduce((sum, b, i) => {
  const a = FULL_ROUTE[i];
  return sum + Math.hypot(b.latitude - a.latitude, b.longitude - a.longitude);
}, 0);
const STEP = _routeDist / ((TOTAL_ETA_S * 1000) / TICK_MS);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false,
    shouldShowBanner: true, shouldShowList: true,
  }),
});

function MilestoneDots({ eta }: { eta: number | null }) {
  const filled = eta === null ? 0 : Math.min(4, Math.floor((TOTAL_ETA_S - eta) / ETA_STEP_S));
  return (
    <View style={ms.row}>
      {[0, 1, 2, 3].map(i => (
        <React.Fragment key={i}>
          <View style={[ms.dot, i < filled && ms.dotOn]} />
          {i < 3 && <View style={[ms.line, i < filled - 1 && ms.lineOn]} />}
        </React.Fragment>
      ))}
    </View>
  );
}
const ms = StyleSheet.create({
  row:    { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  dot:    { width: 11, height: 11, borderRadius: 6, borderWidth: 2, borderColor: '#CCC', backgroundColor: '#fff' },
  dotOn:  { borderColor: GREEN, backgroundColor: GREEN },
  line:   { flex: 1, height: 2, backgroundColor: '#DDD' },
  lineOn: { backgroundColor: GREEN },
});

export default function StatusScreen() {
  const router = useRouter();
  const { activeRideId, setActiveRideId } = useUser();
  const mapRef = useRef<MapView>(null);

  const [ride,           setRide]           = useState<any>(null);
  const [loading,        setLoading]        = useState(true);
  const [driverPos,      setDriverPos]      = useState<{ latitude: number; longitude: number } | null>(null);
  const [geocodedPickup, setGeocodedPickup] = useState<{ latitude: number; longitude: number } | null>(null);
  const [etaSeconds,     setEtaSeconds]     = useState<number | null>(null);
  const [arrived,        setArrived]        = useState(false);

  const prevStatus  = useRef<string | null>(null);
  const simInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const etaInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const waypointIdx = useRef(0);
  const routeRef    = useRef<typeof FULL_ROUTE>([]);
  const mapReady    = useRef(false);

  const progressAnim  = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => ({ width: progressAnim.value * (SCREEN_W - 36) }));

  useEffect(() => { Notifications.requestPermissionsAsync(); }, []);

  useEffect(() => {
    if (!activeRideId) { setLoading(false); return; }
    const unsub = onSnapshot(doc(db, 'rides', activeRideId), snap => {
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as any;
        setRide(data);
        if (prevStatus.current === 'waiting' && data.status === 'claimed') {
          Notifications.scheduleNotificationAsync({
            content: { title: 'UTransport \u2013 Driver Found! \ud83d\ude97', body: 'Your driver is on the way!', sound: true },
            trigger: null,
          });
        }
        if (typeof data.pickup === 'string' && data.pickup.trim()) {
          Location.geocodeAsync(data.pickup).then(r => {
            if (r?.length) setGeocodedPickup({ latitude: r[0].latitude, longitude: r[0].longitude });
          }).catch(() => {});
        }
        prevStatus.current = data.status;
      }
      setLoading(false);
    }, err => { console.warn('[Status]', err); setLoading(false); });
    return unsub;
  }, [activeRideId]);

  useEffect(() => {
    if (ride?.status !== 'claimed') return;
    const coordPickup = ride.pickup && typeof ride.pickup === 'object' && 'latitude' in ride.pickup;
    const target = coordPickup ? { latitude: ride.pickup.latitude, longitude: ride.pickup.longitude } : geocodedPickup;
    if (!target || simInterval.current) return;

    const spawn = ride.workerLocation ?? DRIVER_SPAWN;
    routeRef.current = [spawn, ...FULL_ROUTE.slice(1, -1), target];
    waypointIdx.current = 0;
    setDriverPos(spawn);
    setEtaSeconds(TOTAL_ETA_S);
    progressAnim.value = 0;
    progressAnim.value = withTiming(1, { duration: TOTAL_ETA_S * 1000 });

    etaInterval.current = setInterval(() => {
      setEtaSeconds(prev => {
        if (prev === null || prev <= ETA_STEP_S) {
          clearInterval(etaInterval.current!); etaInterval.current = null;
          setArrived(true); return 0;
        }
        return prev - ETA_STEP_S;
      });
    }, ETA_STEP_S * 1000);

    simInterval.current = setInterval(() => {
      setDriverPos(prev => {
        if (!prev) return null;
        const route = routeRef.current;
        const idx   = waypointIdx.current;
        if (idx >= route.length - 1) { clearInterval(simInterval.current!); simInterval.current = null; return route[route.length - 1]; }
        const wp = route[idx + 1];
        const dLat = wp.latitude - prev.latitude, dLng = wp.longitude - prev.longitude;
        const dist = Math.hypot(dLat, dLng);
        if (dist < STEP * 1.2) { waypointIdx.current = idx + 1; return wp; }
        const r = STEP / dist;
        return { latitude: prev.latitude + dLat * r, longitude: prev.longitude + dLng * r };
      });
    }, TICK_MS);

    return () => {
      if (simInterval.current) { clearInterval(simInterval.current); simInterval.current = null; }
      if (etaInterval.current) { clearInterval(etaInterval.current); etaInterval.current = null; }
    };
  }, [ride?.status, ride?.workerLocation, geocodedPickup]);

  useEffect(() => {
    if (!mapRef.current || mapReady.current) return;
    const coordPickup = ride?.pickup && typeof ride.pickup === 'object' && 'latitude' in ride.pickup;
    const resolved = coordPickup ? ride.pickup : geocodedPickup;
    if (!resolved) return;
    mapReady.current = true;
    mapRef.current.animateToRegion({ latitude: resolved.latitude - 0.0008, longitude: resolved.longitude, latitudeDelta: 0.009, longitudeDelta: 0.009 }, 500);
  }, [geocodedPickup, ride?.pickup]);

  if (loading) return <SafeAreaView style={s.safe}><ActivityIndicator style={{ flex: 1 }} size="large" color={BURNT_ORANGE} /></SafeAreaView>;

  if (!activeRideId || !ride) {
    return (
      <SafeAreaView style={s.safe}>
        <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
        <View style={s.emptyHeader}><Text style={s.emptyHeaderTitle}>Ride Status</Text></View>
        <View style={s.center}>
          <Text style={{ fontSize: 52, marginBottom: 12 }}>{'\ud83d\uddfa\ufe0f'}</Text>
          <Text style={s.emptyTitle}>No Active Ride</Text>
          <Text style={s.emptySub}>Submit a request from the Request tab.</Text>
          <TouchableOpacity style={s.goBtn} onPress={() => router.push('/(student)/(tabs)/request')}>
            <Text style={s.goBtnText}>Request a Ride</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const coordPickup = ride.pickup && typeof ride.pickup === 'object' && 'latitude' in ride.pickup;
  const pickup = coordPickup ? (ride.pickup as { latitude: number; longitude: number }) : geocodedPickup;
  const pickupLabel: string = ride.pickupName ?? (typeof ride.pickup === 'string' ? ride.pickup : 'Your location');
  const isClaimed = ride.status === 'claimed';
  const isWaiting = ride.status === 'waiting';

  // Waiting state — no map, simple card like mockup
  if (isWaiting) {
    return (
      <SafeAreaView style={s.safe}>
        <StatusBar backgroundColor="#BF5700" barStyle="light-content" />
        <UTHeader />
        <View style={s.waitingContainer}>
          <View style={s.waitingCard}>
            <Text style={s.waitingCardTitle}>Ride Status</Text>
            <Text style={s.waitingStatus}>Finding Driver</Text>
            <ActivityIndicator size="large" color={CHARCOAL} style={{ marginTop: 18 }} />
          </View>
          <View style={s.waitingMeta}>
            <Text style={s.metaLabel}>SERVICE</Text>
            <Text style={s.metaValue}>{ride.type}</Text>
            <Text style={[s.metaLabel, { marginTop: 10 }]}>PICKUP</Text>
            <Text style={s.metaValue}>{pickupLabel}</Text>
          </View>
          <TouchableOpacity style={s.cancelBtnWide} onPress={() => { setActiveRideId(null); router.push('/(student)/(tabs)/request'); }}>
            <Text style={s.cancelText}>Cancel Ride</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={s.mapWrap}>
        <MapView ref={mapRef} style={s.map}
          initialRegion={{ latitude: pickup?.latitude ?? 30.2822, longitude: pickup?.longitude ?? -97.7375, latitudeDelta: 0.009, longitudeDelta: 0.009 }}>
          <Polyline coordinates={FULL_ROUTE} strokeColor="rgba(0,0,0,0.10)" strokeWidth={4} lineDashPattern={[4, 7]} />
          {driverPos && pickup && <Polyline coordinates={[driverPos, pickup]} strokeColor={BURNT_ORANGE} strokeWidth={3.5} />}
          {pickup && (
            <Marker coordinate={pickup} anchor={{ x: 0.5, y: 1 }}>
              <View style={s.pin}><View style={s.pinInner} /></View>
            </Marker>
          )}
          {driverPos && (
            <Marker coordinate={driverPos} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={s.carBubble}><Text style={s.carEmoji}>{'\ud83d\ude97'}</Text></View>
            </Marker>
          )}
        </MapView>

        <View style={s.floatingChip}><Image source={require('@/assets/images/ut-header-banner.png')} style={s.floatingChipImg} resizeMode="contain" /></View>
      </View>

      <Animated.View entering={FadeInDown.springify().damping(16).stiffness(120)} style={s.card}>
        <View style={s.handle} />

        {isClaimed && etaSeconds !== null && etaSeconds > 0 && (
          <>
            <View style={s.etaBlock}>
              <View>
                <Text style={s.etaTopLabel}>Estimated time</Text>
                <View style={s.etaCountRow}>
                  <Text style={s.etaBigNum}>{etaSeconds}</Text>
                  <Text style={s.etaSecLabel}> sec</Text>
                </View>
              </View>
              <View style={s.onWayBadge}>
                <View style={s.badgeDot} />
                <Text style={s.badgeText}>On the way</Text>
              </View>
            </View>
            <View style={s.track}><Animated.View style={[s.fill, progressStyle]} /></View>
          </>
        )}

        {isWaiting && (
          <View style={s.searchRow}>
            <View style={s.searchDot} />
            <View style={{ flex: 1 }}>
              <Text style={s.searchTitle}>Finding a driver</Text>
              <Text style={s.searchSub}>Notifying available staff…</Text>
            </View>
          </View>
        )}

        <View style={s.divider} />

        <View style={s.metaRow}>
          <View style={s.metaItem}>
            <Text style={s.metaIcon}>{'\ud83d\ude97'}</Text>
            <View><Text style={s.metaLabel}>SERVICE</Text><Text style={s.metaValue}>{ride.type}</Text></View>
          </View>
          <View style={s.metaSep} />
          <View style={s.metaItem}>
            <Text style={s.metaIcon}>{'\ud83d\udccd'}</Text>
            <View style={{ flex: 1 }}><Text style={s.metaLabel}>PICKUP</Text><Text style={s.metaValue} numberOfLines={1}>{pickupLabel}</Text></View>
          </View>
        </View>

        {(isWaiting || isClaimed) && (
          <TouchableOpacity style={s.cancelBtn} onPress={() => { setActiveRideId(null); router.push('/(student)/(tabs)/request'); }}>
            <Text style={s.cancelText}>Cancel Ride</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      <Modal visible={arrived} transparent animationType="none">
        <View style={s.overlay}>
          <View style={s.modalCard}>
            <View style={s.checkRing}><Text style={s.checkMark}>{'\u2713'}</Text></View>
            <Text style={s.modalTitle}>Driver Arrived!</Text>
            <Text style={s.modalSub}>{'Your driver is waiting at\n'}{pickupLabel}</Text>
            <TouchableOpacity style={s.modalBtn} onPress={() => setArrived(false)}>
              <Text style={s.modalBtnText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F9F9F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 },
  emptyHeader:      { backgroundColor: BURNT_ORANGE, paddingHorizontal: 20, paddingVertical: 16 },
  emptyHeaderTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: CHARCOAL, marginBottom: 6 },
  emptySub:   { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 28 },
  goBtn:     { backgroundColor: BURNT_ORANGE, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14 },
  goBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  mapWrap: { flex: 1 },
  map:     { flex: 1 },
  floatingChip: {
    position: 'absolute', top: 52, left: 16,
    backgroundColor: '#BF5700', borderRadius: 22,
    paddingHorizontal: 14, paddingVertical: 8,
    shadowColor: '#000', shadowOpacity: 0.20, shadowRadius: 10, elevation: 6,
  },
  floatingChipImg: { height: 26, width: 140 },
  floatingChipText: { fontSize: 14, fontWeight: '900', color: BURNT_ORANGE, letterSpacing: 0.6 },
  mapToast: {
    position: 'absolute', bottom: 14, left: 14, right: 14,
    backgroundColor: 'rgba(255,255,255,0.97)', borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 10, elevation: 4,
  },
  toastDot:  { width: 11, height: 11, borderRadius: 6, backgroundColor: BURNT_ORANGE },
  toastText: { fontSize: 13, fontWeight: '600', color: CHARCOAL },
  waitingContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 32, alignItems: 'center' },
  waitingCard: { width: '100%', backgroundColor: '#fff', borderRadius: 18, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 14, elevation: 5, marginBottom: 28 },
  waitingCardTitle: { fontSize: 20, fontWeight: '800', color: CHARCOAL, marginBottom: 12 },
  waitingStatus: { fontSize: 17, fontWeight: '600', color: '#555' },
  waitingMeta: { width: '100%', backgroundColor: '#fff', borderRadius: 14, padding: 18, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, marginBottom: 24 },
  cancelBtnWide: { width: '100%', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 14, paddingVertical: 14, alignItems: 'center', backgroundColor: '#fff' },
  pin: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: BURNT_ORANGE, borderWidth: 3, borderColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, elevation: 8,
  },
  pinInner:  { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  carBubble: {
    backgroundColor: '#fff', borderRadius: 24, padding: 7,
    borderWidth: 1.5, borderColor: '#E8E8E8',
    shadowColor: '#000', shadowOpacity: 0.22, shadowRadius: 8, elevation: 10,
  },
  carEmoji: { fontSize: 22 },
  card: {
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 18, paddingTop: 10, paddingBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 24,
    shadowOffset: { width: 0, height: -6 }, elevation: 18,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 16 },
  etaBlock:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  etaTopLabel: { fontSize: 10, fontWeight: '800', color: '#AAA', letterSpacing: 1.2 },
  etaCountRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 2 },
  etaBigNum:   { fontSize: 52, fontWeight: '900', color: CHARCOAL, lineHeight: 56 },
  etaSecLabel: { fontSize: 20, fontWeight: '600', color: '#888', marginBottom: 4 },
  onWayBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: '#F1F8E9', borderRadius: 22, paddingHorizontal: 14, paddingVertical: 8,
  },
  badgeDot:  { width: 9, height: 9, borderRadius: 5, backgroundColor: GREEN },
  badgeText: { fontSize: 13, fontWeight: '700', color: GREEN },
  track: { height: 5, backgroundColor: '#F0F0F0', borderRadius: 3, marginTop: 14, overflow: 'hidden' },
  fill:  { height: 5, backgroundColor: BURNT_ORANGE, borderRadius: 3 },
  milestoneLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 4 },
  milestoneLabel:    { fontSize: 10, color: '#BBB', fontWeight: '500' },
  searchRow:   { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10 },
  searchDot:   { width: 14, height: 14, borderRadius: 7, backgroundColor: BURNT_ORANGE },
  searchTitle: { fontSize: 17, fontWeight: '800', color: CHARCOAL },
  searchSub:   { fontSize: 12, color: '#999', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F2F2F2', marginVertical: 12 },
  metaRow:  { flexDirection: 'row', alignItems: 'center' },
  metaItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  metaSep:  { width: 1, height: 36, backgroundColor: '#EBEBEB', marginHorizontal: 12 },
  metaIcon: { fontSize: 18 },
  metaLabel:{ fontSize: 9, fontWeight: '800', color: '#BBB', letterSpacing: 0.8 },
  metaValue:{ fontSize: 14, fontWeight: '700', color: CHARCOAL, marginTop: 2 },
  cancelBtn: {
    marginTop: 14, borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 14,
    paddingVertical: 12, alignItems: 'center',
  },
  cancelText: { color: '#AAA', fontWeight: '600', fontSize: 14 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.62)', justifyContent: 'center', alignItems: 'center' },
  modalCard: {
    backgroundColor: '#fff', borderRadius: 32,
    paddingHorizontal: 36, paddingVertical: 44, alignItems: 'center', marginHorizontal: 28,
    shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 28, elevation: 22,
  },
  checkRing: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: GREEN,
    justifyContent: 'center', alignItems: 'center', marginBottom: 22,
    shadowColor: GREEN, shadowOpacity: 0.45, shadowRadius: 18, elevation: 10,
  },
  checkMark:    { fontSize: 40, color: '#fff', fontWeight: '900' },
  modalTitle:   { fontSize: 28, fontWeight: '900', color: CHARCOAL, marginBottom: 8 },
  modalSub:     { fontSize: 15, color: '#777', textAlign: 'center', lineHeight: 23, marginBottom: 30 },
  modalBtn:     { backgroundColor: BURNT_ORANGE, borderRadius: 16, paddingHorizontal: 44, paddingVertical: 15, shadowColor: BURNT_ORANGE, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6 },
  modalBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
