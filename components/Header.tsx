import { View, TextInput, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        {/* Search Box */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#0d9221" />
          <TextInput
            placeholder="Search Teacher, Shop, Plumber..."
            placeholderTextColor="#6B7280"
            style={styles.input}
          />
        </View>

        {/* Notification Icon */}
        <TouchableOpacity style={styles.notification}>
          <Ionicons name="notifications" size={22} color="#ffffff" />

          {/* Badge (optional) */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Location */}
      <Text style={styles.location}>
        📍 10km Radius: Rampur Village
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#056a20", // Grambazer green
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  searchBox: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    height: 42,
    flex: 1,
    marginRight: 12,
  },

  input: {
    marginLeft: 8,
    flex: 1,
    color: "#111827",
  },

  notification: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#0b4113",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#DC2626",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
  },

  location: {
    color: "#fbfdfc",
    marginTop: 8,
    fontSize: 13,
  },
});
