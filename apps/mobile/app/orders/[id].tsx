import { useLocalSearchParams } from "expo-router";
import { canShipPhysicalOrder, canUnlockDigitalFile, demoArtworks, demoMessages, demoOrders, demoShippingQuotes } from "@artisans/shared";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../../src/Screen";
import { colors } from "../../src/theme";

export default function OrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = demoOrders.find((entry) => entry.id === id);

  if (!order) {
    return (
      <Screen>
        <View style={styles.center}><Text style={styles.title}>not found</Text></View>
      </Screen>
    );
  }

  const artwork = demoArtworks.find((entry) => entry.id === order.artworkId);
  const quote = demoShippingQuotes.find((entry) => entry.orderId === order.id);
  const messages = demoMessages.filter((entry) => entry.orderId === order.id);
  const unlocked = canUnlockDigitalFile({ orderType: order.orderType, orderStatus: order.status, paymentStatus: order.paymentStatus });
  const canShip = canShipPhysicalOrder({ orderType: order.orderType, orderStatus: order.status, paymentStatus: order.paymentStatus });

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{artwork?.title}</Text>
        <View style={styles.panel}>
          <Text style={styles.label}>payment intent</Text>
          <Text style={styles.price}>{order.totalUsdc} USDC</Text>
          <Text style={styles.copy}>Network: testnet · Memo: ARTISANS:{order.id}</Text>
          <Text style={styles.copy}>Digital unlock: {unlocked ? "available" : "blocked"}</Text>
          <Text style={styles.copy}>Physical shipping: {canShip ? "allowed" : "blocked"}</Text>
          {quote ? <Text style={styles.copy}>Shipping quote: {quote.method}, {quote.amountUsdc} USDC</Text> : null}
        </View>
        <View style={styles.panel}>
          <Text style={styles.label}>conversation</Text>
          {messages.map((message) => (
            <View key={message.id} style={styles.message}>
              <Text style={styles.messageRole}>{message.senderRole}</Text>
              <Text style={styles.copy}>{message.body}</Text>
            </View>
          ))}
          <TextInput placeholder="Message artist or buyer" placeholderTextColor="rgba(244,244,239,0.46)" style={styles.input} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 36 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { color: colors.paper, fontSize: 48, fontWeight: "900", lineHeight: 50, marginTop: 20 },
  panel: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel, borderRadius: 8, padding: 16, marginTop: 18 },
  label: { color: "rgba(244,244,239,0.48)", fontWeight: "900", textTransform: "uppercase" },
  price: { color: colors.paper, fontSize: 38, fontWeight: "900", marginTop: 6 },
  copy: { color: colors.muted, fontSize: 15, lineHeight: 23, marginTop: 8 },
  message: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 8, padding: 12, marginTop: 12 },
  messageRole: { color: colors.orange, textTransform: "uppercase", fontWeight: "900", fontSize: 12 },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 24, padding: 14, color: colors.paper, backgroundColor: "rgba(0,0,0,0.24)", marginTop: 12 },
});
