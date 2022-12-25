import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import ChatHeader from '../components/ChatHeader'
import { useNavigation } from '@react-navigation/native'
import ChatList from '../components/ChatList'

const ChatScreen = () => {
  return (
    <SafeAreaView className='flex-1'>
      <ChatHeader title="Chat" />
      <ChatList /> 
    </SafeAreaView>
  )
}

export default ChatScreen