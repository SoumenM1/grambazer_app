import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const WS_URL = "ws://192.168.0.116:8000/api/v1/chat/ws";

const USER_ID = "USER_ID_HERE";

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  products?: Product[];
};

type ServerEvent = {
  type: "conversation" | "text" | "products" | "done" | "error";
  data?: any;
  conversation_id?: string;
};

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(
    null
  );

  const wsRef = useRef<globalThis.WebSocket | null>(null);

  const assistantIdRef = useRef<string | null>(null);

  const reconnectTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const isUnmountedRef = useRef(false);

  /**
   * Handle events received from backend
   */
  const handleServerEvent = useCallback(
    (data: ServerEvent) => {
      console.log("WS <-", data);

      switch (data.type) {
        case "conversation": {
          if (data.conversation_id) {
            setConversationId(data.conversation_id);
          }

          break;
        }

        case "text": {
          const chunk = data.data || "";
          const assistantId = assistantIdRef.current;

          if (!assistantId || !chunk) {
            return;
          }

          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? {
                    ...message,
                    text: message.text + chunk,
                  }
                : message
            )
          );

          break;
        }

        case "products": {
          const products = Array.isArray(data.data)
            ? data.data
            : [];

          const assistantId = assistantIdRef.current;

          if (!assistantId) {
            return;
          }

          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? {
                    ...message,
                    products,
                  }
                : message
            )
          );

          break;
        }

        case "done": {
          setLoading(false);

          break;
        }

        case "error": {
          console.error("AI error:", data.data);

          setLoading(false);

          const assistantId = assistantIdRef.current;

          if (assistantId) {
            setMessages((prev) =>
              prev.map((message) =>
                message.id === assistantId
                  ? {
                      ...message,
                      text:
                        message.text ||
                        "Something went wrong. Please try again.",
                    }
                  : message
              )
            );
          }

          break;
        }

        default: {
          console.log("Unknown WS event:", data);

          break;
        }
      }
    },
    []
  );

  /**
   * Connect WebSocket
   */
  const connectWebSocket = useCallback(() => {
    if (isUnmountedRef.current) {
      return;
    }

    // Don't create duplicate connections
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    console.log("Connecting WebSocket:", WS_URL);

    const ws = new WebSocket(WS_URL);

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");

      if (isUnmountedRef.current) {
        ws.close();
        return;
      }

      setConnected(true);

      // Optional:
      // If your backend requires an initial authentication
      // message, send it here.
      //
      // ws.send(
      //   JSON.stringify({
      //     type: "auth",
      //     user_id: USER_ID,
      //   })
      // );
    };

    ws.onmessage = (event) => {
      try {
        const data: ServerEvent = JSON.parse(event.data);

        handleServerEvent(data);
      } catch (error) {
        console.error(
          "Invalid WebSocket message:",
          event.data,
          error
        );
      }
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);

      setConnected(false);
    };

    ws.onclose = (event) => {
      console.log(
        "WebSocket disconnected",
        event.code,
        event.reason
      );

      setConnected(false);

      if (wsRef.current === ws) {
        wsRef.current = null;
      }

      // Reconnect after 3 seconds
      if (!isUnmountedRef.current) {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }

        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      }
    };
  }, [handleServerEvent]);

  /**
   * Connect when screen mounts
   */
  useEffect(() => {
    isUnmountedRef.current = false;

    connectWebSocket();

    return () => {
      isUnmountedRef.current = true;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      const ws = wsRef.current;

      if (ws) {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;

        ws.close();
      }

      wsRef.current = null;
    };
  }, [connectWebSocket]);

  /**
   * Send message
   */
  const sendMessage = () => {
    const message = input.trim();

    if (!message) {
      return;
    }

    if (loading) {
      return;
    }

    const ws = wsRef.current;

    if (!ws) {
      console.log("WebSocket is not connected");

      connectWebSocket();

      return;
    }

    if (ws.readyState !== WebSocket.OPEN) {
      console.log(
        "WebSocket is not ready. State:",
        ws.readyState
      );

      return;
    }

    const timestamp = Date.now();

    const userMessage: Message = {
      id: `user-${timestamp}`,
      role: "user",
      text: message,
    };

    const assistantId = `assistant-${timestamp}`;

    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      text: "",
      products: [],
    };

    assistantIdRef.current = assistantId;

    setMessages((prev) => [
      ...prev,
      userMessage,
      assistantMessage,
    ]);

    setInput("");
    setLoading(true);

    const payload = {
      user_id: "asdas",
      message,
      conversation_id: conversationId,
    };

    console.log("WS ->", payload);

    try {
      ws.send(JSON.stringify(payload));
    } catch (error) {
      console.error("Failed to send WebSocket message:", error);

      setLoading(false);

      setMessages((prev) =>
        prev.map((item) =>
          item.id === assistantId
            ? {
                ...item,
                text: "Failed to send message. Please try again.",
              }
            : item
        )
      );
    }
  };

  /**
   * Render product
   */
  const renderProduct = ({
    item,
  }: {
    item: Product;
  }) => {
    return (
      <View style={styles.productCard}>
        <Text style={styles.productName}>
          {item.name}
        </Text>

        <Text style={styles.productPrice}>
          ₹{item.price}
        </Text>
      </View>
    );
  };

  /**
   * Render message
   */
  const renderMessage = ({
    item,
  }: {
    item: Message;
  }) => {
    const isUser = item.role === "user";

    return (
      <View
        style={[
          styles.messageContainer,
          isUser
            ? styles.userContainer
            : styles.assistantContainer,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isUser
              ? styles.userBubble
              : styles.assistantBubble,
          ]}
        >
          {item.text.length > 0 && (
            <Text
              style={[
                styles.messageText,
                isUser
                  ? styles.userText
                  : styles.assistantText,
              ]}
            >
              {item.text}
            </Text>
          )}

          {!isUser &&
            item.text.length === 0 &&
            loading && (
              <ActivityIndicator />
            )}

          {!isUser &&
            item.products &&
            item.products.length > 0 && (
              <FlatList
                data={item.products}
                keyExtractor={(product) =>
                  product.id
                }
                renderItem={renderProduct}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.productsList}
              />
            )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        {/* Header */}

        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Gram AI
          </Text>

          <View
            style={[
              styles.status,
              {
                backgroundColor: connected
                  ? "green"
                  : "red",
              },
            ]}
          />

          <Text style={styles.statusText}>
            {connected
              ? "Connected"
              : "Disconnected"}
          </Text>
        </View>

        {/* Messages */}

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messages}
          keyboardShouldPersistTaps="handled"
        />

        {/* Input */}

        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask Gram AI..."
            style={styles.input}
            multiline
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (loading || !connected) &&
                styles.disabledButton,
            ]}
            onPress={sendMessage}
            disabled={loading || !connected}
          >
            <Text style={styles.sendText}>
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
  },

  header: {
    height: 60,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#b0e893",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  status: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 10,
  },

  statusText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#666",
  },

  messages: {
    padding: 16,
    paddingBottom: 20,
  },

  messageContainer: {
    marginBottom: 12,
  },

  userContainer: {
    alignItems: "flex-end",
  },

  assistantContainer: {
    alignItems: "flex-start",
  },

  bubble: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 16,
  },

  userBubble: {
    backgroundColor: "#2563eb",
  },

  assistantBubble: {
    backgroundColor: "#f1f5f9",
  },

  messageText: {
    fontSize: 16,
    lineHeight: 23,
  },

  userText: {
    color: "#fff",
  },

  assistantText: {
    color: "#111827",
  },

  productsList: {
    marginTop: 12,
  },

  productCard: {
    width: 180,
    padding: 12,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  productName: {
    fontSize: 15,
    fontWeight: "600",
  },

  productPrice: {
    marginTop: 6,
    fontSize: 15,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#c6f09a",
  },

  input: {
    flex: 1,
    minHeight: 45,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#dcdeb1",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },

  sendButton: {
    marginLeft: 8,
    backgroundColor: "#16a34a",
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 22,
  },

  disabledButton: {
    opacity: 0.5,
  },

  sendText: {
    color: "#fff",
    fontWeight: "600",
  },
});