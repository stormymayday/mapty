import Router from "./Router.js";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, AuthErrorCodes } from "firebase/auth";
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

console.log(db);

export const registerWithEmailAndPassword = async (email, password, role) => {

    try {

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        localStorage.setItem('user', JSON.stringify(userCredential.user));

        Router.go(`/`);

    } catch (error) {

        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode);
        console.log(errorMessage);

        // Invalid Email
        if (errorCode === 'auth/invalid-email' || errorMessage === 'Firebase: Error (auth/invalid-email).') {

            document.querySelector("#message").innerHTML = `This email is invalid`;

        }

        // Weak Password
        if (errorCode === 'auth/weak-password' || errorMessage === 'Firebase: Password should be at least 6 characters (auth/weak-password).') {

            document.querySelector("#message").innerHTML = `Password should be at least 6 characters long`;

        }

        // Email Already In Use
        if (errorCode === 'email-already-in-use' || errorMessage === 'Firebase: Error (auth/email-already-in-use).') {

            document.querySelector("#message").innerHTML = `This email is already in use`;

        }

    }

};

export const loginWithEmailAndPassword = async (email, password) => {

    document.querySelector("#message").innerHTML = ``;

    try {

        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        localStorage.setItem('user', JSON.stringify(userCredential.user));

        Router.go(`/`);

    } catch (error) {

        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode);
        console.log(errorMessage);

        if (errorCode === 'auth/invalid-login-credentials' || errorMessage === 'Firebase: Error (auth/invalid-login-credentials).') {

            document.querySelector("#message").innerHTML = `Invalid login credentials, please try again`;

        } else {

            document.querySelector("#message").innerHTML = `error message`;

        }

    }

};

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