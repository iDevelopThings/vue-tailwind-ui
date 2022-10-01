import {reactive, watch} from "vue";
import {cloneDeep, isEqual} from "lodash";
import {Inertia, hrefToUrl, mergeDataIntoQueryString, urlWithoutHash} from "@inertiajs/inertia";
import {Progress, VisitOptions} from "@inertiajs/inertia";
import axios from "axios";
import {isFocusable} from "../FormUtils";

export interface ExtendedVisitOptions extends VisitOptions {
	usingAxios?: boolean;
}

export interface FormProps<TForm> {
	isDirty: boolean;
	errors: Record<keyof TForm, string>;
	hasErrors: boolean;
	processing: boolean;
	progress: Progress | null;
	wasSuccessful: boolean;
	recentlySuccessful: boolean;
	previewMode: boolean;

	setPreviewMode(value): this;

	setField(key, value): this;

	onReset(fieldName, callback): this;

	data(): TForm;

	transform(callback: (data: TForm) => object): this;

	defaults(): this;

	defaults(field: keyof TForm, value: string): this;

	defaults(fields: Record<keyof TForm, string>): this;

	reset(...fields: (keyof TForm)[]): this;

	clearErrors(...fields: (keyof TForm)[]): this;

	setError(field: keyof TForm, value: string): this;

	setError(errors: Record<keyof TForm, string>): this;

	submit(method: string, url: string, options?: Partial<ExtendedVisitOptions>): void;

	get(url: string, options?: Partial<ExtendedVisitOptions>): void;

	post(url: string, options?: Partial<ExtendedVisitOptions>): void;

	put(url: string, options?: Partial<ExtendedVisitOptions>): void;

	patch(url: string, options?: Partial<ExtendedVisitOptions>): void;

	delete(url: string, options?: Partial<ExtendedVisitOptions>): void;

	cancel(): void;
}

export type Form<TForm> = TForm & FormProps<TForm>;

