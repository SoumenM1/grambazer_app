import { View, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import { API } from "../../../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BusinessIndex() {
  useEffect(() => {
    checkBusiness();
  }, []);

  const checkBusiness = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const res = await API.get("/business/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.business) {
        router.replace("/(tabs)/business/view");
      } else {
        router.replace("/(tabs)/business/create");
      }
    } catch {
      router.replace("/(tabs)/business/create");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator color="#16A34A" />
    </View>
  );
}
