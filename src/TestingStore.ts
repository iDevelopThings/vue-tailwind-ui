import {Store} from "./Vue/Stores/Store";

interface IStore {
	name: string;
	counter: number;
}

class TestStore {

	get state(): IStore {
		return {
			name    : '',
			counter : 0,
		};
	}

	doSomething(): string {
		return "hello";
	}

	doSomethingElse(value: boolean): string {
		return "hello";
	}

	get namepls() {
		return this.state.name;
	}

	updateCounterAndName() {
		this.state.counter++;
		this.state.name = 'hello ' + this.state.counter;
	}

}

export const testStore = Store(TestStore);

console.log('Created store: ', testStore);
