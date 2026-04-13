import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView,
  ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { auth, db } from '@/firebaseConfig';

const BURNT_ORANGE = '#BF5700';

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

function MultiSelect({ options, selected, onToggle }: { options: Option[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
      {options.map(o => (
        <TouchableOpacity key={o.value} onPress={() => onToggle(o.value)}
          style={[radioStyles.chip, selected.includes(o.value) && radioStyles.chipActive]}>
          <Text style={[radioStyles.chipText, selected.includes(o.value) && radioStyles.chipTextActive]}>{o.label}</Text>
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

export default function OnboardingScreen() {
  const router = useRouter();
  // Section A
  const [adaRequired, setAdaRequired] = useState('');
  const [mobilityAids, setMobilityAids] = useState<string[]>([]);
  const [darRegistered, setDarRegistered] = useState('');
  // Section B
  const [studentType, setStudentType] = useState('');
  const [residenceType, setResidenceType] = useState('');
  const [transportModes, setTransportModes] = useState<string[]>([]);
  const [usedSureWalk, setUsedSureWalk] = useState('');
  const [usedPTSPickup, setUsedPTSPickup] = useState('');
  // Section C
  const [termsSignature, setTermsSignature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function toggleMobility(v: string) {
    setMobilityAids(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  }
  function toggleTransport(v: string) {
    setTransportModes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  }

  async function handleFinish() {
    setError('');
    if (!adaRequired) { setError('Please answer the ADA question.'); return; }
    if (!termsSignature.trim()) { setError('Please type your full name to confirm the terms.'); return; }
    const uid = auth.currentUser?.uid;
    if (!uid) { setError('Session expired. Please log in again.'); return; }
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', uid), {
        adaRequired: adaRequired === 'yes',
        mobilityAids,
        darRegistered: darRegistered || 'no',
        studentType: studentType || 'undergraduate',
        residenceType: residenceType || 'near_campus',
        transportModes,
        usedSureWalk: usedSureWalk === 'yes',
        usedPTSPickup: usedPTSPickup === 'yes',
        termsSignature: termsSignature.trim(),
        medDocUrl: null,
        pushToken: null,
        profileComplete: true,
        onboardingCompletedAt: serverTimestamp(),
      });
      router.replace('/(student)/(tabs)');
    } catch (e: any) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Accessibility Profile</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressStep, styles.progressDone]} />
          <View style={[styles.progressStep, styles.progressActive]} />
        </View>
        <Text style={styles.progressLabel}>Step 2 of 2 — Accessibility & Profile</Text>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Text style={styles.sectionHeader}>A. Accessibility Information</Text>

          <Text style={styles.question}>Do you require Americans with Disabilities Act (ADA) assistance? *</Text>
          <RadioGroup options={[{label:'Yes',value:'yes'},{label:'No',value:'no'}]} selected={adaRequired} onSelect={setAdaRequired} />

          {adaRequired === 'yes' && (
            <>
              <Text style={[styles.question, {marginTop: 16}]}>Mobility aids (select all that apply):</Text>
              <MultiSelect
                options={[{label:'Wheelchair',value:'wheelchair'},{label:'Crutches',value:'crutches'},{label:'Walker',value:'walker'},{label:'Cane',value:'cane'},{label:'Other',value:'other'}]}
                selected={mobilityAids} onToggle={toggleMobility}
              />
            </>
          )}

          <Text style={[styles.question, {marginTop: 16}]}>Are you registered with Disability & Access Resources (DAR)?</Text>
          <RadioGroup options={[{label:'Yes',value:'yes'},{label:'No',value:'no'},{label:'In Progress',value:'in_progress'}]} selected={darRegistered} onSelect={setDarRegistered} />

          <View style={styles.uploadNote}>
            <Text style={styles.uploadNoteText}>📎 Medical document upload will be available in your Profile after sign-up.</Text>
          </View>

          <View style={styles.sectionDivider} />
          <Text style={styles.sectionHeader}>B. Transportation Profile</Text>

          <Text style={styles.question}>Are you a:</Text>
          <RadioGroup options={[{label:'Undergraduate',value:'undergraduate'},{label:'Graduate',value:'graduate'},{label:'Staff',value:'staff'}]} selected={studentType} onSelect={setStudentType} />

          <Text style={[styles.question, {marginTop: 16}]}>Where do you live?</Text>
          <RadioGroup options={[{label:'On campus',value:'on_campus'},{label:'Near campus',value:'near_campus'},{label:'Far from campus',value:'far'}]} selected={residenceType} onSelect={setResidenceType} />

          <Text style={[styles.question, {marginTop: 16}]}>How do you usually get around campus? (select all)</Text>
          <MultiSelect
            options={[{label:'Walk',value:'walk'},{label:'Bike/Scooter',value:'bike'},{label:'UT Bus',value:'ut_bus'},{label:'Uber/Lyft',value:'rideshare'},{label:'Friends',value:'friends'},{label:'Other',value:'other'}]}
            selected={transportModes} onToggle={toggleTransport}
          />

          <Text style={[styles.question, {marginTop: 16}]}>Have you used SureWalk before?</Text>
          <RadioGroup options={[{label:'Yes',value:'yes'},{label:'No',value:'no'}]} selected={usedSureWalk} onSelect={setUsedSureWalk} />

          <Text style={[styles.question, {marginTop: 16}]}>Have you used PTS Pickup before?</Text>
          <RadioGroup options={[{label:'Yes',value:'yes'},{label:'No',value:'no'}]} selected={usedPTSPickup} onSelect={setUsedPTSPickup} />

          <View style={styles.sectionDivider} />
          <Text style={styles.sectionHeader}>C. Terms & Agreement</Text>

          <Text style={styles.termsText}>
            I have read the updated rules and guidelines for SureWalk and PTS Pickup and understand the current situation that these programs are experiencing. I agree to use this service responsibly.
          </Text>
          <Text style={[styles.question, {marginTop: 12}]}>Type your full name to confirm: *</Text>
          <TextInput
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor="#AAAAAA"
            value={termsSignature}
            onChangeText={setTermsSignature}
            autoCapitalize="words"
          />

          <TouchableOpacity style={[styles.finishButton, loading && styles.disabled]} onPress={handleFinish} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.finishText}>Finish — Let's Go!</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BURNT_ORANGE },
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: BURNT_ORANGE, paddingVertical: 18, paddingHorizontal: 16, alignItems: 'center' },
  headerText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  progressBar: { flexDirection: 'row', paddingHorizontal: 28, paddingTop: 16, gap: 8 },
  progressStep: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0' },
  progressDone: { backgroundColor: '#4CAF50' },
  progressActive: { backgroundColor: BURNT_ORANGE },
  progressLabel: { fontSize: 12, color: '#888', paddingHorizontal: 28, paddingTop: 6, marginBottom: 8 },
  body: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 48 },
  errorText: { color: '#C0392B', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: BURNT_ORANGE, marginBottom: 4, marginTop: 8 },
  sectionDivider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
  question: { fontSize: 14, fontWeight: '500', color: '#333', marginTop: 4 },
  uploadNote: { backgroundColor: '#FFF8F4', borderRadius: 8, padding: 12, marginTop: 14, borderWidth: 1, borderColor: '#FFD6B8' },
  uploadNoteText: { fontSize: 13, color: '#7A4500' },
  termsText: { fontSize: 13, color: '#555', lineHeight: 20, backgroundColor: '#F8F8F8', padding: 12, borderRadius: 8, marginTop: 8 },
  input: { backgroundColor: '#F4F4F4', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: '#1A1A1A', marginTop: 8 },
  finishButton: { backgroundColor: BURNT_ORANGE, borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginTop: 24, marginBottom: 20 },
  disabled: { opacity: 0.6 },
  finishText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
