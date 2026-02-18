import { Stack } from "expo-router";
import AppHeader from "../components/AppHeader";
import UpdateChecker from "../components/UpdateChecker";
import { AppProvider } from "../contexts/AppContext";
import { colors } from "../utils/theme";

export default function RootLayout() {
  return (
    <AppProvider>
      <UpdateChecker />
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
        <Stack.Screen name="prayer-times" options={{ title: "Prayer Times" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
        <Stack.Screen name="reader" options={{ title: "Quran Reader" }} />
      </Stack>
    </AppProvider>
  );
}
