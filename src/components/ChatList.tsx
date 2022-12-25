import { View, Text, FlatList, Image } from 'react-native'
import React, {useState, useEffect} from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { auth, db } from '../../firebaseConfig'
import { TouchableOpacity } from 'react-native-gesture-handler'
import getMatches from '../lib/getMatches'
import ChatRow from './ChatRow'

const ChatList = () => {

    //fetch matches from database
    const [matches, setMatches] = useState([])
    const user = auth.currentUser

    useEffect(() => 
      onSnapshot(
        query(
            collection(db, 'MATCHES'), 
            where('userMatched', 'array-contains', user.uid)
        ), (snapshot) => 
            setMatches(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
            )),
    [user])
    

    return (
        matches.length > 0 
        ? 
        (
            <FlatList 
                className='h-full'
                data={matches}
                keyExtractor={item => item.id}
                renderItem={({item}) => <ChatRow matchDetails = {item} />}
            />
        )
        : 
        (
            <View className='p-5'>
                <Text className='text-center text-lg'>No matches found</Text>
            </View>
        )
    )
}

export default ChatList