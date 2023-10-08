import { userRegistration } from "../services/API.js";

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

        this.querySelector("#register-btn").addEventListener("click", event => {

            event.preventDefault();

            const email = document.querySelector('#email-input').value;
            const password = document.querySelector('#password-input').value;

            userRegistration(email, password);

            // app.state.isLoggedIn = true;

            // app.router.go(`/`);

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
