import { FloatingTabBar } from '@/components/ui/floating-tab-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Tabs } from 'expo-router';

// Employee-only tab group — only shows the Dispatcher Portal
export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="portal"
        options={{
          title: 'Portal',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="briefcase.fill" color={color} />,
          tabBarStyle: { display: 'none' },
        }}
      />
      {/* Hide all student-facing screens from employee view */}
      <Tabs.Screen name="request" options={{ href: null }} />
      <Tabs.Screen name="status" options={{ href: null }} />
      <Tabs.Screen name="history" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="work-portal" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
