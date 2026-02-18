import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppContext } from "../contexts/AppContext";
import { borderRadius, shadows, spacing } from "../utils/theme";

type ListItemProps = {
  title: string;
  rightText?: string;
  onPress: () => void;
};

export default function ListItem({ title, rightText, onPress }: ListItemProps) {
  const { themeColors } = useAppContext();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: themeColors.card },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
      {rightText ? (
        <View
          style={[styles.badge, { backgroundColor: themeColors.accentSoft }]}
        >
          <Text style={[styles.badgeText, { color: themeColors.primary }]}>
            {rightText}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.md,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
