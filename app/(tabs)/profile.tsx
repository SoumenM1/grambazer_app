import { View, Text, Image } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", paddingTop: 40 }}>
      <Image
        source={{ uri: "https://picsum.photos/200/200?random=16" }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />

      <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 12 }}>
        Soumen Maity
      </Text>

      <Text style={{ color: "#6B7280", marginTop: 4 }}>
        Seller • GramBazer
      </Text>
    </View>
  );
}
