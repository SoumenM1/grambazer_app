import { StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import React from "react";
import { router } from "expo-router";

export default function NarathAi() {
  
  return (
    <>
      <TouchableOpacity
        style={styles.floatingAI}
        onPress={() => router.push("/ai-chat")}
      >
        <Image
          source={require("../assets/ai-icon.png")}
          style={styles.aiIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text style={styles.aiText}>Narath AI</Text>
    </>
  );
}

const styles = StyleSheet.create({
  floatingAI: {
    position: "absolute",
    bottom: 35,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 32,
    backgroundColor: "#a9e79f",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#050e01",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  aiIcon: {
    width: 130,
    height: 120,
  },

  aiText: {
    position: "absolute",
    bottom: 15, // below floating button
    right: 16,
    width: 72,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "800",
    color: "#074f24",
    backgroundColor: "#ffffff",
    paddingVertical: 2,
    borderRadius: 8,
    elevation: 4,
  },
});
