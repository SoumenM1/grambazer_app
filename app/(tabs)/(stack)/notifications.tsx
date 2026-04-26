import { View, Text, FlatList, Image } from "react-native";
import { useNotification } from "../../../context/NotificationContext";
import { useEffect } from "react";

const dummyNotifications = [
  {
    id: "1",
    title: "Welcome 👋",
    body: "Thanks for joining our platform!",
    image: null,
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "New Category",
    body: "A new service category has been added.",
    read: true,
    createdAt: new Date().toISOString(),
  },
];

export default function NotificationsScreen() {
  const { notifications, markAllRead } = useNotification();
  const data = notifications.length > 0 ? notifications : dummyNotifications;
  useEffect(() => {
    markAllRead();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#ffffff" }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "800",
          marginTop: 15,
          color: "#023a1a",
        }}
      >
        Notifications
      </Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 14,
              marginBottom: 10,
              marginTop: 10,
              backgroundColor: item.read ? "#F3F4F6" : "#ECFDF5",
              borderRadius: 12,
              borderLeftWidth: 4,
              borderLeftColor: item.read ? "#97732b" : "#22C55E",
            }}
          >
            <Text style={{ fontWeight: "700", fontSize: 15 }}>
              {item.title}
            </Text>
            <Text style={{ color: "#6B7280", marginTop: 4 }}>{item.body}</Text>
            {item?.image && (
              <Image
                source={{ uri: item?.image  }}
                style={{ width: "100%", height: 60, borderRadius: 8, marginTop: 10 }}
              />
            )}
          </View>
        )}
      />
    </View>
  );
}
