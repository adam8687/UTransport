import { useUser } from '@/context/UserContext';
import { db } from '@/firebaseConfig';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator, SafeAreaView, StatusBar, StyleSheet,
    Text, TouchableOpacity, View,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Animated, {
    FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming,
} from 'react-native-reanimated';

const BURNT_ORANGE = '#BF5700';
const CHARCOAL = '#333333';

// How far the driver moves per tick (degrees, ~10m)
const STEP = 0.00009;
const TICK_MS = 900;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string; label: string }> = {
    waiting:   { bg: '#FFF3E0', text: '#E65100', label: '⏳ Finding a driver…' },
    claimed:   { bg: '#E8F5E9', text: '#1B5E20', label: '✅ Driver on the way' },
    completed: { bg: '#E3F2FD', text: '#0D47A1', label: '✓ Ride Completed' },
    cancelled: { bg: '#FFEBEE', text: '#B71C1C', label: '✗ Cancelled' },
  };
  const c = colors[status] ?? { bg: '#F5F5F5', text: CHARCOAL, label: status };
  return (
    <View style={[styles.pill, { backgroundColor: c.bg }]}>
      <Text style={[styles.pillText, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}

export default function StatusScreen() {
  const router = useRouter();
  const { activeRideId, setActiveRideId } = useUser();
  const mapRef = useRef<MapView>(null);

  const [ride, setRide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // Simulated driver position (local only — for video)
  const [driverPos, setDriverPos] = useState<{ latitude: number; longitude: number } | null>(null);
  const prevStatus = useRef<string | null>(null);
  const simInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pulse animation for "waiting" indicator
  const pulseOpacity = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ opacity: pulseOpacity.value }));
  useEffect(() => {
    pulseOpacity.value = withRepeat(withTiming(0.3, { duration: 900 }), -1, true);
  }, []);

  // Firestore real-time listener
  useEffect(() => {
    if (!activeRideId) { setLoading(false); return; }
    const unsub = onSnapshot(doc(db, 'rides', activeRideId), (snap) => {
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() };
        setRide(data);

        // Fire local notification when status changes to 'claimed'
        if (prevStatus.current === 'waiting' && (data as any).status === 'claimed') {
          Notifications.scheduleNotificationAsync({
            content: {
              title: 'UTransport – Driver Found! 🚗',
              body: 'Your driver is on the way. Watch the map for their location.',
              sound: true,
            },
            trigger: null,
          });
        }
        prevStatus.current = (data as any).status;
      }
      setLoading(false);
    }, (err) => {
      console.warn('[Status] snapshot error:', err);
      setLoading(false);
    });
    return unsub;
  }, [activeRideId]);

  // Start driver simulation when status becomes 'claimed'
  useEffect(() => {
    if (ride?.status !== 'claimed' || !ride?.workerLocation || !ride?.pickup) return;
    if (simInterval.current) return; // already running

    // Start from the workerLocation set by the dispatcher
    setDriverPos({ ...ride.workerLocation });

    simInterval.current = setInterval(() => {
      setDriverPos(prev => {
        if (!prev) return null;
        const targetLat = ride.pickup.latitude;
        const targetLng = ride.pickup.longitude;
        const dLat = targetLat - prev.latitude;
        const dLng = targetLng - prev.longitude;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);

        // Stop when very close
        if (dist < STEP * 1.5) {
          clearInterval(simInterval.current!);
          simInterval.current = null;
          return { latitude: targetLat, longitude: targetLng };
        }

        // Move one STEP towards target
        const ratio = STEP / dist;
        return {
          latitude: prev.latitude + dLat * ratio,
          longitude: prev.longitude + dLng * ratio,
        };
      });
    }, TICK_MS);

    return () => {
      if (simInterval.current) clearInterval(simInterval.current);
      simInterval.current = null;
    };
  }, [ride?.status, ride?.workerLocation]);

  // Fit map to show both pickup and driver
  useEffect(() => {
    if (!mapRef.current || !ride?.pickup) return;
    const coords = [ride.pickup];
    if (driverPos) coords.push(driverPos);
    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
      animated: true,
    });
  }, [driverPos, ride?.pickup]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={BURNT_ORANGE} />
        </View>
      </SafeAreaView>
    );
  }

  if (!activeRideId || !ride) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ride Status</Text>
        </View>
        <View style={styles.center}>
          <Text style={styles.noRideIcon}>🗺️</Text>
          <Text style={styles.noRideTitle}>No Active Ride</Text>
          <Text style={styles.noRideMsg}>Submit a request from the Request tab.</Text>
          <TouchableOpacity style={styles.goBtn} onPress={() => router.push('/(tabs)/request')}>
            <Text style={styles.goBtnText}>Request a Ride</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const pickup = ride.pickup as { latitude: number; longitude: number };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ride Status</Text>
        <StatusPill status={ride.status} />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: pickup.latitude,
            longitude: pickup.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* Student pickup marker */}
          <Marker coordinate={pickup} title="Your Pickup" anchor={{ x: 0.5, y: 1 }}>
            <View style={styles.studentMarker}>
              <Text style={styles.markerEmoji}>📍</Text>
              <Text style={styles.markerLabel}>You</Text>
            </View>
          </Marker>

          {/* Driver marker (shown when claimed) */}
          {driverPos && (
            <Marker coordinate={driverPos} title="Driver" anchor={{ x: 0.5, y: 1 }}>
              <View style={styles.driverMarker}>
                <Text style={styles.markerEmoji}>🚗</Text>
                <Text style={[styles.markerLabel, { color: '#1B5E20' }]}>Driver</Text>
              </View>
            </Marker>
          )}

          {/* Route line */}
          {driverPos && (
            <Polyline
              coordinates={[driverPos, pickup]}
              strokeColor={BURNT_ORANGE}
              strokeWidth={2}
              lineDashPattern={[6, 4]}
            />
          )}
        </MapView>

        {/* Waiting pulse overlay */}
        {ride.status === 'waiting' && (
          <View style={styles.waitingOverlay}>
            <Animated.View style={[styles.waitingPulse, animStyle]} />
            <Text style={styles.waitingText}>Waiting for a dispatcher to claim your ride…</Text>
          </View>
        )}
      </View>

      {/* Info panel */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.infoPanel}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Service</Text>
          <Text style={styles.infoValue}>{ride.type}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pickup</Text>
          <Text style={styles.infoMono}>
            {pickup.latitude.toFixed(5)}, {pickup.longitude.toFixed(5)}
          </Text>
        </View>
        {ride.notes ? (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Notes</Text>
              <Text style={styles.infoValue}>{ride.notes}</Text>
            </View>
          </>
        ) : null}
        {ride.claimedBy && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dispatcher</Text>
              <Text style={styles.infoValue}>{ride.claimedBy}</Text>
            </View>
          </>
        )}

        {(ride.status === 'waiting' || ride.status === 'claimed') && (
          <TouchableOpacity
            style={styles.newRideBtn}
            onPress={() => { setActiveRideId(null); router.push('/(tabs)/request'); }}
          >
            <Text style={styles.newRideBtnText}>+ New Request</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: BURNT_ORANGE,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  pill: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  pillText: { fontSize: 12, fontWeight: '700' },

  mapContainer: { flex: 1, position: 'relative' },
  map: { flex: 1 },

  waitingOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  waitingPulse: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: BURNT_ORANGE,
  },
  waitingText: { flex: 1, fontSize: 13, color: CHARCOAL, fontWeight: '500' },

  studentMarker: { alignItems: 'center' },
  driverMarker: { alignItems: 'center' },
  markerEmoji: { fontSize: 28 },
  markerLabel: { fontSize: 10, fontWeight: '700', color: BURNT_ORANGE, marginTop: -2 },

  infoPanel: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  infoLabel: { fontSize: 13, color: '#888', fontWeight: '600' },
  infoValue: { fontSize: 13, color: CHARCOAL, fontWeight: '600' },
  infoMono: { fontSize: 12, color: CHARCOAL, fontFamily: 'monospace' },
  divider: { height: 1, backgroundColor: '#F0F0F0' },

  newRideBtn: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: BURNT_ORANGE,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  newRideBtnText: { color: BURNT_ORANGE, fontWeight: '700', fontSize: 14 },

  noRideIcon: { fontSize: 60, marginBottom: 16 },
  noRideTitle: { fontSize: 18, fontWeight: '700', color: CHARCOAL, marginBottom: 6 },
  noRideMsg: { fontSize: 14, color: '#888', textAlign: 'center', paddingHorizontal: 32, marginBottom: 24 },
  goBtn: { backgroundColor: BURNT_ORANGE, borderRadius: 10, paddingHorizontal: 28, paddingVertical: 14 },
  goBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
