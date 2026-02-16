import { Pressable, StyleSheet, Text } from "react-native";
import { colors, spacing } from "../utils/theme";

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
      {rightText ? <Text style={styles.rightText}>{rightText}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#ffffff",
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "500",
  },
  rightText: {
    color: colors.muted,
    fontSize: 14,
  },
});
