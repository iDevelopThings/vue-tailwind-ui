import {defineConfig} from 'vite';
import dts            from "vite-plugin-dts";
import vue            from '@vitejs/plugin-vue';

export default defineConfig({
	plugins : [
		dts({
			tsConfigFilePath : "./tsconfig.json",
			insertTypesEntry : true,
		}),
		vue(),
	],
	build   : {
		outDir        : 'dist',
		sourcemap     : true,
		lib           : {
			name     : 'VueTailwindUi',
			entry    : './src/index.ts',
			fileName : 'index',
			formats  : ['es', 'cjs', 'umd', 'iife'],
		},
		rollupOptions : {
			external : ['vue', '@inertiajs/inertia', '@inertiajs/inertia-vue3', 'lodash', 'axios', '@heroicons/vue', 'mitt', 'klona', "dayjs"],
			output   : {
				globals : {
					vue                       : 'Vue',
					'@inertiajs/inertia'      : 'Inertia',
					'@inertiajs/inertia-vue3' : 'InertiaVue3',
					lodash                    : '_',
					axios                     : 'axios',
					'@heroicons/vue'          : 'HeroiconsVue',
					mitt                      : 'mitt',
					klona                     : 'klona',
					dayjs                     : 'dayjs',
				},
			},
		},
	},
});
