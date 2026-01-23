import * as Location from "expo-location";

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
        ? `${geo[0].subregion || ""}, ${geo[0].city || ""}, ${
            geo[0].region || ""
          }`
        : "Unknown location";

    return { lat, lng, text };
  } catch (error) {
    console.log("Location error:", error);
    return null;
  }
}
