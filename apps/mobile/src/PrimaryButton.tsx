import { Link } from "expo-router";
import type { Href } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "./theme";

export function PrimaryButton({
  href,
  children,
  variant = "orange",
}: {
  href: Href;
  children: string;
  variant?: "orange" | "light";
}) {
  return (
    <Link href={href} asChild>
      <Pressable style={[styles.button, variant === "light" ? styles.light : styles.orange]}>
        <Text style={[styles.text, variant === "light" ? styles.darkText : styles.lightText]}>{children}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    width: 224,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  orange: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  light: {
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  text: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  lightText: {
    color: colors.paper,
  },
  darkText: {
    color: colors.ink,
  },
});
