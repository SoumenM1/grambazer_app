import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const services = [
  { name: "Teachers", icon: "school" },
  { name: "Shops", icon: "cart" },
  { name: "Emergency", icon: "alert-circle" },
  { name: "Market", icon: "storefront" },
  { name: "Doctors", icon: "medkit" },
];

export default function QuickServices() {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {services.map((s, i) => (
          <TouchableOpacity key={i} style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons name={s.icon as any} size={22} color="#16A34A" />
            </View>
            <Text style={styles.text}>{s.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingLeft: 16,
  },

  card: {
    alignItems: "center",
    marginRight: 18,
  },

  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#ECFDF5", // light green
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#16A34A",
  },

  text: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "500",
    color: "#065F46",
  },
});
