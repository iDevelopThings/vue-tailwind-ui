<template>

	<div class="max-w-3xl mx-auto py-4 flex flex-col space-y-4">
		<button class="btn btn-primary" @click="$emitEvent('TestingEvent', id + 1)">
			Send Event
		</button>

		<p>Data:</p>
		<pre>{{ data }}</pre>

	</div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useEvent} from "./Vue/EventBus/EventBus";

const data = ref(null);
const id   = ref(0);

useEvent('TestingEvent', (idVal) => {
	console.log('Received event', idVal);
	id.value   = idVal;
	data.value = idVal;
});


</script>
