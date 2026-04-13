import { Redirect, Stack } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useUser } from '@/context/UserContext';

const BURNT_ORANGE = '#BF5700';

export default function StudentLayout() {
  const { firebaseUser, userProfile, authLoading } = useUser();

  if (authLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={BURNT_ORANGE} /></View>;
  }

  // TODO: restore this guard once Firebase auth is configured
  // if (!firebaseUser || userProfile?.role !== 'student') {
  //   return <Redirect href="/(pre-auth)" />;
  // }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="ride-status/[id]" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});
