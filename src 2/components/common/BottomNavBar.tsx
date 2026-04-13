import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

export default function BottomNavBar(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      <Ionicons name="home-outline" size={28} color={Colors.textOnPrimary} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: Colors.primary,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
