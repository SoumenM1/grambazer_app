import { View, Text } from "react-native";

export default function OrdersScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>
        My Orders
      </Text>
      <Text style={{ marginTop: 8, color: "#6B7280" }}>
        No orders yet
      </Text>
    </View>
  );
}
