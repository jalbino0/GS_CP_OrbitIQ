import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";
import { SectionCard } from "./SectionCard";

type MetricCardProps = {
  title: string;
  value: string;
  unit?: string;
  delta?: string;
  icon?: ReactNode;
  variant?: "default" | "purple" | "blue" | "green" | "red" | "yellow";
};

export function MetricCard({ title, value, unit, delta, icon, variant = "default" }: MetricCardProps) {
  return (
    <SectionCard variant={variant} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon}
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>

      {delta ? (
        <View style={styles.deltaBadge}>
          <Text style={styles.delta}>{delta}</Text>
        </View>
      ) : null}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    minHeight: 118,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: COLORS.textSoft,
    fontSize: 12,
    fontWeight: "800",
    flex: 1,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 14,
  },
  value: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "900",
  },
  unit: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: "800",
    marginLeft: 4,
    marginBottom: 4,
  },
  deltaBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
  },
  delta: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "900",
  },
});
