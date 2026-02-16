import { Stack } from "expo-router";
import { colors } from "../utils/theme";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text, fontWeight: "600" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Noor Mushaf" }} />
      <Stack.Screen name="para" options={{ title: "All Para" }} />
      <Stack.Screen name="sura" options={{ title: "All Sura" }} />
      <Stack.Screen name="bookmarks" options={{ title: "Bookmarks" }} />
      <Stack.Screen name="reader" options={{ title: "Quran Reader" }} />
    </Stack>
  );
}
