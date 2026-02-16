import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
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
  const bookmarksSet = useMemo(() => new Set(bookmarks), [bookmarks]);
  const [isNight, setIsNight] = useState(false);
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
        imageBackground={isNight ? "#f2e6d0" : "#ffffff"}
        imageOpacity={isNight ? 0.96 : 1}
      />
    ),
    [bookmarksSet, handleToggleBookmark, isNight],
  );

  return (
    <SafeScreen>
      <Stack.Screen
        options={{
          title: "Quran Reader",
          headerRight: () => (
            <Pressable
              onPress={() => setIsMenuOpen(true)}
              style={styles.menuButton}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={18}
                color={colors.text}
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
        contentContainerStyle={[styles.list, isNight && styles.listNight]}
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
      <View style={[styles.footer, isNight && styles.footerNight]}>
        <Text style={styles.footerText}>Continuous Mushaf View</Text>
      </View>
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
          <View style={styles.menuSheet}>
            <Pressable
              onPress={() => {
                setIsMenuOpen(false);
                setIsNight((value) => !value);
              }}
              style={styles.menuRow}
            >
              <Ionicons name="moon" size={16} color={colors.text} />
              <Text style={styles.menuText}>Night reading</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setIsMenuOpen(false);
                setIsJumpOpen(true);
              }}
              style={styles.menuRow}
            >
              <Ionicons name="search" size={16} color={colors.text} />
              <Text style={styles.menuText}>Go to page</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setIsMenuOpen(false);
                setIsBookmarksOpen(true);
              }}
              style={styles.menuRow}
            >
              <Ionicons name="bookmark" size={16} color={colors.text} />
              <Text style={styles.menuText}>Bookmarks</Text>
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
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Go to page</Text>
            <TextInput
              value={jumpValue}
              onChangeText={setJumpValue}
              placeholder="Enter page number"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              style={styles.modalInput}
            />
            {recentPages.length > 0 ? (
              <View style={styles.recentRow}>
                <Text style={styles.recentLabel}>Recent</Text>
                <View style={styles.recentList}>
                  {recentPages.map((page) => (
                    <Pressable
                      key={page}
                      onPress={() => handleSelectRecent(page)}
                      style={styles.recentChip}
                    >
                      <Text style={styles.recentChipText}>Page {page}</Text>
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
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.modalButtonTextMuted}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleJump}
                style={({ pressed }) => [
                  styles.modalButtonPrimary,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.modalButtonText}>Go</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent
        visible={isBookmarksOpen}
        animationType="slide"
        onRequestClose={() => setIsBookmarksOpen(false)}
      >
        <Pressable
          style={styles.sheetBackdrop}
          onPress={() => setIsBookmarksOpen(false)}
        >
          <View style={styles.sheetCard}>
            <Text style={styles.sheetTitle}>Bookmarks</Text>
            {bookmarks.length === 0 ? (
              <Text style={styles.sheetEmpty}>No bookmarks yet.</Text>
            ) : (
              <View style={styles.sheetList}>
                {bookmarks
                  .slice()
                  .sort((a, b) => a - b)
                  .map((page) => (
                    <Pressable
                      key={page}
                      onPress={() => handleSelectRecent(page)}
                      style={styles.sheetRow}
                    >
                      <Text style={styles.sheetRowText}>Page {page}</Text>
                    </Pressable>
                  ))}
              </View>
            )}
          </View>
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
  listNight: {
    backgroundColor: "#f5eedc",
  },
  footer: {
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  footerNight: {
    backgroundColor: "#f5eedc",
    borderTopColor: "#e2d4bf",
  },
  footerText: {
    fontSize: 12,
    color: colors.muted,
  },
  menuButton: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  menuBackdrop: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 8,
    paddingRight: spacing.md,
  },
  menuSheet: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    width: 180,
    marginTop: 4,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  menuText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  modalInput: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  recentRow: {
    marginTop: spacing.md,
  },
  recentLabel: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  recentList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  recentChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: colors.card,
  },
  recentChipText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "500",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  modalButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  modalButtonPrimary: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.accent,
  },
  modalButtonTextMuted: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.muted,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
  },
  sheetCard: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    maxHeight: "60%",
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sheetEmpty: {
    color: colors.muted,
    fontSize: 14,
    paddingVertical: spacing.sm,
  },
  sheetList: {
    gap: spacing.sm,
  },
  sheetRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
  },
  sheetRowText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  pressed: {
    opacity: 0.85,
  },
});
