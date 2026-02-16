import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import SectionCard from "../components/SectionCard";
import { getLastReadPage } from "../utils/storage";
import { colors, spacing } from "../utils/theme";

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Noor Mushaf</Text>
          <Text style={styles.subtitle}>Hafezi Quran Reading</Text>
        </View>
        <SectionCard
          title="All Para"
          subtitle="Browse 30 Juz"
          onPress={() => router.push("/para")}
        />
        <SectionCard
          title="All Sura"
          subtitle="Browse 114 Suras"
          onPress={() => router.push("/sura")}
        />
        <SectionCard
          title="Bookmarks"
          subtitle="Saved pages"
          onPress={() => router.push("/bookmarks")}
        />
        <SectionCard
          title="Last Read"
          subtitle={`Continue from page ${lastReadPage}`}
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
          onPress={() => setIsJumpOpen(true)}
        />
      </ScrollView>
      <Modal
        animationType="slide"
        transparent
        visible={isJumpOpen}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 15,
    color: colors.muted,
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
  pressed: {
    opacity: 0.85,
  },
});
