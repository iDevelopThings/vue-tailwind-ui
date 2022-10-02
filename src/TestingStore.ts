import {Store} from "./Vue/Stores/Store";

interface IStore {
	name: string;
	counter: number;
}

export const testStore = Store(class {
	get state(): IStore {
		return {
			name    : '',
			counter : 0,
		};
	}

	doSomething(): string {
		return "hello";
	}

	updateCounterAndName() {
		this.state.counter++;
		this.state.name = 'hello ' + this.state.counter;
	}

}, {history : true});
