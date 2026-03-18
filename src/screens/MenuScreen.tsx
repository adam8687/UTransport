import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function MenuScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings ⚙️</Text>
      {/* TODO: App settings */}
      {/* TODO: Notification preferences */}
      {/* TODO: Account / profile info */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
});

export default MenuScreen;
