import { Text, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LoginNavigationType } from '../../types/navigation/LoginNavigationType';

const LogScreen = () => {

    const navigation = useNavigation<LoginNavigationType>()
  return (
    <ImageBackground
        style={{flex: 1, justifyContent: "center"}}
        resizeMode="cover"
        source={{uri: 'https://i.pinimg.com/originals/79/b3/74/79b374c74ed6d6c73f2e20fd31d6904f.png'}}
    >
        <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            className='bg-white self-center p-4 rounded-md flex-row items-center justify-center absolute bottom-10'
        >
            <FontAwesome name="phone" size={30} color="black" />
            <Text className='text-xl font-bold ml-2'>Log in with phone number</Text>
        </TouchableOpacity>
    </ImageBackground>
  )
}

export default LogScreen