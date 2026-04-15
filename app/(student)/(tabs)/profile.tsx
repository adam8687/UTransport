import { GlassCard } from '@/components/ui/glass-card';
import { useUser } from '@/context/UserContext';
import { db } from '@/firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const BURNT_ORANGE = '#BF5700';

function getInitials(firstName: string, lastName: string) {
  return ((firstName?.[0] || '') + (lastName?.[0] || '')).toUpperCase() || 'U';
}

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, firebaseUser, logoutUser } = useUser();
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSavePhone() {
    if (!firebaseUser || !phone.trim()) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), { phone: phone.trim() });
      setIsEditing(false);
      Alert.alert('Success', 'Phone number updated.');
    } catch (e) {
      Alert.alert('Error', 'Failed to update phone number.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          logoutUser();
          router.replace('/(pre-auth)');
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
      <LinearGradient colors={[BURNT_ORANGE, '#d4733a', '#f5ede6']} locations={[0, 0.35, 1]} style={styles.headerGradient}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(userProfile?.firstName || '', userProfile?.lastName || '')}</Text>
          </View>
          <Text style={styles.fullName}>{userProfile?.firstName} {userProfile?.lastName}</Text>
          <Text style={styles.utEID}>{userProfile?.utEID}</Text>
        </View>

        {/* Personal Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <GlassCard style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>First Name</Text>
              <Text style={styles.infoValue}>{userProfile?.firstName}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Name</Text>
              <Text style={styles.infoValue}>{userProfile?.lastName}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>UT EID</Text>
              <Text style={styles.infoValue}>{userProfile?.utEID}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userProfile?.email}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              {isEditing ? (
                <View style={styles.phoneEditRow}>
                  <TextInput
                    style={styles.phoneInput}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholder="Enter phone number"
                  />
                  <TouchableOpacity
                    style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                    onPress={handleSavePhone}
                    disabled={saving}
                  >
                    <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Text style={styles.phoneValue}>{phone || 'Add phone number'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </GlassCard>
        </View>

        {/* Accessibility Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility</Text>
          <GlassCard style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ADA Assistance</Text>
              <Text style={styles.infoValue}>{userProfile?.adaRequired ? 'Yes' : 'No'}</Text>
            </View>
            {userProfile?.adaRequired && userProfile?.mobilityAids?.length > 0 && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Mobility Aids</Text>
                  <Text style={styles.infoValue}>{userProfile.mobilityAids.join(', ')}</Text>
                </View>
              </>
            )}
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>DAR Registered</Text>
              <Text style={styles.infoValue}>{userProfile?.darRegistered === 'yes' ? 'Yes' : userProfile?.darRegistered === 'in_progress' ? 'In Progress' : 'No'}</Text>
            </View>
          </GlassCard>
        </View>

        {/* Medical Document Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Document</Text>
          <GlassCard style={styles.card}>
            <View style={styles.docContainer}>
              <Text style={styles.docStatus}>{userProfile?.medDocUrl ? '✅ Document Uploaded' : '❌ No Document'}</Text>
              <TouchableOpacity
                style={[styles.uploadBtn]}
                onPress={() => Alert.alert('Coming Soon', 'Medical document upload will be available soon.')}
              >
                <Text style={styles.uploadBtnText}>Upload Document</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <GlassCard style={styles.card}>
            <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  headerGradient: { paddingTop: 0, paddingBottom: 0 },
  header: { paddingVertical: 18, paddingHorizontal: 16, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  body: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  avatarContainer: { alignItems: 'center', marginBottom: 28 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: BURNT_ORANGE, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  fullName: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  utEID: { fontSize: 13, color: '#666', marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: BURNT_ORANGE, marginBottom: 10 },
  card: { padding: 0 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  infoLabel: { fontSize: 14, color: '#666', fontWeight: '500' },
  infoValue: { fontSize: 14, color: '#1A1A1A', fontWeight: '600', textAlign: 'right', flex: 1, marginLeft: 12 },
  phoneValue: { fontSize: 14, color: BURNT_ORANGE, fontWeight: '600', textAlign: 'right' },
  phoneEditRow: { flexDirection: 'row', gap: 8, alignItems: 'center', flex: 1 },
  phoneInput: { flex: 1, backgroundColor: '#F4F4F4', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, fontSize: 14 },
  saveBtn: { backgroundColor: BURNT_ORANGE, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8 },
  saveBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginHorizontal: 16 },
  docContainer: { paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center', gap: 12 },
  docStatus: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  uploadBtn: { backgroundColor: '#F4F4F4', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  uploadBtnText: { fontSize: 14, fontWeight: '600', color: BURNT_ORANGE, textAlign: 'center' },
  signOutBtn: { backgroundColor: '#FFEBEE', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' },
  signOutText: { fontSize: 15, fontWeight: '700', color: '#C0392B' },
});
