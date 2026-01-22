import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  function handleSendOTP() {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    // 🔗 CALL YOUR BACKEND API HERE
    // POST /forgot-password

    router.push("/(auth)/verify");
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>GramBazer</Text>
        <Text style={styles.subtitle}>Reset your password</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>

        <Text style={styles.desc}>
          Enter your registered email. We will send a verification code.
        </Text>

        <TextInput
          placeholder="Email Address"
          placeholderTextColor="#6B7280"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.btn} onPress={handleSendOTP}>
          <Text style={styles.btnText}>Send Verification Code</Text>
        </TouchableOpacity>
      </View>

      {/* Back to login */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    padding: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  logo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0f5024",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 22,
    borderRadius: 16,
    elevation: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },

  desc: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },

  input: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },

  btn: {
    backgroundColor: "#0f5024",
    padding: 16,
    borderRadius: 14,
  },

  btnText: {
    color: "#fff",
    fontWeight: "800",
    textAlign: "center",
    fontSize: 15,
  },

  back: {
    marginTop: 24,
    textAlign: "center",
    color: "#CA8A04", // yellow
    fontWeight: "600",
  },
});
