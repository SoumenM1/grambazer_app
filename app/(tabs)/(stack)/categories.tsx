import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { API } from "../../../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppEvents } from "../../../utils/events";

type Category = {
  _id?: string;
  name: string;
  icon: string;
  isActive?: boolean;
  hasSubcategory?: boolean;
};

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await API.get("/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(data.data);
    } catch (error) {
      // console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (item: any) => {
    onCategoryPress(item._id || "");
    if (item.hasSubcategory) {
      router.push({
        pathname: "/subcategory",
        params: { category: item.name },
      });
    } else {
      router.push({
        pathname: "/market",
        params: { category: item.name },
      });
    }
  };

  const onCategoryPress = async (categoryId: string) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.warn("No token found");
        return;
      }
      // 🔐 Correct Axios usage
      await API.post(
        "/categories/track",
        { categoryId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      AppEvents.emit("CATEGORY_REFRESH");
    } catch (error: any) {
      console.error(
        "Track click failed:",
        error?.response?.data || error.message,
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>All Categories</Text>

      <FlatList
        data={categories}
        keyExtractor={(item: any) => item._id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => handleCategoryPress(item)}
          >
            <Image source={{ uri: item.icon }} style={styles.image} />

            <View style={styles.overlay}>
              <Text style={styles.cardText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingTop: 30,
  },

  heading: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
    color: "#025128",
  },

  card: {
    flex: 1,
    height: 140,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
    elevation: 4,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
  },

  cardText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
});
