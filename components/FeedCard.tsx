import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VideoView, useVideoPlayer } from "expo-video";
import Shorts from "./Shorts";
import Header from "./Header";
import { API } from "../lib/api";
import { useIsFocused } from "@react-navigation/native";

/* ---------- TYPES ---------- */

interface User {
  _id: string;
  name: string;
  imageUrl?: string;
}

interface FeedItem {
  _id: string;
  title?: string;
  description: string;
  mediaUrl: string;

  mediaType: "image" | "video";
  isLive?: boolean;
  views?: number;
  createdAt: string;
  user: User;
}

interface FeedResponse {
  success: boolean;
  data: FeedItem[];
  nextCursor: string | null;
}

/* ---------- COMPONENT ---------- */

export default function FeedCard() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cursor, setNextCursor] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 70,
  };

  const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
    setActiveVideoId(viewableItems[0]?.item?._id || null);
  }).current;

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setNextCursor(null);
      await fetchFeed(null);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchFeed = async (cursor: string | null = null) => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      let query = `?limit=10`;
      if (cursor) query += `&cursor=${cursor}`;

      const res = await API.get<FeedResponse>(`/media/feed${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setFeed((prev) =>
          cursor ? [...prev, ...res.data.data] : res.data.data,
        );
        setNextCursor(res.data.nextCursor);
      }
    } catch (err: any) {
      console.log("Feed error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (loading && feed.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  return (
    <FlatList
      data={feed}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={
        <>
          <Header />
          <Shorts />
        </>
      }
      renderItem={({ item }) => (
        <PostCard post={item} isActive={item._id === activeVideoId} />
      )}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      onEndReachedThreshold={0.5} // ⭐ important
      onEndReached={() => {
        if (cursor && !loading) {
          fetchFeed(cursor); // 👈 LOAD NEXT 10
        }
      }}
      refreshing={refreshing}
      onRefresh={onRefresh}
      removeClippedSubviews={true}
    />
  );
}

/* ---------- SINGLE POST UI ---------- */

function PostCard({ post, isActive }: { post: FeedItem; isActive: boolean }) {
  const isVideo = post.mediaType === "video";
  const isLive = post.mediaType;
  const isFocused = useIsFocused();
  const player = useVideoPlayer(isVideo ? post.mediaUrl : null, (player) => {
    player.loop = true;
  });

  useEffect(() => {
    if (!isVideo || !player) return;

    if (isActive && isFocused) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, isFocused]);

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.userRow}>
          <Image
            source={{
              uri: post.user?.imageUrl || "https://picsum.photos/200",
            }}
            style={styles.avatar}
          />

          <View>
            <Text style={styles.username}>{post.user.name}</Text>
            <Text style={styles.time}>
              {new Date(post.createdAt).toLocaleString()}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.followBtn}>
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>
      </View>

      {/* CAPTION */}
      {post.title && <Text style={styles.caption}>{post.title}</Text>}

      {/* CAPTION */}
      {post.description && (
        <Text style={styles.description}>{post.description}</Text>
      )}

      {/* MEDIA */}
      <View style={styles.mediaWrapper}>
        {post.mediaType === "video" ? (
          <TouchableOpacity activeOpacity={0.9}>
            <VideoView player={player} style={styles.media} />

            {/* SOUND ICON */}
            {/* <View style={styles.soundIcon}>
              <Ionicons size={22} color="#ffffff" />
            </View> */}
          </TouchableOpacity>
        ) : (
          <Image
            source={{ uri: post.mediaUrl }}
            style={styles.media}
            resizeMode="contain"
          />
        )}

        {post.isLive && (
          <View style={styles.liveTag}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>

      {(isVideo || isLive) && (
        <Text style={styles.views}>👁 {post.views || 0} views</Text>
      )}

      {/* ACTIONS */}
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

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#ffffff",
    marginBottom: 12,
    padding: 12,
    borderRadius: 14,
    marginTop: 10,
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
    width: 45,
    height: 45,
    borderRadius: 21,
    marginRight: 10,
  },

  username: {
    fontWeight: "700",
    fontSize: 17,
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
    fontSize: 17,
  },
  description: {
    //  marginVertical: 8,
    fontSize: 12,
    marginTop: 0,
    textAlign: "justify",
  },
  soundIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 6,
    borderRadius: 20,
  },

  mediaWrapper: {
    position: "relative",
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
  },

  media: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#000",
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
