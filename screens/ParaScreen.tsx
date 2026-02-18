import { router } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import DetailedListItem from "../components/DetailedListItem";
import SafeScreen from "../components/SafeScreen";
import { useAppContext } from "../contexts/AppContext";
import { paraList } from "../data/paraList";
import { getTranslation } from "../utils/languages";
import { spacing } from "../utils/theme";

export default function ParaScreen() {
  const { themeColors, currentLanguage } = useAppContext();
  return (
    <SafeScreen>
      <FlatList
        contentContainerStyle={[
          styles.list,
          { backgroundColor: themeColors.background },
        ]}
        data={paraList}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <DetailedListItem
            title={`${item.name} - ${item.nameArabic}`}
            subtitle={item.surahs}
            info1={`${item.totalAyahs} Ayahs`}
            badge={`Page ${item.startPage}`}
            icon="book"
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
              {getTranslation("allPara", currentLanguage)}
            </Text>
            <Text
              style={[styles.subtitle, { color: themeColors.textSecondary }]}
            >
              {getTranslation("allParaDesc", currentLanguage)}
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
