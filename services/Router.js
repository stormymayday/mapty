const Router = {

    init: () => {

        // Event Handler for URL changes
        window.addEventListener("popstate", event => {

            // Reading the route object that was pushed to the History API
            // The second argument (false) prevents adding another entry to the History API
            Router.go(event.state.route, false);

        });

        // Checking the initial URL
        Router.go(location.pathname);

    },

    go: (route, addToHistory = true) => {

        if (addToHistory) {

            // Adding route to the History API
            history.pushState({ route }, '', route);

        }

        let pageElement = null;

        switch (route) {

            case "/":

                const user = JSON.parse(localStorage.getItem('user'));

                if (user) {

                    pageElement = document.createElement("home-page");

                    break;

                } else {

                    pageElement = document.createElement("login-page");

                    break;
                }

            case "/registration":

                pageElement = document.createElement("registration-page");

                break;

            case "/login":

                pageElement = document.createElement("login-page");

                break;

            // default:

        }

        // Checking if there is a pageElement to render
        // (If Router found a valid route)
        if (pageElement) {

            // Caching the <main id="app">
            const appContainer = document.querySelector("#app");

            // Clearing the appContainer
            appContainer.innerHTML = "";

            // Inserting the page content
            appContainer.appendChild(pageElement);

            // Resetting the scroll position
            // Going to the top both horizontally and vertically
            window.scrollX = 0;
            window.scrollY = 0;

        } else {

            // Caching the <main id="app">
            const appContainer = document.querySelector("#app");

            pageElement = document.createElement("h1");
            pageElement.textContent = "Page Not Found";

            // Clearing the appContainer
            appContainer.innerHTML = "";

            // Inserting the page content
            appContainer.appendChild(pageElement);

            // Resetting the scroll position
            // Going to the top both horizontally and vertically
            window.scrollX = 0;
            window.scrollY = 0;

        }

    },

};

export default Router;
