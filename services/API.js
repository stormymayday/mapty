import Router from "./Router.js";

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mapty-534f3.firebaseapp.com",
    projectId: "mapty-534f3",
    storageBucket: "mapty-534f3.appspot.com",
    messagingSenderId: "1061200265983",
    appId: "1:1061200265983:web:a45f636a814d795fc902ca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export const userRegistration = async (email, password) => {

    try {

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        app.state.user = userCredential.user;

        console.log(app);

        alert("Your account has been created!");

    } catch (error) {

        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage);

    }

};

export const userSignIn = async (email, password) => {

    try {

        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        localStorage.setItem('user', JSON.stringify(userCredential.user));

        // app.state.user = userCredential.user;
        // console.log(app.state.user);
        // console.log(app.state.user.uid);
        // console.log(app.state.user.email);

        // app.state.isLoggedIn = true;

        Router.go(`/`);

    } catch (error) {

        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage);

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