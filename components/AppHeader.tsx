import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "../utils/theme";

type HeaderProps = {
  navigation: { goBack: () => void };
  options: { title?: string };
  back?: { title?: string };
};

export default function AppHeader({ navigation, options, back }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const title = options.title ?? "";

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <View style={styles.left}>
          {back ? (
            <Pressable onPress={navigation.goBack} style={styles.backButton}>
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View style={styles.right} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    height: 56,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  left: {
    width: 80,
  },
  center: {
    flex: 1,
    alignItems: "center",
  },
  right: {
    width: 80,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  backText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
});
