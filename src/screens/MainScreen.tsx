import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-deck-swiper';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';

type DATA_TYPE =  {
  firstName: string,
  lastName: string,
  occupation: string,
  age: string,
  photoURL: string,
  id: string,
  timestamp?: string 
}

const DATA: DATA_TYPE[] = [
  {
    firstName: 'Iron',
    lastName: 'Man',
    occupation: 'Entrepreneur, billionaire, tech brat',
    age: '24',
    id: '123',
    photoURL: 'https://media.contentapi.ea.com/content/dam/news/www-ea/images/2022/09/ea-motive-new-title-teaser-16x9-featured.jpg.adapt.crop191x100.628p.jpg'
  },
  {
    firstName: 'Scarlet',
    lastName: 'Witch',
    occupation: 'Evil Witch',
    age: '35',
    id: '456',
    photoURL: 'https://pyxis.nymag.com/v1/imgs/4f0/715/3a408c4b9fd021860939b94c47251a521d-wandavision.rsquare.w700.jpg'
  },
  {
    firstName: 'Thor',
    lastName: 'Ordinson',
    occupation: 'God of thunder',
    age: '37',
    id: '789',
    photoURL: 'https://www.koimoi.com/wp-content/new-galleries/2022/09/chris-hemsworth-talks-about-his-return-as-thor-unfortunately-he-isnt-sure-if-he-will-001.jpg'
  },
  {
    firstName: 'Christopher',
    lastName: 'Nolan',
    occupation: 'Director',
    age: '45',
    id: '150',
    photoURL: 'https://images.complex.com/complex/images/c_fill,dpr_auto,f_auto,q_90,w_1400/fl_lossy,pg_1/xytc84t0c7ir9r5ysgug/christopher-nolan'
  }
]

const MainScreen = () => {

  const navigation = useNavigation();

  const swipeRef = useRef(null)

  const user = auth.currentUser;

  //signOut user
  const signOutUser = async() => {
    await signOut(auth)
    .then (() => {
      //signOut user
    })
    .catch(err => console.log(err.message))
  }

  const [profile, setProfile] = useState<DATA_TYPE[]>([])
  const [avatar, setAvatar] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Xdf9OyXn9BpWL30gb6cpyLnkiCCbSaH8wVB1007o9WpYBDgb6J1_afDQTdJuqwgE3xM&usqp=CAU')

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
      unsub = onSnapshot(collection(db, 'users'), snapshot => {
        setProfile(
          snapshot.docs.filter(doc => doc.id !== user.uid).map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
        setAvatar(snapshot.docs.filter(doc => doc.id === user.uid).map(doc => ({
          ...doc.data()
        }))[0].avatar)
      })
    }
    fetchCards()
    return unsub;
  }, [])

  console.log(profile)

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
          cards={profile}
          stackSize={5}
          verticalSwipe={false}
          onSwipedRight={() => {
            console.log('LIKE')
          }}
          onSwipedLeft={() => {
            console.log('NOPE')
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
          renderCard={(card) => card ? (
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