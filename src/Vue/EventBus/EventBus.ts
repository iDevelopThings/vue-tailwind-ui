import {type App} from "@vue/runtime-core";
import type {Emitter, EventHandlerMap, Handler, WildcardHandler} from "mitt";
import {getCurrentScope, onScopeDispose, type Plugin} from "vue";
import MittEventBus from 'mitt';
import {type EventsMap} from "./EventsMap";

export class EventBus implements Emitter<EventsMap> {

	private eventBus = MittEventBus<EventsMap>();

	get all(): EventHandlerMap<EventsMap> {
		return this.eventBus.all;
	}

	public emit<Key extends keyof EventsMap>(type: Key, event: EventsMap[Key]): void;
	public emit<Key extends keyof EventsMap>(type: undefined extends EventsMap[Key] ? Key : never): void;
	public emit<Key extends string>(type, event?): void {
		this.eventBus.emit(type as any, event as any);
	}

	public off<Key extends keyof EventsMap>(type: Key, handler?: Handler<EventsMap[Key]>): void;
	public off(type: "*", handler: WildcardHandler<EventsMap>): void;
	public off(type, handler?): void {
		this.eventBus.off(type, handler);
	}

	public on<Key extends keyof EventsMap>(type: Key, handler: Handler<EventsMap[Key]>): void;
	public on(type: "*", handler: WildcardHandler<EventsMap>): void;
	public on(type, handler): void {
		this.eventBus.on(type, handler);
	}
}

const GlobalEventBus = new EventBus();

export const EventBusPlugin: Plugin = {
	install(app: App, ...options: any[]) {
		app.config.globalProperties.$events    = GlobalEventBus;
		app.config.globalProperties.$emitEvent = GlobalEventBus.emit.bind(GlobalEventBus);
	}
};

export function useEvent<Key extends keyof EventsMap>(type: Key, handler: Handler<EventsMap[Key]>): void;
export function useEvent(type: "*", handler: WildcardHandler<EventsMap>): void;
export function useEvent(type, handler): void {
	const scope = getCurrentScope();
	if (!scope) {
		throw new Error('No scope found. Are you using the plugin outside of a Vue component/setup?');
	}

	GlobalEventBus.on(type, handler);

	onScopeDispose(() => {
		GlobalEventBus.off(type, handler);
		console.log('disposed event listener for', type);
	});
}

export function emitEvent<Key extends keyof EventsMap>(type: Key, data: EventsMap[Key]): void;
export function emitEvent(type, data): void {
	GlobalEventBus.emit(type, data);
}


//export {useEvent, emitEvent};
