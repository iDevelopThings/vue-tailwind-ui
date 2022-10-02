import {createApp} from 'vue';
import App from './TestComponents.vue';
import './components.css';
import {EventBusPlugin} from "./Vue/EventBus/EventBus";

const app = createApp(App);

app.use(EventBusPlugin);

app.mount('#app');
