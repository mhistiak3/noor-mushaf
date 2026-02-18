import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppContext } from "../contexts/AppContext";
import { borderRadius, shadows, spacing } from "../utils/theme";

type SectionCardProps = {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export default function SectionCard({
  title,
  subtitle,
  icon = "book-outline",
  onPress,
}: SectionCardProps) {
  const { themeColors } = useAppContext();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: themeColors.card },
        pressed && styles.pressed,
        shadows.md,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: themeColors.background },
        ]}
      >
        <Ionicons name={icon} size={24} color={themeColors.text} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={themeColors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
  },
});
