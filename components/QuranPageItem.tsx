import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAppContext } from "../contexts/AppContext";
import type { QuranPage } from "../data/quranPages";
import { spacing } from "../utils/theme";

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
  const { themeColors } = useAppContext();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.pageText, { color: themeColors.text }]}>
          Page {page.id}
        </Text>
        <Pressable
          onPress={() => onToggleBookmark(page.id)}
          style={({ pressed }) => [
            styles.bookmark,
            { borderColor: themeColors.textSecondary },
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={18}
            color={
              isBookmarked
                ? themeColors.textSecondary
                : themeColors.textSecondary
            }
          />
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
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  bookmark: {
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.85,
  },
  image: {
    width: "100%",
    backgroundColor: "#ffffff",
  },
});
