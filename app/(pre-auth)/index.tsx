import { UTHeader } from '@/components/ui/ut-header';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function LandingScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#BF5700" />
      <UTHeader />
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>Request a safe ride anywhere on campus</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.body}>
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/(pre-auth)/login')} activeOpacity={0.8}>
            <Text style={styles.btnText}>For Students</Text>
          </TouchableOpacity>
          <Text style={styles.orText}>or</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/(tabs)/work-portal')} activeOpacity={0.8}>
            <Text style={styles.btnText}>For Employees</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { flex: 1, paddingHorizontal: 32, justifyContent: 'center' },
  descriptionCard: { backgroundColor: '#BF5700', borderRadius: 16, paddingVertical: 50, paddingHorizontal: 24, marginBottom: 175, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  descriptionText: { color: '#fff', fontSize: 24, fontWeight: '600', textAlign: 'center', lineHeight: 24 },
  body: { alignItems: 'center', gap: 12 },
  btn: { width: '100%', backgroundColor: '#E0E0E0', borderRadius: 10, paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#333', fontSize: 17, fontWeight: '700' },
  orText: { fontSize: 15, color: '#999', fontWeight: '500' },
});
