import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../components/AppHeader";
import { HistoryBars } from "../../components/HistoryBars";
import { MetricCard } from "../../components/MetricCard";
import { ProgressBar } from "../../components/ProgressBar";
import { SectionCard } from "../../components/SectionCard";
import { COLORS } from "../../constants/theme";
import { useMission } from "../../context/MissionContext";

export default function HomeScreen() {
  const { missionName, metrics, activeAlerts, prediction } = useMission();
  const criticalAlerts = activeAlerts.filter((alert) => alert.level === "critical").length;

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionCard variant="purple">
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={styles.iconBox}>
                <Ionicons name="speedometer-outline" color={COLORS.text} size={18} />
              </View>
              <Text style={styles.sectionTitle}>Status da Missão</Text>
            </View>
            <Ionicons name="sparkles-outline" color={COLORS.yellow} size={18} />
          </View>

          <View style={styles.statusLine}>
            <Text style={styles.statusLabel}>Missão</Text>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Ativa</Text>
            </View>
          </View>
          <Text style={styles.statusValue}>{missionName}</Text>

          <View style={styles.statusInfo}>
            <View>
              <Text style={styles.statusLabel}>Tempo de Operação</Text>
              <Text style={styles.statusInfoValue}>127d 14h 32m</Text>
            </View>
            <View>
              <Text style={styles.statusLabel}>Próxima Janela</Text>
              <Text style={[styles.statusInfoValue, { color: COLORS.cyan }]}>03h 24m</Text>
            </View>
          </View>
        </SectionCard>

        <View style={styles.grid}>
          <MetricCard
            title="Estabilidade Orbital"
            value={metrics.orbitalStability.toFixed(1)}
            unit="%"
            delta="+0.3%"
            variant="green"
            icon={<Ionicons name="analytics-outline" color={COLORS.green} size={18} />}
          />
          <MetricCard
            title="Energia Solar"
            value={metrics.battery.toFixed(1)}
            unit="%"
            delta="-2.1%"
            variant={metrics.battery <= 40 ? "yellow" : "green"}
            icon={<Ionicons name="battery-half-outline" color={COLORS.yellow} size={18} />}
          />
          <MetricCard
            title="Temp. Média"
            value={metrics.internalTemperature.toFixed(1)}
            unit="°C"
            delta="+0°"
            variant={metrics.internalTemperature >= 25 ? "yellow" : "green"}
            icon={<Ionicons name="thermometer-outline" color={COLORS.cyan} size={18} />}
          />
          <MetricCard
            title="Qualidade do Sinal"
            value={metrics.signalQuality.toFixed(1)}
            unit="%"
            delta="+1.2%"
            variant="blue"
            icon={<Ionicons name="radio-outline" color={COLORS.green} size={18} />}
          />
        </View>

        <SectionCard variant={prediction.riskLevel === "Alto" ? "red" : prediction.riskLevel === "Médio" ? "yellow" : "blue"}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTitleLeft}>
              <Ionicons name="bulb-outline" color={COLORS.cyan} size={20} />
              <Text style={styles.sectionTitle}>Previsão Inteligente</Text>
            </View>
            <Text style={styles.riskBadge}>{prediction.riskLevel}</Text>
          </View>
          <Text style={styles.predictionText}>{prediction.message}</Text>
        </SectionCard>

        <SectionCard variant="red">
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Alertas Recentes</Text>
            <View style={styles.alertCountBadge}>
              <Text style={styles.alertCountText}>{activeAlerts.length} ativos</Text>
            </View>
          </View>

          {activeAlerts.length === 0 ? (
            <View style={styles.emptyAlert}>
              <Ionicons name="shield-checkmark-outline" color={COLORS.green} size={22} />
              <Text style={styles.emptyAlertText}>Nenhum alerta crítico ativo no momento.</Text>
            </View>
          ) : (
            activeAlerts.slice(0, 2).map((alert) => (
              <View key={alert.id} style={styles.alertRow}>
                <View style={[styles.alertDot, { backgroundColor: alert.level === "critical" ? COLORS.red : COLORS.yellow }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertTime}>{alert.createdAt}</Text>
                </View>
              </View>
            ))
          )}
        </SectionCard>

        <SectionCard variant="blue">
          <Text style={styles.sectionTitle}>Performance do Sistema</Text>
          <View style={{ marginTop: 14 }}>
            <ProgressBar label="CPU" value={metrics.cpu} color={COLORS.cyan} />
            <ProgressBar label="Memória" value={metrics.memory} color={COLORS.blue} />
            <ProgressBar label="Armazenamento" value={metrics.storage} color={COLORS.primaryStrong} />
          </View>
        </SectionCard>

        <SectionCard variant="purple">
          <Text style={styles.sectionTitle}>Resumo Preditivo</Text>
          <HistoryBars title="Tendência de energia" data={metrics.batteryHistory} color={metrics.battery <= 40 ? COLORS.yellow : COLORS.cyan} />
          <Text style={styles.footerNote}>
            {criticalAlerts > 0
              ? "Atenção: existem alertas críticos exigindo ação do operador."
              : "Todos os sistemas principais seguem dentro dos parâmetros operacionais."}
          </Text>
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 14, paddingBottom: 24 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitleLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBox: { width: 30, height: 30, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" },
  sectionTitle: { color: COLORS.text, fontSize: 15, fontWeight: "900" },
  statusLine: { marginTop: 18, backgroundColor: "rgba(0,0,0,0.18)", padding: 12, borderRadius: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: "700" },
  statusValue: { color: COLORS.text, fontSize: 16, fontWeight: "900", marginTop: 8 },
  activeBadge: { backgroundColor: "rgba(0,230,118,0.15)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  activeBadgeText: { color: COLORS.green, fontSize: 10, fontWeight: "900" },
  statusInfo: { marginTop: 12, gap: 10 },
  statusInfoValue: { color: "#8EA0FF", fontSize: 13, fontWeight: "900", marginTop: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  riskBadge: { color: COLORS.text, fontSize: 12, fontWeight: "900", backgroundColor: "rgba(0,0,0,0.25)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  predictionText: { color: COLORS.textSoft, marginTop: 12, fontSize: 13, lineHeight: 19 },
  alertCountBadge: { backgroundColor: "rgba(255,77,109,0.22)", paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999 },
  alertCountText: { color: COLORS.red, fontSize: 11, fontWeight: "900" },
  emptyAlert: { backgroundColor: "rgba(0,0,0,0.18)", marginTop: 12, borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "center", gap: 8 },
  emptyAlertText: { color: COLORS.textSoft, fontSize: 12, fontWeight: "700", flex: 1 },
  alertRow: { backgroundColor: "rgba(0,0,0,0.18)", borderWidth: 1, borderColor: "rgba(255,77,109,0.28)", borderRadius: 12, padding: 12, marginTop: 10, flexDirection: "row", alignItems: "center", gap: 10 },
  alertDot: { width: 8, height: 8, borderRadius: 4 },
  alertTitle: { color: COLORS.text, fontSize: 13, fontWeight: "800" },
  alertTime: { color: COLORS.textMuted, fontSize: 11, marginTop: 3 },
  footerNote: { color: COLORS.textSoft, fontSize: 12, lineHeight: 18, marginTop: 12 },
});
