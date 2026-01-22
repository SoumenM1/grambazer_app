import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Header() {
  const [locationText, setLocationText] = useState("Fetching location...");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      // 1️⃣ Ask permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required");
        return;
      }

      // 2️⃣ Get GPS location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const lat = location.coords.latitude;
      const lng = location.coords.longitude;

      setCoords({ lat, lng });

      // 3️⃣ Convert to readable place (optional)
      const geo = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });

      if (geo.length > 0) {
        setLocationText(
          ` ${geo[0].subregion}, ${geo[0].city}, ${geo[0].region}`
        );
      }

      // 4️⃣ Send location to backend
      // sendLocationToAPI(lat, lng);
    } catch (error) {
      console.log("Location error:", error);
    }
  };

  // const sendLocationToAPI = async (lat: number, lng: number) => {
  //   try {
  //     await axios.post("http://YOUR_SERVER/api/location/update", {
  //       latitude: lat,
  //       longitude: lng,
  //     });

  //     console.log("Location sent:", lat, lng);
  //   } catch (err) {
  //     console.log("API error:", err);
  //   }
  // };

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
        <TouchableOpacity style={styles.notification}>
          <Ionicons name="notifications" size={22} color="#ffffff" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Location */}
      <Text style={styles.location}>📍{locationText}</Text>
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
