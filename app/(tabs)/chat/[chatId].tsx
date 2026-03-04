import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect, use } from "react";
import { getSocket } from "../../../lib/socket";
import { API } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import { router } from "expo-router";

export default function ChatDetail() {
  const { name, chatId, avater, isOnline, lastMessageAt } =
    useLocalSearchParams();
  const [messages, setMessages] = useState();
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  useEffect(() => {
    const socket = getSocket();

    /* -------- LOAD OLD MESSAGES -------- */
    const loadMessages = async () => {
      try {
        const res = await API.get(`/chat/messages/${chatId}`);
        setMessages(res.data);
      } catch (err: any) {
        console.log("Load messages error:", err.message);
      }
    };

    loadMessages();

    /* -------- SOCKET -------- */
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinChat", chatId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev: any) =>
        prev.find((m: any) => m._id === msg._id) ? prev : [...prev, msg],
      );
    });

    return () => {
      socket.emit("leaveChat", chatId);
      socket.off("receiveMessage");
      // ❌ DO NOT disconnect global socket
    };
  }, [chatId, messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const payload = {
      text: message,
    };

    // Clear input immediately (better UX)
    setMessage("");

    try {
      await API.post(`/chat/messages/${chatId}`, payload);
      // ✅ Do NOT update messages state here
      // Socket "receiveMessage" will handle it
    } catch (err: any) {
      console.log("Send message error:", err.message);
      Alert.alert("Failed to send message");
    }
  };

  /* -------- MENU ACTIONS -------- */

  const handleBlock = () => {
    setMenuOpen(false);
    Alert.alert("User Blocked");
  };

  const handleDelete = () => {
    setMenuOpen(false);
    Alert.alert("Chat Deleted");
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        {/* ---------------- HEADER ---------------- */}
        <View style={styles.header}>
          <Image
            source={{ uri: `${avater || "https://picsum.photos/200"}` }}
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{name || "Soumen Maity"}</Text>
            <Text style={styles.status}>
              {!isOnline ? "Online" : `Last seen ${lastMessageAt}`}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/calls/CallScreen",
                params: {
                  chatId,
                  name,
                  avatar: avater,
                  type: "audio",
                },
              })
            }
          >
            <Ionicons name="call" size={22} color="#0f5024" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginLeft: 16 }}
            onPress={() =>
              router.push({
                pathname: "/calls/CallScreen",
                params: {
                  chatId,
                  name,
                  avatar: avater,
                  type: "video",
                },
              })
            }
          >
            <Ionicons name="videocam" size={22} color="#0f5024" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginLeft: 16 }}
            onPress={() => setMenuOpen(!menuOpen)}
          >
            <Ionicons name="ellipsis-vertical" size={22} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* --------- 3 DOT MENU --------- */}
        {menuOpen && (
          <View style={styles.menu}>
            <TouchableOpacity onPress={handleBlock} style={styles.menuItem}>
              <Text style={styles.menuText}>Block User</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDelete} style={styles.menuItem}>
              <Text style={[styles.menuText, { color: "#DC2626" }]}>
                Delete Chat
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ---------------- MESSAGES ---------------- */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id}
          inverted // ⭐ reverses list
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => {
            const isMine = item?.sender._id === user._id;
            return (
              <View
                style={[
                  styles.bubble,
                  isMine ? styles.myBubble : styles.otherBubble,
                ]}
              >
                <Text style={styles.msgText}>{item.content}</Text>
              </View>
            );
          }}
        />

        {/* ---------------- INPUT ---------------- */}

        <View style={styles.footer}>
          <TouchableOpacity>
            <Ionicons name="mic" size={25} color="#0f5024" />
          </TouchableOpacity>

          <TextInput
            placeholder="Type a message"
            style={[
              styles.input,
              { backgroundColor: isDark ? "#111827" : "#dfe7e1",color: isDark ? "#f9fafb" : "#111827" },
              styles.input,
            ]}
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={sendMessage}
            activeOpacity={0.7}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  /* ---------- HEADER ---------- */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    // backgroundColor: "#eef0f1",
    // elevation: 4,
    marginTop: 38,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 10,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  status: {
    fontSize: 12,
    color: "#07880d",
  },

  /* ---------- MENU ---------- */
  menu: {
    position: "absolute",
    top: 95,
    right: 12,
    backgroundColor: "#fdfdfc",
    borderRadius: 10,
    elevation: 6,
    zIndex: 100,
  },

  menuItem: {
    padding: 13,
    minWidth: 140,
  },

  menuText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  /* ---------- CHAT ---------- */
  bubble: {
    // maxWidth: "75%",
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },

  myBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#DCFCE7",
  },

  otherBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
  },

  msgText: {
    fontSize: 14,
    color: "#111827",
  },

  /* ---------- FOOTER ---------- */
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // backgroundColor: "#d5e2d2",
    // borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  input: {
    flex: 1,
    backgroundColor: "#dfe7e1",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 10,
    fontSize: 17,
    height: 45,
  },

  sendBtn: {
    backgroundColor: "#0f5024",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
