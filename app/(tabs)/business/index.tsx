import { View, ActivityIndicator } from "react-native";
import { useCallback } from "react";
import { router } from "expo-router";
import { API } from "../../../lib/api";
import { useFocusEffect } from "@react-navigation/native";
import { useBusinessStore } from "../../../store/businessStore";

export default function BusinessIndex() {
  // const setBusiness = useBusinessStore((state: any) => state.setBusiness);
  const setLoading = useBusinessStore((state: any) => state.setLoading);

  const checkBusiness = async () => {
    try {
      // setLoading(true);

      const res = await API.get("/business/me");
      const business = res.data?.business;

      if (!business) {
        // setBusiness(null);
        return router.replace("/(tabs)/business/create");
      }

      // Save to global store
      // setBusiness(business);

      if (!business.isKycVerified) {
        return router.replace("/(tabs)/business/kyc");
      }

       router.push({
      pathname: "/(tabs)/(stack)/userBusiness",
      params: { businessId: business._id },
    });
    } catch (error) {
      // setBusiness(null);
      router.replace("/(tabs)/business/create");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkBusiness();
    }, []),
  );

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator color="#16A34A" />
    </View>
  );
}
