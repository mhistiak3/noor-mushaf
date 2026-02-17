import { router } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ListItem from "../components/ListItem";
import SafeScreen from "../components/SafeScreen";
import { suraList } from "../data/suraList";
import { colors, spacing } from "../utils/theme";

export default function SuraScreen() {
  return (
    <SafeScreen>
      <FlatList
        contentContainerStyle={styles.list}
        data={suraList}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ListItem
            title={`${item.id}. ${item.name}`}
            rightText={`Page ${item.startPage}`}
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
            <Text style={styles.title}>All Surahs</Text>
            <Text style={styles.subtitle}>Select a Surah to begin reading</Text>
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
