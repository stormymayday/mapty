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
const firebaseApp = initializeApp(firebaseConfig);

const firebaseAuth = getAuth(firebaseApp);

export const registerUser = async (email, password) => {

    try {

        const registeredUser = await createUserWithEmailAndPassword(firebaseAuth, email, password);

        console.log(registeredUser);

        alert("Your account has been created!");

    } catch (error) {

        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage);

    }

};