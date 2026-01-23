import { ScrollView, View, Text, Image, StyleSheet } from "react-native";

const shorts = [
  { title: "Emergency", img: "https://res.cloudinary.com/dvfs7vdry/image/upload/v1769150443/Gemini_Generated_Image_84y2fi84y2fi84y2_gs6cpr.png" },
  { title: "Clinc", img: "https://res.cloudinary.com/dvfs7vdry/image/upload/v1769150949/Gemini_Generated_Image_9904zh9904zh9904_yuni9q.png" },
  { title: "E-Rickshaw", img: "https://res.cloudinary.com/dvfs7vdry/image/upload/v1769092772/Gemini_Generated_Image_4jkdos4jkdos4jkd_lvvl6g.png" },
  { title: "Grocery", img: "https://res.cloudinary.com/dvfs7vdry/image/upload/v1769094449/Gemini_Generated_Image_nic2bqnic2bqnic2_iffgfn.png" },
  { title: "Construction", img: "https://res.cloudinary.com/dvfs7vdry/image/upload/v1769150830/Gemini_Generated_Image_98wc7z98wc7z98wc_u1wxkv.png" },
  { title: "Tutor", img: "https://res.cloudinary.com/dvfs7vdry/image/upload/v1769094169/Gemini_Generated_Image_s5nx2ws5nx2ws5nx_i6ubtz.png" },
];

export default function Shorts() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>

      {/* Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {shorts.map((item, i) => (
          <View key={i} style={styles.item}>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.img }} style={styles.image} />
            </View>
            <Text style={styles.label}>{item.title}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginBottom: 6,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  seeAll: {
    fontSize: 13,
    color: "#16A34A",
    fontWeight: "500",
  },

  scroll: {
    paddingHorizontal: 12,
  },

  item: {
    marginRight: 16,
    alignItems: "center",
  },

  imageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#a9abaa",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 65,
    height: 65,
    borderRadius: 32,
  },

  label: {
    marginTop: 6,
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
});
