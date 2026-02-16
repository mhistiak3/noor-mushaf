import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import QuranPageItem from "../components/QuranPageItem";
import SafeScreen from "../components/SafeScreen";
import { QuranPage, quranPages } from "../data/quranPages";
import { getBookmarks, setBookmarks, setLastReadPage } from "../utils/storage";
import { colors, spacing } from "../utils/theme";

const PAGE_ASPECT_RATIO = 0.72;
const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_HEIGHT = Math.round(SCREEN_WIDTH / PAGE_ASPECT_RATIO);
const PAGE_HEADER_HEIGHT = 44;
const ITEM_HEIGHT = IMAGE_HEIGHT + PAGE_HEADER_HEIGHT + spacing.lg;

export default function ReaderScreen() {
  const { startPage } = useLocalSearchParams<{ startPage?: string }>();
  const listRef = useRef<FlatList<QuranPage>>(null);
  const [bookmarks, setBookmarkState] = useState<number[]>([]);

  const initialIndex = useMemo(() => {
    const raw = Array.isArray(startPage) ? startPage[0] : startPage;
    const parsed = Number(raw);
    if (!parsed || Number.isNaN(parsed)) return 0;
    const index = quranPages.findIndex((page) => page.id === parsed);
    return index < 0 ? 0 : index;
  }, [startPage]);

  useEffect(() => {
    getBookmarks().then(setBookmarkState);
  }, []);

  useEffect(() => {
    if (initialIndex > 0) {
      const timer = setTimeout(() => {
        listRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      }, 200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [initialIndex]);

  const handleToggleBookmark = useCallback(
    async (pageId: number) => {
      const next = bookmarks.includes(pageId)
        ? bookmarks.filter((item) => item !== pageId)
        : [...bookmarks, pageId];
      setBookmarkState(next);
      await setBookmarks(next);
    },
    [bookmarks],
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 60 });
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0]?.item as QuranPage | undefined;
      if (first) {
        setLastReadPage(first.id);
      }
    },
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<QuranPage> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  return (
    <SafeScreen>
      <FlatList
        ref={listRef}
        data={quranPages}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <QuranPageItem
            page={item}
            isBookmarked={bookmarks.includes(item.id)}
            onToggleBookmark={() => handleToggleBookmark(item.id)}
            imageHeight={IMAGE_HEIGHT}
          />
        )}
        contentContainerStyle={styles.list}
        initialScrollIndex={initialIndex}
        initialNumToRender={3}
        windowSize={5}
        removeClippedSubviews
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={({ index }) => {
          listRef.current?.scrollToIndex({ index, animated: false });
        }}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Continuous Mushaf View</Text>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  footer: {
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  footerText: {
    fontSize: 12,
    color: colors.muted,
  },
});
