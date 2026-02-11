import * as ImagePicker from "expo-image-picker";

export const pickMedia = async () => {
  // Ask permission (important for Android)
  const permission =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    alert("Permission required to access gallery");
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: false,
    quality: 1,
    videoMaxDuration: 120, // seconds
  });

  if (result.canceled) return null;

  return result.assets[0]; // 👈 THIS is the asset
};
