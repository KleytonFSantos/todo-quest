import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { RootNavigator } from "./navigation/RootNavigator";
import { useTaskStore } from "../state/useTaskStore";
import { useGamificationStore } from "../state/useGamificationStore";
import { useSettingsStore } from "../state/useSettingsStore";
import { useCategoryStore } from "../state/useCategoryStore";
import { notificationService } from "../services/NotificationService";
import { useTheme } from "../theme";

/**
 * Composition root: hydrates every store from its repository once on boot,
 * then hands off to navigation. Screens never call repositories directly.
 */
export default function App() {
  const [ready, setReady] = useState(false);
  const theme = useTheme();

  const hydrateTasks = useTaskStore((s) => s.hydrate);
  const hydrateGamification = useGamificationStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const hydrateCategories = useCategoryStore((s) => s.hydrate);

  useEffect(() => {
    async function bootstrap() {
      await Promise.all([
        hydrateTasks(),
        hydrateGamification(),
        hydrateSettings(),
        hydrateCategories(),
      ]);
      await notificationService.requestPermissions();
      setReady(true);
    }
    void bootstrap();
  }, [hydrateTasks, hydrateGamification, hydrateSettings, hydrateCategories]);

  if (!ready) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <RootNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
});
