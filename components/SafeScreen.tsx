import React from "react";
import { View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../utils/theme";

type SafeScreenProps = {
  children: React.ReactNode;
  withTopInset?: boolean;
  style?: ViewStyle;
  backgroundColor?: string;
};

export default function SafeScreen({
  children,
  withTopInset = false,
  style,
  backgroundColor,
}: SafeScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        {
          paddingTop: withTopInset ? insets.top : 0,
          flex: 1,
          backgroundColor: backgroundColor || colors.background,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
