import { Link, useLocalSearchParams } from "expo-router";
import { demoArtists, findArtwork, findCertificateByArtwork } from "@artisans/shared";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../src/Screen";
import { artworkImages } from "../../src/artworkImages";
import { colors } from "../../src/theme";

export default function ArtworkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const artwork = id ? findArtwork(id) : undefined;

  if (!artwork) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.title}>not found</Text>
        </View>
      </Screen>
    );
  }

  const artist = demoArtists.find((entry) => entry.id === artwork.artistId);
  const certificate = findCertificateByArtwork(artwork.id);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={artworkImages[artwork.id]} style={styles.image} />
        <Text style={styles.title}>{artwork.title}</Text>
        <Text style={styles.artist}>{artist?.displayName}</Text>
        <Text style={styles.copy}>{artwork.description}</Text>
        <View style={styles.panel}>
          <Text style={styles.label}>price</Text>
          <Text style={styles.price}>{artwork.priceUsdc} USDC</Text>
          <Text style={styles.hash}>{certificate?.metadataHash}</Text>
        </View>
        <Link href={`/orders/${artwork.artType === "physical" ? "order-physical-001" : "order-digital-001"}`} style={styles.primary}>
          {artwork.artType === "physical" ? "request shipping quote" : "buy and unlock"}
        </Link>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 36 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  image: { width: "100%", height: 430, borderRadius: 8 },
  title: { color: colors.paper, fontSize: 54, fontWeight: "900", lineHeight: 56, marginTop: 18 },
  artist: { color: colors.muted, fontSize: 20, fontWeight: "900", marginTop: 8 },
  copy: { color: colors.muted, fontSize: 16, lineHeight: 25, marginTop: 16 },
  panel: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel, borderRadius: 8, padding: 16, marginTop: 18 },
  label: { color: "rgba(244,244,239,0.48)", fontWeight: "900", textTransform: "uppercase" },
  price: { color: colors.paper, fontSize: 38, fontWeight: "900", marginTop: 4 },
  hash: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 12 },
  primary: { overflow: "hidden", borderRadius: 24, backgroundColor: colors.orange, color: colors.paper, fontWeight: "900", textAlign: "center", padding: 14, marginTop: 18, fontSize: 18 },
});
