import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import SectionCard from "../components/SectionCard";
import { getLastReadPage } from "../utils/storage";
import { colors, spacing } from "../utils/theme";

export default function HomeScreen() {
  const [lastReadPage, setLastReadPage] = useState<number>(1);

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
      </ScrollView>
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
});
