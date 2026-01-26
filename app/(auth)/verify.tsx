import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { API } from "../../lib/api";

export default function VerifyEmail() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    if (otp.length !== 4) {
      Alert.alert("Error", "Enter valid 4-digit OTP");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/verify-otp-register", {
        email,
        otp,
      });

      // Alert.alert("Success", "Email verified successfully");
      router.replace("/(auth)/login");
    } catch (err: any) {
      Alert.alert(
        "Verification failed",
        err.response?.data?.message || "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      await API.post("/auth/resend-otp", { email });
      Alert.alert("OTP Sent", "New verification code sent to your email");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Unable to resend OTP"
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>GramBazer</Text>
        <Text style={styles.subtitle}>Email Verification</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Enter Verification Code</Text>

        <Text style={styles.desc}>
          We have sent a 4-digit code to {email}
        </Text>

        <TextInput
          placeholder="Enter OTP"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          maxLength={4}
          style={styles.otp}
          value={otp}
          onChangeText={setOtp}
        />

        <TouchableOpacity
          style={[
            styles.btn,
            loading && { backgroundColor: "#9CA3AF" },
          ]}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resend}>Resend Code</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 18,
  },

  otp: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 6,
    marginBottom: 18,
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

  resend: {
    marginTop: 16,
    textAlign: "center",
    color: "#CA8A04",
    fontWeight: "700",
  },
});
