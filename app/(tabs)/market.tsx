import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header";
import OfferCarousel from "../../components/OfferCarousel";
import { router } from "expo-router";
import { API } from "../../lib/api";
import { useFilterStore } from "../../store/filterStore";
import { useLiveLocation } from "../../lib/location";

export default function MarketScreen() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const category = useFilterStore((state) => state.category);
  const setCategory = useFilterStore((state) => state.setCategory);

  const fetchBusinesses = async () => {
    try {
      let url = "/business";
      if (category) {
        url += `?category=${category}`;
      }
      const res = await API.get(url);
      setBusinesses(res.data.data);
    } catch (error) {
      console.log("Error fetching businesses:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [category]);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCategory(null);
    fetchBusinesses();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <Header />

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#16A34A" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 12 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#16A34A"]}
            />
          }
        >
          <OfferCarousel />

          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              marginBottom: 12,
              color: "#111827",
            }}
          >
            Nearby Businesses
          </Text>

          {businesses.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No businesses found nearby
            </Text>
          ) : (
            businesses.map((item) => <MarketCard key={item._id} item={item} />)
          )}
        </ScrollView>
      )}
    </View>
  );
}

/* ---------- Card Component ---------- */

function MarketCard({ item }: any) {
  const [following, setFollowing] = useState(false);

  const openBusiness = () => {
    router.push({
      pathname: "/(tabs)/(stack)/userBusiness",
      params: { businessId: item._id },
    });
  };
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={openBusiness}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 16,
        marginBottom: 14,
        overflow: "hidden",
        elevation: 2,
      }}
    >
      <Image
        source={{ uri: item.banner }}
        style={{ width: "100%", height: 160 }}
      />

      <View style={{ padding: 12 }}>
        {/* Shop Name + Follow */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ fontSize: 15, fontWeight: "700" }}>
              {item?.name}
            </Text>
            <Text style={{ marginTop: 4, fontSize: 13, color: "#6B7280" }}>
              {item.Category[0].name} 📍{item.distance}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setFollowing(!following)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 20,
              backgroundColor: following ? "#E5E7EB" : "#16A34A",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: following ? "#374151" : "#ffffff",
              }}
            >
              {following ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reactions Count */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 8,
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 12, color: "#6B7280" }}>
            ⭐ {item.rating} Rating
          </Text>
          <Text style={{ fontSize: 12, color: "#6B7280" }}>
            👥 {item.followers} followers
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
