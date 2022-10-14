import {klona} from "klona";
import {Any} from "ts-toolbelt";
import {isRef, ref} from "vue";
import {type CombinedStore} from "./StoreTypes";

type Constructor<T = { state: any }> = {
	new(...args: any[]): T
	prototype: T
};


function getDescriptors(store: any) {
	const descriptors = Object.getOwnPropertyDescriptors(store);
	if (store.__proto__) {
		const protoDescriptors = getDescriptors(store.__proto__);
		for (const key in protoDescriptors) {
			if (!descriptors[key]) {
				descriptors[key] = protoDescriptors[key];
			}
		}
	}

	return descriptors;
}

export const ClassStoreSymbol = Symbol('ClassStore');

class StoreBase<TBase, TState> {

	[ClassStoreSymbol] = null;

	__defaultStore: TBase;
	__defaultState: TState;
	__state: { [key: string]: any } = {};

	constructor(storeCtor: any) {

		this[ClassStoreSymbol] = storeCtor;

		const store       = new storeCtor();
		const descriptors = getDescriptors(store);

		this.__defaultStore = klona(store);
		this.__defaultState = klona(store.state);
		this.__state        = {};

		// Force the store to extend this class
		Object.setPrototypeOf(store, this);
		// Override the stores get state() getter
		Object.defineProperty(store, 'state', {value : {}, configurable : true});

		// Create a reactive state object
		// Then redefine the state values on the store.state as refs.
		// Also define the $state properties on the store
		for (let key in this.__defaultState) {
			this.__state[key] = isRef(this.__defaultState[key]) ? this.__defaultState[key] : ref(this.__defaultState[key]);

			Object.defineProperty(store.state, key, {
				get : () => {
					return this.__state[key].value;
				},
				set : (value) => {
					this.__state[key].value = value;
				}
			});
			Object.defineProperty(store, "$" + key, {
				get : () => {
					return this.__state[key].value;
				},
				set : (value) => {
					this.__state[key].value = value;
				}
			});
		}

		// Copy all the properties/methods from the store to this class
		for (let key in descriptors) {
			if (key === 'constructor') {
				continue;
			}

			const descriptor = descriptors[key];

			if (typeof descriptor.value === 'function') {
				Object.defineProperty(this, key, {
					value : descriptor.value.bind(store),
				});
				continue;
			}

			Object.defineProperty(this, key, descriptor);

		}

		return store;
	}

}

export function Store<T extends Constructor>(main: T) {
	const store = new StoreBase<T['prototype'], T['prototype']['state']>(main);
	return store as unknown as Any.Compute<CombinedStore<T['prototype']>>;
}





