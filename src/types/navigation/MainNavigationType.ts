import { DATA_TYPE } from "../../screens/MainScreen"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

export type MainStackParamLists = {
    Home: undefined,
    Chat: undefined,
    Modal: undefined,
    Match: {
        loginProfile: DATA_TYPE[],
        userSwiped: DATA_TYPE[]
    },
    Messenger: {
        matchDetais: {
            timestamp: string,
            userMatched: string[],
            users: []
        }
    }
}

export type MainNavigationType = NativeStackNavigationProp<MainStackParamLists, 'Modal', "Chat">
export type ChatNavigationType = NativeStackNavigationProp<MainStackParamLists, 'Messenger', 'Chat'>

export ChatPropType = NativeStackScreenProps<MainStackParamLists, >