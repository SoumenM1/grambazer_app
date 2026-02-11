import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Header from "../../components/Header";
import { router } from "expo-router";
import { API } from "../../lib/api";
import { useEffect, useState } from "react";

/* ---------------- DUMMY DATA ---------------- */

const STATUS_USERS = [
  {
    id: "1",
    name: "Soumen",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "2",
    name: "Amit",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "3",
    name: "Sneha",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: "4",
    name: "Riya",
    online: false,
    avatar: "https://i.pravatar.cc/150?img=10",
  },
  {
    id: "5",
    name: "Purnima",
    online: false,
    avatar: "https://i.pravatar.cc/150?img=10",
  },
];

/* ---------------- SCREEN ---------------- */

export default function ChatScreen() {
  const [chats, setChats] = useState();

  const fetchChats = async () => {
    const res = await API.get("/chat/my-chats");
    setChats(res.data);
  };
  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <>
      <Header />
      <View style={styles.container}>
        {/* STATUS */}
        <Text style={styles.sectionTitle}>Status</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusRow}
        >
          {STATUS_USERS.map((user) => (
            <View key={user.id} style={styles.statusItem}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.statusAvatar}
                />
                {user.online && <View style={styles.onlineDot} />}
              </View>
              <Text style={styles.statusName} numberOfLines={1}>
                {user.name}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* RECENT CHAT */}
        <Text style={styles.sectionTitle}>Chats</Text>

        <FlatList
          data={chats}
          keyExtractor={(item) => item.chatId}
          renderItem={({ item }) => <ChatItem item={item} />}
          stickyHeaderHiddenOnScroll
        />
      </View>
    </>
  );
}

/* ---------------- CHAT ITEM ---------------- */

function ChatItem({ item }: any) {
  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        router.push({
          pathname: "/chat/[chatId]",
          params: {
            chatId: item.chatId, // ✅ required
            name: item?.user.name, // optional
            avater: item?.user.avatar,
            isOnline: item?.user.online,
            lastMessageAt:item.lastMessageAt
          },
        })
      }
    >
      <View style={styles.avatarWrapper}>
        <Image
          source={{
            uri:
              item?.user.avatar || "https://picsum.photos/seed/picsum/200/300",
          }}
          style={styles.chatAvatar}
        />
        {item?.user.online && <View style={styles.onlineDotSmall} />}
      </View>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.chatName}>{item?.user.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>

      <View style={styles.chatRight}>
        <Text style={styles.time}>{item.lastMessageAt}</Text>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: "#ffffff",
    paddingTop: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 16,
    marginBottom: 6,
    color: "#111827",
  },

  /* STATUS */
  statusRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  statusItem: {
    width: 72,
    alignItems: "center",
    marginRight: 12,
  },

  avatarWrapper: {
    position: "relative",
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#40865f",
  },

  statusAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  statusName: {
    fontSize: 12,
    marginTop: 6,
    color: "#374151",
    fontWeight: "500",
  },

  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#12cf57",
    borderWidth: 2,
    borderColor: "#fff",
  },

  /* CHAT */
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  chatAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  onlineDotSmall: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#fff",
  },

  chatName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  lastMessage: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  chatRight: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  time: {
    fontSize: 12,
    color: "#6B7280",
  },

  unreadBadge: {
    marginTop: 6,
    backgroundColor: "#099335",
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});
