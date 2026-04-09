import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useUser } from '@/context/UserContext';

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

  if (!firebaseUser) {
    return <Redirect href="/(pre-auth)" />;
  }

  // Employee
  if (userProfile?.role === 'employee') {
    return <Redirect href="/(tabs)/work-portal" />;
  }

  // Student onboarding incomplete
  if (userProfile && !userProfile.profileComplete) {
    return <Redirect href="/(pre-auth)/onboarding" />;
  }

  // Student fully set up
  if (userProfile?.role === 'student') {
    return <Redirect href="/(student)/(tabs)" />;
  }

  // Fallback
  return <Redirect href="/(pre-auth)" />;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});
