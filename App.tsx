/**
 * AccessibilitySP26
 *
 * @format
 */

import React, { useEffect } from 'react';
import firebase from '@react-native-firebase/app';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
// Optional: Firebase config can be omitted if google-services.json is present and correct
// If you need to check initialization, you can log the app name

function App(): React.JSX.Element {
  useEffect(() => {
    // Check if Firebase is initialized
    if (firebase.apps.length) {
      console.log('Firebase initialized:', firebase.app().name);
    } else {
      console.error('Firebase not initialized!');
    }
  }, []);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.container}>
          <Text style={styles.title}>AccessibilitySP26</Text>
          <Text style={styles.subtitle}>Ready to build something great!</Text>
          <Text style={{ marginTop: 20, color: '#888', fontSize: 12 }}>
            Firebase should be initialized (check console for status)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default App;
