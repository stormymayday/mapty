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

        const user = JSON.parse(localStorage.getItem('user'));
        const userID = JSON.parse(localStorage.getItem('userID'));
        const userRole = JSON.parse(localStorage.getItem('userRole'));

        switch (route) {

            case "/":

                if (userID && userRole === 'reporter') {

                    pageElement = document.createElement("reporter-dashboard-page");

                    break;

                } else if (userID && userRole === 'driver') {

                    pageElement = document.createElement("driver-dashboard-page");

                    break;

                }
                else {

                    pageElement = document.createElement("login-page");

                    break;

                }

            case "/create-case":

                if (userID && userRole === 'reporter') {

                    pageElement = document.createElement("create-case-page");

                    break;
                }

            case "/registration":

                if (userID && userRole === 'reporter') {

                    pageElement = document.createElement("reporter-dashboard-page");

                    break;

                } else if (userID && userRole === 'driver') {

                    pageElement = document.createElement("driver-dashboard-page");

                    break;

                }
                else {

                    pageElement = document.createElement("registration-page");

                    break;

                }

            case "/login":

                if (userID && userRole === 'reporter') {

                    pageElement = document.createElement("reporter-dashboard-page");

                    break;

                } else if (userID && userRole === 'driver') {

                    pageElement = document.createElement("driver-dashboard-page");

                    break;

                }
                else {

                    pageElement = document.createElement("login-page");

                    break;

                }

            default:

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
