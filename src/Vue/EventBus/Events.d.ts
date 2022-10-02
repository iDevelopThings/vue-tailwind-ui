import {Emitter, EventHandlerMap, Handler, WildcardHandler} from "mitt";
import {emitEvent} from "./EventBus";


declare module "@idevelopthings/vue-tailwind-ui" {
	export interface EventsMap {
		'EventBusInitialized': void;
	}

	declare class EventBus implements Emitter<EventsMap> {
		get all(): EventHandlerMap<EventsMap>;

		public emit<Key extends keyof EventsMap>(type: Key, event: EventsMap[Key]): void;
		public emit<Key extends keyof EventsMap>(type: undefined extends EventsMap[Key] ? Key : never): void;
		public emit<Key extends string>(type, event?): void;

		public off<Key extends keyof EventsMap>(type: Key, handler?: Handler<EventsMap[Key]>): void;
		public off(type: "*", handler: WildcardHandler<EventsMap>): void;
		public off(type, handler?): void;
		public on<Key extends keyof EventsMap>(type: Key, handler: Handler<EventsMap[Key]>): void;
		public on(type: "*", handler: WildcardHandler<EventsMap>): void;
		public on(type, handler): void;
	}

	export function useEvent<Key extends keyof EventsMap>(type: Key, handler: Handler<EventsMap[Key]>): void;
	export function useEvent(type: "*", handler: WildcardHandler<EventsMap>): void;
	export function useEvent(type, handler): void ;

	export function emitEvent<Key extends keyof EventsMap>(type: Key, data: EventsMap[Key]): void;
	export function emitEvent(type, data): void ;
}

declare module "@vue/runtime-core" {
	import {EventBus} from "./EventBus";

	interface ComponentCustomProperties {
		$events: EventBus;
		$emitEvent: typeof emitEvent;
	}
}

export {};
