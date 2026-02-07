import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BusinessProfile() {
  const isFollowing = false;

  const business = {
    name: "Maa Durga Grocery",
    logo: "https://picsum.photos/200",
    banner: "https://picsum.photos/800/400",
    description:
      "We provide daily grocery items with best quality and village-friendly pricing.",
    rating: 4.6,
    reviews: 128,
    distance: "2.3 km",
    services: ["Rice", "Oil", "Vegetables", "Home Delivery"],
    owner: {
      name: "Ramesh Das",
      image: "https://picsum.photos/100",
    },
  };

  return (
    <ScrollView style={styles.container}>

      {/* BANNER */}
      <Image source={{ uri: business.banner }} style={styles.banner} />

      {/* LOGO */}
      <View style={styles.logoWrapper}>
        <Image source={{ uri: business.logo }} style={styles.logo} />
      </View>

      {/* INFO */}
      <View style={styles.content}>
        <Text style={styles.title}>{business.name}</Text>

        <View style={styles.row}>
          <Text style={styles.rating}>
            ⭐ {business.rating} ({business.reviews})
          </Text>
          <Text style={styles.distance}>📍 {business.distance}</Text>
        </View>

        <TouchableOpacity style={styles.followBtn}>
          <Text style={styles.followText}>
            {isFollowing ? "Unfollow" : "Follow"}
          </Text>
        </TouchableOpacity>

        {/* DESCRIPTION */}
        <Text style={styles.section}>About</Text>
        <Text style={styles.description}>{business.description}</Text>

        {/* SERVICES */}
        <Text style={styles.section}>Services</Text>
        <View style={styles.services}>
          {business.services.map((s) => (
            <View key={s} style={styles.chip}>
              <Text style={styles.chipText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* OWNER */}
        <Text style={styles.section}>Owner</Text>
        <View style={styles.ownerRow}>
          <Image source={{ uri: business.owner.image }} style={styles.ownerImg} />
          <Text style={styles.ownerName}>{business.owner.name}</Text>
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <Action icon="call-outline" label="Call" />
          <Action icon="location-outline" label="Direction" />
          <Action icon="share-social-outline" label="Share" />
        </View>
      </View>
    </ScrollView>
  );
}

/* ACTION BUTTON */
const Action = ({ icon, label }: any) => (
  <TouchableOpacity style={styles.actionBtn}>
    <Ionicons name={icon} size={20} color="#16A34A" />
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);


const COLORS = {
  green: "#16A34A",     // primary
  greenSoft: "#DCFCE7",
  white: "#FFFFFF",
  mitti: "#D6B27C",     // earth / soil
  mittiSoft: "#F5EFE6",
  textDark: "#1F2937",
  textGray: "#6B7280",
  border: "#E5E7EB",
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },

  banner: {
    width: "100%",
    height: 200,
  },

  logoWrapper: {
    alignItems: "center",
    marginTop: -50,
  },

  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.white,
    backgroundColor: COLORS.mittiSoft,
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 6,
  },

  rating: {
    color: COLORS.green,
    fontWeight: "600",
  },

  distance: {
    color: COLORS.textGray,
  },

  followBtn: {
    marginTop: 14,
    backgroundColor: COLORS.green,
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: "center",
  },

  followText: {
    color: COLORS.white,
    fontWeight: "700",
  },

  section: {
    marginTop: 20,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.mitti,
  },

  description: {
    color: COLORS.textGray,
    lineHeight: 20,
  },

  services: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    backgroundColor: COLORS.mittiSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },

  chipText: {
    color: COLORS.textDark,
    fontSize: 12,
    fontWeight: "600",
  },

  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },

  ownerImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  ownerName: {
    fontWeight: "600",
    color: COLORS.textDark,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: 14,
  },

  actionBtn: {
    alignItems: "center",
  },

  actionText: {
    fontSize: 12,
    color: COLORS.green,
    marginTop: 4,
    fontWeight: "600",
  },
});
