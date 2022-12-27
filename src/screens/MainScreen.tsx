import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-deck-swiper';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  serverTimestamp, 
  setDoc, 
  where 
} from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import generateID from '../lib/generateID';
import { MainNavigationType } from '../types/navigation/MainNavigationType';

export type DATA_TYPE =  {
  firstName: string,
  lastName: string,
  occupation: string,
  age: string,
  photoURL: string,
  id: string,
  timestamp?: Date,
  avatar: string 
}

const MainScreen = () => {

  const navigation = useNavigation<MainNavigationType>();

  const swipeRef = useRef(null)

  const user = auth.currentUser

  if(user === null) return

  //signOut user
  const signOutUser = async() => {
    await signOut(auth)
    .then (() => {
      //signOut user
    })
    .catch(err => console.log(err.message))
  }

  const [profiles, setProfile] = useState<DATA_TYPE[]>([])
  const [avatar, setAvatar] = useState<string>('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Xdf9OyXn9BpWL30gb6cpyLnkiCCbSaH8wVB1007o9WpYBDgb6J1_afDQTdJuqwgE3xM&usqp=CAU')

  //render userProfile from Firestore database
  useLayoutEffect(
    () => onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
        if(!snapshot.exists()) {
          navigation.navigate("Modal")
        }
    }),[]
  )

  useEffect(() => {
    let unsub;
    const fetchCards = async() => {

      //fetch those who's been passed
      const passes = await getDocs(
        collection(db, 'users', user.uid, 'PASS')
        ).then(
          (snapshot) => snapshot.docs.map((doc) => doc.id))
      const passedUserIds = passes.length > 0 ? passes : ['test']

      // fetch those who's been likes
      const likes = await getDocs(
        collection(db, 'users', user.uid, 'LIKE')
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id))
      const likedUserIds = likes.length > 0 ? likes : ['tests']

      //fetch users
      unsub = onSnapshot(
        query(
          collection(db, 'users'), 
          where("id", "not-in", [...passedUserIds, ...likedUserIds]
        )), snapshot => {
        setProfile(
          snapshot.docs.filter(doc => doc.id !== user.uid).map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
        setAvatar(
          snapshot.docs.filter(doc => doc.id === user.uid).map(doc => ({
          id: doc.id,
          ...doc.data()
        }))[0].avatar)
      })
    }
    fetchCards()
    return unsub;
  }, [avatar, db])

  //console.log(avatar)
  //console.log(profiles)

  //swipe Left function to record in the database profiles you dislike (want to pass)
  const swipeLeft = async(cardIndex: any) => {
    if(!profiles[cardIndex]) return
    const userSwiped = profiles[cardIndex]
    console.log(`you dislike ${userSwiped.firstName +  userSwiped.lastName}`)
    setDoc(doc(db, 'users', user.uid, 'PASS', userSwiped.id), userSwiped)
  }

  // swipeRight function to record in the database profiles you like (want to match)
  const swipeRight = async(cardIndex: any) => {
    if(!profiles[cardIndex]) return
    const userSwiped = profiles[cardIndex]
    //fetch auth user from database
    const loggedInProfile = await (await getDoc(doc(db, 'users', user.uid))).data()

    //check if other swipe right on you
    getDoc(doc(db, 'users', userSwiped.id, 'LIKE', user.uid)).then(
      DocumentSnapshot => {
        if(DocumentSnapshot.exists()) {

          //if that user profile has liked you
          console.log(`you match ${userSwiped.firstName + userSwiped.lastName}`)
          setDoc(doc(db, 'users', user.uid, 'LIKE', userSwiped.id), userSwiped )

          //if both like each other => create a match to start chatting
          setDoc(doc(db, 'MATCHES', generateID(user.uid, userSwiped.id)), {
            users: {
              [user.uid] : loggedInProfile,
              [userSwiped.id]: userSwiped
            },
            userMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp()
          })
          //navigate to the Match screen
          navigation.navigate('Match', {
            loggedInProfile, 
            userSwiped
          })

        } else {
          console.log(`you like ${userSwiped.firstName +  userSwiped.lastName}`)
          //push userSwiped to the database
          setDoc(doc(db, 'users', user.uid, 'LIKE', userSwiped.id), userSwiped)
        }
      }
    )
  }

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex-row items-center justify-between mx-3'>
        <TouchableOpacity onPress={signOutUser}>
          <Image
            className='h-10 w-10 rounded-full'
            source={{uri: avatar}}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
          <Image
            className='w-10 h-10' 
            source={{uri: 'https://logos-world.net/wp-content/uploads/2020/09/Tinder-Emblem.png'}}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <AntDesign name="wechat" size={35} color="red" />
        </TouchableOpacity>
      </View>

      {/**Deck Swpier */}
      <View className='flex-1 '>
        <Swiper
        ref={swipeRef}
          containerStyle={{backgroundColor: 'transparent'}} 
          cards={profiles}
          stackSize={5}
          verticalSwipe={false}
          onSwipedRight={(cardIndex) => {
            console.log('You like')
            swipeRight(cardIndex)
          }}
          onSwipedLeft={(cardIndex) => {
            console.log('You pass')
            swipeLeft(cardIndex)
          }}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: 'right',
                  color: 'red',
                },
              }
            },
            right: {
              title: "LIKE",
              style: {
                label: {
                  color: "#4DED30"
                }
              }
            }
          }}
          animateCardOpacity
          cardIndex={0}
          renderCard={card => card ? (
            <View className='bg-white h-3/4 rounded-xl relative -mt-6' key={card.id}>
              <Image source={{uri: card.photoURL}} className='h-full w-full rounded-xl' />
              <View className="bg-white w-full h-20 items-center justify-between flex-row px-5 rounded-b-xl" style={styles.cardShadow}>
                <View>
                  <Text className='text-xl font-bold'>{card.firstName} {card.lastName}</Text>
                  <Text>{card.occupation} </Text>
                </View>
                <Text className="text-2xl font-bold">{card.age}</Text>
              </View>
            </View>
          ) : (
            <View className="relative bg-white h-3/4 rounded-xl justify-center items-center" style={styles.cardShadow}>
              <Text className='font-bold pb-5'>No more matches</Text>
              <Image
                className='h-20 w-20'
                source={{uri: 'https://links.papareact.com/6gb'}}
              />
            </View>
          )}
        />
      </View>

      <View className='flex-row flex justify-evenly mb-3'>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()} 
          className='items-center justify-center rounded-full w-16 h-16 bg-red-200'
        >
          <Entypo name="cross" size={30} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()} 
          className='items-center justify-center rounded-full w-16 h-16 bg-green-200'
        >
          <AntDesign name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
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

export default MainScreen