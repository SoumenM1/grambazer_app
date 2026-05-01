import { View, StyleSheet, } from "react-native";
import FeedCard from "../../components/FeedCard";
import Layout from "../(tabs)/_layout";


export default function Home() {
  return (
    <View style={styles.container}>
      <FeedCard/>
      <Layout />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  content: { paddingBottom: 90 }, // IMPORTANT for footer space
});
