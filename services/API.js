import Router from "./Router.js";

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mapty-534f3.firebaseapp.com",
    projectId: "mapty-534f3",
    storageBucket: "mapty-534f3.appspot.com",
    messagingSenderId: "1061200265983",
    appId: "1:1061200265983:web:a45f636a814d795fc902ca"
};

// Initializing Firebase App
const app = initializeApp(firebaseConfig);

// Initializing Firebase Auth
export const auth = getAuth(app);

// Initializing Firestore Database
export const db = getFirestore(app);

// Initializing Firebase Storage
export const storage = getStorage(app);

export const userSignOut = async () => {

    await signOut(auth);

    Router.go(`/login`);

}

export const isLoggedIn = async () => {

    onAuthStateChanged(auth, (user) => {

        if (user) {

            console.log(user);

            return true;

        } else {

            return false;

        }

    });

};