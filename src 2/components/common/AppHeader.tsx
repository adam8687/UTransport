import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';

interface AppHeaderProps {
  title?: string;
}

export default function AppHeader({
  title = '[App Logo Here/Name]',
}: AppHeaderProps): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingTop: insets.top }]}
      accessibilityRole="header">
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 16,
    minHeight: 80,
  },
  title: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
});
