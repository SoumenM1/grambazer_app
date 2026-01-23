import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function AuthLayout() {
  const { user, loading } = useAuth();

  // ⛔ Wait until auth is restored
  if (loading) return null;

  // ✅ If already logged in → leave auth
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
