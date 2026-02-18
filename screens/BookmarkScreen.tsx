import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ListItem from "../components/ListItem";
import SafeScreen from "../components/SafeScreen";
import { useAppContext } from "../contexts/AppContext";
import { getTranslation } from "../utils/languages";
import { getBookmarks } from "../utils/storage";
import { spacing } from "../utils/theme";

export default function BookmarkScreen() {
  const { themeColors, currentLanguage } = useAppContext();
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const loadBookmarks = useCallback(() => {
    getBookmarks().then(setBookmarks);
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [loadBookmarks]),
  );

  return (
    <SafeScreen>
      <FlatList
        contentContainerStyle={[
          styles.list,
          { backgroundColor: themeColors.background, height: "100%" },
        ]}
        data={bookmarks}
        keyExtractor={(item) => String(item)}
        renderItem={({ item }) => (
          <ListItem
            title={`Page ${item}`}
            onPress={() =>
              router.push({ pathname: "/reader", params: { startPage: item } })
            }
          />
        )}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={[styles.title, { color: themeColors.text }]}>
              {getTranslation("bookmarks", currentLanguage)}
            </Text>
            <Text
              style={[styles.subtitle, { color: themeColors.textSecondary }]}
            >
              {getTranslation("savedPages", currentLanguage)}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text
              style={[styles.emptyText, { color: themeColors.textSecondary }]}
            >
              {getTranslation("noBookmarks", currentLanguage)}
            </Text>
          </View>
        )}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 14,
  },
  empty: {
    paddingVertical: spacing.xxl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
  },
});
