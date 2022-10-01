<template>
	<div
		ref="root"
		class="form-group"
		:class="{
            'has-error' : !!form.errors[id],
            'required' : form.previewMode ? false : required,
        }"
	>
		<label :for="id" v-if="!disableLabel">{{ formLabel }}</label>

		<slot name="above-input" :props="{...$props, ...$attrs}"></slot>

		<template v-if="type === 'textarea'">
            <textarea :id="id"
					  :disabled="form.processing"
					  v-if="!form.previewMode"
					  ref="input"
					  @keydown.enter="changed"
					  @blur="changed"
					  class="form-control"
					  :name="id"
					  :placeholder="placeholder"
					  v-model="form[id]"
					  :required="required"
			></textarea>
			<div v-else class="preview " :class="'textarea'">
				<p class="font-semibold text-slate-800">{{ form[id] }}</p>
			</div>
		</template>
		<template v-else-if="type === 'texteditor'">
            <textarea :id="id"
					  v-if="!form.previewMode"
					  :disabled="form.processing"
					  ref="input"
					  @keydown.enter="changed"
					  @blur="changed"
					  class="form-control"
					  :name="id"
					  :placeholder="placeholder"
			></textarea>
			<div v-else class="preview " :class="'textarea'">
				<p class="font-semibold text-slate-800">{{ form[id] }}</p>
			</div>
		</template>
		<template v-else-if="type === 'file'">
			<input :id="id"
				   v-if="!form.previewMode"
				   ref="input"
				   :disabled="form.processing"
				   type="file"
				   class="form-control  "
				   :class="{
                       'no-rounding-bottom':(filePreview.canShow && filePreview.isFile) && !((form.previewMode || showImagePreview) && imageFile.isImage),
                   }"
				   :name="id"
				   @input="form[id] = $event.target.files[0]"
				   :placeholder="placeholder"
				   :accept="$attrs.accept || 'image/*,application/pdf'"
				   :required="required"
			/>
			<div v-if="(form.previewMode || showImagePreview) && imageFile.isImage" class="preview " :class="'file'">
				<p class="form-label my-2">Preview: </p>
				<img :src="imageFile.url" alt="" class="rounded max-h-44 shadow">
			</div>
			<div v-else-if="filePreview.canShow && filePreview.isFile">
				<div class="bg-slate-200 rounded-b shadow px-4 py-2 flex flex-row items-center flex-wrap">
					<p class="flex-1 text-sm text-slate-800"><strong>File URL: </strong>{{ filePreview.url }}</p>
					<a :href="filePreview.url" download class="btn btn-primary btn-sm flex flex-row items-center space-x-1">
						<ArrowDownTrayIcon class="w-4 h-4"/>
						<span>Download</span>
					</a>
				</div>
			</div>
		</template>
		<template v-else-if="type === 'select'">
			<select
				:id="id"
				@keydown.enter="changed"
				@blur="changed"
				:disabled="form.processing"
				v-if="!form.previewMode"
				ref="input"
				class="form-control"
				:name="id"
				v-model="form[id]"
				:required="required"
			>
				<option :value="option.value" v-for="option in options">{{ option.text }}</option>
			</select>
			<div v-else class="preview " :class="'select'">
				<p class="font-semibold text-slate-800">{{ form[id] }}</p>
			</div>
		</template>
		<template v-else>
			<input :id="id"
				   v-if="!form.previewMode"
				   ref="input"
				   @keydown.enter="changed"
				   @blur="changed"
				   :disabled="form.processing"
				   :min="$attrs?.min"
				   :max="$attrs?.max"
				   :step="$attrs?.step"
				   :type="type || 'text'"
				   class="form-control"
				   :name="id"
				   :placeholder="placeholder"
				   v-model="form[id]"
				   :required="required"
			>
			<div v-else class="preview " :class="type || 'text'">
				<p class="font-semibold text-slate-800">{{ form[id] }}</p>
			</div>
		</template>

		<slot name="below-input" :props="{props, $attrs}"></slot>

		<div class="help-block" v-if="!!form.errors[id]">
			<strong>{{ form.errors[id] }}</strong>
		</div>
	</div>
</template>

<script setup lang="ts">
import {onMounted, ref, useAttrs} from "vue";
import {ArrowDownTrayIcon} from "@heroicons/vue/24/outline";
import type {Form} from "./Inertia/InertiaUseForm";

const root  = ref();
const input = ref();

const emit = defineEmits<{
	(event: 'change'): void
}>();

const props = withDefaults(defineProps<{
	form: Form<any>;
	type: string;
	id: string;
	placeholder?: string;
	required?: boolean;
	label?: string;
	options?: any[];
	showImagePreview?: boolean;
	disableLabel?: boolean;
}>(), {
	showImagePreview : false,
	required         : false,
	disableLabel     : false,
});

function changed() {
	emit('change');
}

function formatLabel() {
	let label = props.id.charAt(0).toUpperCase() + props.id.slice(1);
	label     = label
		.replaceAll(/_/g, " ")
		.replaceAll(/-/g, " ");

	return label;
}

const formLabel = ref(props.label ?? formatLabel());

const imageFile   = ref({
	isImage  : false,
	filePath : null,
	url      : null,
});
const filePreview = ref<{
	canShow: boolean,
	isFile: boolean,
	url: string | null;
	path: string | null;
}>({
	canShow : false,
	isFile  : false,
	url     : null,
	path    : null,
});
const editor      = ref(null);
const attrs       = useAttrs();

onMounted(async () => {
	if (input?.value && props.form.setField) {
		props.form.setField(props.id, input.value);
	}

	if (props.type === "file") {
		if (props.form?.onReset) {
			props.form.onReset(props.id, () => {
				if (input?.value) {
					input.value.value = null;
				}
			});
		}

		if (props?.form.previewMode || props?.showImagePreview) {
			if (props.form[props.id] && props.form[props.id + "Preview"]) {
				const preview            = props.form[props.id + "Preview"];
				imageFile.value.filePath = preview.path;
				imageFile.value.url      = preview.url;
				const img                = new Image();
				img.onload               = () => {
					imageFile.value.isImage = true;
				};
				img.src                  = preview.url;
			}

			if (props.form[props.id] && props.form[props.id + "_url"]) {
				imageFile.value.filePath = props.form[props.id];
				imageFile.value.url      = props.form[props.id + "_url"];
				const img                = new Image();
				img.onload               = () => {
					imageFile.value.isImage = true;
				};
				img.src                  = imageFile.value.url;
			}
		} else {
			if (props.form[props.id] && props.form[props.id + "_url"]) {
				filePreview.value = {
					isFile  : true,
					canShow : true,
					path    : props.form[props.id],
					url     : props.form[props.id + "_url"],
				};
			}
		}
	}
});
</script>
