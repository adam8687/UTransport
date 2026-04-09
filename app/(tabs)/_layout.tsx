import { Tabs } from 'expo-router';
import { FloatingTabBar } from '@/components/ui/floating-tab-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="work-portal"
        options={{
          title: 'Work Portal',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="briefcase.fill" color={color} />,
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="request" options={{ href: null }} />
      <Tabs.Screen name="account" options={{ href: null }} />
      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="sign-up" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="account-info" options={{ href: null }} />
      <Tabs.Screen name="accessibility-info" options={{ href: null }} />
    </Tabs>
  );
}
