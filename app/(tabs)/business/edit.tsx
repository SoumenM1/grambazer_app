import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";
import { API } from "../../../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function EditBusiness() {
  const [business, setBusiness] = useState<any>(null);

  useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await API.get("/business/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBusiness(res.data.business);
  };

  const saveChanges = async () => {
    const token = await AsyncStorage.getItem("token");

    await API.put(
      "/business/update",
      business,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    router.back();
  };

  if (!business) return null;

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>
        Edit Business Profile
      </Text>

      {/* Same Inputs as Create */}
      {/* Update business.name, description, services */}

      <TouchableOpacity
        onPress={saveChanges}
        style={{
          backgroundColor: "#16A34A",
          padding: 14,
          borderRadius: 14,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
