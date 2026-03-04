import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CallScreen() {
  const { name, avatar, type } = useLocalSearchParams();

  const [callStatus, setCallStatus] = useState("Calling...");

  useEffect(() => {
    // TODO: emit socket callUser here
  }, []);

  const endCall = () => {
    // TODO: close peer connection
    router.back();
  };

return (
  <View style={styles.container}>
    
    {/* -------- TOP -------- */}
    <View style={styles.topSection}>
      <Image source={{ uri: avatar as string }} style={styles.avatar} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.status}>{callStatus}</Text>
    </View>

    {/* -------- MIDDLE -------- */}
    {type === "video" && (
      <View style={styles.middleSection}>
        <View style={styles.videoPlaceholder}>
          <Text style={{ color: "#9CA3AF" }}>Video Stream Here</Text>
        </View>
      </View>
    )}

    {/* -------- BOTTOM -------- */}
    <View style={styles.bottomSection}>
      <TouchableOpacity style={styles.endBtn} onPress={endCall}>
        <Ionicons name="call" size={28} color="#fff" />
      </TouchableOpacity>
    </View>

  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    justifyContent: "space-between", // distributes top-middle-bottom
    alignItems: "center",
    paddingVertical: 60,
  },

  /* ---------- TOP SECTION ---------- */
  topSection: {
    alignItems: "center",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },

  name: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "600",
  },

  status: {
    color: "#9CA3AF",
    marginTop: 8,
  },

  /* ---------- MIDDLE SECTION ---------- */
  middleSection: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  videoPlaceholder: {
    width: "90%",
    height: 260,
    backgroundColor: "#1F2937",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ---------- BOTTOM SECTION ---------- */
  bottomSection: {
    alignItems: "center",
    justifyContent: "center",
  },

  endBtn: {
    backgroundColor: "#DC2626",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
});