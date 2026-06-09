import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";

type HistoryBarsProps = {
  title?: string;
  data: number[];
  color?: string;
};

export function HistoryBars({ title, data, color = COLORS.cyan }: HistoryBarsProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.chart}>
        {data.map((item, index) => {
          const height = 18 + ((item - min) / range) * 60;
          return (
            <View key={`${item}-${index}`} style={styles.barWrapper}>
              <View style={[styles.bar, { height, backgroundColor: color }]} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
  },
  title: {
    color: COLORS.textSoft,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 12,
  },
  chart: {
    height: 90,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 7,
  },
  barWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bar: {
    borderRadius: 8,
    opacity: 0.92,
  },
});
