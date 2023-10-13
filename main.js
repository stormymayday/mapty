import './style.scss';

// Services:
import State from './services/State.js';
import Router from './services/Router.js';

// Components:
import RegistrationPage from './components/RegistrationPage.js';
import LoginPage from './components/LoginPage.js';
import HomePage from './components/HomePage.js';

// Assets:
import javascriptLogo from './javascript.svg';
import viteLogo from '/vite.svg';

// Attaching app object to the window
window.app = {};

// Hooking State to the app.state
app.state = State;

// Making Router global 
app.router = Router;

window.addEventListener("DOMContentLoaded", async () => {

  // Initializing the Router
  app.router.init();

});
