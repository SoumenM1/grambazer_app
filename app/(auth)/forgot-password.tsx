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
import { Ionicons } from "@expo/vector-icons";
import { API } from "../../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  /* -------- SEND OTP -------- */
  async function handleSendOTP() {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      setLoading(true);

      // 🔗 CALL YOUR BACKEND HERE
      await API.post("/auth/send-otp", { email });

      setOtpSent(true);
      Alert.alert("Success", "OTP sent to your email");
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  /* -------- SUBMIT RESET -------- */
  async function handleResetPassword() {
    if (!otp || !newPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // 🔗 CALL YOUR BACKEND HERE
      await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      Alert.alert("Success", "Password updated successfully");

      router.replace("/login");
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
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

        {/* EMAIL */}
        <TextInput
          placeholder="Email Address"
          placeholderTextColor="#6B7280"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          editable={!otpSent}
        />

        {/* SEND OTP BUTTON */}
        {!otpSent && (
          <TouchableOpacity
            style={styles.btn}
            onPress={handleSendOTP}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading ? "Sending..." : "Send Verification Code"}
            </Text>
          </TouchableOpacity>
        )}

        {/* OTP + PASSWORD SECTION */}
        {otpSent && (
          <>
            <TextInput
              placeholder="Enter OTP"
              placeholderTextColor="#6B7280"
              keyboardType="number-pad"
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
            />

            {/* PASSWORD WITH EYE ICON */}
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="New Password"
                placeholderTextColor="#6B7280"
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.btn}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text style={styles.btnText}>
                {loading ? "Processing..." : "Reset Password"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

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
    marginBottom: 16,
    textAlign: "center",
  },

  input: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 14,
  },

  btn: {
    backgroundColor: "#0f5024",
    padding: 16,
    borderRadius: 14,
    marginTop: 4,
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
    color: "#CA8A04",
    fontWeight: "600",
  },
});