import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../components/AppHeader";
import { SensorCard } from "../../components/SensorCard";
import { SectionCard } from "../../components/SectionCard";
import { COLORS } from "../../constants/theme";
import { useMission } from "../../context/MissionContext";

export default function SensorsScreen() {
  const { metrics, thresholds } = useMission();

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Sensores em Tempo Real</Text>
        <Text style={styles.subtitle}>Monitoramento contínuo dos sistemas da missão.</Text>

        <SensorCard
          title="Temperatura Externa"
          sensorId="Sensor #1"
          value={metrics.externalTemperature.toFixed(1)}
          unit="°C"
          status="Ótimo"
          data={metrics.temperatureHistory}
          icon="thermometer-outline"
        />

        <SensorCard
          title="Pressão Interna"
          sensorId="Sensor #2"
          value={metrics.pressure.toFixed(1)}
          unit="kPa"
          status="Ótimo"
          data={metrics.pressureHistory}
          icon="speedometer-outline"
        />

        <SensorCard
          title="Temperatura Interna"
          sensorId="Sensor #3"
          value={metrics.internalTemperature.toFixed(1)}
          unit="°C"
          status={metrics.internalTemperature >= thresholds.criticalTemperature ? "Atenção" : "Ótimo"}
          data={metrics.internalTemperatureHistory}
          icon="thermometer-outline"
        />

        <SensorCard
          title="Umidade"
          sensorId="Sensor #4"
          value={metrics.humidity.toFixed(1)}
          unit="%"
          status="Ótimo"
          data={metrics.humidityHistory}
          icon="water-outline"
        />

        <SensorCard
          title="Radiação"
          sensorId="Sensor #5"
          value={metrics.radiation.toFixed(1)}
          unit="rad"
          status={metrics.radiation >= 70 ? "Crítico" : metrics.radiation >= 35 ? "Atenção" : "Ótimo"}
          data={metrics.radiationHistory}
          icon="nuclear-outline"
        />

        <SensorCard
          title="Vibração Estrutural"
          sensorId="Sensor #6"
          value={metrics.vibration.toFixed(1)}
          unit="Hz"
          status={metrics.vibration >= 25 ? "Crítico" : metrics.vibration >= 15 ? "Atenção" : "Ótimo"}
          data={metrics.vibrationHistory}
          icon="pulse-outline"
        />

        <SectionCard variant="blue">
          <Text style={styles.cardTitle}>Interpretação Inteligente</Text>
          <Text style={styles.cardText}>
            O OrbitIQ cruza leituras de temperatura, pressão, radiação e vibração para detectar tendências de falha antes que elas afetem a operação da missão.
          </Text>
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
  cardTitle: { color: COLORS.text, fontSize: 15, fontWeight: "900" },
  cardText: { color: COLORS.textSoft, fontSize: 12, lineHeight: 18, marginTop: 8 },
});
