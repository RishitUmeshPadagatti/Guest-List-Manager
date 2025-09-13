import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import 'react-native-reanimated';
import "../global.css"
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>['name'];
	color: string;
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function RootLayout() {
	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false,
				tabBarStyle: {
					backgroundColor: Colors[colorScheme ?? 'light'].background
				}
			}}>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="two"
				options={{
					title: 'Add',
					tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
				}}
			/>
		</Tabs>
	);
}
