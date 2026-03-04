import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { router } from "expo-router";
import { API } from "../../lib/api";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });
      await login(res.data.token, res.data.user);
    } catch (err: any) {
      Alert.alert("Login failed", err.response?.data?.message || "Error");
    }
  }

  return (
    <View style={styles.container}>
      {/* Brand Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>GramBazer</Text>
        <Text style={styles.subtitle}>
          Local social & business. Local trust.
        </Text>
      </View>

      {/* Form */}
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#6B7280"
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />
        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#6B7280"
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            style={styles.passwordInput}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eye}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        {/* Forgot password */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot-password")}
          style={styles.forgotWrap}
        >
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity onPress={handleLogin} style={styles.btn}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Create account */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text style={styles.create}>Create Account</Text>
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
    marginBottom: 30,
  },

  logo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0f5024",
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 22,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },

  input: {
    // backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 15,
  },

  forgotWrap: {
    alignItems: "flex-end",
    marginBottom: 14,
  },

  forgot: {
    fontSize: 13,
    color: "#CA8A04", // yellow
    fontWeight: "600",
  },

  btn: {
    backgroundColor: "#0f5024",
    padding: 16,
    borderRadius: 14,
  },

  btnText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 26,
  },

  footerText: {
    color: "#6B7280",
    fontSize: 14,
  },

  create: {
    color: "#166534",
    fontWeight: "800",
    marginLeft: 6,
  },
  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
  },
  eye: {
    paddingLeft: 8,
  },
});
