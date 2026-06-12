import { Link } from "expo-router";
import { canUnlockDigitalFile, demoArtworks, demoOrders } from "@artisans/shared";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../src/Screen";
import { colors } from "../../src/theme";

export default function BuyerDashboardScreen() {
  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.content}
        data={demoOrders}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.title}>buyer dashboard</Text>}
        renderItem={({ item }) => {
          const artwork = demoArtworks.find((entry) => entry.id === item.artworkId);
          const unlocked = canUnlockDigitalFile({
            orderType: item.orderType,
            orderStatus: item.status,
            paymentStatus: item.paymentStatus,
          });

          return (
            <Link href={`/orders/${item.id}`} style={styles.card}>
              <Text style={styles.cardTitle}>{artwork?.title}</Text>
              <Text style={styles.meta}>{item.totalUsdc} USDC · {item.paymentStatus}</Text>
              <Text style={styles.meta}>{unlocked ? "digital file unlocked" : "waiting for confirmed payment"}</Text>
            </Link>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 32, gap: 16 },
  title: { color: colors.paper, fontSize: 58, fontWeight: "900", lineHeight: 60, marginTop: 20, marginBottom: 8 },
  card: { overflow: "hidden", borderRadius: 8, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel, padding: 16, marginBottom: 14 },
  cardTitle: { color: colors.paper, fontSize: 28, fontWeight: "900" },
  meta: { color: colors.muted, fontWeight: "800", marginTop: 8 },
});
