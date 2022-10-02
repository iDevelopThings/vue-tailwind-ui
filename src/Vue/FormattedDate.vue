<template>
	<p class="text-sm">{{ dateFormatted }}(<span class="text-sm text-slate-500">{{ dateDiff }}</span>)</p>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const props = withDefaults(defineProps<{
	date: string,
	format?: string,
}>(), {
	format : "DD MMM YY, hh:mm A",
});

const date          = computed(() => dayjs(props.date));
const dateDiff      = computed(() => dayjs().to(date.value));
const dateFormatted = computed(() => date.value.format(props.format));

</script>

