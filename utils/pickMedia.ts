import * as ImagePicker from "expo-image-picker";

export type PickedMedia = {
  uri: string;
  type: "photo" | "video";
  size: number;
  width?: number;
  height?: number;
  duration?: number;
};

export const pickMedia = async (
  type: "photo" | "video"
): Promise<PickedMedia | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes:
      type === "photo"
        ? ImagePicker.MediaTypeOptions.Images
        : ImagePicker.MediaTypeOptions.Videos,
    quality: 1,
    videoMaxDuration: 300, // optional (5 min)
  });

  if (result.canceled || !result.assets?.length) {
    return null;
  }

  const asset = result.assets[0];

  return {
    uri: asset.uri,
    type,
    size: asset.fileSize ?? 0, // 👈 REQUIRED for progress
    width: asset.width,
    height: asset.height,
    duration: asset.duration ?? 0, // video only
  };
};
