<template>
	<div class="max-w-3xl mx-auto py-4 flex flex-col space-y-4">
		<button class="btn btn-primary" @click="testStore.updateCounterAndName()">
			Increment
		</button>

		<input type="text" class="form-control" v-model="testStore.$name">

		<p>Data:</p>
		<pre>{{ testStore.$name }}</pre>
		<pre>{{ testStore.state.name }}</pre>
		<pre>{{ testStore.namepls }}</pre>
	</div>
</template>

<script setup lang="ts">
import {testStore} from "./TestingStore";

//console.log(testStore);

</script>
