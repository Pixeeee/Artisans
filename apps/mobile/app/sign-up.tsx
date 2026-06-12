import { Link } from "expo-router";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../src/Screen";
import { BrandCube } from "../src/BrandCube";
import { colors } from "../src/theme";

export default function SignUpScreen() {
  return (
    <Screen>
      <View style={styles.wrap}>
        <BrandCube size={72} />
        <Text style={styles.title}>sign up</Text>
        <TextInput placeholder="Email" placeholderTextColor="rgba(244,244,239,0.46)" style={styles.input} />
        <TextInput placeholder="Password" placeholderTextColor="rgba(244,244,239,0.46)" secureTextEntry style={styles.input} />
        <Link href="/arts" style={styles.primary}>
          create account
        </Link>
        <Link href="/log-in" style={styles.secondary}>
          already have an account
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", padding: 24, gap: 16 },
  title: { color: colors.paper, fontSize: 58, fontWeight: "900", lineHeight: 58 },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 8, padding: 14, color: colors.paper, backgroundColor: "rgba(255,255,255,0.06)" },
  primary: { overflow: "hidden", borderRadius: 24, backgroundColor: colors.orange, padding: 14, color: colors.paper, textAlign: "center", fontWeight: "900", fontSize: 18 },
  secondary: { color: colors.muted, fontWeight: "900", textAlign: "center", padding: 8 },
});