export function useForm<TForm extends {}>(...args): Form<TForm> {
	const rememberKey               = typeof args[0] === "string" ? args[0] : null;
	const data                      = (typeof args[0] === "string" ? args[1] : args[0]) || {};
	const restored: any             = rememberKey ? Inertia.restore(rememberKey) : null;
	let defaults                    = cloneDeep(data);
	let cancelToken                 = null;
	let recentlySuccessfulTimeoutId = null;
	let transform                   = data => data;

	let form = reactive({
		...restored ? restored.data : data,
		isDirty            : false,
		errors             : restored ? restored.errors : {},
		hasErrors          : false,
		processing         : false,
		progress           : null,
		wasSuccessful      : false,
		recentlySuccessful : false,
		resetCallbacks     : {},
		fields             : {},
		previewMode        : false,
		data() {
			return Object
				.keys(data)
				.reduce((carry, key) => {
					carry[key] = this[key];
					return carry;
				}, {});
		},
		setPreviewMode(value) {
			this.previewMode = value || true;
			return this;
		},
		setField(key, value) {
			Object.assign(this.fields, (value ? {[key] : value} : key));

			return this;
		},
		transform(callback) {
			transform = callback;

			return this;
		},
		defaults(key, value) {
			if (typeof key === "undefined") {
				defaults = this.data();
			} else {
				defaults = Object.assign(
					{},
					cloneDeep(defaults),
					value ? ({[key] : value}) : key,
				);
			}

			return this;
		},

		onReset(fieldName, callback) {
			this.resetCallbacks[fieldName] = callback;

			return this;
		},
		reset(...fields) {
			let clonedDefaults = cloneDeep(defaults);
			if (fields.length === 0) {
				Object.assign(this, clonedDefaults);
			} else {
				const resetFields = Object
					.keys(clonedDefaults)
					.filter(key => fields.includes(key))
					.reduce((carry, key) => {
						carry[key] = clonedDefaults[key];
						return carry;
					}, {});

				Object.assign(this, resetFields);
			}

			Object.keys(clonedDefaults).forEach(key => {
				if (this.resetCallbacks[key]) {
					this.resetCallbacks[key]();
				}
			});

			return this;
		},
		setError(key, value) {
			Object.assign(this.errors, (value ? {[key] : value} : key));

			this.hasErrors = Object.keys(this.errors).length > 0;

			return this;
		},
		clearErrors(...fields) {
			this.errors = Object
				.keys(this.errors)
				.reduce((carry, field) => ({
					...carry,
					...(fields.length > 0 && !fields.includes(field) ? {[field] : this.errors[field]} : {}),
				}), {});

			this.hasErrors = Object.keys(this.errors).length > 0;

			return this;
		},
		submit(method, url, options: { [key: string]: any } = {}) {
			let data            = transform(this.data());
			const _options: any = {
				...options,
				onCancelToken : (token) => {
					cancelToken = token;

					if (options.onCancelToken) {
						return options.onCancelToken(token);
					}
				},
				onBefore      : visit => {
					this.wasSuccessful      = false;
					this.recentlySuccessful = false;
					clearTimeout(recentlySuccessfulTimeoutId);

					if (options.onBefore) {
						return options.onBefore(visit);
					}
				},
				onStart       : visit => {
					this.clearErrors();

					this.processing = true;

					if (options.onStart) {
						return options.onStart(visit);
					}
				},
				onProgress    : event => {
					this.progress = event;

					if (options.onProgress) {
						return options.onProgress(event);
					}
				},
				onSuccess     : async page => {
					this.processing = false;
					this.progress   = null;
					this.clearErrors();
					this.wasSuccessful          = true;
					this.recentlySuccessful     = true;
					recentlySuccessfulTimeoutId = setTimeout(() => this.recentlySuccessful = false, 2000);

					const onSuccess = options.onSuccess ? await options.onSuccess(page) : null;
					defaults        = cloneDeep(this.data());
					this.isDirty    = false;
					return onSuccess;
				},
				onError       : errors => {
					this.processing = false;
					this.progress   = null;
					this.clearErrors().setError(errors);
					if (this.hasErrors) {
						const firstKey = Object.keys(this.errors)[0];
						const first    = (firstKey.includes(".") ? firstKey.split(".").pop() : firstKey);
						console.log(".... focusing");
						if (this.fields[first]) {
							if (isFocusable(this.fields[first])) {
								this.fields[first].focus();
							}
						}
					}
					if (options.onError) {
						return options.onError(errors);
					}
				},
				onCancel      : () => {
					this.processing = false;
					this.progress   = null;

					if (options.onCancel) {
						return options.onCancel();
					}
				},
				onFinish      : () => {
					this.processing = false;
					this.progress   = null;
					cancelToken     = null;

					if (options.onFinish) {
						return options.onFinish();
					}
				},
			};

			if (_options.usingAxios) {
				_options.onStart({});

				let href = hrefToUrl(url);
				if (!(data instanceof FormData)) {
					const [_href, _data] = mergeDataIntoQueryString(method, url, data, "brackets");
					href                 = hrefToUrl(_href);
					data                 = _data;
				}

				axios.request({
						method : method,
						url    : urlWithoutHash(href).href,
						data   : method?.toLowerCase() === "get" ? {} : data,
						params : method?.toLowerCase() === "get" ? data : {},
					})
					.then(response => {
						_options.onSuccess(response.data);
					})
					.catch(error => {
						_options.onError(error.response.data);
					})
					.finally(() => _options.onFinish());

				return;
			}

			if (method === "delete") {
				Inertia.delete(url, {..._options, data});
			} else {
				Inertia[method](url, data, _options);
			}
		},
		get(url, options) {
			this.submit("get", url, options);
		},
		post(url, options) {
			this.submit("post", url, options);
		},
		put(url, options) {
			this.submit("put", url, options);
		},
		patch(url, options) {
			this.submit("patch", url, options);
		},
		delete(url, options) {
			this.submit("delete", url, options);
		},
		cancel() {
			if (cancelToken) {
				cancelToken.cancel();
			}
		},
		__rememberable : rememberKey === null,
		__remember() {
			return {data : this.data(), errors : this.errors};
		},
		__restore(restored) {
			Object.assign(this, restored.data);
			this.setError(restored.errors);
		},
	});

	watch(form, newValue => {
		form.isDirty = !isEqual(form.data(), defaults);
		if (rememberKey) {
			Inertia.remember(cloneDeep(newValue.__remember()), rememberKey);
		}
	}, {immediate : true, deep : true});

	return form;
}

export default useForm;
