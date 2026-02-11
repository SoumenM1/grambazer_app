import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { API } from "../../../lib/api";
import { getUserLocation } from "../../../lib/location";
import { router } from "expo-router";
import { uploadToCloudinary, compressImage } from "../../../utils/mediaUpload";

const placeholderBanner =
  "https://via.placeholder.com/600x300.png?text=Business+Banner";
const placeholderLogo = "https://via.placeholder.com/150.png?text=Logo";

export default function CreateBusiness() {
const [banner, setBanner] = useState<{ url: string; publicId: string } | null>(null);
const [logo, setLogo] = useState<{ url: string; publicId: string } | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState("");
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [showList, setShowList] = useState(false);  
 
  const getLocation = async () => {
    const blocation = await getUserLocation();

    if (!blocation) return;
    setLocation(blocation);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/categories/all");
      setCategories(data.categories);
    } catch (e) {
      console.log("Category load failed");
    }
  };
const pickImage = async (
  type: "banner" | "logo"
) => {
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });

  if (res.canceled) return;

  try {
    setLoading(true);

    const asset = res.assets[0];

    // 🔥 upload FIRST
    const uploaded = await uploadToCloudinary(asset.uri, "image");

    if (!uploaded?.imageUrl || !uploaded?.publicId) {
      throw new Error("Upload failed");
    }

    const imageData = {
      url: uploaded.imageUrl,
      publicId: uploaded.publicId,
    };

    if (type === "banner") setBanner(imageData);
    else setLogo(imageData);

  } catch (err) {
    console.log(err);
    alert("Image upload failed");
  } finally {
    setLoading(false);
  }
};


  const addCategory = (cat: any) => {
    if (selectedCategories.length >= 5)
      return alert("Maximum 5 categories allowed");
    if (selectedCategories.find((c) => c._id === cat._id)) return;
    setSelectedCategories([...selectedCategories, cat]);
    setSearch("");
    setShowList(false);
  };

  const removeCategory = (id: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c._id !== id));
  };

const createBusiness = async () => {
  if (!name || !location) {
    return alert("Business name & location required");
  }

  try {
    setLoading(true);

    const payload = {
      name,
      description,
      services: services.split(",").map(s => s.trim()),
      banner: banner?.url,
      bannerId: banner?.publicId,
      logo: logo?.url,
      logoId: logo?.publicId,
      categories: selectedCategories.map(c => c._id),
      location,
    };

    const res = await API.post("/business/create", payload);
    router.replace(`/business/kyc`);
   
  } catch (err) {
    alert("Business creation failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
      

        {/* BANNER */}
        <TouchableOpacity
          style={styles.bannerWrapper}
          onPress={() => pickImage("banner")}
        >
          <Image
            source={{ uri: banner?.url || placeholderBanner }}
            style={styles.banner}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>➕ Add Banner</Text>
          </View>
        </TouchableOpacity>

        {/* LOGO */}
        <View style={styles.logoWrapper}>
          <TouchableOpacity
            style={styles.logoBox}
            onPress={() => pickImage("logo")}
          >
            <Image
              source={{ uri: logo?.url || placeholderLogo }}
              style={styles.logo}
            />
            <View style={styles.addIcon}>
              <Text style={{ color: "#fff", fontSize: 18 }}>＋</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryBox}>
          <Text>Business Categories *</Text>
          {/* Selected Chips */}
          <View style={styles.chipsWrap}>
            {selectedCategories.map((cat) => (
              <View key={cat._id} style={styles.chip}>
                <Text style={styles.chipText}>{cat.name}</Text>
                <TouchableOpacity onPress={() => removeCategory(cat._id)}>
                  <Text style={styles.remove}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Input */}
          <TextInput
            placeholder="Type to search category"
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              setShowList(true);
            }}
            style={styles.categoryInput}
          />

          {/* Dropdown */}
          {showList && search.length > 0 && (
            <View style={styles.dropdown}>
              {categories
                .filter(
                  (c) =>
                    c.name.toLowerCase().includes(search.toLowerCase()) &&
                    !selectedCategories.some((s) => s._id === c._id),
                )
                .slice(0, 3)
                .map((cat) => (
                  <TouchableOpacity
                    key={cat._id}
                    style={styles.option}
                    onPress={() => addCategory(cat)}
                  >
                    <Text>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>
        <Text style={styles.helper}>Select up to 3 categories</Text>

        {/* FORM */}
        <View style={styles.form}>
          <Input label="Business Name *" value={name} onChange={setName} />

          <Input
            label="Description *"
            value={description}
            onChange={setDescription}
            multiline
          />

          <Input
            label="Services (comma separated)"
            value={services}
            onChange={setServices}
          />
          
          {/* LOCATION */}


            <View style={styles.locationInfo}>
          <Text style={styles.locationTitle}>📌 Important Location Notice</Text>
          <Text style={styles.locationText}>
            Please make sure your business location is set to the{" "}
            <Text style={{ fontWeight: "700" }}>exact place</Text> where your
            shop or service is available.
          </Text>

          <Text style={styles.locationText}>
            If the location is incorrect, customers may{" "}
            <Text style={{ fontWeight: "700" }}>not find your business</Text> in
            nearby searches.
          </Text>

          <Text style={styles.locationHint}>
            👉 Tip: Stand at your shop and tap{" "}
            <Text style={{ fontWeight: "700" }}>"Use Current Location"</Text>
          </Text>
        </View>
          <TouchableOpacity style={styles.locationBtn} onPress={getLocation}>
            <Text style={styles.locationText}>
              📍 {location ? "Location Added" : "Click Exact Shop Location"}
            </Text>
          </TouchableOpacity>

          {/* SUBMIT */}
          <TouchableOpacity style={styles.submitBtn} onPress={createBusiness}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Create Business</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* 🔹 Input Component */
const Input = ({ label, value, onChange, multiline }: any) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      multiline={multiline}
      style={[
        styles.input,
        multiline && { height: 100, textAlignVertical: "top" },
      ]}
      placeholder={label}
    />
  </View>
);

const styles = StyleSheet.create({
  locationInfo: {
    backgroundColor: "#ECFDF5",
    borderColor: "#16A34A",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },

  locationTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#14532D",
    marginBottom: 4,
  },

  locationText: {
    fontSize: 13,
    color: "#065F46",
    marginBottom: 4,
  },

  locationHint: {
    fontSize: 12,
    color: "#047857",
    marginTop: 6,
  },

  categoryBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#16A34A",
  },

  chipText: {
    color: "#065F46",
    fontWeight: "600",
    marginRight: 6,
  },

  remove: {
    color: "#DC2626",
    fontWeight: "700",
  },

  categoryInput: {
    paddingVertical: 8,
    fontSize: 14,
  },

  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    maxHeight: 180,
  },

  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  helper: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
    marginLeft: 9,
  },

  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    marginTop:30
  },

  bannerWrapper: {
    height: 220,
  },
  banner: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bannerText: {
    color: "#fff",
    fontSize: 12,
  },

  logoWrapper: {
    alignItems: "center",
    marginTop: -50,
  },
  logoBox: {
    position: "relative",
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },
  addIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#16A34A",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  form: {
    padding: 16,
    marginTop: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  locationBtn: {
    backgroundColor: "#ECFDF5",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#16A34A",
    marginBottom: 20,
  },
  // locationText: {
  //   color: "#065F46",
  //   fontWeight: "600",
  //   textAlign: "center",
  // },

  submitBtn: {
    backgroundColor: "#16A34A",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
