const plugin       = require('tailwindcss/plugin');
/**
 * @type {import('tailwindcss/types/index').Config}
 */
module.exports = {
	content : ['index.html', './src/**/*.{js,jsx,ts,tsx,vue,html}'],
	theme   : {
		extend : {},
	},
	plugins : [
		require('./tailwind-plugin.cjs'),
	],
};
