import { 
   View, 
   SafeAreaView, 
   TextInput, 
   Button, 
   KeyboardAvoidingView, 
   Platform, 
   TouchableWithoutFeedback, 
   Keyboard, 
   FlatList
} from 'react-native'
import React, { useState, useEffect } from 'react'
import ChatHeader from '../components/ChatHeader'
import { auth, db } from '../../firebaseConfig'
import getMatches from '../lib/getMatches'
import { useRoute } from '@react-navigation/native'
import SenderMessage from '../components/SenderMessage'
import ReceiverMessage from '../components/ReceiverMessage'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'

const MessengerScreen = () => {

  const {params} = useRoute()
  const { matchDetails } = params;
  const user = auth.currentUser;
  const [messageInput, setMessageInput] = useState<string>('')
  const [messages, setMessages] = useState([])
  

  //send message
  const sendMessage = () => {
    addDoc(collection(db, 'MATCHES',  matchDetails.id, 'messages'), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      firstName: matchDetails.users[user?.uid].firstName,
      lastName: matchDetails.users[user?.uid].lastName,
      avatar: matchDetails.users[user?.uid].avatar,
      message: messageInput
    })
    setMessageInput("")
  }

  useEffect(() => 
    onSnapshot(
      query(
        collection(db, "MATCHES", matchDetails.id, 'messages'), 
        orderBy('timestamp', 'desc')
      ), 
      (snapshot) => 
        setMessages(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })
        )
      )
    ),
    [matchDetails, db]
  )

  return (
    <SafeAreaView className='flex-1'>
      <ChatHeader 
        title={
          getMatches(matchDetails?.users, user.uid).firstName 
          + " "
          + getMatches(matchDetails?.users, user.uid).lastName
          } 
        callEnabled 
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList 
            data={messages}
            className="pl-4"
            inverted={-1}
            keyExtractor={item => item.id}
            renderItem={
              ({item: message}) => 
              message.userId === user.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
          />
        </TouchableWithoutFeedback>
      
      <View className='flex-row justify-between items-center border-t-2 border-gray-400 px-6 py-2'>
        <TextInput 
          className=' h-10 text-black text-lg flex-1'
          placeholderTextColor={'gray'}
          placeholder='send message...'
          multiline={true   }
          value={messageInput}
          onChangeText={setMessageInput}
          onSubmitEditing={sendMessage}
        />
        <Button title="Send" color="#FF8964" onPress={sendMessage}/>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView >
  )
}

export default MessengerScreen