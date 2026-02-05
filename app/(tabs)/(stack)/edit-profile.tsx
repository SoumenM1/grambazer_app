import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { API } from "../../../lib/api";
import DateTimePicker from "@react-native-community/datetimepicker";

const COLORS = {
  green: "#16A34A",
  red: "#DC2626",
  grey: "#6B7280",
  lightGrey: "#F3F4F6",
  white: "#FFFFFF",
  mitti: "#C2A27C",
};

export default function EditProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState(""); // yyyy-mm-dd
  const [gender, setGender] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobDate, setDobDate] = useState<Date | null>(null);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await API.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = res.data.user;
      setName(user.name || "");
      setBio(user.bio || "");
      setGender(user.gender || "");
      if (user.dob) {
        const d = new Date(user.dob);
        setDobDate(d);
        setDob(d.toISOString().slice(0, 10)); // yyyy-mm-dd for display
      }
      setAvatar(user.imageUrl || null);
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("dob", dob);
      formData.append("gender", gender);

      if (avatar) {
        const fileName = avatar.split("/").pop();
        const fileType = fileName?.split(".").pop();
        formData.append("image", {
          uri: avatar,
          name: fileName,
          type: `image/${fileType}`,
        } as any);
      }
      await API.put("/auth/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Profile updated successfully");
      router.back()
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("Permission required to access gallery");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setAvatar(uri);
      }
    } catch (error) {
      console.error("Image pick failed", error);
    }
  };

  if (loading) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Avatar with Edit Icon */}
      <View style={{ alignItems: "center", marginBottom: 30, marginTop: 30 }}>
        <View style={{ position: "relative" }}>
          <Image
            source={{
              uri: avatar || "https://picsum.photos/200/200?random=16",
            }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 2,
              borderColor: "#E5E7EB",
            }}
          />

          {/* Edit Icon */}
          <Pressable
            onPress={pickImage}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#16A34A",
              width: 36,
              height: 36,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: "#FFFFFF",
            }}
          >
            <Ionicons name="camera" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      {/* Header */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "800",
          color: COLORS.green,
          marginBottom: 20,
        }}
      >
        Edit Profile
      </Text>

      {/* Name */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        style={styles.input}
      />

      {/* Bio */}
      <Text style={styles.label}>Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="Write something about you"
        multiline
        numberOfLines={3}
        style={[styles.input, { height: 90, textAlignVertical: "top" }]}
      />

      {/* DOB */}
      <Text style={styles.label}>Date of Birth</Text>

      <Pressable onPress={() => setShowDatePicker(true)}>
        <View pointerEvents="none">
          <TextInput
            value={dob}
            placeholder="Select your date of birth"
            style={styles.input}
            editable={false} // 👈 user cannot type
          />
        </View>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={dobDate || new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()} // 👈 no future date
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);

            if (selectedDate) {
              setDobDate(selectedDate);

              const year = selectedDate.getFullYear();
              const month = String(selectedDate.getMonth() + 1).padStart(
                2,
                "0",
              );
              const day = String(selectedDate.getDate()).padStart(2, "0");

              const formatted = `${year}-${month}-${day}`;
              setDob(formatted);
            }
          }}
        />
      )}

      {/* Gender */}
      <Text style={styles.label}>Gender</Text>
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        {["male", "female", "other"].map((g) => (
          <Pressable
            key={g}
            onPress={() => setGender(g)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: gender === g ? COLORS.green : COLORS.lightGrey,
              backgroundColor: gender === g ? "#DCFCE7" : COLORS.white,
              marginRight: 10,
            }}
          >
            <Text
              style={{
                color: gender === g ? COLORS.green : COLORS.grey,
                fontWeight: "600",
                textTransform: "capitalize",
              }}
            >
              {g}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Save Button */}
      <Pressable
        onPress={handleSave}
        disabled={saving}
        style={{
          marginTop: 100,
          backgroundColor: "#04541f",
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: "700" }}>
          {saving ? "Saving..." : "Save Changes"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    color: "#374151",
    marginTop: 14,
    marginBottom: 6,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#FAFAFA",
  },
});
