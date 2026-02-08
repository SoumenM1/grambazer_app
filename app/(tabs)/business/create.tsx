import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "../../../lib/api";

export default function CreateBusiness() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [kyc, setKyc] = useState({
    identityType: "",
    identityNumber: "",
    identityFront: null as string | null,
    identityBack: null as string | null,

    addressType: "",
    addressNumber: "",
    addressImage: null as string | null,
  });

  /* 📸 Pick Logo */
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!res.canceled) {
      setLogo(res.assets[0].uri);
    }
  };

  const pickDoc = async (key: string) => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!res.canceled) {
      setKyc((prev) => ({ ...prev, [key]: res.assets[0].uri }));
    }
  };
  const DocUpload = ({ label, uri, onPress }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.docBox}>
      {uri ? (
        <Image source={{ uri }} style={styles.docImage} />
      ) : (
        <Text style={styles.docText}>{label}</Text>
      )}
    </TouchableOpacity>
  );

  /* 🚀 Submit */
  const createBusiness = async () => {
    if (!name || !description) return alert("Fill all fields");

    setLoading(true);
    const token = await AsyncStorage.getItem("token");

    try {
      await API.post(
        "/business/create",
        {
          name,
          description,
          services: services.split(",").map((s) => s.trim()),
          logo,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      router.replace("/(tabs)/business/view");
    } catch (err) {
      alert("Business creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Your Business</Text>

      {/* LOGO */}
      <TouchableOpacity onPress={pickImage} style={styles.logoBox}>
        <Image
          source={{
            uri: logo || "https://via.placeholder.com/120",
          }}
          style={styles.logo}
        />
        <Text style={styles.uploadText}>Upload Logo</Text>
      </TouchableOpacity>

      {/* NAME */}
      <Input label="Business Name" value={name} onChange={setName} />

      {/* DESCRIPTION */}
      <Input
        label="Description"
        value={description}
        onChange={setDescription}
        multiline
      />

      {/* SERVICES */}
      <Input
        label="Services (comma separated)"
        value={services}
        onChange={setServices}
      />
      <View style={styles.kycBox}>
        <Text style={styles.kycTitle}>KYC Verification</Text>

        <Text style={styles.kycNote}>
          🔒 Your business will be visible only after KYC verification
        </Text>

        {/* Identity Proof */}
        <Text style={styles.sectionLabel}>Identity Proof</Text>

        <Input
          label="Document Type (aadhaar / pan / passport)"
          value={kyc.identityType}
          onChange={(v:any) => setKyc({ ...kyc, identityType: v })}
        />

        <Input
          label="Document Number"
          value={kyc.identityNumber}
          onChange={(v:any) => setKyc({ ...kyc, identityNumber: v })}
        />

        <DocUpload
          label="Upload Front Image"
          uri={kyc.identityFront}
          onPress={() => pickDoc("identityFront")}
        />

        <DocUpload
          label="Upload Back Image"
          uri={kyc.identityBack}
          onPress={() => pickDoc("identityBack")}
        />

        {/* Address Proof */}
        <Text style={styles.sectionLabel}>Address Proof</Text>

        <Input
          label="Address Proof Type (electricity bill / bank)"
          value={kyc.addressType}
          onChange={(v:any) => setKyc({ ...kyc, addressType: v })}
        />

        <Input
          label="Document Number"
          value={kyc.addressNumber}
          onChange={(v:any) => setKyc({ ...kyc, addressNumber: v })}
        />

        <DocUpload
          label="Upload Address Proof"
          uri={kyc.addressImage}
          onPress={() => pickDoc("addressImage")}
        />
      </View>

      {/* SUBMIT */}
      <TouchableOpacity style={styles.button} onPress={createBusiness}>
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create Business"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* 🔹 Reusable Input */
const Input = ({ label, value, onChange, multiline }: any) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      multiline={multiline}
      style={[styles.input, multiline && { height: 90 }]}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0FDF4", padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#14532D",
    marginBottom: 20,
  },
  logoBox: { alignItems: "center", marginBottom: 20 },
  logo: { width: 120, height: 120, borderRadius: 60 },
  uploadText: { color: "#16A34A", marginTop: 8 },
  label: { fontSize: 13, color: "#374151", marginBottom: 4 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  button: {
    backgroundColor: "#16A34A",
    padding: 14,
    borderRadius: 14,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  kycBox: {
    backgroundColor: "#F0FDF4",
    borderRadius: 16,
    padding: 14,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  kycTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#14532D",
    marginBottom: 6,
  },
  kycNote: {
    fontSize: 12,
    color: "#065F46",
    marginBottom: 14,
  },
  sectionLabel: {
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
    color: "#14532D",
  },
  docBox: {
    height: 110,
    borderWidth: 1,
    borderColor: "#16A34A",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#ECFDF5",
  },
  docText: {
    color: "#14532D",
    fontWeight: "600",
  },
  docImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
});
