import type { PropsWithChildren } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { colors } from "./theme";

export function Screen({ children }: PropsWithChildren) {
  return <SafeAreaView style={styles.screen}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ink,
  },
});
