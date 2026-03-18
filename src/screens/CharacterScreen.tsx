import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function CharacterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Buddy</Text>
      <Text style={styles.subtitle}>Take care of your friend!</Text>
      {/* TODO: Character with Dexcom/Omnipod visible on it */}
      {/* TODO: Happiness bar */}
      {/* TODO: Feed character meals */}
      {/* TODO: Challenges (low insulin, low/high sugar scenarios) */}
      {/* TODO: Energy level display */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
});

export default CharacterScreen;
