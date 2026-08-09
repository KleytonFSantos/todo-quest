import { useColorScheme } from "react-native";
import { palette } from "./colors";

export interface Theme {
  isDark: boolean;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryDark: string;
  success: string;
  warning: string;
  danger: string;
}

/**
 * Single hook every screen/component pulls colors from. Keeps light/dark
 * logic in one place instead of scattered `useColorScheme() === 'dark'`
 * checks across the codebase.
 */
export function useTheme(): Theme {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const mode = isDark ? "dark" : "light";

  return {
    isDark,
    background: palette.background[mode],
    surface: palette.surface[mode],
    surfaceAlt: palette.surfaceAlt[mode],
    text: palette.text[mode],
    textMuted: palette.textMuted[mode],
    border: palette.border[mode],
    primary: palette.primary,
    primaryDark: palette.primaryDark,
    success: palette.success,
    warning: palette.warning,
    danger: palette.danger,
  };
}

export { palette };
