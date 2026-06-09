import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../components/AppHeader";
import { SectionCard } from "../../components/SectionCard";
import { COLORS } from "../../constants/theme";
import { useMission } from "../../context/MissionContext";
import { Thresholds } from "../../types/mission";

type FormState = {
  criticalTemperature: string;
  criticalBattery: string;
  minSignal: string;
};

type FormErrors = Partial<Record<keyof Thresholds, string>>;

export default function SettingsScreen() {
  const {
    missionName,
    systemVersion,
    lastUpdate,
    shipId,
    thresholds,
    notifications,
    updateThresholds,
    updateNotifications,
    resetSettings,
  } = useMission();

  const [form, setForm] = useState<FormState>({
    criticalTemperature: String(thresholds.criticalTemperature),
    criticalBattery: String(thresholds.criticalBattery),
    minSignal: String(thresholds.minSignal),
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setForm({
      criticalTemperature: String(thresholds.criticalTemperature),
      criticalBattery: String(thresholds.criticalBattery),
      minSignal: String(thresholds.minSignal),
    });
  }, [thresholds]);

  function updateField(field: keyof FormState, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function validate() {
    const parsed: Thresholds = {
      criticalTemperature: Number(form.criticalTemperature),
      criticalBattery: Number(form.criticalBattery),
      minSignal: Number(form.minSignal),
    };

    const newErrors: FormErrors = {};

    if (Number.isNaN(parsed.criticalTemperature)) {
      newErrors.criticalTemperature = "Digite um número válido.";
    } else if (parsed.criticalTemperature < 18 || parsed.criticalTemperature > 40) {
      newErrors.criticalTemperature = "Use um valor entre 18 e 40.";
    }

    if (Number.isNaN(parsed.criticalBattery)) {
      newErrors.criticalBattery = "Digite um número válido.";
    } else if (parsed.criticalBattery < 10 || parsed.criticalBattery > 90) {
      newErrors.criticalBattery = "Use um valor entre 10 e 90.";
    }

    if (Number.isNaN(parsed.minSignal)) {
      newErrors.minSignal = "Digite um número válido.";
    } else if (parsed.minSignal < 10 || parsed.minSignal > 95) {
      newErrors.minSignal = "Use um valor entre 10 e 95.";
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, parsed };
  }

  async function handleSave() {
    const result = validate();
    if (!result.isValid) return;

    await updateThresholds(result.parsed);
    Alert.alert("Configurações salvas", "Os limiares de alerta foram atualizados.");
  }

  async function handleReset() {
    await resetSettings();
    Alert.alert("Configurações restauradas", "Os parâmetros padrão foram aplicados.");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Configurações</Text>
          <Text style={styles.subtitle}>Ajuste os parâmetros do sistema.</Text>

          <SectionCard variant="purple">
            <View style={styles.titleWithIcon}>
              <Ionicons name="options-outline" color={COLORS.primaryStrong} size={18} />
              <Text style={styles.cardTitle}>Limiares de Alerta</Text>
            </View>

            <Input
              label="Temperatura Crítica (°C)"
              icon="thermometer-outline"
              value={form.criticalTemperature}
              onChangeText={(value) => updateField("criticalTemperature", value)}
              helper="Alerta será gerado quando temperatura ultrapassar este valor."
              error={errors.criticalTemperature}
            />

            <Input
              label="Bateria Crítica (%)"
              icon="battery-dead-outline"
              value={form.criticalBattery}
              onChangeText={(value) => updateField("criticalBattery", value)}
              helper="Alerta será gerado quando bateria ficar abaixo deste valor."
              error={errors.criticalBattery}
            />

            <Input
              label="Sinal Mínimo (%)"
              icon="radio-outline"
              value={form.minSignal}
              onChangeText={(value) => updateField("minSignal", value)}
              helper="Alerta será gerado quando qualidade do sinal ficar abaixo deste valor."
              error={errors.minSignal}
            />
          </SectionCard>

          <SectionCard variant="blue">
            <View style={styles.titleWithIcon}>
              <Ionicons name="notifications-outline" color={COLORS.blue} size={18} />
              <Text style={styles.cardTitle}>Notificações</Text>
            </View>

            <ToggleRow
              title="Alertas Críticos"
              subtitle="Prioridade máxima"
              value={notifications.critical}
              onValueChange={(value) => updateNotifications({ ...notifications, critical: value })}
            />
            <ToggleRow
              title="Avisos"
              subtitle="Prioridade média"
              value={notifications.warning}
              onValueChange={(value) => updateNotifications({ ...notifications, warning: value })}
            />
            <ToggleRow
              title="Informações"
              subtitle="Prioridade baixa"
              value={notifications.info}
              onValueChange={(value) => updateNotifications({ ...notifications, info: value })}
            />
          </SectionCard>

          <SectionCard variant="purple">
            <Text style={styles.cardTitle}>Informações da Missão</Text>
            <InfoRow label="Nome da Missão" value={missionName} />
            <InfoRow label="Versão do Sistema" value={systemVersion} />
            <InfoRow label="Última Atualização" value={lastUpdate} />
            <InfoRow label="ID da Nave" value={shipId} />
          </SectionCard>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="save-outline" color={COLORS.text} size={18} />
            <Text style={styles.saveButtonText}>Salvar Configurações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Restaurar Padrão</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type InputProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (value: string) => void;
  helper: string;
  error?: string;
};

function Input({ label, icon, value, onChangeText, helper, error }: InputProps) {
  return (
    <View style={styles.inputGroup}>
      <View style={styles.inputLabelRow}>
        <Ionicons name={icon} color={COLORS.yellow} size={14} />
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        placeholder="Digite o valor"
        placeholderTextColor={COLORS.textSubtle}
        style={[styles.input, error ? styles.inputError : null]}
      />
      <Text style={[styles.helper, error ? styles.error : null]}>{error ?? helper}</Text>
    </View>
  );
}

type ToggleRowProps = {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

function ToggleRow({ title, subtitle, value, onValueChange }: ToggleRowProps) {
  return (
    <View style={styles.toggleRow}>
      <View>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleSubtitle}>{subtitle}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: "#4B5563", true: COLORS.green }} thumbColor={COLORS.text} />
    </View>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 14, paddingBottom: 24 },
  title: { color: COLORS.text, fontSize: 22, fontWeight: "900", marginTop: 4 },
  subtitle: { color: COLORS.textMuted, fontSize: 13, marginTop: 4, marginBottom: 14 },
  titleWithIcon: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  cardTitle: { color: COLORS.text, fontSize: 15, fontWeight: "900" },
  inputGroup: { marginTop: 14 },
  inputLabelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  inputLabel: { color: COLORS.text, fontSize: 13, fontWeight: "900" },
  input: { backgroundColor: "rgba(0,0,0,0.26)", borderWidth: 1, borderColor: COLORS.borderPurple, borderRadius: 12, color: COLORS.text, fontSize: 15, fontWeight: "800", height: 46, paddingHorizontal: 12 },
  inputError: { borderColor: COLORS.red },
  helper: { color: COLORS.textSubtle, fontSize: 11, marginTop: 6 },
  error: { color: COLORS.red },
  toggleRow: { backgroundColor: "rgba(0,0,0,0.16)", borderRadius: 12, padding: 12, marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  toggleTitle: { color: COLORS.text, fontSize: 13, fontWeight: "900" },
  toggleSubtitle: { color: COLORS.textMuted, fontSize: 11, marginTop: 3 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12, gap: 12 },
  infoLabel: { color: COLORS.textMuted, fontSize: 12, flex: 1 },
  infoValue: { color: COLORS.text, fontSize: 12, fontWeight: "900", textAlign: "right", flex: 1 },
  saveButton: { backgroundColor: COLORS.primaryStrong, borderRadius: 14, minHeight: 52, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, marginBottom: 10 },
  saveButtonText: { color: COLORS.text, fontSize: 14, fontWeight: "900" },
  resetButton: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, minHeight: 48, alignItems: "center", justifyContent: "center" },
  resetButtonText: { color: COLORS.textSoft, fontSize: 13, fontWeight: "900" },
});
