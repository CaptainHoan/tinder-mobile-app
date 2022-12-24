// Import the functions you need from the SDKs you need
import { FIREBASE_KEY } from "@env";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_KEY,
  authDomain: "tinder-mobile-app.firebaseapp.com",
  projectId: "tinder-mobile-app",
  storageBucket: "tinder-mobile-app.appspot.com",
  messagingSenderId: "772809740245",
  appId: "1:772809740245:web:0e26f31c480d09e21d375c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app)