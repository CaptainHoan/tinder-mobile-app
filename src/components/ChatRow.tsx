import { View, Text, Image, StyleSheet } from 'react-native'
import React, {useState, useEffect} from 'react'
import { auth, db } from '../../firebaseConfig'
import { useNavigation } from '@react-navigation/native';
import getMatches from '../lib/getMatches';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { ChatNavigationType, MATCH_TYPE } from '../types/navigation/MainNavigationType';
import { DATA_TYPE } from '../screens/MainScreen';

const ChatRow = ({matchDetails}: {matchDetails: MATCH_TYPE}) => {

    const user = auth.currentUser;
    // check if user === null
    if (user === null) return;

    const navigation = useNavigation<ChatNavigationType>();
    const [matchUser, setMatchUser] = useState<DATA_TYPE | null>(null)

    //query last message
    const [lastMessage, setLastMessage] = useState<string>('')

    useEffect(() => {
      setMatchUser(getMatches(matchDetails.users, user.uid))
    }, [matchDetails, user])

    useEffect(() => 
      onSnapshot(
        query(
          collection(db, "MATCHES", matchDetails.id, 'messages'), 
          orderBy('timestamp', 'desc')
        ), (snapshot) =>
            setLastMessage(snapshot.docs[0]?.data()?.message)
      ), 
      [matchDetails, db]
    )
    
    //console.log(lastMessage)

  return (
    <TouchableOpacity 
        className='flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg' 
        style={styles.cardShadow}
        onPress={() => navigation.navigate('Messenger', {
          matchDetails,
        })}
    >
      <Image 
        source={{uri: matchUser?.avatar}}
        className="rounded-full h-12 w-12 mr-4"
      />
      <View>
        <Text className='text-lg font-semibold'>
            {matchUser?.firstName} {matchUser?.lastName}
        </Text>
        <Text>{lastMessage || 'Say hi!'}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    cardShadow: { 
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1
      },
       shadowOpacity: 0.2,
       shadowRadius: 1.45,
       elevation: 2
    }
  })

export default ChatRow