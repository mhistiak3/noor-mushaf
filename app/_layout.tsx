import { Stack } from "expo-router";
import AppHeader from "../components/AppHeader";
import { colors } from "../utils/theme";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <AppHeader {...props} />,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Noor Mushaf", headerShown: false }}
      />
      <Stack.Screen name="para" options={{ title: "All Para" }} />
      <Stack.Screen name="sura" options={{ title: "All Sura" }} />
      <Stack.Screen name="bookmarks" options={{ title: "Bookmarks" }} />
      <Stack.Screen name="reader" options={{ title: "Quran Reader" }} />
    </Stack>
  );
}
