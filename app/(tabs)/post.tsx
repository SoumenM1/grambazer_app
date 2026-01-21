import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

type MediaType = "photo" | "video" | "live" | null;

export default function PostScreen() {
  const [selected, setSelected] = useState<MediaType>(null);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#F9FAFB" }}>
      {/* Title */}
      <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 16 }}>
        Create Post
      </Text>

      {/* Media Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <ActionButton
          icon="image"
          label="Photo"
          active={selected === "photo"}
          onPress={() => setSelected("photo")}
        />

        <ActionButton
          icon="videocam"
          label="Video"
          active={selected === "video"}
          onPress={() => setSelected("video")}
        />

        <ActionButton
          icon="radio"
          label="Live"
          active={selected === "live"}
          onPress={() => setSelected("live")}
        />
      </View>

      {/* Selected Media Preview Area */}
      <View
        style={{
          flex: 1,
          borderRadius: 14,
          backgroundColor: "#ffffff",
          borderWidth: 1,
          borderColor: "#E5E7EB",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!selected && (
          <Text style={{ color: "#6B7280" }}>
            Select Photo / Video / Live
          </Text>
        )}

        {selected === "photo" && (
          <Preview icon="image" text="Photo preview will appear here" />
        )}

        {selected === "video" && (
          <Preview icon="videocam" text="Video preview will appear here" />
        )}

        {selected === "live" && (
          <Preview icon="radio" text="Live stream preview will appear here" />
        )}
      </View>
    </View>
  );
}

/* ---------- Small Components ---------- */

function ActionButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: any;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: "32%",
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: active ? "#16A34A" : "#ffffff",
        borderWidth: 1,
        borderColor: active ? "#16A34A" : "#E5E7EB",
        alignItems: "center",
      }}
    >
      <Ionicons
        name={icon}
        size={20}
        color={active ? "#ffffff" : "#16A34A"}
      />
      <Text
        style={{
          marginTop: 6,
          fontSize: 13,
          fontWeight: "600",
          color: active ? "#ffffff" : "#374151",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Preview({ icon, text }: { icon: any; text: string }) {
  return (
    <>
      <Ionicons name={icon} size={42} color="#9CA3AF" />
      <Text style={{ marginTop: 10, color: "#6B7280" }}>{text}</Text>
    </>
  );
}
