import { Pressable, StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, shadows, spacing } from "../utils/theme";

type ListItemProps = {
  title: string;
  rightText?: string;
  onPress: () => void;
};

export default function ListItem({ title, rightText, onPress }: ListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Text style={styles.title}>{title}</Text>
      {rightText ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{rightText}</Text>
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
    backgroundColor: colors.card,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  badge: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.md,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
});
