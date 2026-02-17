import { router } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import DetailedListItem from "../components/DetailedListItem";
import SafeScreen from "../components/SafeScreen";
import { paraList } from "../data/paraList";
import { colors, spacing } from "../utils/theme";

export default function ParaScreen() {
  return (
    <SafeScreen>
      <FlatList
        contentContainerStyle={styles.list}
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
            <Text style={styles.title}>All Para (Juz)</Text>
            <Text style={styles.subtitle}>
              30 divisions of the Quran for easy reading
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
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
