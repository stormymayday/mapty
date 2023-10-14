import Router from "../services/Router.js";
import { signOut } from "firebase/auth";
import { auth, db } from "../services/API.js";
import { collection, query, where, getDocs } from "firebase/firestore";

export default class ReporterDashboardPage extends HTMLElement {

    constructor() {

        super();

    }

    getUserCases = async () => {

        const user = JSON.parse(localStorage.getItem('user'));

        const q = query(collection(db, "cases"), where("reporterId", "==", user.uid));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });

    }

    async logOut() {

        await signOut(auth);

        Router.go(`/login`);

    }

    connectedCallback() {

        this.getUserCases();

        // Getting template from the DOM
        const template = document.getElementById('reporter-dashboard-page-template');

        // Cloning the template
        const content = template.content.cloneNode(true);

        // Appending content to the DOM
        this.appendChild(content);

        const user = JSON.parse(localStorage.getItem('user'));
        const userRole = JSON.parse(localStorage.getItem('userRole'));

        if (user) {

            this.querySelector('h2').innerHTML = `Welcome ${user.email}`;
            this.querySelector('h3').innerHTML = `Welcome ${userRole}`;

            this.querySelector("#create-case-btn").addEventListener("click", async (event) => {

                Router.go(`/create-case`);

            });

            this.querySelector("#logout-btn").addEventListener("click", async (event) => {

                localStorage.clear();

                await this.logOut();

            });

        }

    }

}

customElements.define("reporter-dashboard-page", ReporterDashboardPage);
