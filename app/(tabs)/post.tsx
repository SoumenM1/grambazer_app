import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PostScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
        Create Post
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#2563EB",
          padding: 14,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="camera" size={20} color="#fff" />
        <Text style={{ color: "#fff", marginLeft: 8, fontWeight: "600" }}>
          Upload Photo / Video
        </Text>
      </TouchableOpacity>
    </View>
  );
}
