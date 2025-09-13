import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { guestInterface } from '@/constants/interfaces';
import { addGuest } from '@/utils/asyncStorage';
import axios from "axios"

export default function TabTwoScreen() {
	const initialFormState: Omit<guestInterface, "id"> = {
		name: "",
		gender: "Male",
		phone: 0,
		rsvp: "yes",
	};

	const [formData, setFormData] = useState(initialFormState);

	const handleInputChange = (
		field: keyof typeof formData,
		value: string | number
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleRandom = async () => {
		const randomData = (await axios.get("https://randomuser.me/api/")).data;
		const randomUser = randomData.results[0]

		setFormData({
			name: randomUser.name.first + " " + randomUser.name.last,
			gender: randomUser.gender === "male" ? "Male" : "Female",
			phone: randomUser.phone,
			rsvp: "maybe",
		})
	};

	const handleSubmit = () => {
		if (formData.name === ""){
			Alert.alert("Error", "Enter name");
			return
		}
		if (formData.phone === 0){
			Alert.alert("Error", "Enter phone");
			return
		}

		const guestData: guestInterface = {
			id: Date.now(), // Simple ID generation
			...formData,
		};

		addGuest(guestData);

		Alert.alert("Success", "Guest details added");

		setFormData(initialFormState);
	};

	return (
		<ThemedView className='flex-1'>
			<SafeAreaView className='flex-1 p-6'>
				<View className='flex-1 justify-center'>
					<ThemedText className='text-2xl font-bold text-center mb-10'>
						Guest Registration
					</ThemedText>

					<View className='space-y-6'>
						{/* Name Field */}
						<View className='mb-6'>
							<ThemedText className='text-base font-medium mb-3'>Name</ThemedText>
							<TextInput
								className='border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-4 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
								placeholder='Enter guest name'
								placeholderTextColor='#9CA3AF'
								value={formData.name}
								onChangeText={(value) => handleInputChange('name', value)}
							/>
						</View>

						{/* Gender Field */}
						<View className='mb-6'>
							<ThemedText className='text-base font-medium mb-3'>Gender</ThemedText>
							<View className='flex-row space-x-4'>
								<TouchableOpacity
									className={`flex-1 mx-2 py-4 px-4 rounded-lg border ${formData.gender === 'Male'
										? 'bg-blue-500 border-blue-500'
										: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
										}`}
									onPress={() => handleInputChange('gender', 'Male')}
								>
									<Text className={`text-center font-medium ${formData.gender === 'Male' ? 'text-white' : 'text-gray-900 dark:text-gray-100'
										}`}>
										Male
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									className={`flex-1 mx-2 py-4 px-4 rounded-lg border ${formData.gender === 'Female'
										? 'bg-pink-500 border-pink-500'
										: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
										}`}
									onPress={() => handleInputChange('gender', 'Female')}
								>
									<Text className={`text-center font-medium ${formData.gender === 'Female' ? 'text-white' : 'text-gray-900 dark:text-gray-100'
										}`}>
										Female
									</Text>
								</TouchableOpacity>
							</View>
						</View>

						{/* Phone Field */}
						<View className='mb-6'>
							<ThemedText className='text-base font-medium mb-3'>Phone</ThemedText>
							<TextInput
								className='border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-4 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
								placeholder='Enter phone number'
								placeholderTextColor='#9CA3AF'
								value={formData.phone === 0 ? '' : formData.phone.toString()}
								onChangeText={(value) => handleInputChange('phone', parseInt(value) || 0)}
								keyboardType='numeric'
							/>
						</View>

						{/* RSVP Field */}
						<View className='mb-8'>
							<ThemedText className='text-base font-medium mb-3'>RSVP</ThemedText>
							<View className='flex-row space-x-3'>
								{['yes', 'no', 'maybe'].map((option) => (
									<TouchableOpacity
										key={option}
										className={`flex-1 mx-2 py-4 px-4 rounded-lg border ${formData.rsvp === option
											? option === 'yes'
												? 'bg-green-500 border-green-500'
												: option === 'no'
													? 'bg-red-500 border-red-500'
													: 'bg-yellow-500 border-yellow-500'
											: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
											}`}
										onPress={() => handleInputChange('rsvp', option as 'yes' | 'no' | 'maybe')}
									>
										<Text className={`text-center font-medium capitalize ${formData.rsvp === option ? 'text-white' : 'text-gray-900 dark:text-gray-100'
											}`}>
											{option}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>

						{/* Buttons */}
						<View className='flex-row space-x-4 mt-8'>
							<TouchableOpacity
								className=' mx-2 flex-1 bg-gray-500 dark:bg-gray-600 py-4 px-4 rounded-lg'
								onPress={handleRandom}
							>
								<Text className='text-white text-center font-medium text-base'>
									Random
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className=' mx-2 flex-1 bg-blue-500 dark:bg-blue-600 py-4 px-4 rounded-lg'
								onPress={handleSubmit}
							>
								<Text className='text-white text-center font-medium text-base'>
									Submit
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</SafeAreaView>
		</ThemedView>
	);
}
