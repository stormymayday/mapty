import { auth, db } from "../services/API.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Router from "../services/Router.js";

export default class LoginPage extends HTMLElement {

    constructor() {

        super();

    }

    loginWithEmailAndPassword = async (email, password) => {

        document.querySelector("span").innerHTML = ``;

        try {

            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            console.log(userCredential.user.uid);

            localStorage.setItem('user', JSON.stringify(userCredential.user));
            localStorage.setItem('userID', JSON.stringify(userCredential.user.uid));

            try {

                const docRef = doc(db, "users", userCredential.user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {

                    console.log("Document data:", docSnap.data());
                    console.log(`docSnap.data().email = ${docSnap.data().email}`);
                    console.log(`docSnap.data().role = ${docSnap.data().role}`);

                    localStorage.setItem('userEmail', JSON.stringify(docSnap.data().email));
                    localStorage.setItem('userRole', JSON.stringify(docSnap.data().role));

                } else {
                    // docSnap.data() will be undefined in this case
                    console.log("No such document!");
                }

            } catch (error) {

            }

            Router.go(`/`);

        } catch (error) {

            const errorCode = error.code;
            const errorMessage = error.message;

            console.log(errorCode);
            console.log(errorMessage);

            if (errorCode === 'auth/invalid-login-credentials' || errorMessage === 'Firebase: Error (auth/invalid-login-credentials).') {

                document.querySelector("span").innerHTML = `Invalid login credentials, please try again`;

            } else {

                document.querySelector("span").innerHTML = `error message`;

            }

        }

    };

    connectedCallback() {

        // Getting template from the DOM
        const template = document.getElementById('login-page-template');

        // Cloning the template
        const content = template.content.cloneNode(true);

        // Appending content to the DOM
        this.appendChild(content);

        this.querySelector(".login").addEventListener("submit", async (event) => {

            event.preventDefault();

            const email = document.querySelector('input[type="email"]').value;

            const password = document.querySelector('input[type="password"]').value;

            this.loginWithEmailAndPassword(email, password);

            // app.router.go(`/`);

        });


        this.querySelector("#register-btn").addEventListener("click", (event) => {

            app.router.go(`/registration`);

        });

    }

}

// Registering the login-page custom element
customElements.define("login-page", LoginPage);
