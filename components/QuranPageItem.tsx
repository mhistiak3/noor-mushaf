import { memo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { QuranPage } from "../data/quranPages";
import { colors, spacing } from "../utils/theme";

const PAGE_HEADER_HEIGHT = 44;

type QuranPageItemProps = {
  page: QuranPage;
  isBookmarked: boolean;
  onToggleBookmark: (pageId: number) => void;
  imageHeight: number;
  imageBackground?: string;
  imageOpacity?: number;
};

function QuranPageItem({
  page,
  isBookmarked,
  onToggleBookmark,
  imageHeight,
  imageBackground,
  imageOpacity,
}: QuranPageItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageText}>Page {page.id}</Text>
        <Pressable
          onPress={() => onToggleBookmark(page.id)}
          style={({ pressed }) => [styles.bookmark, pressed && styles.pressed]}
        >
          <Text
            style={[styles.bookmarkText, isBookmarked && styles.bookmarkActive]}
          >
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Text>
        </Pressable>
      </View>
      <Image
        source={page.image}
        style={[
          styles.image,
          {
            height: imageHeight,
            backgroundColor: imageBackground,
            opacity: imageOpacity,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

export default memo(QuranPageItem);

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    height: PAGE_HEADER_HEIGHT,
  },
  pageText: {
    color: colors.primary,
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  bookmark: {
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
  },
  pressed: {
    opacity: 0.85,
  },
  bookmarkText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "600",
  },
  bookmarkActive: {
    color: colors.text,
  },
  image: {
    width: "100%",
    backgroundColor: "#ffffff",
  },
});
