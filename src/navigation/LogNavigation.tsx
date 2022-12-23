import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import LogScreen from '../screens/LogScreen/LogScreen'
import LoginScreen from '../screens/LogScreen/LoginScreen'

const LoginStack = createStackNavigator()

const LogNavigation = () => {
  return (
    <NavigationContainer>
        <LoginStack.Navigator initialRouteName='Log' screenOptions={{headerShown: false}}>
            <LoginStack.Screen name="Log" component={LogScreen} />
            <LoginStack.Screen name="Login" component={LoginScreen} />
        </LoginStack.Navigator>
    </NavigationContainer>
  )
}

export default LogNavigation