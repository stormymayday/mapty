export default class HomePage extends HTMLElement {

    constructor() {

        super();

    }

    connectedCallback() {

        // Getting template from the DOM
        const template = document.getElementById('home-page-template');

        // Cloning the template
        const content = template.content.cloneNode(true);

        // Appending content to the DOM
        this.appendChild(content);

        this.querySelector("#logout-btn").addEventListener("click", event => {

            app.state.isLoggedIn = false;

            app.router.go(`/login`);

        });

    }

}

customElements.define("home-page", HomePage);
