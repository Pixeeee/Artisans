import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../src/Screen";
import { BrandCube } from "../src/BrandCube";
import { colors } from "../src/theme";

export default function AboutScreen() {
  return (
    <Screen>
      <View style={styles.wrap}>
        <BrandCube size={92} />
        <Text style={styles.title}>verified art, direct from artists</Text>
        <Text style={styles.copy}>
          ArtisanS uses Stellar for public authenticity proof and USDC payments while keeping the experience simple for mainstream buyers and artists.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", padding: 24, gap: 20 },
  title: { color: colors.paper, fontSize: 54, fontWeight: "900", lineHeight: 56 },
  copy: { color: colors.muted, fontSize: 17, lineHeight: 27 },
});
