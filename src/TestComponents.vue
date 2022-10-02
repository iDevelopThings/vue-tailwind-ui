<template>
	<div class="max-w-3xl mx-auto py-12 flex flex-col space-y-4 divide-y divide-slate-400 max-h-screen h-screen justify-center items-center">
		<div class="w-full">
			<p class="text-lg">Events</p>

			<TestEvents/>
		</div>

		<div class="w-full">
			<p class="text-lg">Store</p>

			<TestStore/>
		</div>

		<div class="w-full">
			<p class="text-lg">Buttons</p>
			<div class="flex flex-col items-center justify-center gap-6">
				<div class="flex flex-row">
					<button class="btn btn-default">btn-default</button>
					<button class="btn btn-dark">btn-dark</button>
					<button class="btn btn-primary">btn-primary</button>
					<button class="btn btn-success">btn-success</button>
					<button class="btn btn-danger">btn-danger</button>
					<button class="btn btn-warning">btn-warning</button>
				</div>
				<div class="flex flex-row">
					<button class="btn btn-default btn-sm">sm btn-default</button>
					<button class="btn btn-dark btn-sm">sm btn-dark</button>
					<button class="btn btn-primary btn-sm">sm btn-primary</button>
					<button class="btn btn-success btn-sm">sm btn-success</button>
					<button class="btn btn-danger btn-sm">sm btn-danger</button>
					<button class="btn btn-warning btn-sm">sm btn-warning</button>
				</div>
			</div>
		</div>

		<div class="w-full">
			<p class="text-lg pt-8">Card</p>
			<div class="card w-full">
				<div class="header">
					This is the header
				</div>
				<div class="body">
					<p>This is the body</p>
				</div>
				<div class="footer">
					This is the footer
				</div>

			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import TestEvents from './TestEvents.vue';
import TestStore from "./TestStore.vue";

</script>
