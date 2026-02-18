import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppContext } from "../contexts/AppContext";
import { borderRadius, shadows, spacing } from "../utils/theme";

type DetailedListItemProps = {
  title: string;
  subtitle?: string;
  info1?: string;
  info2?: string;
  badge?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export default function DetailedListItem({
  title,
  subtitle,
  info1,
  info2,
  badge,
  icon,
  onPress,
}: DetailedListItemProps) {
  const { themeColors } = useAppContext();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: themeColors.card },
        pressed && styles.pressed,
      ]}
    >
      {icon && (
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: themeColors.primaryLight },
          ]}
        >
          <Ionicons name={icon} size={20} color={themeColors.primary} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
        {(info1 || info2) && (
          <View style={styles.infoRow}>
            {info1 && (
              <View
                style={[
                  styles.infoChip,
                  {
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.infoText,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  {info1}
                </Text>
              </View>
            )}
            {info2 && (
              <View
                style={[
                  styles.infoChip,
                  {
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.infoText,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  {info2}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
      {badge && (
        <View
          style={[styles.badge, { backgroundColor: themeColors.primaryLight }]}
        >
          <Text style={[styles.badgeText, { color: themeColors.primary }]}>
            {badge}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: "row",
    gap: spacing.xs,
    flexWrap: "wrap",
    marginTop: spacing.xs,
  },
  infoChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 11,
    fontWeight: "500",
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
