import { useUser } from '@/context/UserContext';
import { db } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView,
  ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';

const BURNT_ORANGE = '#BF5700';

function Field({ label, ...props }: any) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor="#AAAAAA" {...props} />
    </View>
  );
}

export default function SignUpScreen() {
  const router = useRouter();
  const { loginUser } = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [utEID, setUtEID] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleNext() {
    setError('');
    if (!firstName.trim() || !lastName.trim() || !utEID.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!email.trim().toLowerCase().endsWith('@utexas.edu')) {
      setError('Please use your @utexas.edu email address.');
      return;
    }
    if (!/^[a-zA-Z0-9]{3,8}$/.test(utEID.trim())) {
      setError('UT EID must be 3–8 alphanumeric characters.');
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must be at least 8 characters with one uppercase letter and one number.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      // Demo mode — generate a fake UID and write directly to Firestore
      const fakeUid = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      try {
        await setDoc(doc(db, 'users', fakeUid), {
          uid: fakeUid,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          utEID: utEID.trim().toLowerCase(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          role: 'student',
          profileComplete: false,
          createdAt: serverTimestamp(),
        });
      } catch (dbErr: any) {
        console.error('[SignUp] Firestore write error:', dbErr.code, dbErr.message);
      }

      await loginUser(fakeUid);
      router.push('/(pre-auth)/onboarding');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Create Account</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressStep, styles.progressActive]} />
          <View style={styles.progressStep} />
        </View>
        <Text style={styles.progressLabel}>Step 1 of 2 — Account Information</Text>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Field label="First Name *" placeholder="First name" value={firstName} onChangeText={setFirstName} autoCapitalize="words" />
          <Field label="Last Name *" placeholder="Last name" value={lastName} onChangeText={setLastName} autoCapitalize="words" />
          <Field label="UT EID *" placeholder="e.g. abc1234" value={utEID} onChangeText={setUtEID} autoCapitalize="none" autoCorrect={false} />
          <Field label="UT Email *" placeholder="youreid@utexas.edu" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoCorrect={false} />
          <Field label="Phone Number *" placeholder="(512) 555-0000" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Password *</Text>
            <View style={styles.passwordRow}>
              <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} placeholder="Min 8 chars, 1 uppercase, 1 number" placeholderTextColor="#AAAAAA" value={password} onChangeText={setPassword} secureTextEntry={!showPass} />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(v => !v)}>
                <Text>{showPass ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Field label="Confirm Password *" placeholder="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

          <TouchableOpacity style={[styles.nextButton, loading && styles.disabled]} onPress={handleNext} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.nextText}>Next →</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(pre-auth)/login')} style={styles.loginLink}>
            <Text style={styles.loginLinkBase}>Already have an account? </Text>
            <Text style={styles.loginLinkAccent}>Log in</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BURNT_ORANGE },
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: BURNT_ORANGE, paddingVertical: 18, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 12 },
  backText: { color: '#fff', fontSize: 30, lineHeight: 32 },
  headerText: { color: '#fff', fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center', marginRight: 30 },
  progressBar: { flexDirection: 'row', paddingHorizontal: 28, paddingTop: 16, gap: 8 },
  progressStep: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0' },
  progressActive: { backgroundColor: BURNT_ORANGE },
  progressLabel: { fontSize: 12, color: '#888', paddingHorizontal: 28, paddingTop: 6, marginBottom: 4 },
  body: { paddingHorizontal: 28, paddingTop: 12, paddingBottom: 40 },
  errorText: { color: '#C0392B', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 },
  input: { backgroundColor: '#F4F4F4', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: '#1A1A1A' },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  eyeBtn: { paddingHorizontal: 10, paddingVertical: 13 },
  nextButton: { backgroundColor: BURNT_ORANGE, borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginTop: 12, marginBottom: 20 },
  disabled: { opacity: 0.6 },
  nextText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  loginLink: { flexDirection: 'row', justifyContent: 'center' },
  loginLinkBase: { fontSize: 14, color: '#666' },
  loginLinkAccent: { fontSize: 14, color: BURNT_ORANGE, fontWeight: '600' },
});
