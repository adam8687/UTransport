import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useUser } from '@/context/UserContext';

const BURNT_ORANGE = '#BF5700';

function formatDate(timestamp: any) {
  if (!timestamp) return 'Unknown date';
  const date = timestamp.toDate?.() || new Date(timestamp);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'completed': return '#4CAF50';
    case 'cancelled': return '#F44336';
    case 'pending': return '#FF9800';
    case 'accepted': return '#2196F3';
    case 'enRoute': return '#2196F3';
    default: return '#999';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
    case 'pending': return 'Pending';
    case 'accepted': return 'Accepted';
    case 'enRoute': return 'En Route';
    default: return status;
  }
}

export default function HistoryScreen() {
  const { firebaseUser } = useUser();
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) return;
    async function fetchRides() {
      try {
        const q = query(
          collection(db, 'rideRequests'),
          where('uid', '==', firebaseUser!.uid),
          orderBy('timestamp', 'desc')
        );
        const snap = await getDocs(q);
        setRides(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.warn('fetchRides error:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchRides();
  }, [firebaseUser]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ride History</Text>
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={BURNT_ORANGE} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
      <LinearGradient colors={[BURNT_ORANGE, '#d4733a', '#f5ede6']} locations={[0, 0.35, 1]} style={styles.headerGradient}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ride History</Text>
        </View>
      </LinearGradient>

      {rides.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No Rides Yet</Text>
          <Text style={styles.emptyMessage}>Your ride history will appear here once you request a ride.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {rides.map((ride) => (
            <TouchableOpacity
              key={ride.id}
              style={styles.rideCard}
              onPress={() => Alert.alert(
                `${ride.type === 'surewalk' ? 'SureWalk' : 'PTS Pickup'} Ride`,
                `From: ${ride.pickup}\nTo: ${ride.dropoff || ride.destination}\nStatus: ${getStatusLabel(ride.status)}\nDate: ${formatDate(ride.timestamp)}`,
                [{ text: 'Close' }]
              )}
            >
              <View style={styles.rideCardLeft}>
                <Text style={styles.rideIcon}>{ride.type === 'surewalk' ? '🚶' : '🚐'}</Text>
                <View style={styles.rideDetails}>
                  <Text style={styles.rideType}>{ride.type === 'surewalk' ? 'SureWalk' : 'PTS Pickup'}</Text>
                  <Text style={styles.rideRoute}>{ride.pickup} → {ride.dropoff || ride.destination}</Text>
                  <Text style={styles.rideDate}>{formatDate(ride.timestamp)}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor(ride.status) }]}>
                <Text style={styles.statusText}>{getStatusLabel(ride.status)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  headerGradient: { paddingTop: 0, paddingBottom: 0 },
  header: { paddingVertical: 18, paddingHorizontal: 16, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  emptyMessage: { fontSize: 14, color: '#666', textAlign: 'center', paddingHorizontal: 24 },
  body: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  rideCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E0E0E0' },
  rideCardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rideIcon: { fontSize: 32, marginRight: 12 },
  rideDetails: { flex: 1 },
  rideType: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  rideRoute: { fontSize: 13, color: '#666', marginTop: 2 },
  rideDate: { fontSize: 12, color: '#999', marginTop: 2 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginLeft: 8 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
