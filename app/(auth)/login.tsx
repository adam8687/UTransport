import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useUser } from '@/context/UserContext';

const BURNT_ORANGE = '#BF5700';

export default function LoginScreen() {
  const router = useRouter();
  const { setUserInfo } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Log in</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Username:*</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Password:*</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              setUserInfo({ email: username, username, role: 'student' });
              // Redirect is handled automatically by RootNavigator
            }}
          >
            <Text style={styles.primaryButtonText}>Log in</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BURNT_ORANGE },
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: BURNT_ORANGE,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'SourceSans3_700Bold',
  },
  body: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 44,
    alignItems: 'center',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  label: {
    width: 110,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    fontFamily: 'SourceSans3_500Medium',
  },
  input: {
    flex: 1,
    backgroundColor: '#E8E3DA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#222',
    fontFamily: 'SourceSans3_400Regular',
  },
  primaryButton: {
    backgroundColor: '#EDE8E0',
    borderRadius: 30,
    paddingVertical: 14,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'SourceSans3_600SemiBold',
    color: '#222',
  },
  linkText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'SourceSans3_400Regular',
  },
});
