import {type GConstructor} from "./StoreTypes";


class RecordBase<T, TDataType> {
	_data: TDataType;

	constructor(...args: any[]) {
		this._data = args[0];
		Object.assign(this, args[0]);
	}

	public static create<T, TDataType>(this: GConstructor<T>, data: TDataType): T & TDataType {
		const inst = new (this as any)(data);
		Object.setPrototypeOf(inst, this.prototype);
		return inst;
	}

	get originalData(): TDataType {
		return this._data;
	}

}

type RecordType<T, TDataType> = {
	                                [P in keyof RecordBase<T, TDataType>]: RecordBase<T, TDataType>[P]
                                } & { [P in keyof TDataType]: TDataType[P] };

type RecordInst<T, TDataType> = {
	new(): RecordType<T, TDataType>;

	create<T, TDataType>(this: GConstructor<T>, data: TDataType): T;
}

export function Record<T, TDataType>() {
	const rType = RecordBase<T, TDataType>;
	return rType as unknown as RecordInst<T, TDataType>;
}
