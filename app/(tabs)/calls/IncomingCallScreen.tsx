import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function IncomingCall() {
  const { name, avatar, type } = useLocalSearchParams();

  const acceptCall = () => {
    router.replace({
      pathname: "/calls/callScreen",
      params: { name, avatar, type },
    });
  };

  const rejectCall = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: avatar as string }} style={styles.avatar} />

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.status}>Incoming {type} call...</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.rejectBtn} onPress={rejectCall}>
          <Ionicons name="call" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.acceptBtn} onPress={acceptCall}>
          <Ionicons name="call" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
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
  },
  status: {
    color: "#9CA3AF",
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    marginTop: 40,
  },
  acceptBtn: {
    backgroundColor: "#16A34A",
    padding: 20,
    borderRadius: 50,
    marginLeft: 30,
  },
  rejectBtn: {
    backgroundColor: "#DC2626",
    padding: 20,
    borderRadius: 50,
  },
});