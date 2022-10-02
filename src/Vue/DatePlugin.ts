import {type App} from "@vue/runtime-core";
import {type Plugin} from "vue";

let currentTime = new Date();

export function useTime(): Date {
	return currentTime;
}

export const DatePlugin: Plugin = {
	install(app: App, ...options: any[]) {
		app.config.globalProperties.$currentTime = currentTime;

		setInterval(() => {
			currentTime                              = new Date();
			app.config.globalProperties.$currentTime = currentTime;
		}, 5000);
	}
};
