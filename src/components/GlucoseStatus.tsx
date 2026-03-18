/**
 * Glucose status indicator using simple colors.
 * Kids see a color/ message instead of raw numbers.

 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

type GlucoseZone = 'green' | 'yellow' | 'red';

interface GlucoseStatusProps {
  glucoseValue: number; // mg/dL
}

function getGlucoseZone(value: number): GlucoseZone {
  
}

function getGlucoseMessage(zone: GlucoseZone, value: number): string {
  
}

const ZONE_COLORS: Record<GlucoseZone, string> = {
  
};

function GlucoseStatus({glucoseValue}: GlucoseStatusProps) {
  
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
