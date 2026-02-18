import { Ionicons } from "@expo/vector-icons";
import type {
  NativeStackHeaderProps,
  NativeStackHeaderRightProps,
} from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "../contexts/AppContext";
import { getTranslation, type Translations } from "../utils/languages";
import { borderRadius, shadows, spacing } from "../utils/theme";

const SCREEN_TITLE_MAP: Record<string, keyof Translations> = {
  para: "allPara",
  sura: "allSura",
  bookmarks: "bookmarks",
  "prayer-times": "prayerTimes",
  settings: "settings",
  reader: "quranReader",
};

export default function AppHeader(props: NativeStackHeaderProps) {
  const { navigation, options, back, route } = props;
  const { themeColors, currentLanguage } = useAppContext();
  const insets = useSafeAreaInsets();

  // Get title - use translated version if available, otherwise use options.title
  const routeName = route.name as string;
  let title = options.title ?? "";
  if (SCREEN_TITLE_MAP[routeName]) {
    title = getTranslation(SCREEN_TITLE_MAP[routeName], currentLanguage);
  }

  const headerRightProps: NativeStackHeaderRightProps = {
    tintColor: themeColors.primary,
    canGoBack: Boolean(back),
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: themeColors.card },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          {back ? (
            <Pressable
              onPress={navigation.goBack}
              style={({ pressed }) => [
                styles.backButton,
                { backgroundColor: themeColors.background },
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={themeColors.text}
              />
            </Pressable>
          ) : null}
        </View>
        <View style={styles.center}>
          <Text
            style={[styles.title, { color: themeColors.text }]}
            numberOfLines={1}
          >
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
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
});
