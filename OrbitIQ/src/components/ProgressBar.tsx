import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";

type ProgressBarProps = {
  label: string;
  value: number;
  color?: string;
};

export function ProgressBar({ label, value, color = COLORS.cyan }: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{safeValue.toFixed(0)}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${safeValue}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  label: {
    color: COLORS.textSoft,
    fontSize: 12,
    fontWeight: "700",
  },
  value: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "900",
  },
  track: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.28)",
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
});
