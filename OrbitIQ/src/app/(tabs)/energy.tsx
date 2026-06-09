import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../components/AppHeader";
import { HistoryBars } from "../../components/HistoryBars";
import { ProgressBar } from "../../components/ProgressBar";
import { SectionCard } from "../../components/SectionCard";
import { COLORS } from "../../constants/theme";
import { useMission } from "../../context/MissionContext";

export default function EnergyScreen() {
  const { metrics, thresholds } = useMission();
  const autonomy = Math.max(1, (metrics.battery / Math.max(metrics.energyConsumption, 1)) * 1.9);

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Sistema de Energia</Text>
        <Text style={styles.subtitle}>Monitoramento de geração, consumo e autonomia da missão.</Text>

        <SectionCard variant={metrics.battery <= thresholds.criticalBattery ? "yellow" : "green"}>
          <View style={styles.headerRow}>
            <View style={styles.titleWithIcon}>
              <Ionicons name="battery-half-outline" color={COLORS.yellow} size={20} />
              <View>
                <Text style={styles.cardTitle}>Carga da Bateria</Text>
                <Text style={styles.cardSubtitle}>Reserva principal</Text>
              </View>
            </View>
            <Text style={styles.warningLabel}>{metrics.battery <= thresholds.criticalBattery ? "Baixa" : "Estável"}</Text>
          </View>

          <View style={styles.batteryRow}>
            <Text style={styles.batteryText}>{metrics.battery.toFixed(1)}%</Text>
            <Text style={styles.autonomy}>Tempo restante: ~{autonomy.toFixed(0)}h</Text>
          </View>

          <View style={styles.batteryTrack}>
            <View
              style={[
                styles.batteryFill,
                {
                  width: `${Math.max(metrics.battery, 4)}%`,
                  backgroundColor: metrics.battery <= thresholds.criticalBattery ? COLORS.yellow : COLORS.green,
                },
              ]}
            />
          </View>

          <View style={styles.energyInfoGrid}>
            <View style={styles.energyInfoBox}>
              <Text style={styles.boxLabel}>Entrada</Text>
              <Text style={[styles.boxValue, { color: COLORS.green }]}>+{metrics.solarInput.toFixed(1)} kW</Text>
            </View>
            <View style={styles.energyInfoBox}>
              <Text style={styles.boxLabel}>Consumo</Text>
              <Text style={[styles.boxValue, { color: COLORS.red }]}>-{metrics.energyConsumption.toFixed(1)} kW</Text>
            </View>
          </View>
        </SectionCard>

        <SectionCard variant="blue">
          <View style={styles.titleWithIcon}>
            <Ionicons name="sunny-outline" color={COLORS.cyan} size={18} />
            <Text style={styles.cardTitle}>Geração Solar 24h</Text>
          </View>
          <HistoryBars data={metrics.solarHistory} color={COLORS.cyan} />
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>00:00</Text>
            <Text style={styles.timeText}>04:00</Text>
            <Text style={styles.timeText}>08:00</Text>
            <Text style={styles.timeText}>12:00</Text>
            <Text style={styles.timeText}>16:00</Text>
          </View>
        </SectionCard>

        <SectionCard variant="purple">
          <View style={styles.titleWithIcon}>
            <Ionicons name="flash-outline" color={COLORS.primaryStrong} size={18} />
            <Text style={styles.cardTitle}>Distribuição de Consumo</Text>
          </View>

          <View style={styles.distribution}>
            <View style={styles.donut}>
              <View style={styles.donutCenter} />
            </View>
            <View style={styles.legendArea}>
              <ProgressBar label="Propulsão" value={35} color={COLORS.primaryStrong} />
              <ProgressBar label="Sistemas" value={28} color={COLORS.cyan} />
              <ProgressBar label="Comunicação" value={18} color={COLORS.green} />
              <ProgressBar label="Navegação" value={12} color={COLORS.orange} />
            </View>
          </View>
        </SectionCard>

        <SectionCard variant="green">
          <Text style={styles.cardTitle}>Status dos Painéis Solares</Text>
          <View style={{ marginTop: 14 }}>
            <ProgressBar label="Painel Solar A" value={94.2} color={COLORS.green} />
            <ProgressBar label="Painel Solar B" value={88.7} color={COLORS.green} />
            <ProgressBar label="Painel Solar C" value={62.1} color={COLORS.yellow} />
          </View>
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 14, paddingBottom: 24 },
  title: { color: COLORS.text, fontSize: 22, fontWeight: "900", marginTop: 4 },
  subtitle: { color: COLORS.textMuted, fontSize: 13, marginTop: 4, marginBottom: 14 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  titleWithIcon: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { color: COLORS.text, fontSize: 15, fontWeight: "900" },
  cardSubtitle: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  warningLabel: { color: COLORS.yellow, fontSize: 12, fontWeight: "900" },
  batteryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 18 },
  batteryText: { color: COLORS.text, fontSize: 16, fontWeight: "900" },
  autonomy: { color: COLORS.textMuted, fontSize: 12, fontWeight: "700" },
  batteryTrack: { height: 15, backgroundColor: "rgba(0,0,0,0.25)", borderRadius: 999, overflow: "hidden", marginTop: 8 },
  batteryFill: { height: "100%", borderRadius: 999 },
  energyInfoGrid: { flexDirection: "row", gap: 10, marginTop: 14 },
  energyInfoBox: { flex: 1, backgroundColor: "rgba(0,0,0,0.18)", borderRadius: 12, padding: 12 },
  boxLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: "700" },
  boxValue: { fontSize: 16, fontWeight: "900", marginTop: 4 },
  timeRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  timeText: { color: COLORS.textSubtle, fontSize: 10 },
  distribution: { marginTop: 16, flexDirection: "row", alignItems: "center", gap: 20 },
  donut: { width: 96, height: 96, borderRadius: 48, borderWidth: 18, borderTopColor: COLORS.primaryStrong, borderRightColor: COLORS.cyan, borderBottomColor: COLORS.green, borderLeftColor: COLORS.orange, alignItems: "center", justifyContent: "center" },
  donutCenter: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.cardPurple },
  legendArea: { flex: 1 },
});
