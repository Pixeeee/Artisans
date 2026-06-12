import { Link } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandCube } from "../src/BrandCube";
import { PrimaryButton } from "../src/PrimaryButton";
import { colors, fonts } from "../src/theme";

const source = require("../assets/optimized/mobile.mp4");

export default function MobileLanding() {
  const player = useVideoPlayer(source, (instance) => {
    instance.loop = true;
    instance.muted = true;
    instance.play();
  });

  return (
    <View style={styles.root}>
      <VideoView
        contentFit="cover"
        nativeControls={false}
        player={player}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>
        <View style={styles.nav}>
          <Link href="/" style={styles.navText}>home</Link>
          <Link href="/arts" style={styles.navText}>arts</Link>
          <BrandCube size={46} />
          <Link href="/dashboard/artist" style={styles.navText}>earn</Link>
          <Link href="/about" style={styles.navText}>about</Link>
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>
            Where art carries <Text style={styles.mutedTitle}>proof</Text> beyond the frame.
          </Text>
          <Text style={styles.copy}>
            Sell and collect digital or physical art with Stellar-powered certificates and simple USDC checkout.
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton href="/arts">Enter Marketplace</PrimaryButton>
          <PrimaryButton href="/log-in" variant="light">
            Log in
          </PrimaryButton>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  safe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  nav: {
    position: "absolute",
    top: 14,
    left: 16,
    right: 16,
    height: 66,
    borderRadius: 33,
    backgroundColor: "rgba(255,255,255,0.5)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 12,
  },
  navText: {
    color: colors.ink,
    fontWeight: "800",
    fontSize: 13,
    letterSpacing: 0.4,
  },
  hero: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  title: {
    color: colors.paper,
    fontFamily: fonts.display,
    fontSize: 62,
    lineHeight: 58,
    textAlign: "center",
    letterSpacing: -1.1,
  },
  mutedTitle: {
    color: "rgba(255,255,255,0.6)",
    fontFamily: fonts.display,
  },
  copy: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 24,
    maxWidth: 330,
  },
  actions: {
    position: "absolute",
    bottom: 54,
    gap: 18,
  },
});
