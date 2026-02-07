import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

const themes = {
  light: {
    background: "#ffffff",
    card: "#ffffff",
    text: "#111827",
    subText: "#6B7280",
    border: "#E5E7EB",
    green: "#16A34A",
  },
  dark: {
    background: "#020617",
    card: "#020617",
    text: "#F9FAFB",
    subText: "#9CA3AF",
    border: "#1F2937",
    green: "#22C55E",
  },
};

const ThemeContext = createContext(themes.light);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
