/**
 * Glucobuddy - Gamified Diabetes Management for Kids
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './screens/HomeScreen';
import CharacterScreen from './screens/CharacterScreen';
import MinigameScreen from './screens/MinigameScreen';
import MenuScreen from './screens/MenuScreen';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#4A90D9',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              height: 60,
              paddingBottom: 8,
              paddingTop: 4,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
            headerShown: false,
          }}>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({color, size}) => (
                <Icon name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Character"
            component={CharacterScreen}
            options={{
              tabBarLabel: 'Buddy',
              tabBarIcon: ({color, size}) => (
                <Icon name="emoticon-happy" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Minigames"
            component={MinigameScreen}
            options={{
              tabBarLabel: 'Games',
              tabBarIcon: ({color, size}) => (
                <Icon name="gamepad-variant" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Menu"
            component={MenuScreen}
            options={{
              tabBarLabel: 'Settings',
              tabBarIcon: ({color, size}) => (
                <Icon name="cog" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
