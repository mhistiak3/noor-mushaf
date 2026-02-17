import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import SafeScreen from "../components/SafeScreen";
import SectionCard from "../components/SectionCard";
import { getLastReadPage } from "../utils/storage";
import { borderRadius, colors, shadows, spacing } from "../utils/theme";

export default function HomeScreen() {
  const [lastReadPage, setLastReadPage] = useState<number>(1);
  const [isJumpOpen, setIsJumpOpen] = useState(false);
  const [jumpValue, setJumpValue] = useState("");

  const loadLastRead = useCallback(() => {
    getLastReadPage().then(setLastReadPage);
  }, []);

  useEffect(() => {
    loadLastRead();
  }, [loadLastRead]);

  useFocusEffect(
    useCallback(() => {
      loadLastRead();
    }, [loadLastRead]),
  );

  const handleJump = useCallback(() => {
    const target = Number(jumpValue);
    if (!target || Number.isNaN(target)) return;
    const nextPage = Math.max(1, target);
    setIsJumpOpen(false);
    setJumpValue("");
    router.push({ pathname: "/reader", params: { startPage: nextPage } });
  }, [jumpValue]);

  return (
    <SafeScreen withTopInset={true}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight, colors.background]}
        locations={[0, 0.3, 1]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Noor Mushaf</Text>
            <Text style={styles.subtitle}>
              Your peaceful companion for Quran
            </Text>
          </View>
          <SectionCard
            title="All Para"
            subtitle="Browse 30 Juz"
            icon="book-outline"
            onPress={() => router.push("/para")}
          />
          <SectionCard
            title="All Sura"
            subtitle="Browse 114 Suras"
            icon="list-outline"
            onPress={() => router.push("/sura")}
          />
          <SectionCard
            title="Bookmarks"
            subtitle="Saved pages"
            icon="bookmark-outline"
            onPress={() => router.push("/bookmarks")}
          />
          <SectionCard
            title="Last Read"
            subtitle={`Continue from page ${lastReadPage}`}
            icon="time-outline"
            onPress={() =>
              router.push({
                pathname: "/reader",
                params: { startPage: lastReadPage },
              })
            }
          />
          <SectionCard
            title="Go to Page"
            subtitle="Open any page by number"
            icon="arrow-forward-circle-outline"
            onPress={() => setIsJumpOpen(true)}
          />
        </ScrollView>
      </LinearGradient>
      <Modal
        animationType="fade"
        transparent
        visible={isJumpOpen}
        onRequestClose={() => setIsJumpOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Go to page</Text>
            <Text style={styles.modalSubtitle}>Enter page number (1-610)</Text>
            <TextInput
              value={jumpValue}
              onChangeText={setJumpValue}
              placeholder="Enter page number"
              placeholderTextColor={colors.mutedDark}
              keyboardType="number-pad"
              style={styles.modalInput}
              autoFocus
            />
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
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.backgroundAlt,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    color: colors.accentSoft,
    textAlign: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(13, 148, 136, 0.4)",
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    backgroundColor: colors.backgroundAlt,
    ...shadows.lg,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: spacing.md,
  },
  modalInput: {
    borderWidth: 2,
    borderRadius: borderRadius.md,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  modalButton: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  modalButtonPrimary: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.backgroundAlt,
  },
  modalButtonTextMuted: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.85,
  },
});
