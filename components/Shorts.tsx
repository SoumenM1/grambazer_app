import { ScrollView, View, Text, Image, StyleSheet } from "react-native";

const shorts = [
  { title: "New Stock", img: "https://picsum.photos/200/200?random=11" },
  { title: "Sale", img: "https://picsum.photos/200/200?random=12" },
  { title: "Yoga", img: "https://picsum.photos/200/200?random=13" },
  { title: "E-Rickshaw", img: "https://picsum.photos/200/200?random=14" },
  { title: "Services", img: "https://picsum.photos/200/200?random=15" },
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
    color: "#065F46",
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
    borderColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },

  label: {
    marginTop: 6,
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
});
