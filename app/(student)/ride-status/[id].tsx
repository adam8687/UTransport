import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity,
  View, ActivityIndicator, Alert,
} from 'react-native';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const BURNT_ORANGE = '#BF5700';

function getStatusIcon(status: string) {
  switch (status) {
    case 'pending': return '⏳';
    case 'accepted': return '✅';
    case 'enRoute': return '🚗';
    case 'completed': return '✓';
    case 'cancelled': return '✗';
    default: return '?';
  }
}

function getStatusMessage(status: string) {
  switch (status) {
    case 'pending': return 'Waiting for driver acceptance...';
    case 'accepted': return 'Driver accepted! Coming to pick you up.';
    case 'enRoute': return 'Driver is on the way to you.';
    case 'completed': return 'Ride completed. Thank you!';
    case 'cancelled': return 'Ride was cancelled.';
    default: return 'Unknown status';
  }
}

export default function RideStatusScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [ride, setRide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withTiming(0.4, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, 'rideRequests', id as string);
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setRide({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    });
    return unsub;
  }, [id]);

  async function handleCancel() {
    if (!id || !ride) return;
    Alert.alert('Cancel Ride', 'Are you sure you want to cancel this request?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          setCancelling(true);
          try {
            await updateDoc(doc(db, 'rideRequests', id as string), { status: 'cancelled' });
          } catch (e) {
            Alert.alert('Error', 'Failed to cancel ride.');
          } finally {
            setCancelling(false);
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={BURNT_ORANGE} />
        </View>
      </SafeAreaView>
    );
  }

  if (!ride) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
        <View style={styles.centerContent}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Ride Not Found</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = ride.status === 'completed' ? '#4CAF50' : ride.status === 'cancelled' ? '#F44336' : BURNT_ORANGE;
  const canCancel = ride.status === 'pending';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.headerBackText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride Status</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Status Circle */}
        <View style={styles.statusSection}>
          <Animated.View style={[styles.statusCircle, { borderColor: statusColor }, animatedStyle]}>
            <Text style={styles.statusIcon}>{getStatusIcon(ride.status)}</Text>
          </Animated.View>
          <Text style={[styles.statusLabel, { color: statusColor }]}>{ride.status.toUpperCase()}</Text>
          <Text style={styles.statusMessage}>{getStatusMessage(ride.status)}</Text>
        </View>

        {/* Ride Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>Ride Details</Text>

          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Service Type</Text>
              <Text style={styles.detailValue}>{ride.type === 'surewalk' ? 'SureWalk' : 'PTS Pickup'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pickup Location</Text>
              <Text style={[styles.detailValue, styles.locationValue]}>{ride.pickup}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Destination</Text>
              <Text style={[styles.detailValue, styles.locationValue]}>{ride.dropoff || ride.destination}</Text>
            </View>

            {ride.notes && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Notes</Text>
                  <Text style={[styles.detailValue, styles.notesValue]}>{ride.notes}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Driver Info (if accepted or enRoute) */}
        {(ride.status === 'accepted' || ride.status === 'enRoute') && ride.driverName && (
          <View style={styles.driverSection}>
            <Text style={styles.driverTitle}>Your Driver</Text>
            <View style={styles.driverCard}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverAvatarText}>{ride.driverName[0]}</Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{ride.driverName}</Text>
                {ride.driverPhone && <Text style={styles.driverPhone}>{ride.driverPhone}</Text>}
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {canCancel && (
          <TouchableOpacity
            style={[styles.cancelButton, cancelling && { opacity: 0.6 }]}
            onPress={handleCancel}
            disabled={cancelling}
          >
            <Text style={styles.cancelButtonText}>{cancelling ? 'Cancelling...' : 'Cancel Request'}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/(student)/(tabs)')}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: BURNT_ORANGE, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerBackText: { color: '#fff', fontSize: 28, lineHeight: 32 },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  body: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorIcon: { fontSize: 60, marginBottom: 16 },
  errorTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 24 },
  backBtn: { backgroundColor: BURNT_ORANGE, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 12 },
  backBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  statusSection: { alignItems: 'center', marginBottom: 32 },
  statusCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statusIcon: { fontSize: 40 },
  statusLabel: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  statusMessage: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
  detailsSection: { marginBottom: 24 },
  detailsTitle: { fontSize: 16, fontWeight: '700', color: BURNT_ORANGE, marginBottom: 12 },
  detailCard: { backgroundColor: '#F8F8F8', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E0E0E0' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  detailLabel: { fontSize: 13, color: '#666', fontWeight: '600' },
  detailValue: { fontSize: 13, color: '#1A1A1A', fontWeight: '600', textAlign: 'right', flex: 1, marginLeft: 12 },
  locationValue: { textAlign: 'right', fontWeight: '500', color: '#333' },
  notesValue: { textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 12 },
  driverSection: { marginBottom: 24 },
  driverTitle: { fontSize: 16, fontWeight: '700', color: BURNT_ORANGE, marginBottom: 12 },
  driverCard: { backgroundColor: '#F8F8F8', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0' },
  driverAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: BURNT_ORANGE, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  driverAvatarText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  driverPhone: { fontSize: 13, color: '#666', marginTop: 4 },
  cancelButton: { backgroundColor: '#FFEBEE', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#F44336' },
  cancelButtonText: { fontSize: 15, fontWeight: '700', color: '#C0392B' },
  homeButton: { backgroundColor: BURNT_ORANGE, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  homeButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
