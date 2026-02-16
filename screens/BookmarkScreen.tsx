import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import ListItem from "../components/ListItem";
import { getBookmarks } from "../utils/storage";
import { colors, spacing } from "../utils/theme";

export default function BookmarkScreen() {
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
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.list}
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
            <Text style={styles.title}>Bookmarks</Text>
            <Text style={styles.subtitle}>Saved pages for quick access</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No bookmarks yet.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 14,
    color: colors.muted,
  },
  empty: {
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
  },
});
