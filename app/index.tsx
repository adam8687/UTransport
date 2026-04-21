import { useUser } from '@/context/UserContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const BURNT_ORANGE = '#BF5700';

export default function AuthGate() {
  const { firebaseUser, userProfile, authLoading } = useUser();

  if (authLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={BURNT_ORANGE} />
      </View>
    );
  }

  // TODO: re-enable Firebase auth gate once backend is configured
  // For now, send unauthenticated users straight to the landing page.
  if (!firebaseUser) {
    return <Redirect href="/(pre-auth)" />;
  }

  // Employee
  if (userProfile?.role === 'employee') {
    return <Redirect href="/(tabs)/portal" />;
  }

  // Student onboarding incomplete
  if (userProfile && !userProfile.profileComplete) {
    return <Redirect href="/(pre-auth)/onboarding" />;
  }

  // Student fully set up
  if (userProfile?.role === 'student') {
    return <Redirect href="/(student)/(tabs)" />;
  }

  // Fallback — go to pre-auth landing
  return <Redirect href="/(pre-auth)" />;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});
