import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewToken,
} from "react-native";
import QuranPageItem from "../components/QuranPageItem";
import SafeScreen from "../components/SafeScreen";
import { useAppContext } from "../contexts/AppContext";
import { QuranPage, quranPages } from "../data/quranPages";
import { getTranslation } from "../utils/languages";
import { getBookmarks, setBookmarks, setLastReadPage } from "../utils/storage";
import { borderRadius, shadows, spacing } from "../utils/theme";

const PAGE_ASPECT_RATIO = 0.72;
const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_HEIGHT = Math.round(SCREEN_WIDTH / PAGE_ASPECT_RATIO);
const PAGE_HEADER_HEIGHT = 44;
const ITEM_HEIGHT = IMAGE_HEIGHT + PAGE_HEADER_HEIGHT + spacing.lg;

export default function ReaderScreen() {
  const { startPage } = useLocalSearchParams<{ startPage?: string }>();
  const { themeColors, currentLanguage } = useAppContext();
  const listRef = useRef<FlatList<QuranPage>>(null);
  const [bookmarks, setBookmarkState] = useState<number[]>([]);
  const bookmarksSet = useMemo(() => new Set(bookmarks), [bookmarks]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isJumpOpen, setIsJumpOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [jumpValue, setJumpValue] = useState("");
  const [recentPages, setRecentPages] = useState<number[]>([]);

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

  const handleToggleBookmark = useCallback((pageId: number) => {
    setBookmarkState((prev) => {
      const next = prev.includes(pageId)
        ? prev.filter((item) => item !== pageId)
        : [...prev, pageId];
      setBookmarks(next);
      return next;
    });
  }, []);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 60 });
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0]?.item as QuranPage | undefined;
      if (first) {
        setLastReadPage(first.id);
        setRecentPages((prev) => {
          if (prev[0] === first.id) return prev;
          return [first.id, ...prev.filter((page) => page !== first.id)].slice(
            0,
            5,
          );
        });
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

  const handleJump = useCallback(() => {
    const target = Number(jumpValue);
    if (!target || Number.isNaN(target)) return;
    const maxPage = quranPages[quranPages.length - 1]?.id ?? 1;
    const nextPage = Math.min(Math.max(1, target), maxPage);
    const index = quranPages.findIndex((page) => page.id === nextPage);
    if (index >= 0) {
      listRef.current?.scrollToIndex({ index, animated: false });
    }
    setIsJumpOpen(false);
    setJumpValue("");
  }, [jumpValue]);

  const handleSelectRecent = useCallback((page: number) => {
    const index = quranPages.findIndex((item) => item.id === page);
    if (index >= 0) {
      listRef.current?.scrollToIndex({ index, animated: false });
    }
    setIsJumpOpen(false);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: QuranPage }) => (
      <QuranPageItem
        page={item}
        isBookmarked={bookmarksSet.has(item.id)}
        onToggleBookmark={handleToggleBookmark}
        imageHeight={IMAGE_HEIGHT}
        imageBackground={themeColors.background}
      />
    ),
    [bookmarksSet, handleToggleBookmark, themeColors],
  );

  return (
    <SafeScreen backgroundColor="#FFFFFF">
      <Stack.Screen
        options={{
          title: "Quran Reader",
          headerRight: () => (
            <Pressable
              onPress={() => setIsMenuOpen(true)}
              style={({ pressed }) => [
                styles.menuButton,
                { backgroundColor: themeColors.background },
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={20}
                color={themeColors.text}
              />
            </Pressable>
          ),
        }}
      />
      <FlatList
        ref={listRef}
        data={quranPages}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { backgroundColor: themeColors.background },
        ]}
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
      {/* <View
        style={[styles.footer, { backgroundColor: themeColors.background }]}
      >
        <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
          Continuous Mushaf View
        </Text>
      </View> */}
      <Modal
        transparent
        visible={isMenuOpen}
        animationType="fade"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <Pressable
          style={styles.menuBackdrop}
          onPress={() => setIsMenuOpen(false)}
        >
          <View
            style={[styles.menuSheet, { backgroundColor: themeColors.card }]}
          >
            <Pressable
              onPress={() => {
                setIsMenuOpen(false);
                router.push("/settings");
              }}
              style={styles.menuRow}
            >
              <Ionicons name="settings" size={16} color={themeColors.text} />
              <Text style={[styles.menuText, { color: themeColors.text }]}>
                {getTranslation("settings", currentLanguage)}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setIsMenuOpen(false);
                setIsJumpOpen(true);
              }}
              style={styles.menuRow}
            >
              <Ionicons name="search" size={16} color={themeColors.text} />
              <Text style={[styles.menuText, { color: themeColors.text }]}>
                {getTranslation("jumpToPage", currentLanguage)}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setIsMenuOpen(false);
                setIsBookmarksOpen(true);
              }}
              style={styles.menuRow}
            >
              <Ionicons name="bookmark" size={16} color={themeColors.text} />
              <Text style={[styles.menuText, { color: themeColors.text }]}>
                {getTranslation("bookmarks", currentLanguage)}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
      <Modal
        transparent
        visible={isJumpOpen}
        animationType="slide"
        onRequestClose={() => setIsJumpOpen(false)}
      >
        <Pressable
          style={styles.modalContainer}
          onPress={() => setIsJumpOpen(false)}
        >
          <Pressable
            style={[styles.modalCard, { backgroundColor: themeColors.card }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>
              {getTranslation("jumpToPage", currentLanguage)}
            </Text>
            <TextInput
              value={jumpValue}
              onChangeText={setJumpValue}
              placeholder="Enter page number"
              placeholderTextColor={themeColors.textSecondary}
              keyboardType="number-pad"
              style={[
                styles.modalInput,
                {
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.border,
                  color: themeColors.text,
                },
              ]}
            />
            {recentPages.length > 0 ? (
              <View style={styles.recentRow}>
                <Text
                  style={[
                    styles.recentLabel,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  {getTranslation("recent", currentLanguage)}
                </Text>
                <View style={styles.recentList}>
                  {recentPages.map((page) => (
                    <Pressable
                      key={page}
                      onPress={() => handleSelectRecent(page)}
                      style={[
                        styles.recentChip,
                        { backgroundColor: themeColors.primaryLight },
                      ]}
                    >
                      <Text
                        style={[
                          styles.recentChipText,
                          { color: themeColors.primary },
                        ]}
                      >
                        Page {page}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setIsJumpOpen(false)}
                style={({ pressed }) => [
                  styles.modalButton,
                  { backgroundColor: themeColors.background },
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.modalButtonTextMuted,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  {getTranslation("cancel", currentLanguage)}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleJump}
                style={({ pressed }) => [
                  styles.modalButtonPrimary,
                  { backgroundColor: themeColors.primary },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.modalButtonText, { color: "#FFFFFF" }]}>
                  {getTranslation("go", currentLanguage)}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      <Modal
        transparent
        visible={isBookmarksOpen}
        animationType="slide"
        onRequestClose={() => setIsBookmarksOpen(false)}
      >
        <Pressable
          style={styles.sheetContainer}
          onPress={() => setIsBookmarksOpen(false)}
        >
          <Pressable
            style={[styles.sheetCard, { backgroundColor: themeColors.card }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={[styles.sheetTitle, { color: themeColors.text }]}>
              {getTranslation("bookmarks", currentLanguage)}
            </Text>
            {bookmarks.length === 0 ? (
              <Text
                style={[
                  styles.sheetEmpty,
                  { color: themeColors.textSecondary },
                ]}
              >
                No bookmarks yet.
              </Text>
            ) : (
              <View style={styles.sheetList}>
                {bookmarks
                  .slice()
                  .sort((a, b) => a - b)
                  .map((page) => (
                    <Pressable
                      key={page}
                      onPress={() => handleSelectRecent(page)}
                      style={[
                        styles.sheetRow,
                        { backgroundColor: themeColors.primaryLight },
                      ]}
                    >
                      <Text
                        style={[
                          styles.sheetRowText,
                          { color: themeColors.primary },
                        ]}
                      >
                        Page {page}
                      </Text>
                    </Pressable>
                  ))}
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  listNight: {},
  footer: {
    alignItems: "center",
    paddingVertical: spacing.sm,
    ...shadows.sm,
  },
  footerNight: {},
  footerText: {
    fontSize: 12,
    fontWeight: "500",
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  menuBackdrop: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
    paddingRight: spacing.md,
  },
  menuSheet: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    width: 200,
    marginTop: 4,
    ...shadows.lg,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  menuText: {
    fontSize: 15,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  modalInput: {
    marginTop: spacing.sm,
    borderWidth: 2,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
  },
  recentRow: {
    marginTop: spacing.lg,
  },
  recentLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  recentList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  recentChip: {
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  recentChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  modalButton: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  modalButtonPrimary: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalButtonTextMuted: {
    fontSize: 16,
    fontWeight: "600",
  },
  sheetContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetCard: {
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.xl,
    maxHeight: "60%",
    ...shadows.lg,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: spacing.lg,
  },
  sheetEmpty: {
    fontSize: 15,
    paddingVertical: spacing.lg,
    textAlign: "center",
  },
  sheetList: {
    gap: spacing.sm,
  },
  sheetRow: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  sheetRowText: {
    fontSize: 15,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.8,
  },
});
