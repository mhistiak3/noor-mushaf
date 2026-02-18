// 6 Beautiful color themes
export type ThemeName =
  | "ocean"
  | "forest"
  | "sunset"
  | "midnight"
  | "lavender"
  | "coral";

export type Theme = {
  primary: string;
  primaryLight: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
};

export const themes: Record<ThemeName, Theme> = {
  ocean: {
    primary: "#0066CC",
    primaryLight: "#E6F2FF",
    secondary: "#00A3E0",
    background: "#F5F9FF",
    card: "#FFFFFF",
    text: "#1A1A2E",
    textSecondary: "#666B7F",
    border: "#DFE4F0",
    success: "#10B981",
    warning: "#F59E0B",
  },
  forest: {
    primary: "#1B5E20",
    primaryLight: "#E8F5E9",
    secondary: "#4CAF50",
    background: "#F1F8F6",
    card: "#FFFFFF",
    text: "#1A1A1A",
    textSecondary: "#555555",
    border: "#D0E8E0",
    success: "#2E7D32",
    warning: "#F59E0B",
  },
  sunset: {
    primary: "#FF6B35",
    primaryLight: "#FFE5D9",
    secondary: "#FFA500",
    background: "#FFF5E6",
    card: "#FFFFFF",
    text: "#2D1B0D",
    textSecondary: "#666666",
    border: "#FFD9B3",
    success: "#10B981",
    warning: "#FF6B35",
  },
  midnight: {
    primary: "#1E1B4B",
    primaryLight: "#E0E7FF",
    secondary: "#6366F1",
    background: "#0F172A",
    card: "#1E293B",
    text: "#F1F5F9",
    textSecondary: "#CBD5E1",
    border: "#334155",
    success: "#10B981",
    warning: "#F59E0B",
  },
  lavender: {
    primary: "#7C3AED",
    primaryLight: "#F3E8FF",
    secondary: "#A855F7",
    background: "#FAF5FF",
    card: "#FFFFFF",
    text: "#2D1B4E",
    textSecondary: "#666666",
    border: "#E9D5FF",
    success: "#10B981",
    warning: "#F59E0B",
  },
  coral: {
    primary: "#EF4444",
    primaryLight: "#FEE2E2",
    secondary: "#F97316",
    background: "#FFF7ED",
    card: "#FFFFFF",
    text: "#3B0E0E",
    textSecondary: "#666666",
    border: "#FECACA",
    success: "#10B981",
    warning: "#F59E0B",
  },
};

export const themeLabels: Record<ThemeName, string> = {
  ocean: "🌊 Ocean",
  forest: "🌲 Forest",
  sunset: "🌅 Sunset",
  midnight: "🌙 Midnight",
  lavender: "💜 Lavender",
  coral: "🪸 Coral",
};
