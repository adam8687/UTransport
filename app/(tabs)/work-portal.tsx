import { useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const BURNT_ORANGE = '#BF5700';

export default function WorkPortalScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome to{'\n'}SureWalk</Text>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>
              Request a safety escort anywhere on campus
            </Text>
          </View>

          <Text style={styles.questionText}>Are you a user or employee?</Text>

          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => router.push('/(tabs)/login')}
          >
            <Text style={styles.roleButtonText}>User</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>or</Text>

          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => router.push('/(tabs)/login')}
          >
            <Text style={styles.roleButtonText}>Employee</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BURNT_ORANGE,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
    textAlign: 'center',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 36,
  },
  descriptionBox: {
    backgroundColor: BURNT_ORANGE,
    borderRadius: 16,
    paddingVertical: 44,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 36,
  },
  descriptionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  roleButton: {
    backgroundColor: '#EDE8E0',
    borderRadius: 30,
    paddingVertical: 13,
    paddingHorizontal: 52,
    marginVertical: 6,
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  orText: {
    fontSize: 15,
    color: '#666',
    marginVertical: 4,
  },
});
