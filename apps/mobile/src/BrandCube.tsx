import { Image, StyleSheet } from "react-native";

export function BrandCube({ size = 112 }: { size?: number }) {
  return <Image accessibilityLabel="ArtisanS icon" source={require("../assets/icons/icon.png")} style={[styles.icon, { height: size, width: size }]} />;
}

const styles = StyleSheet.create({
  icon: {
    resizeMode: "contain",
    tintColor: "#f54733",
  },
});
