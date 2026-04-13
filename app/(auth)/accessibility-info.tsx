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

export default function AccessibilityInfoScreen() {
  const router = useRouter();
  const { uid } = useLocalSearchParams<{ uid: string }>();

  const [adaRequired, setAdaRequired] = useState<boolean | null>(null);
  const [termsSignature, setTermsSignature] = useState('');

  function handleConfirm() {
    if (adaRequired === null || !termsSignature.trim()) {
      Alert.alert('Required', 'Please answer all required fields.');
      return;
    }
    // Onboarding complete — enter the main interface
    router.replace('/(tabs)/');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Additional Information</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          {/* Section A — ADA question */}
          <Text style={styles.sectionLabel}>
            {"Do you require Americans with\nDisabilities Act assistance?*"}
          </Text>
          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={styles.checkboxOption}
              onPress={() => setAdaRequired(true)}
            >
              <Text style={styles.checkboxLabel}>Yes</Text>
              <View style={[styles.checkbox, adaRequired === true && styles.checkboxSelected]}>
                {adaRequired === true && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkboxOption}
              onPress={() => setAdaRequired(false)}
            >
              <Text style={styles.checkboxLabel}>No</Text>
              <View style={[styles.checkbox, adaRequired === false && styles.checkboxSelected]}>
                {adaRequired === false && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          </View>

          {/* Section B — Medical Document */}
          <Text style={[styles.sectionLabel, { marginTop: 28, marginBottom: 10 }]}>
            Medical Document:
          </Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() =>
              Alert.alert('Coming Soon', 'Document upload will be available in a future update.')
            }
          >
            <Text style={styles.uploadButtonText}>Upload File</Text>
          </TouchableOpacity>

          {/* Section C — Terms acknowledgment */}
          <Text style={styles.termsLabel}>
            I have read the updated rules and guidelines for Sure Walk and understand the current
            situation that the program is experiencing.*
          </Text>
          <TextInput
            style={styles.termsInput}
            value={termsSignature}
            onChangeText={setTermsSignature}
            placeholder="Type your full name to confirm"
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.primaryButton, { marginTop: 28, marginBottom: 16 }]}
            onPress={handleConfirm}
          >
            <Text style={styles.primaryButtonText}>Confirm</Text>
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
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'SourceSans3_700Bold',
    textAlign: 'center',
  },
  scrollView: { flex: 1 },
  body: {
    paddingHorizontal: 32,
    paddingTop: 44,
    alignItems: 'flex-start',
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    fontFamily: 'SourceSans3_500Medium',
    marginBottom: 12,
    width: '100%',
  },
  checkboxRow: {
    flexDirection: 'row',
    gap: 32,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'SourceSans3_400Regular',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#AAAAAA',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: BURNT_ORANGE,
    borderColor: BURNT_ORANGE,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'SourceSans3_700Bold',
  },
  uploadButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#BBBBBB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'SourceSans3_400Regular',
  },
  termsLabel: {
    fontSize: 13,
    color: '#333',
    fontFamily: 'SourceSans3_400Regular',
    marginTop: 28,
    marginBottom: 10,
    lineHeight: 19,
    width: '100%',
  },
  termsInput: {
    width: '100%',
    backgroundColor: '#E8E3DA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#222',
    fontFamily: 'SourceSans3_400Regular',
    height: 80,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#EDE8E0',
    borderRadius: 30,
    paddingVertical: 14,
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'SourceSans3_600SemiBold',
    color: '#222',
  },
});
