import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  MissionAlert,
  MissionMetrics,
  NotificationPreferences,
  Thresholds,
} from "../types/mission";

type MissionContextData = {
  missionName: string;
  shipId: string;
  systemVersion: string;
  lastUpdate: string;
  metrics: MissionMetrics;
  thresholds: Thresholds;
  notifications: NotificationPreferences;
  alerts: MissionAlert[];
  activeAlerts: MissionAlert[];
  pendingAlerts: MissionAlert[];
  resolvedAlerts: MissionAlert[];
  prediction: {
    riskLevel: "Baixo" | "Médio" | "Alto";
    message: string;
  };
  updateThresholds: (data: Thresholds) => Promise<void>;
  updateNotifications: (data: NotificationPreferences) => Promise<void>;
  resolveAlert: (id: string) => void;
  resetSettings: () => Promise<void>;
};

const STORAGE_KEY = "@OrbitIQ:settings";

const defaultThresholds: Thresholds = {
  criticalTemperature: 25,
  criticalBattery: 40,
  minSignal: 50,
};

const defaultNotifications: NotificationPreferences = {
  critical: true,
  warning: true,
  info: false,
};

const initialMetrics: MissionMetrics = {
  externalTemperature: -39.6,
  internalTemperature: 22.8,
  pressure: 102.9,
  humidity: 46.5,
  radiation: 18.4,
  vibration: 7.2,

  battery: 38.5,
  solarInput: 2.4,
  energyConsumption: 3.8,

  signalQuality: 87.3,
  latency: 239,
  packetLoss: 2.1,

  orbitalStability: 98.2,

  cpu: 45,
  memory: 62,
  storage: 78,

  temperatureHistory: [-42, -41, -39, -40, -38, -39.6],
  pressureHistory: [101.4, 102.1, 102.5, 102.2, 102.9],
  internalTemperatureHistory: [21.9, 22.2, 22.4, 22.7, 22.8],
  humidityHistory: [43, 45, 44, 46, 46.5],
  radiationHistory: [15, 16.3, 18, 17.4, 18.4],
  vibrationHistory: [5.2, 6.1, 7, 6.8, 7.2],
  batteryHistory: [52, 49, 46, 43, 41, 38.5],
  solarHistory: [28, 34, 51, 62, 45, 24],
  signalHistory: [84, 86, 87, 85, 88, 87.3],
  latencyHistory: [210, 220, 236, 229, 240, 239],
};

const MissionContext = createContext<MissionContextData | null>(null);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function updateHistory(history: number[], value: number) {
  return [...history.slice(-9), Number(value.toFixed(1))];
}

function getTime() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function simulateMetrics(previous: MissionMetrics): MissionMetrics {
  const externalTemperature = clamp(
    previous.externalTemperature + randomBetween(-1.5, 1.5),
    -80,
    10
  );

  const internalTemperature = clamp(
    previous.internalTemperature + randomBetween(-0.7, 0.9),
    16,
    35
  );

  const pressure = clamp(previous.pressure + randomBetween(-0.8, 0.8), 95, 108);
  const humidity = clamp(previous.humidity + randomBetween(-2, 2.5), 20, 80);
  const radiation = clamp(previous.radiation + randomBetween(-1.2, 2), 5, 95);
  const vibration = clamp(previous.vibration + randomBetween(-0.8, 1.4), 1, 35);
  const battery = clamp(previous.battery + randomBetween(-1.8, 1), 8, 100);
  const solarInput = clamp(previous.solarInput + randomBetween(-0.4, 0.5), 0.4, 5);
  const energyConsumption = clamp(previous.energyConsumption + randomBetween(-0.5, 0.6), 1.8, 6);
  const signalQuality = clamp(previous.signalQuality + randomBetween(-2.4, 2.1), 18, 100);
  const latency = clamp(previous.latency + randomBetween(-18, 24), 80, 520);

  return {
    ...previous,
    externalTemperature,
    internalTemperature,
    pressure,
    humidity,
    radiation,
    vibration,
    battery,
    solarInput,
    energyConsumption,
    signalQuality,
    latency,
    packetLoss: clamp(previous.packetLoss + randomBetween(-0.3, 0.5), 0, 18),
    orbitalStability: clamp(previous.orbitalStability + randomBetween(-0.6, 0.4), 65, 100),
    cpu: clamp(previous.cpu + randomBetween(-3, 4), 18, 95),
    memory: clamp(previous.memory + randomBetween(-2, 3), 20, 96),
    storage: clamp(previous.storage + randomBetween(-0.4, 0.8), 30, 95),
    temperatureHistory: updateHistory(previous.temperatureHistory, externalTemperature),
    pressureHistory: updateHistory(previous.pressureHistory, pressure),
    internalTemperatureHistory: updateHistory(previous.internalTemperatureHistory, internalTemperature),
    humidityHistory: updateHistory(previous.humidityHistory, humidity),
    radiationHistory: updateHistory(previous.radiationHistory, radiation),
    vibrationHistory: updateHistory(previous.vibrationHistory, vibration),
    batteryHistory: updateHistory(previous.batteryHistory, battery),
    solarHistory: updateHistory(previous.solarHistory, solarInput * 20),
    signalHistory: updateHistory(previous.signalHistory, signalQuality),
    latencyHistory: updateHistory(previous.latencyHistory, latency),
  };
}

