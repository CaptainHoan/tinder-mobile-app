import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../firebaseConfig'; 
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationType } from '../types/navigation/MainNavigationType';

const ModalScreen = () => {

  //get the current user
  const user = auth.currentUser;
  // console.log(user)

  const navigation = useNavigation<MainNavigationType>()
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [age, setAge] = useState<string>('')
  const [occupation, setOccupation] = useState<string>('')
  const [avatar, setAvatar] = useState<string>('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Xdf9OyXn9BpWL30gb6cpyLnkiCCbSaH8wVB1007o9WpYBDgb6J1_afDQTdJuqwgE3xM&usqp=CAU')
  const [photoURL, setPhotoURL] = useState<string>('https://cdn.pixabay.com/photo/2017/02/07/02/16/cloud-2044823_960_720.png')
  const inCompleteForm: boolean = firstName.length === 0 || lastName.length === 0 || age.length === 0 || occupation.length === 0 || avatar.length === 0 || photoURL.length === 0

  const pickAvatar = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    try {
      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    }catch(err:any) {
      console.log(err.message)
    }
  }

  const pickPhoto = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    try {
      if (!result.canceled) {
        setPhotoURL(result.assets[0].uri);
      }
    }catch(err:any) {
      console.log(err.message)
    }
  }

  //update user profile in the firestore database
  const updateProfile = () => {
    if(user) {
      setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        firstName: firstName,
        lastName: lastName,
        age: age,
        occupation: occupation,
        avatar: avatar,
        photoURL: photoURL,
        timestamp: serverTimestamp()
      }).then(() => {
        navigation.navigate('Home')
      }).catch((error) => {
        console.log(error.message)
      })
    }
  }

  return (
    <View>
      <Image 
        source={{uri: 'https://logos-world.net/wp-content/uploads/2020/09/Tinder-Logo.png'}}
        style={{width: 120, height: 80, resizeMode: 'contain', alignSelf: 'center'}}
      />
      <Text className='text-3xl font-bold text-center'>Add your profile to start matching your date</Text>

      <View className='flex-row items-center justify-around mx-3 space-x-3 mt-5'>
        <View className="bg-white p-4 rounded-xl flex-1">
          <TextInput 
            placeholder='First name'
            placeholderTextColor={'gray'}
            value={firstName}
            onChangeText={value => setFirstName(value)}
          />
        </View>
        <View className="bg-white p-4 rounded-xl flex-1">
          <TextInput 
            placeholder='Last name'
            placeholderTextColor={'gray'}
            value={lastName}
            onChangeText={value => setLastName(value)}
          />
        </View>
      </View>

      <View className='flex-row items-center justify-around mx-3 space-x-3 mt-3'>
        <View className="bg-white p-4 rounded-xl flex-1">
          <TextInput 
            placeholder='Age'
            placeholderTextColor={'gray'}
            value={age}
            onChangeText={value => setAge(value)}
          />
        </View>
        <View className="bg-white p-4 rounded-xl flex-1">
          <TextInput 
            placeholder='Occupation'
            placeholderTextColor={'gray'}
            value={occupation}
            onChangeText={value => setOccupation(value)}
          />
        </View>
      </View>
        
      <View className="items-center mt-5">
        <Text className="text-2xl font-bold">Your avatar here</Text>
        <TouchableOpacity onPress={pickAvatar}>
          <Image
            className='h-20 w-20 rounded-full' 
            source={{uri: avatar}}
          />
        </TouchableOpacity>
      </View>

      <View className="items-center mt-5">
        <Text className="text-2xl font-bold">Upload your photo</Text>
        <TouchableOpacity onPress={pickPhoto}>
          <Image
            className='h-20 w-20 rounded-full' 
            source={{uri: photoURL}}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={updateProfile} 
        className='p-4 rounded-xl mt-8 mx-20' 
        disabled={inCompleteForm} 
        style={{backgroundColor: inCompleteForm ? 'gray' : '#F47373' }}
      >
        <Text className='text-center text-xl text-white'>Update Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ModalScreen