import { FloatingTabBar } from '@/components/ui/floating-tab-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Tabs } from 'expo-router';

// Student-only tab group
export default function StudentTabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} /> }} />
      <Tabs.Screen name="request" options={{ title: 'Request', tabBarIcon: ({ color }) => <IconSymbol size={26} name="bell.fill" color={color} /> }} />
      <Tabs.Screen name="status" options={{ title: 'Status', tabBarIcon: ({ color }) => <IconSymbol size={26} name="figure.walk" color={color} />, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="history" options={{ title: 'History', tabBarIcon: ({ color }) => <IconSymbol size={26} name="clock.fill" color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.fill" color={color} /> }} />
    </Tabs>
  );
}
