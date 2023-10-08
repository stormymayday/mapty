import { userSignIn } from "../services/API.js";

export default class LoginPage extends HTMLElement {

    constructor() {

        super();

    }

    connectedCallback() {

        // Getting template from the DOM
        const template = document.getElementById('login-page-template');

        // Cloning the template
        const content = template.content.cloneNode(true);

        // Appending content to the DOM
        this.appendChild(content);

        this.querySelector("#login-btn").addEventListener("click", async (event) => {

            event.preventDefault();

            const email = document.querySelector('#email-input').value;
            const password = document.querySelector('#password-input').value;

            userSignIn(email, password);

            // app.router.go(`/`);

        });

        this.querySelector("#register-btn").addEventListener("click", (event) => {

            app.router.go(`/registration`);

        });

    }

}

// Registering the login-page custom element
customElements.define("login-page", LoginPage);
