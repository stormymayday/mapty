export default class HomePage extends HTMLElement {

    constructor() {

        super();

    }

    connectedCallback() {

        // console.log(auth.currentUser);

        // Getting template from the DOM
        const template = document.getElementById('home-page-template');

        // Cloning the template
        const content = template.content.cloneNode(true);

        // Appending content to the DOM
        this.appendChild(content);

        const user = JSON.parse(localStorage.getItem('user'));

        this.querySelector('h1').innerHTML = `Welcome ${user.email}`;

        this.querySelector("#logout-btn").addEventListener("click", event => {

            localStorage.clear();

            // app.state.isLoggedIn = false;

            app.router.go(`/login`);

        });

    }

}

customElements.define("home-page", HomePage);
