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
import PrayerTimesWidget from "../components/PrayerTimesWidget";
import SafeScreen from "../components/SafeScreen";
import SectionCard from "../components/SectionCard";
import { useAppContext } from "../contexts/AppContext";
import { getTranslation } from "../utils/languages";
import { getLastReadPage } from "../utils/storage";
import { borderRadius, shadows, spacing } from "../utils/theme";

export default function HomeScreen() {
  const { themeColors, currentLanguage } = useAppContext();
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
    <SafeScreen withTopInset={true} backgroundColor={themeColors.primary}>
      <LinearGradient
        colors={[
          themeColors.primary,
          themeColors.primaryLight,
          themeColors.background,
        ]}
        locations={[0, 0.3, 1]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <PrayerTimesWidget />
          <SectionCard
            title={getTranslation("allPara", currentLanguage)}
            subtitle={getTranslation("browseJuz", currentLanguage)}
            icon="book-outline"
            onPress={() => router.push("/para")}
          />
          <SectionCard
            title={getTranslation("allSura", currentLanguage)}
            subtitle={getTranslation("browseSuras", currentLanguage)}
            icon="list-outline"
            onPress={() => router.push("/sura")}
          />
          <SectionCard
            title={getTranslation("bookmarks", currentLanguage)}
            subtitle={getTranslation("savedPages", currentLanguage)}
            icon="bookmark-outline"
            onPress={() => router.push("/bookmarks")}
          />
          <SectionCard
            title={getTranslation("lastRead", currentLanguage)}
            subtitle={`${getTranslation("continueFrom", currentLanguage)} ${lastReadPage}`}
            icon="time-outline"
            onPress={() =>
              router.push({
                pathname: "/reader",
                params: { startPage: lastReadPage },
              })
            }
          />
          <SectionCard
            title={getTranslation("goToPage", currentLanguage)}
            subtitle={getTranslation("openAnyPage", currentLanguage)}
            icon="arrow-forward-circle-outline"
            onPress={() => setIsJumpOpen(true)}
          />
          <SectionCard
            title={getTranslation("prayerTimes", currentLanguage)}
            subtitle={getTranslation("fullSchedule", currentLanguage)}
            icon="sunny-outline"
            onPress={() => router.push("/prayer-times")}
          />
          <SectionCard
            title={getTranslation("settings", currentLanguage)}
            subtitle="Theme & Language"
            icon="settings-outline"
            onPress={() => router.push("/settings")}
          />
        </ScrollView>
      </LinearGradient>
      <Modal
        animationType="fade"
        transparent
        visible={isJumpOpen}
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
              {getTranslation("goToPage", currentLanguage)}
            </Text>
            <Text
              style={[
                styles.modalSubtitle,
                { color: themeColors.textSecondary },
              ]}
            >
              Enter page number (1-610)
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
                  borderColor: themeColors.border,
                  color: themeColors.text,
                  backgroundColor: themeColors.background,
                },
              ]}
              autoFocus
            />
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
                  Cancel
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
                  Go
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
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
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.lg,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: spacing.md,
  },
  modalInput: {
    borderWidth: 2,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
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
  pressed: {
    opacity: 0.85,
  },
});
