const State = {
    user: {},
}

// Creating a Proxy that would broadcast changes
// First argument is the original State
// Second argument is the Handler containing Traps
const proxyState = new Proxy(State, {

    // Setting a trap for the 'set' method
    set(targetObject, propertyName, propertyValue) {

        // Validation can be added here

        // Assigning the value
        targetObject[propertyName] = propertyValue;

        // Checking if property is 'isLoggedIn'
        if (propertyName === 'isLoggedIn') {

            // Announcing that the menu was changed
            window.dispatchEvent(new Event('isLoggedIn-change'));

        }

        // Important:
        // Must return 'true' if we are accepting the set
        // Otherwise, must return 'false'
        return true;

    }

});

// Exporting the proxyState (the original State remains private)
export default proxyState;