function buildAutomaticAlerts(metrics: MissionMetrics, thresholds: Thresholds): MissionAlert[] {
  const alerts: MissionAlert[] = [];
  const time = getTime();

  if (metrics.battery <= thresholds.criticalBattery) {
    alerts.push({
      id: "energy-critical",
      title: "Energia Solar Crítica",
      description: `Carga da bateria principal abaixo de ${thresholds.criticalBattery}%. Recomenda-se economia de energia.`,
      category: "energy",
      level: "critical",
      status: "active",
      createdAt: time,
    });
  }

  if (metrics.internalTemperature >= thresholds.criticalTemperature) {
    alerts.push({
      id: "temperature-critical",
      title: "Temperatura Elevada",
      description: `Temperatura interna em ${metrics.internalTemperature.toFixed(1)}°C. Verificar sistema de resfriamento.`,
      category: "temperature",
      level: "warning",
      status: "active",
      createdAt: time,
    });
  }

  if (metrics.signalQuality <= thresholds.minSignal) {
    alerts.push({
      id: "communication-critical",
      title: "Janela de Comunicação",
      description: `Qualidade do sinal abaixo de ${thresholds.minSignal}%. Verificar telemetria e canais de backup.`,
      category: "communication",
      level: "critical",
      status: "active",
      createdAt: time,
    });
  }

  return alerts;
}

function buildPrediction(metrics: MissionMetrics) {
  const energyRisk = metrics.battery < 35;
  const signalRisk = metrics.signalQuality < 55;
  const temperatureRisk = metrics.internalTemperature > 27;
  const latencyRisk = metrics.latency > 320;
  const riskPoints = [energyRisk, signalRisk, temperatureRisk, latencyRisk].filter(Boolean).length;

  if (riskPoints >= 2) {
    return {
      riskLevel: "Alto" as const,
      message: "Risco operacional alto nas próximas 2 horas. Priorize energia, temperatura e comunicação.",
    };
  }

  if (riskPoints === 1) {
    return {
      riskLevel: "Médio" as const,
      message: "Risco moderado detectado. O sistema recomenda acompanhamento dos próximos ciclos.",
    };
  }

  return {
    riskLevel: "Baixo" as const,
    message: "Operação estável. Nenhuma tendência crítica foi prevista para os próximos ciclos.",
  };
}

export function MissionProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<MissionMetrics>(initialMetrics);
  const [thresholds, setThresholds] = useState<Thresholds>(defaultThresholds);
  const [notifications, setNotifications] = useState<NotificationPreferences>(defaultNotifications);
  const [alerts, setAlerts] = useState<MissionAlert[]>([
    {
      id: "pending-update",
      title: "Atualização Pendente",
      description: "Pacote de calibração dos sensores aguardando confirmação.",
      category: "system",
      level: "warning",
      status: "pending",
      createdAt: "há 2 horas",
    },
    {
      id: "resolved-maneuver",
      title: "Manobra Concluída",
      description: "Correção orbital executada com sucesso.",
      category: "system",
      level: "info",
      status: "resolved",
      createdAt: "há 3 horas",
    },
  ]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        const parsed = JSON.parse(saved);
        if (parsed.thresholds) setThresholds(parsed.thresholds);
        if (parsed.notifications) setNotifications(parsed.notifications);
      } catch (error) {
        console.log("Erro ao carregar configurações:", error);
      }
    }

    loadSettings();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((previous) => simulateMetrics(previous));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const automaticAlerts = buildAutomaticAlerts(metrics, thresholds);
    setAlerts((previous) => {
      const ids = automaticAlerts.map((alert) => alert.id);
      const filtered = previous.filter((alert) => !ids.includes(alert.id));
      return [...automaticAlerts, ...filtered].slice(0, 20);
    });
  }, [metrics, thresholds]);

  async function saveSettings(nextThresholds: Thresholds, nextNotifications: NotificationPreferences) {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ thresholds: nextThresholds, notifications: nextNotifications })
    );
  }

  async function updateThresholds(data: Thresholds) {
    setThresholds(data);
    await saveSettings(data, notifications);
  }

  async function updateNotifications(data: NotificationPreferences) {
    setNotifications(data);
    await saveSettings(thresholds, data);
  }

  async function resetSettings() {
    setThresholds(defaultThresholds);
    setNotifications(defaultNotifications);
    await saveSettings(defaultThresholds, defaultNotifications);
  }

  function resolveAlert(id: string) {
    setAlerts((previous) =>
      previous.map((alert) =>
        alert.id === id ? { ...alert, status: "resolved", createdAt: "agora" } : alert
      )
    );
  }

  const activeAlerts = alerts.filter((alert) => alert.status === "active");
  const pendingAlerts = alerts.filter((alert) => alert.status === "pending");
  const resolvedAlerts = alerts.filter((alert) => alert.status === "resolved");
  const prediction = useMemo(() => buildPrediction(metrics), [metrics]);

  return (
    <MissionContext.Provider
      value={{
        missionName: "OrbitIQ-01",
        shipId: "ORB-IQ-2026-001",
        systemVersion: "v2.8.3",
        lastUpdate: "08/06/2026",
        metrics,
        thresholds,
        notifications,
        alerts,
        activeAlerts,
        pendingAlerts,
        resolvedAlerts,
        prediction,
        updateThresholds,
        updateNotifications,
        resolveAlert,
        resetSettings,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error("useMission precisa estar dentro de MissionProvider");
  }
  return context;
}
