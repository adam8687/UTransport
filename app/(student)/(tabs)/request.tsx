import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, SafeAreaView, ScrollView, StatusBar,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useUser } from '@/context/UserContext';

const BURNT_ORANGE = '#BF5700';

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

type Option = { label: string; value: string };

function RadioGroup({ options, selected, onSelect }: { options: Option[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
      {options.map(o => (
        <TouchableOpacity key={o.value} onPress={() => onSelect(o.value)}
          style={[radioStyles.chip, selected === o.value && radioStyles.chipActive]}>
          <Text style={[radioStyles.chipText, selected === o.value && radioStyles.chipTextActive]}>{o.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const radioStyles = StyleSheet.create({
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#DDD', backgroundColor: '#F8F8F8' },
  chipActive: { borderColor: BURNT_ORANGE, backgroundColor: '#FFF0E6' },
  chipText: { fontSize: 14, color: '#555' },
  chipTextActive: { color: BURNT_ORANGE, fontWeight: '600' },
});

export default function RequestScreen() {
  const router = useRouter();
  const { userProfile, firebaseUser } = useUser();
  const [activeTab, setActiveTab] = useState<'surewalk' | 'pts'>('surewalk');
  const sureWalkOpen = isSureWalkOpen();

  // SureWalk state
  const [swPickup, setSwPickup] = useState('');
  const [swDropoff, setSwDropoff] = useState('');
  const [swPeople, setSwPeople] = useState('1');
  const [swNotes, setSwNotes] = useState('');

  // PTS state
  const [ptsPickup, setPtsPickup] = useState('');
  const [ptsDestination, setPtsDestination] = useState('');
  const [ptsReason, setPtsReason] = useState('');
  const [ptsMobilityAid, setPtsMobilityAid] = useState(false);
  const [ptsNotes, setPtsNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function checkExistingRequest() {
    if (!firebaseUser) return false;
    try {
      const q = query(
        collection(db, 'rideRequests'),
        where('uid', '==', firebaseUser.uid),
        where('status', 'in', ['pending', 'accepted', 'enRoute'])
      );
      const snap = await getDocs(q);
      return !snap.empty;
    } catch (e) {
      return false;
    }
  }

  async function handleSureWalkSubmit() {
    setError('');
    if (!swPickup.trim() || !swDropoff.trim()) {
      setError('Please fill in pickup and drop-off locations.');
      return;
    }

    const hasActive = await checkExistingRequest();
    if (hasActive) {
      Alert.alert('Active Request', 'You already have an active ride request. Complete or cancel it first.');
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'rideRequests'), {
        uid: firebaseUser!.uid,
        type: 'surewalk',
        pickup: swPickup.trim(),
        dropoff: swDropoff.trim(),
        numPeople: parseInt(swPeople) || 1,
        notes: swNotes.trim(),
        studentName: `${userProfile?.firstName} ${userProfile?.lastName}`,
        studentPhone: userProfile?.phone,
        adaRequired: userProfile?.adaRequired || false,
        mobilityAids: userProfile?.mobilityAids || [],
        status: 'pending',
        timestamp: serverTimestamp(),
      });
      router.push(`/(student)/ride-status/${docRef.id}`);
    } catch (e: any) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePTSSubmit() {
    setError('');
    if (!ptsPickup.trim() || !ptsDestination.trim() || !ptsReason.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const hasActive = await checkExistingRequest();
    if (hasActive) {
      Alert.alert('Active Request', 'You already have an active ride request. Complete or cancel it first.');
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'rideRequests'), {
        uid: firebaseUser!.uid,
        type: 'pts',
        pickup: ptsPickup.trim(),
        destination: ptsDestination.trim(),
        reason: ptsReason.trim(),
        mobilityAid: ptsMobilityAid,
        notes: ptsNotes.trim(),
        studentName: `${userProfile?.firstName} ${userProfile?.lastName}`,
        studentPhone: userProfile?.phone,
        adaRequired: userProfile?.adaRequired || false,
        mobilityAids: userProfile?.mobilityAids || [],
        status: 'pending',
        timestamp: serverTimestamp(),
      });
      router.push(`/(student)/ride-status/${docRef.id}`);
    } catch (e: any) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (activeTab === 'surewalk' && !sureWalkOpen) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Request a Ride</Text>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity style={[styles.tab, activeTab === 'surewalk' && styles.tabActive]} onPress={() => setActiveTab('surewalk')}>
            <Text style={[styles.tabText, activeTab === 'surewalk' && styles.tabTextActive]}>SureWalk</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, (activeTab as string) === 'pts' && styles.tabActive]} onPress={() => setActiveTab('pts')}>
            <Text style={[styles.tabText, (activeTab as string) === 'pts' && styles.tabTextActive]}>PTS Pickup</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.closedContainer}>
          <Text style={styles.closedIcon}>🕒</Text>
          <Text style={styles.closedTitle}>SureWalk Not Available</Text>
          <Text style={styles.closedMessage}>SureWalk is available from 8 PM to 6 AM for your safety.</Text>
          <Text style={styles.closedCountdown}>Opens in {getCountdown()}</Text>
          <TouchableOpacity style={styles.switchButton} onPress={() => setActiveTab('pts')}>
            <Text style={styles.switchButtonText}>Try PTS Pickup Instead</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Request a Ride</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tab, activeTab === 'surewalk' && styles.tabActive]} onPress={() => setActiveTab('surewalk')}>
          <Text style={[styles.tabText, activeTab === 'surewalk' && styles.tabTextActive]}>SureWalk</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'pts' && styles.tabActive]} onPress={() => setActiveTab('pts')}>
          <Text style={[styles.tabText, activeTab === 'pts' && styles.tabTextActive]}>PTS Pickup</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {activeTab === 'surewalk' ? (
          <>
            <Text style={styles.sectionLabel}>Pickup Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="Where should we pick you up?"
              placeholderTextColor="#AAAAAA"
              value={swPickup}
              onChangeText={setSwPickup}
            />

            <Text style={styles.sectionLabel}>Drop-off Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="Where are you going?"
              placeholderTextColor="#AAAAAA"
              value={swDropoff}
              onChangeText={setSwDropoff}
            />

            <Text style={styles.sectionLabel}>Number of People</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => setSwPeople(String(Math.max(1, parseInt(swPeople) - 1)))}>
                <Text style={styles.stepperText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{swPeople}</Text>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => setSwPeople(String(Math.min(4, parseInt(swPeople) + 1)))}>
                <Text style={styles.stepperText}>+</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>Additional Notes</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Any special instructions?"
              placeholderTextColor="#AAAAAA"
              value={swNotes}
              onChangeText={setSwNotes}
              multiline
            />

            {userProfile?.adaRequired && (
              <View style={styles.adaBadge}>
                <Text style={styles.adaBadgeText}>♿ ADA Accommodation: Your profile info will be included with this request.</Text>
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Pickup Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="Where should we pick you up?"
              placeholderTextColor="#AAAAAA"
              value={ptsPickup}
              onChangeText={setPtsPickup}
            />

            <Text style={styles.sectionLabel}>Destination *</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {[{label:'UHS',value:'uhs'},{label:'Campus Pharmacy',value:'pharmacy'},{label:'CVS',value:'cvs'},{label:'Other',value:'other'}].map(o => (
                <TouchableOpacity key={o.value} onPress={() => setPtsDestination(o.value)}
                  style={[radioStyles.chip, ptsDestination === o.value && radioStyles.chipActive]}>
                  <Text style={[radioStyles.chipText, ptsDestination === o.value && radioStyles.chipTextActive]}>{o.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {ptsDestination === 'other' && (
              <TextInput
                style={[styles.input, { marginTop: 12 }]}
                placeholder="Enter your destination"
                placeholderTextColor="#AAAAAA"
                value={ptsReason}
                onChangeText={setPtsReason}
              />
            )}

            {ptsDestination !== 'other' && (
              <>
                <Text style={[styles.sectionLabel, { marginTop: 14 }]}>Reason for Trip *</Text>
                <RadioGroup options={[{label:'Medical',value:'medical'},{label:'Disability',value:'disability'},{label:'Essential',value:'essential'},{label:'Other',value:'other_reason'}]} selected={ptsReason} onSelect={setPtsReason} />
              </>
            )}

            <Text style={[styles.sectionLabel, { marginTop: 14 }]}>Mobility Aid Needed?</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TouchableOpacity style={[radioStyles.chip, !ptsMobilityAid && radioStyles.chipActive]} onPress={() => setPtsMobilityAid(false)}>
                <Text style={[radioStyles.chipText, !ptsMobilityAid && radioStyles.chipTextActive]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[radioStyles.chip, ptsMobilityAid && radioStyles.chipActive]} onPress={() => setPtsMobilityAid(true)}>
                <Text style={[radioStyles.chipText, ptsMobilityAid && radioStyles.chipTextActive]}>Yes</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>Additional Notes</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Any special instructions?"
              placeholderTextColor="#AAAAAA"
              value={ptsNotes}
              onChangeText={setPtsNotes}
              multiline
            />

            {userProfile?.adaRequired && (
              <View style={styles.adaBadge}>
                <Text style={styles.adaBadgeText}>♿ ADA Accommodation: Your profile info will be included with this request.</Text>
              </View>
            )}
          </>
        )}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabled]}
          onPress={activeTab === 'surewalk' ? handleSureWalkSubmit : handlePTSSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Request Ride</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: BURNT_ORANGE, paddingVertical: 18, paddingHorizontal: 16, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: BURNT_ORANGE },
  tabText: { fontSize: 15, fontWeight: '600', color: '#999' },
  tabTextActive: { color: BURNT_ORANGE },
  body: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  errorText: { color: '#C0392B', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 14 },
  input: { backgroundColor: '#F4F4F4', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#1A1A1A' },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  stepperBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: BURNT_ORANGE, justifyContent: 'center', alignItems: 'center' },
  stepperText: { fontSize: 18, fontWeight: '700', color: BURNT_ORANGE },
  stepperValue: { fontSize: 16, fontWeight: '700', color: '#333' },
  adaBadge: { backgroundColor: '#FFF8F4', borderRadius: 8, padding: 12, marginTop: 16, borderWidth: 1, borderColor: '#FFD6B8' },
  adaBadgeText: { fontSize: 13, color: '#7A4500', fontWeight: '500' },
  submitButton: { backgroundColor: BURNT_ORANGE, borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  disabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  closedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  closedIcon: { fontSize: 60, marginBottom: 16 },
  closedTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A', marginBottom: 8 },
  closedMessage: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 20 },
  closedCountdown: { fontSize: 24, fontWeight: '700', color: BURNT_ORANGE, marginBottom: 24 },
  switchButton: { backgroundColor: BURNT_ORANGE, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 14 },
  switchButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
