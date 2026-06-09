export type AlertStatus = "active" | "pending" | "resolved";
export type AlertLevel = "info" | "warning" | "critical";
export type AlertCategory = "energy" | "temperature" | "communication" | "system";

export type MissionAlert = {
  id: string;
  title: string;
  description: string;
  category: AlertCategory;
  level: AlertLevel;
  status: AlertStatus;
  createdAt: string;
};

export type Thresholds = {
  criticalTemperature: number;
  criticalBattery: number;
  minSignal: number;
};

export type NotificationPreferences = {
  critical: boolean;
  warning: boolean;
  info: boolean;
};

export type MissionMetrics = {
  externalTemperature: number;
  internalTemperature: number;
  pressure: number;
  humidity: number;
  radiation: number;
  vibration: number;

  battery: number;
  solarInput: number;
  energyConsumption: number;

  signalQuality: number;
  latency: number;
  packetLoss: number;

  orbitalStability: number;

  cpu: number;
  memory: number;
  storage: number;

  temperatureHistory: number[];
  pressureHistory: number[];
  internalTemperatureHistory: number[];
  humidityHistory: number[];
  radiationHistory: number[];
  vibrationHistory: number[];
  batteryHistory: number[];
  solarHistory: number[];
  signalHistory: number[];
  latencyHistory: number[];
};
