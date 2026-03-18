import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function MinigameScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Games! 🎮</Text>
      <Text style={styles.subtitle}>Play and learn!</Text>
      {/* TODO: Dinosaur obstacle/platform game */}
      {/* TODO: Food catching game */}
      {/* TODO: Daily educational minigame */}
      {/* TODO: Happiness level connection to character */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FFF0',
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

export default MinigameScreen;
