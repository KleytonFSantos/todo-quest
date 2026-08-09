import React from "react";
import { Text } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "../../theme";
import { RootTabParamList } from "./types";
import { TasksScreen } from "../../features/tasks/screens/TasksScreen";
import { PomodoroScreen } from "../../features/pomodoro/screens/PomodoroScreen";
import { ReportScreen } from "../../features/reports/screens/ReportScreen";
import { ProgressScreen } from "../../features/gamification/screens/ProgressScreen";
import { SettingsScreen } from "../../features/settings/screens/SettingsScreen";

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICON: Record<keyof RootTabParamList, string> = {
  Tasks: "📋",
  Pomodoro: "🍅",
  Report: "📊",
  Progress: "🏆",
  Settings: "⚙️",
};

export function RootNavigator() {
  const theme = useTheme();

  const navigationTheme = {
    ...(theme.isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme.isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.background,
      card: theme.surface,
      border: theme.border,
      text: theme.text,
      primary: theme.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textMuted,
          tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.border },
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>{TAB_ICON[route.name]}</Text>,
        })}
      >
        <Tab.Screen name="Tasks" component={TasksScreen} options={{ title: "Tarefas" }} />
        <Tab.Screen name="Pomodoro" component={PomodoroScreen} options={{ title: "Pomodoro" }} />
        <Tab.Screen name="Report" component={ReportScreen} options={{ title: "Relatório" }} />
        <Tab.Screen name="Progress" component={ProgressScreen} options={{ title: "Progresso" }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: "Ajustes" }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
