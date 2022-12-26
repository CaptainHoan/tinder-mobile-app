import { View, Text, Image } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ChatNavigationType } from '../types/navigation/MainNavigationType';

const MatchScreen = () => {

    const navigation = useNavigation<ChatNavigationType>();
    const {params} = useRoute();

    const {loggedInProfile, userSwiped} = params

  return (
    <View className='h-full bg-red-500 pt-20' style={{opacity: 0.89}}>
        <View className='self-center'>
            <Image
                style={{resizeMode: 'contain', width: 250, height: 150}}
                source={{uri: 'https://links.papareact.com/mg9'}}
            />
        </View>

        <Text className='text-white text-center mt-3 font-bold text-xl mx-10'>
            You and {userSwiped.firstName}{userSwiped.lastName} have liked each other
        </Text>

        <View className='flex-row items-center justify-evenly mt-5'>
            <Image 
                className='h-32 w-32 rounded-full'
                source={{uri: loggedInProfile.avatar}}
            />
            <Image
                className='h-32 w-32 rounded-full' 
                source={{uri: userSwiped.avatar}}
            />
        </View>

        <TouchableOpacity
        onPress={() => {
            navigation.goBack();
            navigation.navigate('Chat')
        }} 
        className='bg-white m-5 px-8 py-8 rounded-full mt-20'
        >
            <Text className='text-center font-bold text-xl'>
                Send messages
            </Text>
        </TouchableOpacity>
    </View>
  )
}

export default MatchScreen