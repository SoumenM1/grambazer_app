import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FeedCard() {
  const isVideo = true; // change based on post type
  const isLive = false; // true for live stream

  return (
    <View style={styles.card}>
      {/* ---------- HEADER ---------- */}
      <View style={styles.header}>
        <View style={styles.userRow}>
          <Image
            source={{ uri: "https://picsum.photos/200/200?random=12" }}
            style={styles.avatar}
          />

          <View>
            <Text style={styles.username}>Sharma Kirana Store</Text>
            <Text style={styles.time}>2 minutes ago</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.followBtn}>
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- CONTENT ---------- */}
      <Text style={styles.caption}>
        Fresh Milk & Bread just arrived!
      </Text>

      <View style={styles.mediaWrapper}>
        <Image
          source={{ uri: "https://picsum.photos/200/200?random=11" }}
          style={styles.media}
        />

        {/* LIVE TAG */}
        {isLive && (
          <View style={styles.liveTag}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}

        {/* VIDEO PLAY ICON */}
        {isVideo && (
          <Ionicons
            name="play-circle"
            size={60}
            color="#ffffff"
            style={styles.playIcon}
          />
        )}
      </View>

      {/* ---------- VIEWS ---------- */}
      {(isVideo || isLive) && (
        <Text style={styles.views}>👁 1.2k views</Text>
      )}

      {/* ---------- ACTIONS ---------- */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="heart-outline" size={20} />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={20} />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="share-social-outline" size={20} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    marginBottom: 12,
    padding: 12,
    borderRadius: 14,
    marginTop:10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },

  username: {
    fontWeight: "700",
    fontSize: 14,
  },

  time: {
    fontSize: 12,
    color: "#6B7280",
  },

  followBtn: {
    borderColor: "#16A34A",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  followText: {
    color: "#16A34A",
    fontWeight: "600",
    fontSize: 12,
  },

  caption: {
    marginVertical: 8,
    fontSize: 14,
  },

  mediaWrapper: {
    position: "relative",
  },

  media: {
    width: "100%",
    height: 220,
    borderRadius: 12,
  },

  playIcon: {
    position: "absolute",
    top: "40%",
    left: "42%",
  },

  liveTag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#DC2626",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  liveText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },

  views: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
  },

  actionText: {
    marginLeft: 4,
    fontSize: 13,
  },
});
