import { ScrollView, View, Text, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { API } from "../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Category = {
  _id?: string;    
  name: string;
  icon: string;
  isActive?: boolean;
};

export default function Shorts() {
 const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCategories();
  }, [categories]);

  const fetchCategories = async () => {
    try {
       const token = await AsyncStorage.getItem("token");
      const { data } = await API.get("/categories/recent",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     setCategories(data.categories);
    } catch (error) {
      console.error("Failed to load categories:");
    } finally {
      setLoading(false);
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
            <View key={item._id} style={styles.item}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item.icon }} style={styles.image} />
              </View>
              <Text style={styles.label}>{item.name}</Text>
            </View>
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
