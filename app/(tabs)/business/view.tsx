import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function BusinessView() {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>My Business</Text>

        <TouchableOpacity onPress={() => router.push("/(tabs)/business/edit")}>
          <Ionicons name="create-outline" size={22} color="#166534" />
        </TouchableOpacity>
      </View>

      {/* PROFILE */}
      <Image
        source={{ uri: "https://picsum.photos/300" }}
        style={styles.logo}
      />

      <Text style={styles.name}>Grambazer Store</Text>
      <Text style={styles.desc}>Village groceries & daily needs</Text>

      {/* STATS */}
      <View style={styles.stats}>
        <Stat label="Followers" value="320" />
        <Stat label="Rating" value="4.6 ⭐" />
        <Stat label="Services" value="12" />
      </View>
    </View>
  );
}

const Stat = ({ label, value }: any) => (
  <View style={{ alignItems: "center" }}>
    <Text style={{ fontWeight: "700" }}>{value}</Text>
    <Text style={{ fontSize: 12, color: "#6B7280" }}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F0FDF4" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "700", color: "#14532D" },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: "center",
    marginVertical: 16,
  },
  name: { fontSize: 18, fontWeight: "700", textAlign: "center" },
  desc: { textAlign: "center", color: "#6B7280", marginBottom: 12 },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});
