import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Pressable 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "../../lib/api";

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ],
      { cancelable: true },
    );
  };
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.warn("No token found");
        return;
      }
      const res = await API.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.user);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      {/* Profile Header */}
      {loading ? (
        <Text style={{ padding: 20 }}>Loading...</Text>
      ) : (
        user && (
          <View style={{ backgroundColor: "#F9FAFB", paddingBottom: 30 }}>
            {/* Top Right Edit Button */}
            <View
              style={{
                position: "absolute",
                top: 40,
                right: 20,
                zIndex: 10,
              }}
            >
              <Pressable onPress={() => router.push("/(tabs)/(stack)/edit-profile")}>
                <Ionicons name="create-outline" size={26} color="#111827" />
              </Pressable>
            </View>

            {/* Profile Info */}
            <View
              style={{
                alignItems: "center",
                paddingTop: 60,
                paddingHorizontal: 20,
              }}
            >
              {/* Avatar */}
              <Image
                source={{
                  uri:
                    user.imageUrl || "https://picsum.photos/200/200?random=16",
                }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  borderWidth: 2,
                  borderColor: "#E5E7EB",
                }}
              />

              {/* Name */}
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "800",
                  marginTop: 12,
                  color: "#111827",
                }}
              >
                {user.name}
              </Text>

              {/* Bio (Centered & Max Width) */}
              <Text
                style={{
                  fontSize: 14,
                  color: "#4B5563",
                  marginTop: 6,
                  fontWeight: "500",
                  textAlign: "center",
                  maxWidth: "80%",
                }}
                numberOfLines={2}
              >
                {user.bio || "Add a short bio about yourself"}
              </Text>

              {/* Followers / Following */}
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 26,
                }}
              >
                <StatBox label="Followers" value={user.followersCount} />
                <View style={{ width: 40 }} />
                <StatBox label="Following" value={user.followingCount} />
              </View>
            </View>
          </View>
        )
      )}

      {/* Business Dashboard */}
      <Section>
        <MenuItem
          icon="business"
          label="My Business Dashboard"
          subtitle="View & edit your shop"
          highlight
        />
      </Section>

      {/* Account */}
      <Section title="Account">
        <MenuItem icon="lock-closed" label="Account Privacy" />
        <MenuItem icon="people" label="Followers & Following" />
      </Section>

      {/* Support */}
      <Section title="Support">
        <MenuItem icon="help-circle" label="Help & Support" />
        <MenuItem icon="document-text" label="Privacy Policy" />
      </Section>

      {/* Logout */}
      <Section>
        <MenuItem icon="log-out" label="Logout" danger onPress={handleLogout} />
      </Section>
    </ScrollView>
  );
}

/* ---------- Small Components ---------- */

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: "center", marginHorizontal: 26 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "800",
          color: "#111827",
        }}
      >
        {value}
      </Text>

      <Text
        style={{
          fontSize: 13,
          color: "#374151",
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function Section({ title, children }: { title?: string; children: any }) {
  return (
    <View style={{ marginTop: 16 }}>
      {title && (
        <Text
          style={{
            marginLeft: 16,
            marginBottom: 6,
            fontSize: 13,
            color: "#6B7280",
            fontWeight: "600",
          }}
        >
          {title}
        </Text>
      )}

      <View
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 14,
          marginHorizontal: 12,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  subtitle,
  highlight,
  danger,
  onPress,
}: {
  icon: any;
  label: string;
  subtitle?: string;
  highlight?: boolean;
  danger?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
      }}
    >
      <Ionicons
        name={icon}
        size={22}
        color={danger ? "#DC2626" : highlight ? "#16A34A" : "#374151"}
      />

      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: danger ? "#DC2626" : "#111827",
          }}
        >
          {label}
        </Text>

        {subtitle && (
          <Text style={{ fontSize: 12, color: "#6B7280" }}>{subtitle}</Text>
        )}
      </View>

      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
