/**
 * HappinessBar - a visual bar showing the character's happiness level.
 * Displayed on the Character tab. Minigames and feeding raise this bar.
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface HappinessBarProps {
  /** Value between 0 and 100 */
  level: number;
}

function getBarColor(level: number): string {
  if (level >= 60) {
    return '#4CAF50';
  }
  if (level >= 30) {
    return '#FFC107';
  }
  return '#F44336';
}

function getEmoji(level: number): string {
  if (level >= 80) {
    return '😄';
  }
  if (level >= 60) {
    return '😊';
  }
  if (level >= 40) {
    return '😐';
  }
  if (level >= 20) {
    return '😟';
  }
  return '😢';
}

function HappinessBar({level}: HappinessBarProps) {
  const clampedLevel = Math.max(0, Math.min(100, level));
  const color = getBarColor(clampedLevel);
  const emoji = getEmoji(clampedLevel);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Happiness {emoji}</Text>
      <View style={styles.barBackground}>
        <View
          style={[styles.barFill, {width: `${clampedLevel}%`, backgroundColor: color}]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  barBackground: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
});

export default HappinessBar;
