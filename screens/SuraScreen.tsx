import { router } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import DetailedListItem from "../components/DetailedListItem";
import SafeScreen from "../components/SafeScreen";
import { useAppContext } from "../contexts/AppContext";
import { suraList } from "../data/suraList";
import { getTranslation } from "../utils/languages";
import { spacing } from "../utils/theme";

export default function SuraScreen() {
  const { themeColors, currentLanguage } = useAppContext();
  return (
    <SafeScreen>
      <FlatList
        contentContainerStyle={[
          styles.list,
          { backgroundColor: themeColors.background },
        ]}
        data={suraList}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <DetailedListItem
            icon="list-outline"
            title={`${item.id}. ${item.name} - ${item.nameArabic}`}
            subtitle={item.meaning}
            info1={`${item.ayahs} Ayahs`}
            info2={item.revelationType}
            badge={`${item.startPage}`}
            onPress={() =>
              router.push({
                pathname: "/reader",
                params: { startPage: item.startPage },
              })
            }
          />
        )}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={[styles.title, { color: themeColors.text }]}>
              {getTranslation("allSura", currentLanguage)}
            </Text>
            <Text
              style={[styles.subtitle, { color: themeColors.textSecondary }]}
            >
              {getTranslation("allSuraDesc", currentLanguage)}
            </Text>
          </View>
        )}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 14,
  },
});
