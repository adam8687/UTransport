import { useUser } from '@/context/UserContext';
import { db } from '@/firebaseConfig';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert, SafeAreaView, ScrollView, StatusBar,
    StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';

const BURNT_ORANGE = '#BF5700';
const CHARCOAL = '#333333';
const UT_TOWER = { latitude: 30.2861, longitude: -97.7394 };

type RideType = 'SureWalk' | 'PTS Pickup';

export default function RequestScreen() {
  const router = useRouter();
  const { userProfile, firebaseUser, setActiveRideId, activeRideId } = useUser();

  const [rideType, setRideType] = useState<RideType>('SureWalk');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(true);
  const [pickupCoord, setPickupCoord] = useState(UT_TOWER);
  const [locationLabel, setLocationLabel] = useState('Detecting location…');

  // Auto-detect GPS on mount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          setPickupCoord(coords);
          setLocationLabel(`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
        } else {
          setLocationLabel('UT Tower (GPS unavailable)');
        }
      } catch {
        setLocationLabel('UT Tower (GPS unavailable)');
      } finally {
        setLocating(false);
      }
    })();
  }, []);

  // If there's already an active ride, show "ride in progress" state
  if (activeRideId) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Request a Ride</Text>
        </View>
        <View style={styles.center}>
          <Text style={styles.inProgressIcon}>🚗</Text>
          <Text style={styles.inProgressTitle}>Ride In Progress</Text>
          <Text style={styles.inProgressMsg}>
            You already have an active ride request. Track it on the Status tab.
          </Text>
          <TouchableOpacity
            style={styles.viewStatusBtn}
            onPress={() => router.push('/(tabs)/status')}
          >
            <Text style={styles.viewStatusBtnText}>View Live Status →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelLink}
            onPress={() =>
              Alert.alert('Cancel Ride?', 'This will remove your current ride request from the queue.', [
                { text: 'Keep Ride', style: 'cancel' },
                { text: 'Cancel Ride', style: 'destructive', onPress: () => setActiveRideId(null) },
              ])
            }
          >
            <Text style={styles.cancelLinkText}>Cancel Current Ride</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  async function handleSubmit() {
    if (locating) {
      Alert.alert('Please wait', 'Still detecting your location.');
      return;
    }
    const studentName = userProfile
      ? `${userProfile.firstName} ${userProfile.lastName} (${userProfile.utEID})`
      : 'Demo Student';

    setSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'rides'), {
        studentName,
        studentUid: firebaseUser?.uid ?? 'demo',
        pickup: pickupCoord,
        type: rideType,
        notes: notes.trim(),
        status: 'waiting',
        createdAt: serverTimestamp(),
        claimedBy: null,
        workerLocation: null,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setActiveRideId(docRef.id);
      router.push('/(tabs)/status');
    } catch (e: any) {
      console.warn('[Request] submit error:', e);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Request a Ride</Text>
        <Text style={styles.headerSub}>A dispatcher will come to your GPS location</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

        {/* Service type */}
        <Text style={styles.label}>Service Type</Text>
        <View style={styles.segmentWrapper}>
          {(['SureWalk', 'PTS Pickup'] as RideType[]).map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.segmentBtn, rideType === type && styles.segmentBtnActive]}
              onPress={() => setRideType(type)}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentText, rideType === type && styles.segmentTextActive]}>
                {type === 'SureWalk' ? '🚶  SureWalk' : '🚐  PTS Pickup'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pickup location (GPS auto-detected) */}
        <Text style={styles.label}>Your Pickup Location</Text>
        <View style={styles.locationBox}>
          {locating
            ? <ActivityIndicator size="small" color={BURNT_ORANGE} />
            : <Text style={styles.locationIcon}>📍</Text>}
          <Text style={styles.locationText}>
            {locating ? 'Detecting your location…' : locationLabel}
          </Text>
        </View>
        <Text style={styles.locationHint}>
          Your current GPS coordinates will be shared with the dispatcher
        </Text>

        {/* Service info card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>
            {rideType === 'SureWalk' ? '🚶 About SureWalk' : '🚐 About PTS Pickup'}
          </Text>
          <Text style={styles.infoCardBody}>
            {rideType === 'SureWalk'
              ? 'A trained student escort will walk with you to your destination on campus. Available nightly.'
              : 'Accessible vehicle transport for students with mobility needs across UT Austin campus.'}
          </Text>
        </View>

        {/* Notes */}
        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="e.g. 'wheelchair accessible entrance', 'meeting at PCL east doors'"
          placeholderTextColor="#AAA"
          value={notes}
          onChangeText={setNotes}
          multiline
          maxLength={150}
        />

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, (locating || submitting) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={locating || submitting}
          activeOpacity={0.85}
        >
          {submitting
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.submitBtnText}>Request {rideType}  →</Text>}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: BURNT_ORANGE,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 3 },

  body: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },

  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 22,
    marginBottom: 8,
  },

  segmentWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 3,
  },
  segmentBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  segmentBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  segmentText: { fontSize: 15, fontWeight: '600', color: '#888' },
  segmentTextActive: { color: BURNT_ORANGE },

  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  locationIcon: { fontSize: 18 },
  locationText: { fontSize: 14, color: CHARCOAL, fontWeight: '500', flex: 1 },
  locationHint: { fontSize: 12, color: '#AAA', marginTop: 5 },

  infoCard: {
    marginTop: 20,
    backgroundColor: '#FFF8F4',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: BURNT_ORANGE,
    padding: 14,
  },
  infoCardTitle: { fontSize: 14, fontWeight: '700', color: CHARCOAL, marginBottom: 5 },
  infoCardBody: { fontSize: 13, color: '#666', lineHeight: 19 },

  notesInput: {
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: CHARCOAL,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  submitBtn: {
    backgroundColor: BURNT_ORANGE,
    borderRadius: 12,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: BURNT_ORANGE,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: { opacity: 0.5, shadowOpacity: 0 },
  submitBtnText: { color: '#fff', fontWeight: '800', fontSize: 17 },

  // Ride in progress state
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  inProgressIcon: { fontSize: 72, marginBottom: 20 },
  inProgressTitle: { fontSize: 24, fontWeight: '800', color: CHARCOAL, marginBottom: 10 },
  inProgressMsg: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  viewStatusBtn: {
    backgroundColor: BURNT_ORANGE,
    borderRadius: 12,
    paddingHorizontal: 36,
    paddingVertical: 15,
    marginBottom: 16,
    shadowColor: BURNT_ORANGE,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  viewStatusBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  cancelLink: { padding: 12 },
  cancelLinkText: { color: '#999', fontSize: 14, textDecorationLine: 'underline' },
});
