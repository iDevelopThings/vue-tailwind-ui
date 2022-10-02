<template>
	<div class="max-w-3xl mx-auto py-4 flex flex-col space-y-4">
		<button class="btn btn-primary" @click="testStore.updateCounterAndName()">
			Increment
		</button>

		<p>Data:</p>
		<pre>{{ testStore.getName }}</pre>
	</div>
</template>

<script setup lang="ts">
import {testStore} from "./TestingStore";

</script>
