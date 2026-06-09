import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/theme";
import { MissionAlert } from "../types/mission";

type AlertItemProps = {
  alert: MissionAlert;
  onResolve?: (id: string) => void;
};

function getColor(alert: MissionAlert) {
  if (alert.level === "critical") return COLORS.red;
  if (alert.level === "warning") return COLORS.yellow;
  return COLORS.blue;
}

function getIcon(alert: MissionAlert): keyof typeof Ionicons.glyphMap {
  if (alert.category === "energy") return "battery-dead-outline";
  if (alert.category === "temperature") return "thermometer-outline";
  if (alert.category === "communication") return "radio-outline";
  return "information-circle-outline";
}

export function AlertItem({ alert, onResolve }: AlertItemProps) {
  const color = getColor(alert);

  return (
    <View style={[styles.card, { borderColor: color }]}> 
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Ionicons name={getIcon(alert)} color={color} size={20} />
          <Text style={styles.title}>{alert.title}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: `${color}22` }]}> 
          <Text style={[styles.badgeText, { color }]}>{alert.category}</Text>
        </View>
      </View>

      <Text style={styles.description}>{alert.description}</Text>
      <Text style={styles.time}>{alert.createdAt}</Text>

      {alert.status === "active" && onResolve ? (
        <TouchableOpacity style={styles.button} onPress={() => onResolve(alert.id)}>
          <Text style={styles.buttonText}>Resolver</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  titleArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "900",
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "900",
  },
  description: {
    color: COLORS.textSoft,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
  time: {
    color: COLORS.textSubtle,
    fontSize: 11,
    marginTop: 8,
  },
  button: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginTop: 8,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 12,
  },
});
