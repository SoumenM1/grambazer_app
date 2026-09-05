import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";

export default function GramAi() {
  return (
    <TouchableOpacity
      style={styles.floatingAI}
      onPress={() => router.push("/gramai")}
      activeOpacity={0.8}
    >
      <View style={styles.circle}>
        <Image
          source={require("../assets/gram.gif")}
          style={styles.aiIcon}
          contentFit="contain"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingAI: {
    position: "absolute",
    bottom: 35,
    right: 19,

    width: 75,
    height: 75,

    alignItems: "center",
    justifyContent: "center",
  },

  circle: {
    width: 70,
    height: 70,

    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#3e8f59",

    backgroundColor: "transparent",

    alignItems: "center",
    justifyContent: "center",

    // IMPORTANT
    overflow: "hidden",

    elevation: 6,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  aiIcon: {
    width: 90,
    height: 90,
  },
});
