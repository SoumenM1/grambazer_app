import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { router } from "expo-router";

const CATEGORIES = [
  {
    id: "1",
    name: "Groceries",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e",
    hasSubcategory: true,
  },
  {
    id: "2",
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    hasSubcategory: true,
  },
  {
    id: "3",
    name: "Clothes",
    image: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47",
    hasSubcategory: true,
  },
  {
    id: "4",
    name: "Plumber",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
    hasSubcategory: false,
  },
  {
    id: "5",
    name: "Electrician",
    image: "https://images.unsplash.com/photo-1581092334651-ddf26d9b9e58",
    hasSubcategory: false,
  },
  {
    id: "6",
    name: "Teacher",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350",
    hasSubcategory: false,
  },
  {
    id: "7",
    name: "Medical",
    image: "https://images.unsplash.com/photo-1580281657527-47f249e8f8a5",
    hasSubcategory: true,
  },
  {
    id: "8",
    name: "Restaurant",
    image: "https://images.unsplash.com/photo-1555992336-03a23c8c37d6",
    hasSubcategory: false,
  },
];

const handleCategoryPress = (item: any) => {
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


export default function CategoriesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>All Categories</Text>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => handleCategoryPress(item)}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.image}
            />

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
