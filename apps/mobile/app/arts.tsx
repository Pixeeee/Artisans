import { Link } from "expo-router";
import { demoArtworks } from "@artisans/shared";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Screen } from "../src/Screen";
import { artworkImages } from "../src/artworkImages";
import { colors } from "../src/theme";

export default function ArtsScreen() {
  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.content}
        data={demoArtworks}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>arts</Text>
            <Text style={styles.copy}>Digital and physical works verified with ArtisanS certificates.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Link href={`/artwork/${item.id}`} style={styles.card}>
            <Image source={artworkImages[item.id]} style={styles.image} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.meta}>{item.artType} · {item.priceUsdc} USDC</Text>
            </View>
          </Link>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 32, gap: 16 },
  header: { paddingTop: 20, marginBottom: 8 },
  title: { color: colors.paper, fontSize: 76, fontWeight: "900", lineHeight: 78 },
  copy: { color: colors.muted, fontSize: 16, lineHeight: 24, marginTop: 8 },
  card: { overflow: "hidden", borderRadius: 8, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, marginBottom: 16 },
  image: { width: "100%", height: 280 },
  cardBody: { padding: 16 },
  cardTitle: { color: colors.paper, fontSize: 28, fontWeight: "900" },
  meta: { color: colors.muted, marginTop: 6, fontWeight: "800" },
});
