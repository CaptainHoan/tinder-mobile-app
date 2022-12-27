import { SafeAreaView } from 'react-native'
import React from 'react'
import ChatHeader from '../components/ChatHeader'
import ChatList from '../components/ChatList'

const ChatScreen = () => {
  return (
    <SafeAreaView className='flex-1'>
      <ChatHeader title="Chat" callEnabled />
      <ChatList /> 
    </SafeAreaView>
  )
}

export default ChatScreen