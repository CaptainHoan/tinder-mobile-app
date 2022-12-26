import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import MainScreen from '../screens/MainScreen';
import ChatScreen from '../screens/ChatScreen';
import ModalScreen from '../screens/ModalScreen';
import MatchScreen from '../screens/MatchScreen';
import MessengerScreen from '../screens/MessengerScreen';
import { MainStackParamLists } from '../types/navigation/MainNavigationType';

const MainStack = createStackNavigator<MainStackParamLists>();

const MainNavigator = () => {
  return (
    <NavigationContainer>
        <MainStack.Navigator initialRouteName='Home' screenOptions={{headerShown: false}}>
            <MainStack.Screen name="Home" component={MainScreen} />
            <MainStack.Screen name="Chat" component={ChatScreen} />
            <MainStack.Screen name="Modal" component={ModalScreen} options={{presentation: 'modal'}}/>
            <MainStack.Screen name="Match" component={MatchScreen} 
              options={{presentation: 'transparentModal'}}
            />
            <MainStack.Screen name="Messenger" component={MessengerScreen} />
        </MainStack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator