import { useLocalSearchParams } from "expo-router";
import { demoArtists, demoCertificates, findArtwork } from "@artisans/shared";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../src/Screen";
import { colors } from "../../src/theme";

export default function CertificateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const certificate = demoCertificates.find((entry) => entry.id === id);
  const artwork = certificate ? findArtwork(certificate.artworkId) : undefined;
  const artist = artwork ? demoArtists.find((entry) => entry.id === artwork.artistId) : undefined;

  if (!certificate || !artwork) {
    return (
      <Screen>
        <View style={styles.center}><Text style={styles.title}>not found</Text></View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>certificate</Text>
        {[
          ["Artwork", artwork.title],
          ["Artist", artist?.displayName ?? "Unknown"],
          ["Creator wallet", certificate.artistWalletAddress],
          ["Metadata hash", certificate.metadataHash],
          ["Stellar reference", certificate.stellarTransactionHash],
          ["Network", certificate.network],
          ["Status", certificate.status],
        ].map(([label, value]) => (
          <View key={label} style={styles.panel}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.copy}>{value}</Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 36 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { color: colors.paper, fontSize: 60, fontWeight: "900", lineHeight: 62, marginTop: 20 },
  panel: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel, borderRadius: 8, padding: 16, marginTop: 12 },
  label: { color: "rgba(244,244,239,0.48)", fontWeight: "900", textTransform: "uppercase" },
  copy: { color: colors.muted, fontSize: 15, lineHeight: 23, marginTop: 8 },
});
