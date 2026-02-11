import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/* ---------------- DUMMY DATA ---------------- */

const dummyUser = {
  id: "u123",
  name: "Soumen Maity",
  username: "soumen.dev",
  avatar:
    "https://res.cloudinary.com/dvfs7vdry/image/upload/v1770704906/soumen-maity_eduhkq.webp",
  bio: "Building Gramseba 🌱 | Helping villages grow digitally",
  followers: 1280,
  following: 210,
  isFollowing: false,
  isJoined: true, // 👈 if true show Message instead of Invite
};

const dummyPosts = [
  { id: "1", image: "https://picsum.photos/300/300?1" },
  { id: "2", image: "https://picsum.photos/300/300?2" },
  { id: "3", image: "https://picsum.photos/300/300?3" },
  { id: "4", image: "https://picsum.photos/300/300?4" },
  { id: "5", image: "https://picsum.photos/300/300?5" },
  { id: "6", image: "https://picsum.photos/300/300?6" },
];

/* ---------------- SCREEN ---------------- */

export default function UserProfile() {
  const [following, setFollowing] = useState(dummyUser.isFollowing);

  const handleFollow = () => {
    setFollowing(!following);
  };

  const handleInvite = () => {
    Alert.alert("Invite Sent", "Invitation sent successfully 🌱");
  };

  const handleMessage = () => {
    Alert.alert("Message", "Opening chat...");
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image source={{ uri: dummyUser.avatar }} style={styles.avatar} />

        <Text style={styles.name}>{dummyUser.name}</Text>
        <Text style={styles.username}>@{dummyUser.username}</Text>
      </View>

      {/* BIO */}
      <Text style={styles.bio}>{dummyUser.bio}</Text>

      {/* STATS */}
      <View style={styles.statsRow}>
        <Stat label="Followers" value={dummyUser.followers} />
        <Stat label="Following" value={dummyUser.following} />
        <Stat label="Posts" value={dummyPosts.length} />
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.followBtn, following && styles.followingBtn]}
          onPress={handleFollow}
        >
          <Text style={[styles.followText, following && styles.followingText]}>
            {following ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>

        {dummyUser.isJoined ? (
          <TouchableOpacity style={styles.messageBtn} onPress={handleMessage}>
            <Ionicons name="chatbubble" size={16} color="#fff" />
            <Text style={styles.messageText}>Message</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.inviteBtn} onPress={handleInvite}>
            <Ionicons name="share-social" size={16} color="#166534" />
            <Text style={styles.inviteText}>Invite</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* RECENT POSTS */}
      <Text style={styles.sectionTitle}>Recent Posts</Text>

      <View style={styles.grid}>
        {dummyPosts.map((post) => (
          <Image
            key={post.id}
            source={{ uri: post.image }}
            style={styles.post}
          />
        ))}
      </View>
    </ScrollView>
  );
}

/* ---------------- COMPONENTS ---------------- */

const Stat = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.stat}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FEE7", // mitti light
    marginTop: 20,
  },

  header: {
    alignItems: "center",
    paddingVertical: 20,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "#16A34A",
  },

  name: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "700",
    color: "#14532D",
  },

  username: {
    fontSize: 14,
    color: "#4D7C0F",
  },

  bio: {
    textAlign: "center",
    paddingHorizontal: 20,
    color: "#374151",
    fontSize: 14,
    marginBottom: 14,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#ECFDF5",
    marginHorizontal: 16,
    borderRadius: 12,
  },

  stat: {
    alignItems: "center",
  },

  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#166534",
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginVertical: 14,
  },

  followBtn: {
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#16A34A",
  },

  followingBtn: {
    backgroundColor: "#E5E7EB",
  },

  followText: {
    color: "#fff",
    fontWeight: "600",
  },

  followingText: {
    color: "#374151",
  },

  inviteBtn: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#16A34A",
    alignItems: "center",
  },

  inviteText: {
    color: "#166534",
    fontWeight: "600",
  },

  messageBtn: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#166534",
    alignItems: "center",
  },

  messageText: {
    color: "#fff",
    fontWeight: "600",
  },

  sectionTitle: {
    marginLeft: 16,
    marginTop: 10,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "700",
    color: "#14532D",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    gap: 6,
  },

  post: {
    width: "32%",
    height: 110,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },
});
