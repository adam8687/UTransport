import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavBar from '../../components/common/BottomNavBar';
import SecondaryButton from '../../components/common/SecondaryButton';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLine1}>Welcome to</Text>
          <Text style={styles.headerLine2}>[Title of app]</Text>
        </View>

        {/* Description card */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>
            [Add description of the app/tagline]
          </Text>
        </View>

        {/* Role selector */}
        <View style={styles.roleSection}>
          <Text style={styles.roleLabel}>Are you a user or employee?</Text>
          <View style={styles.buttonWrapper}>
            <SecondaryButton
              label="User"
              onPress={() => navigation.navigate('Login')}
            />
          </View>
          <Text style={styles.orText}>or</Text>
          <View style={styles.buttonWrapper}>
            <SecondaryButton
              label="Employee"
              onPress={() =>
                Alert.alert(
                  'Coming Soon',
                  'Employee login is not available yet.',
                )
              }
            />
          </View>
        </View>

        <View style={styles.flex} />
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLine1: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  headerLine2: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  descriptionCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 24,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  descriptionText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.base,
    textAlign: 'center',
  },
  roleSection: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 40,
  },
  roleLabel: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 16,
  },
  orText: {
    fontSize: FontSize.sm - 1,
    color: Colors.textSecondary,
    marginVertical: 8,
  },
  flex: {
    flex: 1,
  },
});
