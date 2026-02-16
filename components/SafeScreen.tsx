import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../utils/theme";

type SafeScreenProps = {
  children: React.ReactNode;
  withTopInset?: boolean;
};

export default function SafeScreen({
  children,
  withTopInset = false,
}: SafeScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: withTopInset ? insets.top : 0,
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      {children}
    </View>
  );
}
