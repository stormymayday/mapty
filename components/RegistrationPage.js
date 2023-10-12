// import { registerWithEmailAndPassword } from "../services/API.js";
import Router from "../services/Router.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../services/API.js";

export default class RegistrationPage extends HTMLElement {

    constructor() {

        super();

    }

    connectedCallback() {

        // Getting template from the DOM
        const template = document.getElementById('registration-page-template');

        // Cloning the template
        const content = template.content.cloneNode(true);

        // Appending content to the DOM
        this.appendChild(content);

        this.querySelector("#registration-form").addEventListener("submit", async (event) => {

            event.preventDefault();

            const email = document.querySelector('#email-input').value;
            const password = document.querySelector('#password-input').value;
            const role = document.querySelector('#role-input').value;

            // registerWithEmailAndPassword(email, password, role);

            try {

                // Registering new user via the Firebase Auth
                const response = await createUserWithEmailAndPassword(auth, email, password, role);

                try {

                    // Creating new user document in the Firestore Database
                    await setDoc(doc(db, 'users', response.user.uid), {

                        email: email,
                        role: role,
                        timeStamp: serverTimestamp(),

                    });

                    localStorage.setItem('user', JSON.stringify(response.user));

                    Router.go(`/`);

                } catch (error) {

                    console.log(error);

                }

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

        });

        this.querySelector("#login-btn").addEventListener("click", event => {

            app.state.isLoggedIn = false;

            app.router.go(`/login`);

        });

        this.querySelector("#home-page-btn").addEventListener("click", event => {

            app.router.go(`/`);

        });

    }

}

customElements.define("registration-page", RegistrationPage);
