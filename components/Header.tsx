import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getUserLocation } from "../lib/location";
import { useEffect, useState } from "react";
import { useNotification } from "../context/NotificationContext";
import { router } from "expo-router";

const USERS = [
  {
    id: "u1",
    name: "Soumen Maity",
    avatar: "https://picsum.photos/100",
    type: "user",
  },
  {
    id: "u2",
    name: "Ravi Sharma",
    avatar: "https://picsum.photos/101",
    type: "user",
  },
];

const BUSINESSES = [
  {
    id: "b1",
    name: "Green Plumbing",
    logo: "https://picsum.photos/102",
    type: "business",
  },
  {
    id: "b2",
    name: "Mitti Electronics",
    logo: "https://picsum.photos/103",
    type: "business",
  },
];

const SERVICES = [
  { id: "s1", name: "Electrician", icon: "⚡", type: "service" },
  { id: "s2", name: "Home Tutor", icon: "📚", type: "service" },
];

export default function Header() {
  const [locationText, setLocationText] = useState("Fetching location...");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const { unreadCount } = useNotification();

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    const location = await getUserLocation();
    if (!location) return;
    setLocationText(`📍 ${location.text}`);
  };

  /* 🔍 SEARCH LOGIC */
  const handleSearch = (text: string) => {
    setQuery(text);

    if (!text.trim()) {
      setResults([]);
      return;
    }

    const q = text.toLowerCase();

    const userResults = USERS.filter((u) => u.name.toLowerCase().includes(q));

    const businessResults = BUSINESSES.filter((b) =>
      b.name.toLowerCase().includes(q),
    );

    const serviceResults = SERVICES.filter((s) =>
      s.name.toLowerCase().includes(q),
    );

    setResults([...userResults, ...businessResults, ...serviceResults]);
  };

  /* 🔁 REDIRECT LOGIC */
  const openResult = (item: any) => {
    if (item.type === "user") {
      router.push(`/(stack)/UserProfile`);
    } else if (item.type === "business") {
      router.push(`/(stack)/business`);
    } else {
      router.push(`/(stack)/business`);
    }

    setQuery("");
    setResults([]);
  };

  return (
    <View style={styles.container}>
      {/* Search Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={22} color="#0d9221" />
          <TextInput
            placeholder="Search Teacher, Shop, Plumber..."
            style={styles.input}
            value={query}
            onChangeText={handleSearch}
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

      {/* 📍 Location */}
      <Text style={styles.location}>{locationText}</Text>

      {/* 🔍 SEARCH RESULTS */}
      {results.length > 0 && (
        <>
          {/* Overlay (tap outside to close) */}
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setResults([])}
          />

          {/* Floating results */}
          <View style={styles.floatingResults}>
            {results.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.resultItem}
                onPress={() => openResult(item)}
              >
                {item.avatar || item.logo ? (
                  <Image
                    source={{ uri: item.avatar || item.logo }}
                    style={styles.resultImage}
                  />
                ) : (
                  <Text style={styles.icon}>{item.icon}</Text>
                )}

                <View>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultType}>{item.type}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
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
  results: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginTop: 8,
    elevation: 4,
  },

  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  resultImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },

  icon: {
    fontSize: 22,
    marginRight: 10,
  },

  resultName: {
    fontSize: 14,
    fontWeight: "600",
  },

  resultType: {
    fontSize: 11,
    color: "#16A34A",
    textTransform: "capitalize",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 5,
  },

  floatingResults: {
    position: "absolute",
    top: 96, // 👈 adjust based on header height
    left: 12,
    right: 12,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    elevation: 10, // Android
    zIndex: 20, // iOS
    maxHeight: 320,
    overflow: "hidden",
  },
});
