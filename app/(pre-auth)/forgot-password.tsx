import { sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView,
  StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { auth } from '@/firebaseConfig';

const BURNT_ORANGE = '#BF5700';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSendReset() {
    setError('');
    setSuccess(false);
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      setSuccess(true);
      setEmail('');
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Reset Password</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>Forgot Your Password?</Text>
          <Text style={styles.subtitle}>Enter your email address and we'll send you a link to reset your password.</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>Check your email for a password reset link.</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#AAAAAA"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            editable={!success}
          />

          <TouchableOpacity
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleSendReset}
            disabled={loading || success}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.sendText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>

          {success && (
            <TouchableOpacity onPress={() => router.push('/(pre-auth)/login')} style={styles.loginLink}>
              <Text style={styles.loginLinkText}>Back to Log In</Text>
            </TouchableOpacity>
          )}
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
  title: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24, lineHeight: 20 },
  errorText: { color: '#C0392B', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  successText: { color: '#2E7D32', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  input: { backgroundColor: '#F4F4F4', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#1A1A1A', marginBottom: 20 },
  sendButton: { backgroundColor: BURNT_ORANGE, borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginBottom: 20 },
  sendButtonDisabled: { opacity: 0.6 },
  sendText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 1 },
  loginLink: { alignItems: 'center' },
  loginLinkText: { color: BURNT_ORANGE, fontSize: 14, fontWeight: '600' },
});
