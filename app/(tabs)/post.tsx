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
import { VideoView, useVideoPlayer } from "expo-video";
import { pickMedia } from "../../utils/pickMedia";
import { API } from "../../lib/api";
import { uploadMedia } from "../../utils/mediaUpload";
import { useAuth } from "../../context/AuthContext";

type MediaType = "photo" | "video" | "live" | null;

export default function PostScreen() {
  const [selected, setSelected] = useState<MediaType>(null);
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

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
  const handlePick = async () => {
    const picked = await pickMedia();
    if (!picked) return;

    setFile(picked);

    if (picked.type === "video") {
      setSelected("video");
    } else {
      setSelected("photo");
    }
  };

  /* ---------------- Upload ---------------- */
 const handleUpload = async () => {
  try {
    if (!selected || !file) return;

    setLoading(true);
    setProgress(0);

    // 1️⃣ Upload to Cloudinary
    const uploaded = await uploadMedia(file, user._id, (p) => {
      setProgress(p);
    });

    // 2️⃣ Save metadata
    await API.post("/media/create", {
      title,
      description,
      mediaType: uploaded.mediaType,
      mediaUrl: uploaded.url,
      mediaPublicId: uploaded.publicId,
      thumbnailUrl: uploaded.thumbnail ?? null,
    });

    // 3️⃣ Finish
    setProgress(100);
    alert(uploaded.mediaType === "video" ? "Video uploaded 🎥" : "Post uploaded 🚀");

    // 4️⃣ Reset UI
    setSelected(null);
    setFile(null);
    setTitle("");
    setDescription("");
  } catch (err) {
    console.log("Upload error:", err );
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
          onPress={() => handlePick()}
        />
        <ActionButton
          icon="videocam"
          label="Video"
          active={selected === "video"}
          onPress={() => handlePick()}
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
            onPress={() => selected !== "live" && handlePick()}
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
            onPress={() => handlePick()}
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
