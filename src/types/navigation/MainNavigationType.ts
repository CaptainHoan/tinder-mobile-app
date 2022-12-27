import { RouteProp } from "@react-navigation/native"
import { DATA_TYPE } from "../../screens/MainScreen"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

export type usersType = {
    id: DATA_TYPE
}

export type MATCH_TYPE = {
    id: string,
    timestamp: Date,
    userMatched: string[],
    users: usersType[],
}

export type MainStackParamLists = {
    Home: undefined,
    Chat: undefined,
    Modal: undefined,
    Match: {
        loggedInProfile: DATA_TYPE,
        userSwiped: DATA_TYPE
    },
    Messenger: {
        matchDetails: MATCH_TYPE
    }
}

export type MainNavigationType = NativeStackNavigationProp<MainStackParamLists, 'Match', "Chat">
export type ChatNavigationType = NativeStackNavigationProp<MainStackParamLists, 'Messenger', 'Chat'>

export type ChatPropType = NativeStackScreenProps<MainStackParamLists, 'Messenger'>
export type MatchPropType = NativeStackScreenProps<MainStackParamLists, 'Match'>

export type ChatRouteProp = RouteProp<MainStackParamLists, 'Messenger'>
export type MatchRouteProp = RouteProp<MainStackParamLists, 'Match'>