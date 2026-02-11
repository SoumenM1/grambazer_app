import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { API } from "../../../lib/api";

export default function BusinessProfile() {
  const { businessId } = useLocalSearchParams();
  const { user } = useAuth();
  const myUserId = user?._id;
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isFriend = true;
  useEffect(() => {
    const loadBusiness = async () => {
      try {
        // 🔥 Public (Market/Search)
        if (businessId) {
          const res = await API.get(`/business/${businessId}`);
          setBusiness(res.data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadBusiness();
  }, [businessId]);
  if (loading) return <ActivityIndicator />;
  if (!business) return <Text>Business not found</Text>;
  const isOwner = business.owner?._id === myUserId;
  /* FOLLOW / UNFOLLOW */
  const toggleFollow = async () => {
    const updated = {
      ...business,
      isFollowing: !business.isFollowing,
      followers: business.isFollowing
        ? business.followers - 1
        : business.followers + 1,
    };

    setBusiness(updated);

    try {
      await API.post(`/business/follow/${business._id}`);
    } catch (err) {
      console.log("Follow failed");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* BANNER */}
      <Image source={{ uri: business.banner }} style={styles.banner} />

      {/* EDIT BUTTON */}
      {isOwner && (
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push("/(tabs)/business/create")}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      )}

      {/* LOGO */}
      <View style={styles.logoWrapper}>
        <Image source={{ uri: business.logo }} style={styles.logo} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{business.name}</Text>

        <View style={styles.row}>
          <Text style={styles.stat}>
            ⭐ {business.rating} ({business.reviewsCount})
          </Text>
          <Text style={styles.stat}>👥 {business.followers}</Text>
          {!isOwner && (
            <Text style={styles.stat}>📍 {business.distance}</Text>
          )}
        </View>

        {!isOwner && (
          <TouchableOpacity style={styles.followBtn} onPress={toggleFollow}>
            <Text style={styles.followText}>
              {business.isFollowing ? "Unfollow" : "Follow"}
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.section}>About</Text>
        <Text style={styles.description}>{business.description}</Text>

        <Text style={styles.section}>Services</Text>
        <View style={styles.services}>
          {business.services?.map((s: any) => (
            <View key={s} style={styles.chip}>
              <Text style={styles.chipText}>{s}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>Owner</Text>
        <View style={styles.ownerRow}>
          <Image
            source={{ uri: business.owner?.imageUrl }}
            style={styles.ownerImg}
          />
          <Text style={styles.ownerName}>{business.owner?.name}</Text>
        </View>
        {/* ACTIONS (USER ONLY) */}
        {!isOwner && (
          <View style={styles.actions}>
            {isFriend ? (
              <Action icon="chatbubble-ellipses-outline" label="Message" />
            ) : (
              <Action icon="person-add-outline" label="Invite" />
            )}

            <Action icon="location-outline" label="Direction" />
            <Action icon="share-social-outline" label="Share" />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const Action = ({ icon, label }: any) => (
  <TouchableOpacity style={styles.actionBtn}>
    <Ionicons name={icon} size={20} color="#16A34A" />
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

const COLORS = {
  green: "#16A34A",
  white: "#FFFFFF",
  mitti: "#D6B27C",
  mittiSoft: "#F5EFE6",
  textDark: "#1F2937",
  textGray: "#6B7280",
  border: "#E5E7EB",
};

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.white, marginTop: 35 },
  banner: { width: "100%", height: 200 },

  editBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    flexDirection: "row",
    backgroundColor: COLORS.green,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
    gap: 6,
  },
  editText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  logoWrapper: { alignItems: "center", marginTop: -50 },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.white,
  },

  content: { padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    color: COLORS.textDark,
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginTop: 6,
  },
  stat: { color: COLORS.textGray, fontWeight: "600" },

  followBtn: {
    marginTop: 14,
    backgroundColor: COLORS.green,
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: "center",
  },
  followText: { color: COLORS.white, fontWeight: "700" },

  section: {
    marginTop: 20,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.mitti,
  },

  description: { color: COLORS.textGray, lineHeight: 20 },

  services: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: COLORS.mittiSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  chipText: { fontSize: 12, fontWeight: "600" },

  ownerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  ownerImg: { width: 40, height: 40, borderRadius: 20 },
  ownerName: { fontWeight: "600" },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: 14,
  },
  actionBtn: { alignItems: "center" },
  actionText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
    color: COLORS.green,
  },
});
