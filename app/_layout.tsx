import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { NotificationProvider } from "../context/NotificationContext";

function RootLayout() {
  const { user, loading } = useAuth();

  // ⛔ STOP rendering until auth restored
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="(auth)" />
      ) : (
        <Stack.Screen name="(tabs)" />
        
      )}
     
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RootLayout />
      </NotificationProvider>
    </AuthProvider>
  );
}
