import {Emitter, EventHandlerMap} from "mitt";

declare module "./Vue/EventBus/EventBus" {
	import {Handler, WildcardHandler} from "mitt";

	export interface EventsMap {
		'TestingEvent': number;
	}

//	declare class EventBus implements Emitter<EventsMap> {
//	}

	export function useEvent<Key extends keyof EventsMap>(type: Key, handler: Handler<EventsMap[Key]>): void;
	export function useEvent(type: "*", handler: WildcardHandler<EventsMap>): void;
	export function useEvent(type, handler): void ;

	export function emitEvent<Key extends keyof EventsMap>(type: Key, data: EventsMap[Key]): void;
	export function emitEvent(type, data): void ;
}
export {};
