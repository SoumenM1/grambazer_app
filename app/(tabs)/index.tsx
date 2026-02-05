import { ScrollView, View, StyleSheet, Animated } from "react-native";
import { useRef } from "react";
import Header from "../../components/Header";
import Shorts from "../../components/Shorts";
import FeedCard from "../../components/FeedCard";
import Layout from "../(tabs)/_layout";

export default function Home() {
  const translateY = useRef(new Animated.Value(0)).current;
  const lastOffset = useRef(0);

  const onScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;

    // Always show footer at top
    if (currentOffset <= 0) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
      lastOffset.current = 0;
      return;
    }

    const direction = currentOffset > lastOffset.current ? "down" : "up";

    Animated.timing(translateY, {
      toValue: direction === "down" ? 100 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();

    lastOffset.current = currentOffset;
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <Header />
        <Shorts />
        {/* <FeedCard /> */}
      </Animated.ScrollView>
      <Layout />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  content: { paddingBottom: 90 }, // IMPORTANT for footer space
});
