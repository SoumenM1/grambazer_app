import * as Location from "expo-location";

export async function getUserLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") return null;

  const location = await Location.getCurrentPositionAsync({});
  return location.coords;
}
