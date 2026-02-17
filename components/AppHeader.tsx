import { Ionicons } from "@expo/vector-icons";
import type {
  NativeStackHeaderProps,
  NativeStackHeaderRightProps,
} from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { borderRadius, colors, shadows, spacing } from "../utils/theme";

export default function AppHeader(props: NativeStackHeaderProps) {
  const { navigation, options, back } = props;
  const insets = useSafeAreaInsets();
  const title = options.title ?? "";
  const headerRightProps: NativeStackHeaderRightProps = {
    tintColor: colors.primary,
    canGoBack: Boolean(back),
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <View style={styles.left}>
          {back ? (
            <Pressable
              onPress={navigation.goBack}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
            </Pressable>
          ) : null}
        </View>
        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View style={styles.right}>
          {options.headerRight?.(headerRightProps)}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    ...shadows.sm,
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
    alignItems: "flex-end",
    justifyContent: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
});
