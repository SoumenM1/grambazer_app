import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { API } from "../lib/api";

// const { width } = Dimensions.get("window");
const width = 350;

export default function OfferCarousel() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const flatListRef = useRef<FlatList>(null);

  // 🔹 Fetch offers
  const fetchOffers = async () => {
    try {
      const res = await API.get("/offers/location");
      setOffers(res.data.offers);
    } catch (err) {
      console.log("Offer fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // 🔹 Auto scroll
  useEffect(() => {
    if (!offers.length) return;

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % offers.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, offers]);

  if (loading) {
    return <ActivityIndicator size="small" />;
  }

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={offers}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            {/* <View style={styles.overlay}> */}
            {/* <Text style={styles.title}>{item.title}</Text> */}
            {/* <Text style={styles.subtitle}>{item.description}</Text> */}
            {/* </View> */}
          </View>
        )}
      />

      {/* 🔹 Dots */}
      <View style={styles.dots}>
        {offers.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, activeIndex === i && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    width: width, // ⭐ FULL WIDTH
    height: 160,
    overflow: "hidden",
    backgroundColor: "#000",
    borderRadius: 10,
    marginRight: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "#e5e7eb",
    fontSize: 14,
    marginTop: 4,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9ca3af",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#16a34a",
    width: 18,
  },
});
