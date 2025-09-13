import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { addGuest, deleteGuest, getAllGuests } from '@/utils/asyncStorage';
import { guestInterface } from '@/constants/interfaces';
import {
	FlatList,
	TextInput,
	TouchableOpacity,
	RefreshControl,
	Alert,
	View,
	Text,
	ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useMemo } from 'react';

type FilterType = 'all' | 'Male' | 'Female' | 'yes' | 'no' | 'maybe';

export default function TabOneScreen() {
	const [guests, setGuests] = useState<guestInterface[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [filter, setFilter] = useState<FilterType>('all');
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);

	const loadGuests = async () => {
		try {
			const allGuests = await getAllGuests();
			setGuests(allGuests);
		} catch (error) {
			console.error('Error loading guests:', error);
			Alert.alert('Error', 'Failed to load guests');
		} finally {
			setLoading(false);
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await loadGuests();
		setRefreshing(false);
	};

	const handleDeleteGuest = async (id: number, name: string) => {
		Alert.alert(
			'Delete Guest',
			`Are you sure you want to delete ${name}?`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						try {
							await deleteGuest(id);
							await loadGuests(); // Reload the list
							Alert.alert('Success', 'Guest deleted successfully');
						} catch (error) {
							console.error('Error deleting guest:', error);
							Alert.alert('Error', 'Failed to delete guest');
						}
					}
				}
			]
		);
	};

	// Filter and search logic
	const filteredGuests = useMemo(() => {
		let filtered = guests;

		// Apply search filter
		if (searchQuery.trim()) {
			filtered = filtered.filter(guest =>
				guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				guest.phone.toString().includes(searchQuery)
			);
		}

		// Apply category filter
		if (filter !== 'all') {
			if (filter === 'Male' || filter === 'Female') {
				filtered = filtered.filter(guest => guest.gender === filter);
			} else if (['yes', 'no', 'maybe'].includes(filter)) {
				filtered = filtered.filter(guest => guest.rsvp === filter);
			}
		}

		return filtered;
	}, [guests, searchQuery, filter]);

	// Calculate guest statistics
	const guestStats = useMemo(() => {
		const totalGuests = guests.length;
		const comingGuests = guests.filter(guest => guest.rsvp === 'yes').length;
		const notComingGuests = guests.filter(guest => guest.rsvp === 'no').length;
		const maybeGuests = guests.filter(guest => guest.rsvp === 'maybe').length;

		return {
			total: totalGuests,
			coming: comingGuests,
			notComing: notComingGuests,
			maybe: maybeGuests
		};
	}, [guests]);

	useEffect(() => {
		loadGuests();
	}, []);

	const renderGuestItem = ({ item }: { item: guestInterface }) => (
		<View className='bg-white dark:bg-gray-800 p-4 m-2 rounded-lg border border-gray-200 dark:border-gray-700'>
			<View className='flex-row justify-between items-start'>
				<View className='flex-1'>
					<ThemedText className='text-lg font-semibold mb-1'>{item.name}</ThemedText>
					<ThemedText className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
						Gender: {item.gender}
					</ThemedText>
					<ThemedText className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
						Phone: {item.phone}
					</ThemedText>
					<View className='flex-row items-center'>
						<ThemedText className='text-sm text-gray-600 dark:text-gray-400 mr-2'>
							RSVP:
						</ThemedText>
						<View className={`px-2 py-1 rounded-full ${item.rsvp === 'yes'
								? 'bg-green-100 dark:bg-green-900'
								: item.rsvp === 'no'
									? 'bg-red-100 dark:bg-red-900'
									: 'bg-yellow-100 dark:bg-yellow-900'
							}`}>
							<Text className={`text-xs font-medium capitalize ${item.rsvp === 'yes'
									? 'text-green-800 dark:text-green-200'
									: item.rsvp === 'no'
										? 'text-red-800 dark:text-red-200'
										: 'text-yellow-800 dark:text-yellow-200'
								}`}>
								{item.rsvp}
							</Text>
						</View>
					</View>
				</View>
				<TouchableOpacity
					className='bg-red-400 px-3 py-2 rounded-lg ml-3'
					onPress={() => handleDeleteGuest(item.id, item.name)}
				>
					<Text className='text-white text-sm font-medium'>Delete</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const filterButtons: { label: string; value: FilterType }[] = [
		{ label: 'All', value: 'all' },
		{ label: 'Male', value: 'Male' },
		{ label: 'Female', value: 'Female' },
		{ label: 'Yes', value: 'yes' },
		{ label: 'No', value: 'no' },
		{ label: 'Maybe', value: 'maybe' }
	];

	if (loading) {
		return (
			<ThemedView className='flex-1'>
				<SafeAreaView className='flex-1 justify-center items-center'>
					<ThemedText>Loading guests...</ThemedText>
				</SafeAreaView>
			</ThemedView>
		);
	}

	return (
		<ThemedView className='flex-1'>
			<SafeAreaView className='flex-1'>
				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor="#007AFF"
						/>
					}
					showsVerticalScrollIndicator={false}
				>
					<View className='p-4'>
						{/* Header with Title and Refresh Button */}
						<View className='flex-row justify-between items-center mb-4'>
							<ThemedText className='text-2xl font-bold'>Guest List</ThemedText>

						</View>

						{/* Status Container */}
						<View className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4'>
							<ThemedText className='text-lg font-semibold mb-3 text-center'>Guest Statistics</ThemedText>
							<View className='flex-row justify-around'>
								<View className='items-center'>
									<ThemedText className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
										{guestStats.total}
									</ThemedText>
									<ThemedText className='text-sm text-gray-600 dark:text-gray-400'>
										Total Registered
									</ThemedText>
								</View>
								<View className='items-center'>
									<ThemedText className='text-2xl font-bold text-green-600 dark:text-green-400'>
										{guestStats.coming}
									</ThemedText>
									<ThemedText className='text-sm text-gray-600 dark:text-gray-400'>
										Coming
									</ThemedText>
								</View>
								<View className='items-center'>
									<ThemedText className='text-2xl font-bold text-red-600 dark:text-red-400'>
										{guestStats.notComing}
									</ThemedText>
									<ThemedText className='text-sm text-gray-600 dark:text-gray-400'>
										Not Coming
									</ThemedText>
								</View>
								<View className='items-center'>
									<ThemedText className='text-2xl font-bold text-yellow-600 dark:text-yellow-400'>
										{guestStats.maybe}
									</ThemedText>
									<ThemedText className='text-sm text-gray-600 dark:text-gray-400'>
										Maybe
									</ThemedText>
								</View>
							</View>
						</View>

						{/* Search Bar */}
						<TextInput
							className='border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4'
							placeholder='Search by name or phone...'
							placeholderTextColor='#9CA3AF'
							value={searchQuery}
							onChangeText={setSearchQuery}
						/>

						{/* Filter Buttons - Horizontally Scrollable */}
						<View className='mb-4'>
							<ThemedText className='text-base font-medium mb-2'>Filter by:</ThemedText>
							<ScrollView
								horizontal
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={{ paddingRight: 16 }}
							>
								<View className='flex-row gap-2'>
									{filterButtons.map((button) => (
										<TouchableOpacity
											key={button.value}
											className={`px-4 py-2 rounded-lg border ${filter === button.value
													? 'bg-blue-500 border-blue-500'
													: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
												}`}
											onPress={() => setFilter(button.value)}
										>
											<Text className={`text-sm font-medium ${filter === button.value
													? 'text-white'
													: 'text-gray-900 dark:text-gray-100'
												}`}>
												{button.label}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							</ScrollView>
						</View>

						{/* Results Count */}
						<ThemedText className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
							{filteredGuests.length} guest{filteredGuests.length !== 1 ? 's' : ''} found
						</ThemedText>
					</View>

					{/* Guest List */}
					<View>
						{filteredGuests.length > 0 ? (
							filteredGuests.map((item) => (
								<View key={item.id} className='bg-white dark:bg-gray-800 p-4 m-2 rounded-lg border border-gray-200 dark:border-gray-700'>
									<View className='flex-row justify-between items-start'>
										<View className='flex-1'>
											<ThemedText className='text-lg font-semibold mb-1'>{item.name}</ThemedText>
											<ThemedText className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
												Gender: {item.gender}
											</ThemedText>
											<ThemedText className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
												Phone: {item.phone}
											</ThemedText>
											<View className='flex-row items-center'>
												<ThemedText className='text-sm text-gray-600 dark:text-gray-400 mr-2'>
													RSVP:
												</ThemedText>
												<View className={`px-2 py-1 rounded-full ${item.rsvp === 'yes'
														? 'bg-green-100 dark:bg-green-900'
														: item.rsvp === 'no'
															? 'bg-red-100 dark:bg-red-900'
															: 'bg-yellow-100 dark:bg-yellow-900'
													}`}>
													<Text className={`text-xs font-medium capitalize ${item.rsvp === 'yes'
															? 'text-green-800 dark:text-green-200'
															: item.rsvp === 'no'
																? 'text-red-800 dark:text-red-200'
																: 'text-yellow-800 dark:text-yellow-200'
														}`}>
														{item.rsvp}
													</Text>
												</View>
											</View>
										</View>
										<TouchableOpacity
											className='bg-red-400 px-3 py-2 rounded-lg ml-3'
											onPress={() => handleDeleteGuest(item.id, item.name)}
										>
											<Text className='text-white text-sm font-medium'>Delete</Text>
										</TouchableOpacity>
									</View>
								</View>
							))
						) : (
							<View className='flex-1 justify-center items-center py-20'>
								<ThemedText className='text-lg text-gray-500 dark:text-gray-400'>
									{searchQuery || filter !== 'all'
										? 'No guests match your search criteria'
										: 'No guests found. Pull to refresh or add a new guest.'
									}
								</ThemedText>
							</View>
						)}
					</View>
				</ScrollView>
			</SafeAreaView>
		</ThemedView>
	);
}
