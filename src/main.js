import { createApp } from "vue";
import { createPinia } from "pinia"; // Import Pinia
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.vue";
import router from "./router"; // Import router

const app = createApp(App); // Create app instance

const pinia = createPinia(); // Create Pinia instance

app.use(pinia); // <-- Use Pinia BEFORE mounting
app.use(router); // <-- Use Router BEFORE mounting

app.mount("#app"); // <-- Mount the app LAST
