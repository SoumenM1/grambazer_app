import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { API } from "../../../lib/api";

const IDENTITY_TYPES = [
  { label: "Aadhaar Card", value: "aadhaar" },
  { label: "PAN Card", value: "pan" },
  { label: "Passport", value: "passport" },
  { label: "Voter ID", value: "voter_id" },
];

const ADDRESS_TYPES = [
  { label: "Aadhaar Card", value: "aadhaar" },
  { label: "Electricity Bill", value: "electricity_bill" },
  { label: "Bank Statement", value: "bank_statement" },
  { label: "Rent Agreement", value: "rent_agreement" },
];

export default function KycVerification() {
  const [status, setStatus] = useState<
    "not_submitted" | "pending" | "verified" | "rejected"
  >("not_submitted");

  const [identityType, setIdentityType] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [identityFront, setIdentityFront] = useState<string | null>(null);
  const [identityBack, setIdentityBack] = useState<string | null>(null);
  const [addressType, setAddressType] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [addressImage, setAddressImage] = useState<string | null>(null);

  const pickImage = async (setter: any) => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!res.canceled) setter(res.assets[0].uri);
  };

  function StatusBanner({ status }: { status: string }) {
    const config: any = {
      not_submitted: {
        bg: "#FEFCE8",
        text: "📝 Please submit KYC to activate your business",
      },
      pending: {
        bg: "#EFF6FF",
        text: "⏳ KYC submitted. Verification in progress",
      },
      verified: {
        bg: "#ECFDF5",
        text: "✅ KYC verified. Your business is live",
      },
      rejected: {
        bg: "#FEF2F2",
        text: "❌ KYC rejected. Please re-upload documents",
      },
    };

    return (
      <View style={[styles.statusBox, { backgroundColor: config[status].bg }]}>
        <Text style={styles.statusText}>{config[status].text}</Text>
      </View>
    );
  }

  function DocUpload({ label, uri, onPress }: any) {
    return (
      <TouchableOpacity style={styles.docBox} onPress={onPress}>
        {uri ? (
          <Image source={{ uri }} style={styles.docImage} />
        ) : (
          <Text style={styles.docText}>{label}</Text>
        )}
      </TouchableOpacity>
    );
  }

  function Dropdown({ label, value, onChange, options }: any) {
    return (
      <View style={{ marginBottom: 14 }}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.dropdown}>
          <Picker selectedValue={value} onValueChange={onChange}>
            <Picker.Item label="Select option" value="" />
            {options.map((o: any) => (
              <Picker.Item key={o.value} label={o.label} value={o.value} />
            ))}
          </Picker>
        </View>
      </View>
    );
  }

  function Input({ label, value, onChange }: any) {
    return (
      <View style={{ marginBottom: 14 }}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputBox}>
          <Text style={{ padding: 12 }} onPress={() => {}}>
            {value || "Enter here"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* STATUS BANNER */}
      <StatusBanner status={status} />

      {/* IDENTITY SECTION */}
      <Text style={styles.sectionTitle}>Identity Proof</Text>

      <Dropdown
        label="Select Document Type"
        value={identityType}
        onChange={setIdentityType}
        options={IDENTITY_TYPES}
      />

      <Input
        label="Document Number"
        value={identityNumber}
        onChange={setIdentityNumber}
      />

      <DocUpload
        label="Upload Front Image"
        uri={identityFront}
        onPress={() => pickImage(setIdentityFront)}
      />

      <DocUpload
        label="Upload Back Image"
        uri={identityBack}
        onPress={() => pickImage(setIdentityBack)}
      />

      {/* ADDRESS SECTION */}
      <Text style={styles.sectionTitle}>Address Proof</Text>

      <Dropdown
        label="Select Address Proof"
        value={addressType}
        onChange={setAddressType}
        options={ADDRESS_TYPES}
      />

      <Input
        label="Document Number"
        value={addressNumber}
        onChange={setAddressNumber}
      />

      <DocUpload
        label="Upload Address Proof"
        uri={addressImage}
        onPress={() => pickImage(setAddressImage)}
      />

      {/* SUBMIT */}
      {status === "not_submitted" && (
        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitText}>Submit KYC</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FDF4",
    padding: 16,
    marginTop: 25,
  },

  statusBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusText: {
    fontWeight: "600",
    color: "#14532D",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#14532D",
    marginVertical: 10,
  },

  label: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 4,
  },

  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },

  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  docBox: {
    height: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
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

  submitBtn: {
    backgroundColor: "#16A34A",
    padding: 14,
    borderRadius: 14,
    marginTop: 10,
    marginBottom:25
  },

  submitText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
});
