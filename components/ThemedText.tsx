import { Text, TextProps } from "react-native";
import { useColorScheme } from "react-native";
import Colors from "../constants/Colors";

type ThemedTextProps = TextProps & {
  className?: string;
};

export function ThemedText({ style, ...props }: ThemedTextProps) {
  const colorScheme = useColorScheme() ?? "light";
  const color = Colors[colorScheme].text;

  return <Text style={[{ color }, style]} {...props} />;
}
