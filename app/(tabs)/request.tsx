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

export default function RequestScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>SureWalk</Text>
        </View>

        {/* Body – centered Request button */}
        <View style={styles.body}>
          <Text style={styles.promptText}>Need a safety escort?</Text>
          <Text style={styles.subText}>
            Tap below and a SureWalk team member{'\n'}will walk with you to your destination.
          </Text>

          <TouchableOpacity style={styles.requestButton} activeOpacity={0.8}>
            <Text style={styles.requestButtonText}>Request</Text>
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
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  promptText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 52,
  },
  requestButton: {
    backgroundColor: BURNT_ORANGE,
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 72,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
