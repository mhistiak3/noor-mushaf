import { router } from "expo-router";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import ListItem from "../components/ListItem";
import { suraList } from "../data/suraList";
import { colors, spacing } from "../utils/theme";

export default function SuraScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
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
            <Text style={styles.title}>All Sura</Text>
            <Text style={styles.subtitle}>Select a Surah to begin</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 14,
    color: colors.muted,
  },
});
