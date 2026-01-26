import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getUserLocation } from "../lib/location";
import { useEffect, useState } from "react";
import { useNotification } from "../context/NotificationContext";
import { router } from "expo-router";

export default function Header() {
  const [locationText, setLocationText] = useState("Fetching location...");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const { unreadCount } = useNotification();

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    const location = await getUserLocation();
    if (!location) return;

    setCoords(location);
    setLocationText(`📍 ${location.text}`);

    // Optional API call
    // sendLocationToAPI(location.lat, location.lng);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        {/* Search Box */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={23} color="#0d9221" />
          <TextInput
            placeholder="Search Teacher, Shop, Plumber..."
            placeholderTextColor="#111111"
            style={styles.input}
          />
        </View>

        {/* Notification */}
        <TouchableOpacity
          style={styles.notification}
          onPress={() => router.push("/(tabs)/(stack)/notifications")}
        >
          <Ionicons name="notifications" size={22} color="#fff" />

          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Location */}
      <Text style={styles.location}>{locationText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#056a20", // Grambazer green
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 11,
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
    height: 44,
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
    color: "#ffffff",
    marginTop: 8,
    fontSize: 14,
  },
});
