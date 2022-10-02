import {type App} from "@vue/runtime-core";
import {type Plugin} from "vue";


export const DatePlugin: Plugin = {
	install(app: App, ...options: any[]) {
		app.config.globalProperties.$currentTime = new Date();

		setInterval(() => {
			app.config.globalProperties.$currentTime = new Date();
		}, 5000);
	}
};
