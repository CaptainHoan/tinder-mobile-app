import { View, Text, Image } from 'react-native'
import React from 'react'
import { messageType } from '../screens/MessengerScreen'

const ReceiverMessage = ({message}: {message: messageType}) => {
  return (
    <View
        className='bg-red-400 rounded-lg rounded-tl-none px-5 py-3 mx-3 my-2 ml-14'
        style={{alignSelf: 'flex-start'}}
    >
        <Image 
            source={{uri: message.avatar}}
            className="h-12 w-12 rounded-full absolute top-0 -left-14"
        />
      <Text className='text-white'>{message.message}</Text>
    </View>
  )
}

export default ReceiverMessage