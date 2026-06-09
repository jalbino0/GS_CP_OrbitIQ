import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";
import { HistoryBars } from "./HistoryBars";

type SensorCardProps = {
  title: string;
  sensorId: string;
  value: string;
  unit: string;
  status: "Ótimo" | "Atenção" | "Crítico";
  data: number[];
  icon: keyof typeof Ionicons.glyphMap;
};

function getStatusColor(status: SensorCardProps["status"]) {
  if (status === "Crítico") return COLORS.red;
  if (status === "Atenção") return COLORS.yellow;
  return COLORS.green;
}

export function SensorCard({ title, sensorId, value, unit, status, data, icon }: SensorCardProps) {
  const color = getStatusColor(status);

  return (
    <View style={[styles.card, { borderColor: color }]}> 
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <View style={[styles.iconBox, { borderColor: color }]}>
            <Ionicons name={icon} color={color} size={18} />
          </View>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.sensorId}>{sensorId}</Text>
          </View>
        </View>
        <View style={[styles.badge, { borderColor: color, backgroundColor: `${color}22` }]}> 
          <Text style={[styles.badgeText, { color }]}>{status}</Text>
        </View>
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>

      <HistoryBars data={data} color={color} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Última leitura: há 2s</Text>
        <Text style={styles.footerText}>Atualização automática</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardGreen,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  titleArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.22)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "900",
  },
  sensorId: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "900",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 18,
  },
  value: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "900",
  },
  unit: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: "900",
    marginLeft: 5,
    marginBottom: 6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 9,
  },
  footerText: {
    color: COLORS.textSubtle,
    fontSize: 10,
    fontWeight: "700",
  },
});
