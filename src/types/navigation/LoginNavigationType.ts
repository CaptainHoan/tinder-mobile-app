import { NativeStackNavigationProp } from "@react-navigation/native-stack"

export type LogInStackParamList = {
    Log: undefined,
    Login: undefined
}

export type LoginNavigationType = NativeStackNavigationProp<LogInStackParamList, 'Login'>