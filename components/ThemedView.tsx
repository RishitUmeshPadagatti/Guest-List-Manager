import { View, ViewProps } from "react-native";
import { useColorScheme } from "react-native";
import Colors from "../constants/Colors";

type ThemedViewProps = ViewProps & {
	className?: string;
};

export function ThemedView({ style, ...props }: ThemedViewProps) {
	const colorScheme = useColorScheme() ?? "light";
	const backgroundColor = Colors[colorScheme].background;

	return <View style={[{ backgroundColor }, style]} {...props} />;
}
