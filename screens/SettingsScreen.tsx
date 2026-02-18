import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import SafeScreen from "../components/SafeScreen";
import { useAppContext } from "../contexts/AppContext";
import {
  getTranslation,
  LanguageCode,
  type Translations,
} from "../utils/languages";
import { shadows } from "../utils/theme";
import type { ThemeName } from "../utils/themes";
import { themeLabels, themes } from "../utils/themes";

export default function SettingsScreen() {
  const {
    currentTheme,
    setCurrentTheme,
    currentLanguage,
    setCurrentLanguage,
    themeColors,
  } = useAppContext();
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(currentTheme);
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>(currentLanguage);

  useFocusEffect(
    useCallback(() => {
      setSelectedTheme(currentTheme);
      setSelectedLanguage(currentLanguage);
    }, [currentTheme, currentLanguage]),
  );

  const handleThemeChange = async (theme: ThemeName) => {
    setSelectedTheme(theme);
    await setCurrentTheme(theme);
  };

  const handleLanguageChange = async (language: LanguageCode) => {
    setSelectedLanguage(language);
    await setCurrentLanguage(language);
  };

  const t = (key: keyof Translations) => getTranslation(key, selectedLanguage);

  return (
    <SafeScreen>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: themeColors.background },
        ]}
      >
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            🎨 {t("appearance")}
          </Text>

          {/* Theme Selection */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: themeColors.text }]}>
              {t("selectTheme")}
            </Text>
            <View style={styles.themeGrid}>
              {(Object.entries(themeLabels) as [ThemeName, string][]).map(
                ([theme, label]) => (
                  <Pressable
                    key={theme}
                    onPress={() => handleThemeChange(theme)}
                    style={[
                      styles.themeOption,
                      {
                        backgroundColor: themeColors.background,
                        borderColor:
                          selectedTheme === theme
                            ? themeColors.primary
                            : themeColors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.themeSwatch,
                        { backgroundColor: themes[theme].primary },
                      ]}
                    />
                    <View style={styles.themeMeta}>
                      <Text
                        style={[
                          styles.themeLabel,
                          {
                            color: themeColors.text,
                            fontWeight: selectedTheme === theme ? "700" : "600",
                          },
                        ]}
                      >
                        {label}
                      </Text>
                      {selectedTheme === theme ? (
                        <Text
                          style={[
                            styles.themeActive,
                            { color: themeColors.text },
                          ]}
                        >
                          Active
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                ),
              )}
            </View>
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            🌍 {t("appLanguage")}
          </Text>

          <View
            style={[
              styles.card,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: themeColors.text }]}>
              {t("selectLanguage")}
            </Text>

            <View style={styles.languageOptions}>
              {/* English */}
              <Pressable
                onPress={() => handleLanguageChange("en")}
                style={[
                  styles.languageButton,
                  {
                    backgroundColor:
                      selectedLanguage === "en"
                        ? themeColors.primary
                        : themeColors.background,
                    borderColor:
                      selectedLanguage === "en"
                        ? themeColors.primary
                        : themeColors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.languageText,
                    {
                      color: themeColors.text,
                      fontWeight: selectedLanguage === "en" ? "700" : "600",
                    },
                  ]}
                >
                  {t("english")}
                </Text>
                <Text
                  style={[
                    styles.languageCheck,
                    {
                      color: themeColors.primaryLight,
                      opacity: selectedLanguage === "en" ? 1 : 0,
                    },
                  ]}
                >
                  ✓
                </Text>
              </Pressable>

              {/* Bangla */}
              <Pressable
                onPress={() => handleLanguageChange("bn")}
                style={[
                  styles.languageButton,
                  {
                    backgroundColor:
                      selectedLanguage === "bn"
                        ? themeColors.primary
                        : themeColors.background,
                    borderColor:
                      selectedLanguage === "bn"
                        ? themeColors.primary
                        : themeColors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.languageText,
                    {
                      color: themeColors.text,
                      fontWeight: selectedLanguage === "bn" ? "700" : "600",
                    },
                  ]}
                >
                  {t("bangla")}
                </Text>
                <Text
                  style={[
                    styles.languageCheck,
                    {
                      color: themeColors.primaryLight,
                      opacity: selectedLanguage === "bn" ? 1 : 0,
                    },
                  ]}
                >
                  ✓
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            ℹ️ {t("about")}
          </Text>

          <View
            style={[
              styles.card,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <View style={styles.aboutRow}>
              <Text
                style={[
                  styles.aboutLabel,
                  { color: themeColors.textSecondary },
                ]}
              >
                {t("version")}
              </Text>
              <Text style={[styles.aboutValue, { color: themeColors.text }]}>
                1.0.0
              </Text>
            </View>
            <View
              style={[styles.divider, { borderTopColor: themeColors.border }]}
            />
            <View style={styles.aboutRow}>
              <Text
                style={[
                  styles.aboutLabel,
                  { color: themeColors.textSecondary },
                ]}
              >
                App Name
              </Text>
              <Text style={[styles.aboutValue, { color: themeColors.text }]}>
                Noor Mushaf
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    ...shadows.sm,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 14,
  },
  themeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  themeOption: {
    width: "48%",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  themeSwatch: {
    width: 28,
    height: 28,
    borderRadius: 10,
  },
  themeMeta: {
    flex: 1,
    gap: 2,
  },
  themeLabel: {
    fontSize: 13,
  },
  themeActive: {
    fontSize: 11,
    fontWeight: "700",
  },
  languageOptions: {
    gap: 12,
  },
  languageButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
  },
  languageText: {
    fontSize: 16,
  },
  languageCheck: {
    fontSize: 16,
    fontWeight: "700",
  },
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  aboutLabel: {
    fontSize: 14,
  },
  aboutValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    borderTopWidth: 1,
  },
});
