import { Ionicons } from "@expo/vector-icons";
import type {
  NativeStackHeaderProps,
  NativeStackHeaderRightProps,
} from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "../utils/theme";

export default function AppHeader(props: NativeStackHeaderProps) {
  const { navigation, options, back } = props;
  const insets = useSafeAreaInsets();
  const title = options.title ?? "";
  const headerRightProps: NativeStackHeaderRightProps = {
    tintColor: colors.text,
    canGoBack: Boolean(back),
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <View style={styles.left}>
          {back ? (
            <Pressable onPress={navigation.goBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={22} color={colors.accent} />
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
    alignItems: "flex-end",
    justifyContent: "center",
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
});
