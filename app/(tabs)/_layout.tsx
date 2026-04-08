import { Tabs } from 'expo-router';
import React from 'react';

import { FloatingTabBar } from '@/components/ui/floating-tab-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';

const BURNT_ORANGE = '#BF5700';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // Push screen content up so it's not obscured by the floating bar
        contentStyle: { paddingBottom: 100 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="work-portal"
        options={{
          title: 'SureWalk',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="figure.walk" color={color} />,
        }}
      />
      <Tabs.Screen
        name="request"
        options={{
          title: 'Request',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="bell.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.fill" color={color} />,
        }}
      />
      {/* Hidden screens — routable but not in tab bar */}
      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="sign-up" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="account-info" options={{ href: null }} />
      <Tabs.Screen name="accessibility-info" options={{ href: null }} />
    </Tabs>
  );
}
