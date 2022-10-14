export type Constructor = new (...args: any[]) => {};
export type GConstructor<T = {}> = new (...args: any[]) => T;

export type StoreMethodKeys<T> = ({ [P in keyof T]: T[P] extends Function ? P : never })[keyof T];
export type StoreGetterKeys<T> = ({ [P in keyof T]: T[P] extends Function ? never : P })[keyof T];

export type StoreMethods<T> = { [P in keyof T]: T[P] extends Function ? T[P] : never };
export type StoreGetters<T> = { [P in keyof T]: T[P] extends Function ? never : T[P] };

//export type StoreMethods<T> = Pick<T, StoreMethodKeys<T>>;
//export type StoreGetters<T> = Pick<T, StoreGetterKeys<T>>;

export type StoreStateObject<T> = ({ [P in keyof T]: T[P] extends Function ? never : (P extends 'state' ? T[P] : never) })[keyof T];

export type StoreStateGetters<T> = {
	[P in keyof StoreStateObject<T> as `$${string & P}`]: StoreStateObject<T>[P]
};

export type CombinedStore<T> = StoreStateGetters<T> & T;


