import { Link } from "expo-router";
import { demoArtists, demoArtworks } from "@artisans/shared";
import { FlatList, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../../src/Screen";
import { artworkImages } from "../../src/artworkImages";
import { colors } from "../../src/theme";

export default function ArtistDashboardScreen() {
  const artist = demoArtists[0]!;
  const artworks = demoArtworks.filter((artwork) => artwork.artistId === artist.id);

  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.content}
        data={artworks}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>artist dashboard</Text>
            <View style={styles.form}>
              <Text style={styles.formTitle}>upload listing</Text>
              <TextInput placeholder="Artwork title" placeholderTextColor="rgba(244,244,239,0.46)" style={styles.input} />
              <TextInput placeholder="USDC price" placeholderTextColor="rgba(244,244,239,0.46)" style={styles.input} />
              <Link href="/arts" style={styles.primary}>create certificate draft</Link>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Link href={`/artwork/${item.id}`} style={styles.card}>
            <Image source={artworkImages[item.id]} style={styles.image} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.meta}>{item.priceUsdc} USDC · {item.status}</Text>
            </View>
          </Link>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 32 },
  header: { paddingTop: 20, gap: 18 },
  title: { color: colors.paper, fontSize: 54, fontWeight: "900", lineHeight: 56 },
  form: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel, borderRadius: 8, padding: 16, gap: 12 },
  formTitle: { color: colors.paper, fontSize: 28, fontWeight: "900" },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 8, padding: 14, color: colors.paper, backgroundColor: "rgba(255,255,255,0.06)" },
  primary: { overflow: "hidden", borderRadius: 24, backgroundColor: colors.orange, color: colors.paper, textAlign: "center", fontWeight: "900", padding: 14 },
  card: { overflow: "hidden", borderRadius: 8, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, marginTop: 16 },
  image: { width: "100%", height: 260 },
  cardBody: { padding: 16 },
  cardTitle: { color: colors.paper, fontSize: 28, fontWeight: "900" },
  meta: { color: colors.muted, marginTop: 6, fontWeight: "800" },
});
