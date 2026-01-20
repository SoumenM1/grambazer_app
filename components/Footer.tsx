import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  translateY: Animated.Value;
};

export default function Footer({ translateY }: Props) {
  return (
    <Animated.View
      style={[
        styles.footer,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <Tab icon="home" label="Home" />
      <Tab icon="storefront" label="Market" />
       <Tab icon="add" label="Post" isPost />
      <Tab icon="person" label="Profile" />
    </Animated.View>
  );
}

function Tab({
  icon,
  label,
  isPost,
}: {
  icon: any;
  label: string;
  isPost?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.tab}>
      <Ionicons
        name={icon}
        size={isPost ? 35 : 26}
        color="#ffffff"
        style={isPost && styles.postIcon}
      />

      {/* <Text style={styles.text}>{label}</Text> */}
    </TouchableOpacity>
  );
}




const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: "#0d6f2c",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // borderTopWidth: 1,
    // borderTopColor: "#E5E7EB",
    elevation: 10,
  },

  tab: {
    alignItems: "center",
  },

  text: {
    fontSize: 12,
    marginTop: 2,
    color: "#ffffff",
  },
  postIcon: {
  marginTop: 0, // 🔥 aligns with other icons
},

});
