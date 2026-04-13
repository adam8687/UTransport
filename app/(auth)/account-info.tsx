import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const BURNT_ORANGE = '#BF5700';

export default function AccountInfoScreen() {
  const router = useRouter();
  const { uid, email } = useLocalSearchParams<{ uid: string; email: string }>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [utEID, setUtEID] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  function handleConfirm() {
    if (!firstName.trim() || !lastName.trim() || !utEID.trim() || !phoneNumber.trim()) {
      Alert.alert('Required', 'Please fill in all required fields.');
      return;
    }
    router.push({ pathname: '/(auth)/accessibility-info', params: { uid } });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>{"Please enter additional\naccount information"}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.fieldRow}>
            <Text style={styles.label}>First Name:*</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Last Name:*</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>UT EID:*</Text>
            <TextInput
              style={styles.input}
              value={utEID}
              onChangeText={setUtEID}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>Phone Number:*</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleConfirm}>
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
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
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'SourceSans3_700Bold',
    textAlign: 'center',
  },
  scrollView: { flex: 1 },
  body: {
    paddingHorizontal: 32,
    paddingTop: 44,
    alignItems: 'center',
    paddingBottom: 40,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  label: {
    width: 120,
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
});
