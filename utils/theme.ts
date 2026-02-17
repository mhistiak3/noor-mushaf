// Color palette inspired by Hudaa landing page
export const colors = {
  // Primary gradient colors (teal to emerald)
  primary: "#0D9488", // Teal-600
  primaryDark: "#0F766E", // Teal-700
  primaryLight: "#14B8A6", // Teal-500

  // Accent colors
  accent: "#10B981", // Emerald-500
  accentDark: "#059669", // Emerald-600
  accentSoft: "#D1FAE5", // Emerald-100

  // Background colors
  background: "#F0FDFA", // Teal-50 - soft teal background
  backgroundAlt: "#FFFFFF",

  // Card colors
  card: "#FFFFFF",
  cardGradientStart: "#CCFBF1", // Teal-100
  cardGradientEnd: "#FFFFFF",

  // Text colors
  text: "#134E4A", // Teal-900 - dark teal for text
  textSecondary: "#115E59", // Teal-800
  muted: "#26655c", // Teal-700
  mutedDark: "#2DD4BF", // Teal-400

  // Border colors
  border: "#99F6E4", // Teal-200
  borderDark: "#5EEAD4", // Teal-300

  // Reader night mode
  sepia: "#F5F0E8",
  sepiaText: "#4A453C",

  // Semantic colors
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};
