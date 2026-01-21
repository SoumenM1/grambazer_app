import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      {/* Profile Header */}
      <View
        style={{
          alignItems: "center",
          paddingVertical: 50,
          backgroundColor: "#cbcaca",
        }}
      >
        <Image
          source={{ uri: "https://picsum.photos/200/200?random=16" }}
          style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            marginBottom: 8,
          }}
        />

        {/* Name */}
        <Text
          style={{
            fontSize: 22,
            fontWeight: "800",
            marginTop: 6,
            color: "#111827",
          }}
        >
          Soumen Maity
        </Text>

        {/* Role */}
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            marginTop: 4,
            fontWeight: "500",
          }}
        >
          Seller • GramBazer
        </Text>

        {/* Followers / Following */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 22,
          }}
        >
          <StatBox label="Followers" value="128" />
          <StatBox label="Following" value="64" />
        </View>
      </View>

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
        <MenuItem icon="log-out" label="Logout" danger />
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
}: {
  icon: any;
  label: string;
  subtitle?: string;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
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
