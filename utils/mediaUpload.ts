import axios from "axios";
import * as ImageManipulator from "expo-image-manipulator";

const CLOUD_NAME = "dvfs7vdry";
const IMAGE_PRESET = "image_upload";
const VIDEO_PRESET = "video_upload";

type UploadProgressFn = (percent: number) => void;

export const uploadMedia = async (
  asset: any,
  userId: string,
  onProgress?: UploadProgressFn,
) => {
  const isVideo = asset.type === "video";

  const folder = isVideo
    ? `grambazer/videos/users/${userId}`
    : `grambazer/images/users/${userId}`;

  const formData = new FormData();

  formData.append("file", {
    uri: asset.uri,
    name: asset.fileName || (isVideo ? "video.mp4" : "image.jpg"),
    type: isVideo ? "video/mp4" : asset.mimeType || "image/jpeg",
  } as any);

  formData.append("upload_preset", isVideo ? VIDEO_PRESET : IMAGE_PRESET);
  formData.append("folder", folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${
    isVideo ? "video" : "image"
  }/upload`;

  const res = await axios.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 0,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,

    onUploadProgress: (e) => {
      if (!e.total) return;

      const percent = Math.round((e.loaded * 100) / e.total);
      onProgress?.(Math.min(percent, 95));
    },
  });

  const data = res.data;

  // 🎥 VIDEO (HLS)
  if (isVideo) {
    return {
      mediaType: "video",
      publicId: data.public_id,
      url: `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/sp_auto/${data.public_id}.m3u8`,
      thumbnail: `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_1/${data.public_id}.jpg`,
    };
  }

  // 🖼 IMAGE
  return {
    mediaType: "image",
    publicId: data.public_id,
    url: data.secure_url,
  };
};

/* 🔹 Compress Image */
export const compressImage = async (uri: string) => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1200 } }],
    {
      compress: 0.7,
      format: ImageManipulator.SaveFormat.JPEG,
    },
  );

  return result.uri;
};

/* 🔹 Upload Image / Video */
export const uploadToCloudinary = async (
  uri: string,
  type: "image" | "video",
) => {
  const formData = new FormData();

  formData.append("file", {
    uri,
    name: `${Date.now()}.${type === "image" ? "jpg" : "mp4"}`,
    type: type === "image" ? "image/jpeg" : "video/mp4",
  } as any);

  formData.append("upload_preset", IMAGE_PRESET);
  formData.append("resource_type", "auto");
  formData.append("folder", "grambazer/business");

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`;

  const res = await axios.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 0,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });

  const data = res.data;

  if (!data.secure_url) {
    throw new Error("Cloudinary upload failed");
  }

  return {
    imageUrl: data.secure_url,
    publicId: data.public_id,
  };
};
