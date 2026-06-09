import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
};

export function AppHeader({ title = "OrbitIQ", subtitle = "Predictive Mission Control" }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.brandArea}>
        <View style={styles.logo}>
          <Ionicons name="rocket-outline" color={COLORS.text} size={20} />
        </View>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <View style={styles.status}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>ONLINE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundSoft,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  status: {
    backgroundColor: "rgba(0, 230, 118, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(0, 230, 118, 0.35)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.green,
  },
  statusText: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: "900",
  },
});
