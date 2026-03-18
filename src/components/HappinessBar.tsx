/**
 * visual bar showing character's happiness level.
 * Displayed on Character tab. Minigames and feeding raise bar.
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface HappinessBarProps {
  level: number;
}

function getBarColor(level: number): string {
  
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
