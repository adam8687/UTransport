/**
 * Glucose status indicator using a simple green/yellow/red system.
 * Kids see a color + friendly message instead of raw numbers.
 *
 * Medically accurate ranges for pediatric Type 1 Diabetes (mg/dL):
 * - Green (In Range): 70–180 mg/dL
 * - Yellow (Low Warning): 54–69 mg/dL  OR  High Warning: 181–250 mg/dL
 * - Red (Urgent Low): below 54 mg/dL  OR  Urgent High: above 250 mg/dL
 *
 * Ranges based on ADA Standards of Care and International Consensus
 * on Time in Range (TIR) guidelines for pediatric patients.
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

type GlucoseZone = 'green' | 'yellow' | 'red';

interface GlucoseStatusProps {
  glucoseValue: number; // mg/dL
}

function getGlucoseZone(value: number): GlucoseZone {
  if (value >= 70 && value <= 180) {
    return 'green';
  }
  if ((value >= 54 && value < 70) || (value > 180 && value <= 250)) {
    return 'yellow';
  }
  return 'red';
}

function getGlucoseMessage(zone: GlucoseZone, value: number): string {
  if (zone === 'green') {
    return "You're doing awesome! 🌟";
  }
  if (zone === 'yellow' && value < 70) {
    return 'A little low — time for a snack! 🍎';
  }
  if (zone === 'yellow' && value > 180) {
    return "A little high — let's keep an eye on it! 👀";
  }
  if (zone === 'red' && value < 54) {
    return 'Very low — tell a grown-up right away! 🚨';
  }
  return 'Very high — tell a grown-up right away! 🚨';
}

const ZONE_COLORS: Record<GlucoseZone, string> = {
  green: '#4CAF50',
  yellow: '#FFC107',
  red: '#F44336',
};

function GlucoseStatus({glucoseValue}: GlucoseStatusProps) {
  const zone = getGlucoseZone(glucoseValue);
  const message = getGlucoseMessage(zone, glucoseValue);
  const color = ZONE_COLORS[zone];

  return (
    <View style={[styles.container, {borderColor: color}]}>
      <View style={[styles.dot, {backgroundColor: color}]} />
      <Text style={styles.value}>{glucoseValue}</Text>
      <Text style={styles.unit}>mg/dL</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 3,
    backgroundColor: '#FFF',
    margin: 16,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 8,
  },
  value: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  unit: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginTop: 4,
  },
});

export default GlucoseStatus;
