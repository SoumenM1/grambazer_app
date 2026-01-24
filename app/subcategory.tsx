import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";

const SUBCATEGORIES = {
  Groceries: [
    {
      id: "1",
      name: "Vegetables",
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999",
    },
    {
      id: "2",
      name: "Fruits",
      image:
        "https://images.unsplash.com/photo-1574226516831-e1dff420e12d",
    },
    {
      id: "3",
      name: "Dairy",
      image:
        "https://images.unsplash.com/photo-1585238342028-4bbc87d63e6a",
    },
  ],

  Electronics: [
    {
      id: "1",
      name: "Mobile",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    },
    {
      id: "2",
      name: "Laptop",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    },
  ],

  Medical: [
    {
      id: "1",
      name: "Pharmacy",
      image:
        "https://images.unsplash.com/photo-1580281657527-47f249e8f8a5",
    },
    {
      id: "2",
      name: "Clinic",
      image:
        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3",
    },
  ],
};

export default function SubcategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();

  const data = SUBCATEGORIES[category as keyof typeof SUBCATEGORIES] || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.heading}>{category}</Text>
      <Text style={styles.sub}>Choose a subcategory</Text>

      {/* Grid */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/market",
                params: {
                  category,
                  subcategory: item.name,
                },
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.image} />

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
    fontSize: 26,
    fontWeight: "800",
    color: "#0f5024",
  },

  sub: {
    marginTop: 4,
    marginBottom: 16,
    fontSize: 14,
    color: "#6B7280",
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
