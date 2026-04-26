import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { API } from "../lib/api";
import { AppEvents } from "../utils/events";
import { useFilterStore } from "../store/filterStore";

type Category = {
  _id?: string;
  name: string;
  icon: string;
  isActive?: boolean;
};

export default function Shorts() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const setCategory = useFilterStore((state) => state.setCategory);
  useEffect(() => {
    // 🔹 1. Normal initial load
    fetchCategories();

    // 🔹 2. Event-based refresh
    const refreshCategories = () => {
      fetchCategories();
    };

    AppEvents.addListener("CATEGORY_REFRESH", refreshCategories);

    // 🔹 3. Cleanup
    return () => {
      AppEvents.removeListener("CATEGORY_REFRESH", refreshCategories);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/categories/recent");
      setCategories(data.categories);
      // console.log("Fetched categories:", data.categories);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (item: any) => {
    if (item.hasSubcategory) {
      router.push({
        pathname: "/subcategory",
        params: { category: item._id },
      });
    } else {
      setCategory(item._id);
      router.push({
        pathname: "/market",
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.seeAll} onPress={() => router.push("/categories")}>
          See all
        </Text>
      </View>

      {/* Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {loading ? (
          <Text style={{ paddingHorizontal: 12 }}>Loading...</Text>
        ) : (
          categories?.map((item) => (
            <TouchableOpacity
              key={item._id} // ✅ key MUST be here
              activeOpacity={0.8}
              onPress={() => handleCategoryPress(item)}
              style={styles.item}
            >
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item.icon }} style={styles.image} />
              </View>
              <Text style={styles.label}>{item.name}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginBottom: 6,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  seeAll: {
    fontSize: 13,
    color: "#16A34A",
    fontWeight: "500",
  },

  scroll: {
    paddingHorizontal: 12,
  },

  item: {
    marginRight: 16,
    alignItems: "center",
  },

  imageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#a9abaa",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 65,
    height: 65,
    borderRadius: 32,
  },

  label: {
    marginTop: 6,
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
});
