import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VideoView, useVideoPlayer } from "expo-video";
import { pickMedia } from "../../utils/pickMedia";
import { API } from "../../lib/api";


type MediaType = "photo" | "video" | "live" | null;

export default function PostScreen() {
  const [selected, setSelected] = useState<MediaType>(null);
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);

  /* ---------------- Video Player ---------------- */
  const videoPlayer = useVideoPlayer(file?.uri ?? null, (player) => {
    player.loop = true;
  });

  useEffect(() => {
    if (selected === "video" && file) {
      videoPlayer?.play();
    } else {
      videoPlayer?.pause();
    }
  }, [selected, file]);

  /* ---------------- Pick ---------------- */
  const handlePick = async (type: "photo" | "video") => {
    const picked = await pickMedia(type);
    if (picked) {
      setSelected(type);
      setFile(picked);
    }
  };

  /* ---------------- Upload ---------------- */
  const handleUpload = async () => {
    if (!file || !selected || selected === "live") {
      const res = await API.post("/live/start");
      // navigation.navigate("LiveBroadcast", res.data);
    }
    try {
      setLoading(true);
      setProgress(0);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("Login required");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", {
        uri: file.uri,
        name:
          selected === "video"
            ? `video_${Date.now()}.mp4`
            : `image_${Date.now()}.jpg`,
        type: selected === "video" ? "video/mp4" : "image/jpeg",
      } as any);

      const endpoint = selected === "video" ? `/media/video` : `/media/image`;

      await API.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 0,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,

        onUploadProgress: (progressEvent) => {
          if (!file?.size) return;

          const percent = Math.round((progressEvent.loaded * 100) / file.size);

          setProgress(Math.min(percent, 100));
        },
      });

      alert(
        selected === "video"
          ? "Video uploaded 🎥 uplodaing..."
          : "Post uploaded 🚀",
      );
      setSelected(null);
      setFile(null);
      setProgress(0);
      setTitle("");
      setDescription("");
      setLoading(false);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <View
      style={{
        flex: 1,
        padding: 15,
        backgroundColor: "#eaeeea",
        marginTop: 10,
      }}
    >
      {/* Media Switch */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 14,
        }}
      >
        <ActionButton
          icon="image"
          label="Photo"
          active={selected === "photo"}
          onPress={() => handlePick("photo")}
        />
        <ActionButton
          icon="videocam"
          label="Video"
          active={selected === "video"}
          onPress={() => handlePick("video")}
        />
        <ActionButton
          icon="radio"
          label="Live"
          active={selected === "live"}
          onPress={() => {
            setSelected("live");
            setFile(null);
          }}
        />
      </View>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{
          marginTop: 8,
          marginBottom: 10,
          padding: 12,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#bdbeb7",
          backgroundColor: "#ffffff",
          fontWeight: "600",
        }}
      />

      {/* Preview Container */}
      <View
        style={{
          flex: 1,
          borderRadius: 16,
          borderWidth: 1,
          backgroundColor: "#fff",
          borderColor: "#e5e6e0",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* DEFAULT / LIVE */}
        {!file && (
          <TouchableOpacity
            onPress={() => selected !== "live" && handlePick("photo")}
            style={{ alignItems: "center" }}
          >
            <Ionicons
              name="add-circle"
              size={64}
              color={selected === "live" ? "#EF4444" : "#16A34A"}
            />
            <Text style={{ marginTop: 10, color: "#6B7280" }}>
              {selected === "live" ? "Go Live" : "Upload Photo / Video"}
            </Text>
          </TouchableOpacity>
        )}

        {/* PHOTO PREVIEW */}
        {selected === "photo" && file && (
          <Image
            source={{ uri: file.uri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        )}

        {/* VIDEO PREVIEW (expo-video) */}
        {selected === "video" && file && (
          <VideoView
            player={videoPlayer}
            style={{ width: "100%", height: "100%" }}
            // allowsFullscreen
            allowsPictureInPicture
          />
        )}

        {/* {selected === "live" && (
         
        )} */}

        {/* CHANGE BUTTON */}
        {file && (
          <TouchableOpacity
            onPress={() => handlePick(selected as "photo" | "video")}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: "rgba(0,0,0,0.6)",
              padding: 8,
              borderRadius: 20,
            }}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* PROGRESS BAR */}
      {loading && (
        <>
          <View
            style={{
              height: 6,
              backgroundColor: "#E5E7EB",
              borderRadius: 4,
              marginTop: 10,
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${progress}%`,
                backgroundColor: "#16A34A",
                borderRadius: 4,
              }}
            />
          </View>

          <Text style={{ marginTop: 4, fontSize: 12, color: "#374151" }}>
            Uploading… {progress}%
          </Text>
        </>
      )}

      {/* description */}
      <TextInput
        placeholder="Write a description..."
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          marginTop: 10,
          padding: 12,
          height: 70,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#bdbeb7",
          backgroundColor: "#ffffff",
          textAlignVertical: "top",
        }}
      />

      {/* UPLOAD BUTTON */}
      {file && selected !== "live" && (
        <TouchableOpacity
          onPress={handleUpload}
          disabled={loading}
          style={{
            marginTop: 14,
            padding: 14,
            borderRadius: 14,
            backgroundColor: "#07712e",
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "700" }}>Upload</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ---------------- Button ---------------- */
function ActionButton({ icon, label, active, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: "32%",
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: active ? "#078234" : "#fff",
        borderWidth: 1,
        borderColor: active ? "#078033" : "#E5E7EB",
        alignItems: "center",
      }}
    >
      <Ionicons name={icon} size={20} color={active ? "#fff" : "#07732f"} />
      <Text
        style={{
          marginTop: 6,
          fontSize: 13,
          fontWeight: "600",
          color: active ? "#fff" : "#374151",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
