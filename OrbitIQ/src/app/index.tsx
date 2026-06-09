import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.logo}>
          <Ionicons name="rocket-outline" color={COLORS.text} size={42} />
        </View>

        <Text style={styles.appName}>OrbitIQ</Text>
        <Text style={styles.subtitle}>Predictive Mission Control</Text>

        <Text style={styles.description}>
          Plataforma inteligente de monitoramento preditivo para missões
          orbitais simuladas.
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="analytics-outline" color={COLORS.cyan} size={20} />
            <Text style={styles.infoText}>
              Dashboards espaciais em tempo real
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="warning-outline" color={COLORS.yellow} size={20} />
            <Text style={styles.infoText}>
              Alertas automáticos por limiares
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="save-outline" color={COLORS.green} size={20} />
            <Text style={styles.infoText}>
              Configurações salvas localmente
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() => router.replace("/dashboard")}
        >
          <Text style={styles.buttonText}>Entrar no Painel</Text>
          <Ionicons name="arrow-forward-outline" color={COLORS.text} size={20} />
        </TouchableOpacity>

        <Text style={styles.footer}>Global Solution 2026.1 — FIAP</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 94,
    height: 94,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
    borderWidth: 1,
    borderColor: COLORS.borderPurple,
  },
  appName: {
    color: COLORS.text,
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 1,
  },
  subtitle: {
    color: COLORS.cyan,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 8,
  },
  description: {
    color: COLORS.textSoft,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 18,
    maxWidth: 320,
  },
  infoCard: {
    width: "100%",
    backgroundColor: COLORS.cardPurple,
    borderWidth: 1,
    borderColor: COLORS.borderPurple,
    borderRadius: 22,
    padding: 18,
    marginTop: 30,
    gap: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    color: COLORS.textSoft,
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  button: {
    width: "100%",
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primaryStrong,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 28,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "900",
  },
  footer: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 26,
    fontWeight: "600",
  },
});