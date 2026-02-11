import * as Location from "expo-location";
import { useEffect, useRef } from "react";
import { API } from "../lib/api";

export type UserLocation = {
  lat: number;
  lng: number;
  text: string;
};

export async function getUserLocation(): Promise<UserLocation | null> {
  try {
    // Permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return null;
    }

    // GPS
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const lat = location.coords.latitude;
    const lng = location.coords.longitude;

    // Reverse geocode
    const geo = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });

    const text =
      geo.length > 0
        ? `${geo[0].city || ""}, ${geo[0].subregion || ""}, ${
            geo[0].region || ""
          }`
        : "Unknown location";

    return { lat, lng, text };
  } catch (error) {
    console.log("Location error:", error);
    return null;
  }
}

export function useLiveLocation() {
  const lastSent = useRef<{ lat: number; lng: number } | null>(null);
  useEffect(() => {
    let subscription: Location.LocationSubscription;

    async function start() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 500, // meters
        },
        async (loc) => {
          const lat = loc.coords.latitude;
          const lng = loc.coords.longitude;

          // 🚫 avoid duplicate calls
          if (
            lastSent.current &&
            Math.abs(lastSent.current.lat - lat) < 0.0005 &&
            Math.abs(lastSent.current.lng - lng) < 0.0005
          ) {
            return;
          }

          lastSent.current = { lat, lng };

          await API.post("/update-location", { latitude: lat, longitude: lng });
        },
      );
    }

    start();

    return () => {
      subscription?.remove();
    };
  }, []);
}
