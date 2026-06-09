import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../components/AppHeader";
import { HistoryBars } from "../../components/HistoryBars";
import { ProgressBar } from "../../components/ProgressBar";
import { SectionCard } from "../../components/SectionCard";
import { COLORS } from "../../constants/theme";
import { useMission } from "../../context/MissionContext";

export default function SignalScreen() {
  const { metrics, thresholds } = useMission();

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Sistema de Comunicação</Text>
        <Text style={styles.subtitle}>Telemetria e conectividade entre nave, satélite e base Terra.</Text>

        <SectionCard variant="blue">
          <View style={styles.metricHeader}>
            <View style={styles.titleWithIcon}>
              <Ionicons name="cellular-outline" color={COLORS.blue} size={20} />
              <View>
                <Text style={styles.cardTitle}>Qualidade do Sinal</Text>
                <Text style={styles.cardSubtitle}>Média das últimas 2 horas</Text>
              </View>
            </View>
            <Text style={styles.bigValue}>{metrics.signalQuality.toFixed(1)}%</Text>
          </View>
          <HistoryBars data={metrics.signalHistory} color={metrics.signalQuality <= thresholds.minSignal ? COLORS.red : COLORS.blue} />
        </SectionCard>

        <SectionCard variant="purple">
          <View style={styles.metricHeader}>
            <View style={styles.titleWithIcon}>
              <Ionicons name="git-commit-outline" color={COLORS.primaryStrong} size={20} />
              <View>
                <Text style={styles.cardTitle}>Latência</Text>
                <Text style={styles.cardSubtitle}>Ping Terra-Nave</Text>
              </View>
            </View>
            <Text style={[styles.bigValue, { color: COLORS.primaryStrong }]}>{metrics.latency.toFixed(0)}ms</Text>
          </View>
          <HistoryBars data={metrics.latencyHistory} color={COLORS.primaryStrong} />
        </SectionCard>

        <SectionCard variant="green">
          <View style={styles.titleWithIcon}>
            <Ionicons name="radio-outline" color={COLORS.green} size={18} />
            <Text style={styles.cardTitle}>Canais de Comunicação</Text>
          </View>

          <ChannelRow name="Canal Principal" frequency="2.4 GHz" status="Ativo" bandwidth={metrics.signalQuality} color={COLORS.green} />
          <ChannelRow name="Canal Backup" frequency="5.8 GHz" status="Standby" bandwidth={92.1} color={COLORS.yellow} />
          <ChannelRow name="Canal de Emergência" frequency="8.4 GHz" status="Inativo" bandwidth={0} color={COLORS.textSubtle} />
        </SectionCard>

        <SectionCard variant="blue">
          <View style={styles.titleWithIcon}>
            <Ionicons name="git-network-outline" color={COLORS.cyan} size={18} />
            <Text style={styles.cardTitle}>Conexões Ativas</Text>
          </View>

          <ConnectionRow name="Estação Terra São Paulo" distance="384.400 km" value={87} />
          <ConnectionRow name="Satélite Relay IQ-A" distance="42.164 km" value={92} />
          <ConnectionRow name="Base Lunar Backup" distance="406.700 km" value={74} />
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

type ChannelRowProps = {
  name: string;
  frequency: string;
  status: string;
  bandwidth: number;
  color: string;
};

function ChannelRow({ name, frequency, status, bandwidth, color }: ChannelRowProps) {
  return (
    <View style={styles.channelRow}>
      <View>
        <Text style={styles.channelName}>{name}</Text>
        <Text style={styles.channelMeta}>{frequency}</Text>
      </View>
      <View style={styles.channelRight}>
        <Text style={[styles.channelStatus, { color }]}>{status}</Text>
        <Text style={styles.channelMeta}>Banda: {bandwidth.toFixed(1)}%</Text>
      </View>
    </View>
  );
}

type ConnectionRowProps = {
  name: string;
  distance: string;
  value: number;
};

function ConnectionRow({ name, distance, value }: ConnectionRowProps) {
  return (
    <View style={styles.connectionRow}>
      <View style={styles.connectionTop}>
        <View>
          <Text style={styles.channelName}>{name}</Text>
          <Text style={styles.channelMeta}>{distance}</Text>
        </View>
        <Text style={styles.signalLabel}>{value}%</Text>
      </View>
      <ProgressBar label="" value={value} color={COLORS.green} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 14, paddingBottom: 24 },
  title: { color: COLORS.text, fontSize: 22, fontWeight: "900", marginTop: 4 },
  subtitle: { color: COLORS.textMuted, fontSize: 13, marginTop: 4, marginBottom: 14 },
  metricHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  titleWithIcon: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { color: COLORS.text, fontSize: 15, fontWeight: "900" },
  cardSubtitle: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  bigValue: { color: COLORS.blue, fontSize: 22, fontWeight: "900" },
  channelRow: { backgroundColor: "rgba(0,0,0,0.16)", borderRadius: 12, padding: 12, marginTop: 10, flexDirection: "row", justifyContent: "space-between", gap: 12 },
  channelName: { color: COLORS.text, fontSize: 13, fontWeight: "900" },
  channelMeta: { color: COLORS.textMuted, fontSize: 11, marginTop: 5 },
  channelRight: { alignItems: "flex-end" },
  channelStatus: { fontSize: 11, fontWeight: "900" },
  connectionRow: { marginTop: 14 },
  connectionTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  signalLabel: { color: COLORS.green, fontSize: 12, fontWeight: "900" },
});
