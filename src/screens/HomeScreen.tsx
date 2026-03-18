import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hi there! 👋</Text>
      <Text style={styles.subtitle}>How are you feeling today?</Text>
      {/* TODO: Glucose level display (green/yellow/red system) */}
      {/* TODO: Character preview */}
      {/* TODO: Words of encouragement */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
});

export default HomeScreen;
