import React, { useMemo } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useTheme } from "../../../theme";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { useTaskStore } from "../../../state/useTaskStore";
import { TimerDisplay } from "../components/TimerDisplay";
import { TimerControls } from "../components/TimerControls";
import { TaskPicker } from "../components/TaskPicker";

export function PomodoroScreen() {
  const theme = useTheme();
  const { state, start, pause, resume, reset, skip, setLinkedTask } = usePomodoroTimer();
  // Select the stable `tasks` reference and derive the filtered list with
  // useMemo — filtering inside the Zustand selector itself would return a
  // new array on every render and trigger an infinite update loop.
  const tasks = useTaskStore((s) => s.tasks);
  const pendingTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Pomodoro</Text>

      <View style={styles.timerArea}>
        <TimerDisplay phase={state.phase} secondsRemaining={state.secondsRemaining} />
        <Text style={[styles.cycleText, { color: theme.textMuted }]}>
          Ciclo {state.completedWorkCycles % state.config.cyclesBeforeLongBreak}/
          {state.config.cyclesBeforeLongBreak}
        </Text>
      </View>

      <TimerControls
        status={state.status}
        onStart={start}
        onPause={pause}
        onResume={resume}
        onReset={reset}
        onSkip={skip}
      />

      <View style={styles.pickerArea}>
        <TaskPicker
          tasks={pendingTasks}
          linkedTaskId={state.linkedTaskId}
          onSelect={setLinkedTask}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 12 },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 24 },
  timerArea: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  cycleText: { fontSize: 13 },
  pickerArea: { marginTop: 28, marginBottom: 12 },
});
