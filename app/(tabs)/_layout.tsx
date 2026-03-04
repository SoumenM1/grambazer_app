import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { registerForPushNotificationsAsync } from "../../lib/notifications";
import { useEffect } from "react";
import { API } from "../../lib/api";
import { useLiveLocation } from "../../lib/location";

export default function TabsLayout() {
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();
  // ⛔ Wait until auth is restored (VERY IMPORTANT)
  if (loading) return null;

  // ❌ Not logged in → go to login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  useEffect(() => {
    async function initPush() {
      try {
        const expoPushToken = await registerForPushNotificationsAsync();
        if (!expoPushToken) return;
        await API.post("/save-push-token", { expoPushToken });
      } catch (err) {
        console.log("Push register error:", err);
      }
    }

    initPush();
  }, []);
  useLiveLocation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#099335",
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingTop: 3,
          paddingBottom: insets.bottom,
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          elevation: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="market"
        options={{
          title: "Market",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="post"
        options={{
          title: "Post",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size + 6} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="(stack)" options={{ href: null }} />
      <Tabs.Screen name="chat/[chatId]" options={{ href: null }} />
      {/* <Tabs.Screen name="business/view" options={{ href: null }} /> */}
      <Tabs.Screen name="business/index" options={{ href: null }} />
      <Tabs.Screen name="business/create" options={{ href: null }} />
      <Tabs.Screen name="business/kyc" options={{ href: null }} />
      <Tabs.Screen name="calls/CallScreen" options={{ href: null }} />
      <Tabs.Screen name="calls/IncomingCallScreen" options={{ href: null }} />
    </Tabs>
  );
}
