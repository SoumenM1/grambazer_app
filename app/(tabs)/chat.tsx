import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from "../../components/Header";
import { router } from "expo-router";
import { API } from "../../lib/api";
import { useEffect, useState, useRef } from "react";
import GramAi from "../../components/GramAi";

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
const groups = [
  { id: "1", name: "Village Team", image: "https://i.pravatar.cc/150?img=1" },
  { id: "2", name: "Shop Owners", image: "https://i.pravatar.cc/150?img=2" },
];

const requests = [
  { id: "1", name: "Rahul", avatar: "https://i.pravatar.cc/150?img=3" },
];

/* ---------------- SCREEN ---------------- */

export default function ChatScreen() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"chats" | "groups" | "requests">(
    "chats",
  );
  const tabs = ["chats", "groups", "requests"];

  const handleSwipe = (translationX: number) => {
    const currentIndex = tabs.indexOf(activeTab);

    // Swipe Left → Next Tab
    if (translationX < -80 && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1] as "chats" | "groups" | "requests");
    }

    // Swipe Right → Previous Tab
    if (translationX > 80 && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1] as "chats" | "groups" | "requests");
    }
  };

  const swipeGesture = Gesture.Pan().onEnd((event) => {
    handleSwipe(event.translationX);
  });
  const fetchChats = async () => {
    setLoading(true);
    const res = await API.get("/chat/my-chats");
    setChats(res.data);
    setLoading(false);
  };
  useEffect(() => {
    fetchChats();
  }, []);

  if (loading && chats.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }
  const onRefresh = async () => {
    try {
      setRefreshing(true);

      // 🔁 call your APIs
      await fetchChats();
      // await fetchGroups();
      // await fetchRequests();
    } catch (err) {
      console.log("Refresh error", err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <Header />
      <GestureHandlerRootView>
      {/* <GestureDetector gesture={swipeGesture}> */}
        <FlatList
          data={
            activeTab === "chats"
              ? chats
              : activeTab === "groups"
                ? groups
                : requests
          }
          keyExtractor={(item: any) => item.chatId || item.id}
          renderItem={({ item }) => {
            if (activeTab === "chats") return <ChatItem item={item} />;
            if (activeTab === "groups") return <GroupItem item={item} />;
            return <RequestItem item={item} />;
          }}
          ListHeaderComponent={
            <>
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

              {/* TABS */}
              <View style={styles.tabContainer}>
                <TabItem
                  label="Chats"
                  active={activeTab === "chats"}
                  onPress={() => setActiveTab("chats")}
                />
                <TabItem
                  label="Groups"
                  active={activeTab === "groups"}
                  onPress={() => setActiveTab("groups")}
                />
                <TabItem
                  label="Requests"
                  active={activeTab === "requests"}
                  onPress={() => setActiveTab("requests")}
                />
              </View>
            </>
          }
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          />
          {/* </GestureDetector> */}
          </GestureHandlerRootView>
      {/* Floating AI Button */}
      <GramAi />
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
            lastMessageAt: item.lastMessageAt,
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
function TabItem({ label, active, onPress }: any) {
  return (
    <TouchableOpacity style={styles.tabItem} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.activeTabText]}>
        {label}
      </Text>

      {active && <View style={styles.activeLine} />}
    </TouchableOpacity>
  );
}
function GroupItem({ item }: any) {
  return (
    <TouchableOpacity style={styles.chatItem}>
      <Image source={{ uri: item.image }} style={styles.chatAvatar} />
      <Text style={{ marginLeft: 12, fontWeight: "700" }}>{item.name}</Text>
    </TouchableOpacity>
  );
}
function RequestItem({ item }: any) {
  return (
    <View style={styles.chatItem}>
      <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.lastMessage}>Wants to connect</Text>
      </View>

      <TouchableOpacity style={styles.acceptBtn}>
        <Text style={{ color: "#fff", fontSize: 12 }}>Accept</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  /* TOP TABS */
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  tabItem: {
    alignItems: "center",
    flex: 1,
  },

  tabText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },

  activeTabText: {
    color: "#0f5024",
    fontWeight: "800",
  },

  activeLine: {
    marginTop: 6,
    height: 3,
    width: "60%",
    backgroundColor: "#0f5024",
    borderRadius: 2,
  },

  /* CHAT ITEM (reuse) */
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
    backgroundColor: "#fff",
  },

  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  chatName: {
    fontWeight: "700",
    fontSize: 14,
  },

  lastMessage: {
    fontSize: 12,
    color: "#6B7280",
  },

  acceptBtn: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
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
    paddingHorizontal: 5,
    paddingBottom: 12,
  },

  statusItem: {
    width: 72,
    alignItems: "center",
    marginRight: 10,
  },

  avatarWrapper: {
    position: "relative",
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#40865f",
  },

  statusAvatar: {
    width: 60,
    height: 60,
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
  // chatItem: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   paddingVertical: 12,
  //   paddingHorizontal: 16,
  //   backgroundColor: "#fff",
  //   borderBottomWidth: 1,
  //   borderColor: "#E5E7EB",
  // },

  // chatAvatar: {
  //   width: 52,
  //   height: 52,
  //   borderRadius: 26,
  // },

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

  // chatName: {
  //   fontSize: 15,
  //   fontWeight: "700",
  //   color: "#111827",
  // },

  // lastMessage: {
  //   fontSize: 13,
  //   color: "#6B7280",
  //   marginTop: 2,
  // },

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
