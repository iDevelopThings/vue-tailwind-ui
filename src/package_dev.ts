import {createApp} from 'vue';
import App from './TestComponents.vue';
import './components.css';
import {DatePlugin} from "./Vue/DatePlugin";
import {EventBusPlugin} from "./Vue/EventBus/EventBus";

const app = createApp(App);

app.use(EventBusPlugin);
app.use(DatePlugin);

app.mount('#app');
