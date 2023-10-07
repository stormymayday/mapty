import './style.css';

// Services:
import State from './services/State.js';
import Router from './services/Router.js';

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
