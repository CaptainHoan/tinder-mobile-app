import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import MainNavigator from './MainNavigator'
import LogNavigation from './LogNavigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const RootNavigation = () => {

  const [isLogged, setIsLogged] = useState<boolean>(false)

  onAuthStateChanged(auth, (user) => {
    user ? setIsLogged(true) : setIsLogged(false)
  })
  
  return (
    isLogged === false
    ? (<LogNavigation/>)
    : (<MainNavigator />)
  )
}

export default RootNavigation