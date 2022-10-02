import {klona} from "klona";
import {isRef, markRaw, reactive, ref, unref} from "vue";

export type Constructor<T = {}> = {
	new(...args: any[]): T
	prototype: T
};

export type StoreCtorBase<T> = {
	                               get state(): any;
	                               [key: string]: any;
                               } & T;


export type StoreMethodKeys<T> = ({ [P in keyof T]: T[P] extends Function ? P : never })[keyof T];
export type StoreGetterKeys<T> = ({ [P in keyof T]: T[P] extends Function ? never : P })[keyof T];
export type StoreMethods<T> = Pick<T, StoreMethodKeys<T>>;
export type StoreGetters<T> = Pick<T, StoreGetterKeys<T>>;


export type StoreStateObject<T> = Readonly<({ [P in keyof T]: T[P] extends Function ? never : (P extends 'state' ? T[P] : never) })[keyof T]>;
export type StoreStateGetters<T> = Readonly<{
	[P in keyof StoreStateObject<T> as `get${Capitalize<string & P>}`]: /*Ref<StoreStateObject<T>[P]> |*/ StoreStateObject<T>[P]
}>;
export type StoreStateSetters<T> = Readonly<{
	[P in keyof StoreStateObject<T> as `set${Capitalize<string & P>}`]: (value: StoreStateObject<T>[P]) => void
}>;

export interface HistoryItem {
	state: any,
	modification: { before: any, after: any },
	time: number
}

export type StoreClass<TStore> =
//                                 StoreMethods<TStore> &
	StoreGetters<TStore> &
	StoreStateGetters<TStore> &
	StoreStateSetters<TStore> &
	TStore &
	{
		get state(): StoreStateGetters<TStore>;

		__getHistory(): HistoryItem[];
		__enableHistory(): void;
		__disableHistory(): void;
		__undoLastOperation(): void;
	};

export type StoreConstructor<T = {}> = Constructor<StoreGetters<T> & StoreCtorBase<T>>;


function StoreMixin<TStore, TBase = Constructor>(Base: TBase): TStore & TBase {
	const base = Base as unknown as Constructor;
	return class extends base {
		private _state: any = reactive({});

		constructor(...args: any[]) {
			super(...args);
		}

	} as unknown as TStore & TBase;
}

export function Store<TBase extends StoreConstructor>(Base: TBase, options: { history?: boolean } = {history : false}) {
	const store    = StoreMixin(Base);
	const instance = new store() as any;

	const originalState     = klona(instance.state) as { [key: string]: any };
	instance.__defaultState = originalState;
	instance.__state        = {};
	instance.__trackChanges = ref(options?.history ?? false);

	const modifications = [];

	Object.defineProperty(instance, 'state', {
		value        : {},
		configurable : true,
	});

	instance.__history = ref<HistoryItem[]>([]);

	for (let key in originalState) {
		const capFirst = key.substring(0, 1).toUpperCase() + key.substring(1);

		instance.__state[key] = isRef(originalState[key]) ? originalState[key] : ref(originalState[key]);

		Object.defineProperty(instance.state, key, {
			get() {
				return instance.__state[key].value;
			},
			set(value) {
				if (instance.__trackChanges.value) {
					const oldValue = klona(unref(instance.__state[key]));
					instance.__history.value.unshift(markRaw({
						state        : Object.keys(instance.__state).reduce((acc, key) => {
							acc[key] = unref(instance.__state[key]);
							return acc;
						}, {}),
						modification : {
							before : oldValue,
							after  : klona(unref(value)),
						},
						time         : Date.now()
					}));
				}
				instance.__state[key].value = value;
			}
		});

		Object.defineProperty(instance, `get${capFirst}`, {
			configurable : false,
			get(): any {
				return this.state[key];
			}
		});

		Object.defineProperty(instance, `set${capFirst}`, {
			configurable : false,
			writable     : false,
			value(value: any) {
				this.state[key] = value;
			},
		});
	}

	instance.__enableHistory = () => instance.__trackChanges.value = true;

	instance.__disableHistory = () => {
		instance.__history.value      = [];
		instance.__trackChanges.value = false;
	};
	instance.__getHistory     = () => {
		return instance.__history.value;
	};

	instance.__undoLastOperation = function () {
		if (!instance.__trackChanges.value) {
			console.error('Cannot undo last operation, track changes is disabled');
			return;
		}
		//			ignoreUpdates(() => {
		//				if (!instance.__history?.value?.length) return;
		//
		//				const {state, time} = instance.__history.value.shift();
		//				for (let key in state) {
		//					const capFirst = key.substring(0, 1).toUpperCase() + key.substring(1);
		//
		//					instance[`set${capFirst}`](state[key]);
		//				}
		//				//			instance.__state = reactive(state);
		//				console.log('undo', time, state);
		//			});
	};

	return instance as StoreClass<TBase['prototype']>;
}





