import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Header from "../../components/Header";
import OfferCarousel from "../../components/OfferCarousel";
import { router } from "expo-router";

const DUMMY_MARKETS = [
  {
    id: 1,
    name: "Sharma Kirana Store",
    category: "Grocery • 0.8 km",
    img: "https://picsum.photos/300/200?random=1",
  },
  {
    id: 2,
    name: "Gupta Vegetable Market",
    category: "Vegetables • 1.2 km",
    img: "https://picsum.photos/300/200?random=2",
  },
  {
    id: 3,
    name: "Rahul Medical Store",
    category: "Pharmacy • 0.5 km",
    img: "https://picsum.photos/300/200?random=3",
  },
];

export default function MarketScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <Header />
      
      <ScrollView contentContainerStyle={{ padding: 12 }}>
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

        {DUMMY_MARKETS.map((item) => (
          <MarketCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

/* ---------- Card Component ---------- */

function MarketCard({ item }: any) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(12);
  const [comments] = useState(4);
  const [following, setFollowing] = useState(false);

  const onLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

   const openBusiness = () => {
    router.push(`/(tabs)/(stack)/business`);
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
        source={{ uri: item.img }}
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
            <Text style={{ fontSize: 15, fontWeight: "700" }}>{item.name}</Text>
            <Text style={{ marginTop: 4, fontSize: 13, color: "#6B7280" }}>
              {item.category}
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
            👍 {likes} Likes
          </Text>
          <Text style={{ fontSize: 12, color: "#6B7280" }}>
            💬 {comments} Comments
          </Text>
        </View>

        {/* Reaction Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 10,
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
            paddingTop: 10,
          }}
        >
          <ReactionButton
            icon={liked ? "thumbs-up" : "thumbs-up-outline"}
            label="Like"
            color={liked ? "#16A34A" : "#6B7280"}
            onPress={onLike}
          />

          <ReactionButton
            icon="chatbubble-outline"
            label="Comment"
            color="#6B7280"
          />

          <ReactionButton
            icon="share-social-outline"
            label="Share"
            color="#6B7280"
          />
        </View>
      </View>
      </TouchableOpacity>
  );
}

/* ---------- Small Button ---------- */

function ReactionButton({
  icon,
  label,
  color,
  onPress,
}: {
  icon: any;
  label: string;
  color: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <Ionicons name={icon} size={18} color={color} />
      <Text style={{ marginLeft: 6, fontSize: 13, color }}>{label}</Text>
    </TouchableOpacity>
  );
}
