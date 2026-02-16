import { router } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ListItem from "../components/ListItem";
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
          <ListItem
            title={item.name}
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
            <Text style={styles.title}>All Para</Text>
            <Text style={styles.subtitle}>Select a Juz to begin</Text>
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
