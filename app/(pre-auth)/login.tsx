import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  SafeAreaView, StatusBar, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { auth, db } from '@/firebaseConfig';

const BURNT_ORANGE = '#BF5700';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSignIn() {
    // TODO: re-enable Firebase auth once backend is configured
    router.replace('/(student)/(tabs)');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>UT Transportation</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>Log In</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Email or UT EID"
            placeholderTextColor="#AAAAAA"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />

          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Password"
              placeholderTextColor="#AAAAAA"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(v => !v)}>
              <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.signInButton, loading && styles.signInButtonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signInText}>SIGN IN</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={() => router.push('/(pre-auth)/forgot-password')}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.signUpRow}>
            <Text style={styles.signUpBaseText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(pre-auth)/sign-up')}>
              <Text style={styles.signUpLinkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  body: { flex: 1, paddingHorizontal: 28, paddingTop: 36 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A1A', textAlign: 'center', marginBottom: 24 },
  errorText: { color: '#C0392B', fontSize: 13, textAlign: 'center', marginBottom: 12 },
  input: { backgroundColor: '#F4F4F4', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#1A1A1A', marginBottom: 14 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  eyeBtn: { paddingHorizontal: 12, paddingVertical: 14 },
  eyeText: { fontSize: 18 },
  signInButton: { backgroundColor: BURNT_ORANGE, borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginBottom: 20 },
  signInButtonDisabled: { opacity: 0.6 },
  signInText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 1 },
  divider: { height: 1, backgroundColor: '#E8E8E8', marginVertical: 20 },
  forgotText: { color: BURNT_ORANGE, fontSize: 14, textAlign: 'center', marginBottom: 16 },
  signUpRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signUpBaseText: { fontSize: 14, color: '#666' },
  signUpLinkText: { fontSize: 14, color: BURNT_ORANGE, fontWeight: '600' },
});
