import { View, Text, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const LogScreen = () => {

    const navigation = useNavigation()
  return (
    <ImageBackground
        style={{flex: 1, justifyContent: "center"}}
        resizeMode="contain"
        source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA9VzSCto0TAtDeRmg4v5Zn55pyKvf85isouxCEnRNY_6Yn1g7m924ULBoEZeO_Mgk-NQ&usqp=CAU'}}
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