import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';

const ChatHeader = ({title, callEnabled}) => {

    const navigation = useNavigation();

  return (
    <View className='mx-2 flex-row items-center justify-between'>
        <View className='flex flex-row items-center'>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-outline" size={34} color="#FF5864" />
            </TouchableOpacity>
            <Text className='text-2xl font-bold pl-2'>{title}</Text>
        </View>
        {callEnabled && (
            <TouchableOpacity className='bg-red-200 p-3 px-4 mr-2 rounded-full' >
                <Foundation name="telephone" size={25} color="red"/>
            </TouchableOpacity>
        )}
    </View>
  )
}

export default ChatHeader