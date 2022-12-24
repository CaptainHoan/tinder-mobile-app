import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import React, {useRef, useState}  from 'react'
import PhoneInput from "react-native-phone-number-input";
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { auth } from '../../../firebaseConfig';
import { PhoneAuthProvider, RecaptchaVerifier, signInWithCredential } from 'firebase/auth';
import { getApp } from 'firebase/app';

const LoginScreen = () => {

  const app = getApp()
  const phoneInput = useRef<PhoneInput>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const recaptchaVerifier = React.useRef(null);
  const [showConfirmInput, setShowConfirmInput] = useState<boolean>(false)
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [verificationId, setVerificationId] = useState<string>('')
  const attemptInvisibleVerification = false;

  //firebaseConfig
  const firebaseConfig = app ? app.options : undefined;

  //function to sendVerificationCode
  const sendVerificationCode = async() => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth)
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      )
      setShowConfirmInput(true)
      setVerificationId(verificationId)
    }catch (error:any) {
      console.log(error.message)
    }
  }

  const LogInWithPhone = async() => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      const userCredential = await signInWithCredential(auth, credential);
      console.log(userCredential)
    }catch(error:any) {
      console.log(error.message)
    }
  } 

  return (
    <View>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        //attemptInvisibleVerification
      />
      <Image 
        source={{uri: 'https://logos-world.net/wp-content/uploads/2020/09/Tinder-Logo.png'}}
        style={{width: 150, height: 150, resizeMode: 'contain', alignSelf: 'center'}}
      />
      <View className='items-center justify-center'>
        <Text className="text-2xl font-bold mb-5">Enter your phone number</Text>
        <PhoneInput
          ref={phoneInput}
          defaultValue={phoneNumber}
          defaultCode="IN"
          onChangeFormattedText={(text) => {
            setPhoneNumber(text);
          }}
          withDarkTheme
          withShadow
          autoFocus
        />
      </View>
      {
      showConfirmInput
      ? (
          <>
            <Text className="text-2xl font-bold mb-5 mt-5 text-center">Enter your verification code</Text>
            <View className='bg-white p-4 mx-10'>
              <TextInput 
              placeholder='123456'
              placeholderTextColor={'gray'}
              value={verificationCode}
              onChangeText={value => setVerificationCode(value)}
              keyboardType="default"
              autoFocus={true}
              style={{textAlign: 'center'}}
            />
            </View>
          </>
        )
      : null
      }
      <TouchableOpacity 
        onPress={verificationCode.length > 0 ? LogInWithPhone: sendVerificationCode}
        className='bg-red-300 mx-10 p-3 mt-5 rounded-md flex-row items-center justify-center'
      >
        <Text className="text-white text-2xl font-bold">{verificationCode.length > 0 ? 'Log In' : 'Verify'}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default LoginScreen