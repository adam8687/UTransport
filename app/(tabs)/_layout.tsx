import { FloatingTabBar } from '@/components/ui/floating-tab-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Tabs } from 'expo-router';

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
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
