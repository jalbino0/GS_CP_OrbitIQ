import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertItem } from "../../components/AlertItem";
import { AppHeader } from "../../components/AppHeader";
import { SectionCard } from "../../components/SectionCard";
import { COLORS } from "../../constants/theme";
import { useMission } from "../../context/MissionContext";

export default function AlertsScreen() {
  const { activeAlerts, pendingAlerts, resolvedAlerts, resolveAlert } = useMission();

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Central de Alertas</Text>
        <Text style={styles.subtitle}>Monitoramento de eventos do sistema.</Text>

        <View style={styles.summaryGrid}>
          <SummaryCard label="Ativos" value={activeAlerts.length} variant="red" />
          <SummaryCard label="Pendentes" value={pendingAlerts.length} variant="yellow" />
          <SummaryCard label="Resolvidos" value={resolvedAlerts.length} variant="green" />
        </View>

        <View style={styles.sectionHeader}>
          <Ionicons name="time-outline" color={COLORS.textSoft} size={16} />
          <Text style={styles.sectionTitle}>Alertas Ativos</Text>
        </View>

        {activeAlerts.length === 0 ? (
          <SectionCard variant="green">
            <Text style={styles.emptyTitle}>Nenhum alerta ativo</Text>
            <Text style={styles.emptyText}>Todos os sistemas estão dentro dos limites configurados.</Text>
          </SectionCard>
        ) : (
          activeAlerts.map((alert) => <AlertItem key={alert.id} alert={alert} onResolve={resolveAlert} />)
        )}

        <Text style={styles.groupTitle}>Alertas Pendentes</Text>
        {pendingAlerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}

        <Text style={styles.groupTitle}>Recentemente Resolvidos</Text>
        {resolvedAlerts.slice(0, 4).map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

type SummaryCardProps = {
  label: string;
  value: number;
  variant: "red" | "yellow" | "green";
};

function SummaryCard({ label, value, variant }: SummaryCardProps) {
  const color = variant === "red" ? COLORS.red : variant === "yellow" ? COLORS.yellow : COLORS.green;
  return (
    <View style={[styles.summaryCard, { borderColor: color }]}> 
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 14, paddingBottom: 24 },
  title: { color: COLORS.text, fontSize: 22, fontWeight: "900", marginTop: 4 },
  subtitle: { color: COLORS.textMuted, fontSize: 13, marginTop: 4, marginBottom: 14 },
  summaryGrid: { flexDirection: "row", gap: 10, marginBottom: 14 },
  summaryCard: { flex: 1, borderWidth: 1, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 12 },
  summaryValue: { color: COLORS.text, fontSize: 24, fontWeight: "900" },
  summaryLabel: { color: COLORS.textSoft, fontSize: 11, fontWeight: "700", marginTop: 2 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  sectionTitle: { color: COLORS.text, fontSize: 14, fontWeight: "900" },
  groupTitle: { color: COLORS.text, fontSize: 14, fontWeight: "900", marginTop: 10, marginBottom: 8 },
  emptyTitle: { color: COLORS.text, fontSize: 15, fontWeight: "900" },
  emptyText: { color: COLORS.textSoft, fontSize: 12, lineHeight: 18, marginTop: 6 },
});
