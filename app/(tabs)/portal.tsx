// Worker Dispatcher Portal
// Pulls rides where status == 'waiting' from Firestore.
// Composite index NOT needed — orderBy is done client-side.

import { db } from '@/firebaseConfig';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, FlatList, SafeAreaView, StatusBar,
    StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

const BURNT_ORANGE = '#BF5700';
const CHARCOAL = '#333333';

// Starting worker location: Speedway & PCL area
const WORKER_START = { latitude: 30.2880, longitude: -97.7393 };

function timeSince(ts: any): string {
  if (!ts) return '';
  const date: Date = ts.toDate ? ts.toDate() : new Date(ts);
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

function RideCard({ ride, onClaim, claiming }: { ride: any; onClaim: () => void; claiming: boolean }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.typeBadge, ride.type === 'SureWalk' ? styles.badgeSW : styles.badgePTS]}>
          <Text style={styles.typeBadgeText}>{ride.type}</Text>
        </View>
        <Text style={styles.cardTime}>{timeSince(ride.createdAt)}</Text>
      </View>

      <Text style={styles.cardName}>{ride.studentName}</Text>

      <View style={styles.coordRow}>
        <Text style={styles.coordLabel}>📍 Pickup</Text>
        <Text style={styles.coordValue}>
          {ride.pickup?.latitude?.toFixed(5)}, {ride.pickup?.longitude?.toFixed(5)}
        </Text>
      </View>

      {ride.notes ? (
        <Text style={styles.cardNotes}>"{ride.notes}"</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.claimBtn, claiming && styles.claimBtnDisabled]}
        onPress={onClaim}
        activeOpacity={0.8}
        disabled={claiming}
      >
        {claiming
          ? <ActivityIndicator color="#fff" size="small" />
          : <Text style={styles.claimBtnText}>CLAIM RIDE</Text>}
      </TouchableOpacity>
    </View>
  );
}

export default function PortalScreen() {
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    // NOTE: Only filtering by status (no orderBy) so no composite index is needed.
    // Client-side sort by createdAt below.
    const q = query(
      collection(db, 'rides'),
      where('status', '==', 'waiting'),
    );

    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        // Sort newest-first client-side
        .sort((a: any, b: any) => {
          const at = a.createdAt?.seconds ?? 0;
          const bt = b.createdAt?.seconds ?? 0;
          return bt - at;
        });
      setRides(docs);
      setLoading(false);
    }, (err) => {
      console.warn('[Portal] snapshot error:', err.message);
      setLoading(false);
    });

    return unsub;
  }, []);

  async function handleClaim(rideId: string) {
    setClaiming(rideId);
    try {
      await updateDoc(doc(db, 'rides', rideId), {
        status: 'claimed',
        claimedBy: 'MockWorker-123',
        workerLocation: WORKER_START,
      });
      // Firestore onSnapshot on the student's status screen will pick this up
      // and trigger the driver simulation + local notification automatically.
    } catch (e: any) {
      console.warn('[Portal] claim error:', e.message);
    } finally {
      setClaiming(null);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dispatcher Queue</Text>
          <Text style={styles.headerSub}>
            {loading ? 'Loading…' : `${rides.length} ride${rides.length !== 1 ? 's' : ''} waiting`}
          </Text>
        </View>
        <View style={styles.onlineDot} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={BURNT_ORANGE} />
        </View>
      ) : rides.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🟢</Text>
          <Text style={styles.emptyTitle}>Queue Clear</Text>
          <Text style={styles.emptyMsg}>No pending ride requests right now.</Text>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <RideCard
              ride={item}
              claiming={claiming === item.id}
              onClaim={() => {
                if (claiming) return; // block concurrent claims
                handleClaim(item.id);
              }}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    backgroundColor: BURNT_ORANGE,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 },
  onlineDot: {
    width: 13, height: 13, borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2, borderColor: '#fff',
  },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 52, marginBottom: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: CHARCOAL, marginBottom: 6 },
  emptyMsg: { fontSize: 14, color: '#888', textAlign: 'center', paddingHorizontal: 32 },

  list: { padding: 16, gap: 12 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  typeBadge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  badgeSW: { backgroundColor: '#FFF0E6' },
  badgePTS: { backgroundColor: '#E8F0FF' },
  typeBadgeText: { fontSize: 12, fontWeight: '700', color: CHARCOAL },
  cardTime: { fontSize: 12, color: '#999' },
  cardName: { fontSize: 16, fontWeight: '700', color: CHARCOAL, marginBottom: 8 },
  coordRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  coordLabel: { fontSize: 12, color: '#888', fontWeight: '600' },
  coordValue: { fontSize: 13, color: CHARCOAL, fontWeight: '500' },
  cardNotes: { fontSize: 13, color: '#777', fontStyle: 'italic', marginBottom: 12 },

  claimBtn: {
    backgroundColor: BURNT_ORANGE,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 6,
  },
  claimBtnDisabled: { opacity: 0.6 },
  claimBtnText: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
});
