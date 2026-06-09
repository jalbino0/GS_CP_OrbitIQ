import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MissionProvider } from "../context/MissionContext";

export default function RootLayout() {
  return (
    <MissionProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </MissionProvider>
  );
}