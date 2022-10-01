```shell
npm i @idevelopthings/vue-tailwind-ui
yarn add @idevelopthings/vue-tailwind-ui
```

## Tailwind Plugin for buttons/cards
![buttons/cards](https://user-images.githubusercontent.com/4105581/193417729-399e6843-c7aa-4425-b4de-fd91e319f093.png)

```js
/**
 * @type {import('tailwindcss/types/index').Config}
 */
module.exports = {
	content : ['index.html', './src/**/*.{js,jsx,ts,tsx,vue,html}'],
	theme   : {
		extend : {},
	},
	plugins : [
		require('@idevelopthings/vue-tailwind-ui/tailwind-plugin'),
	],
};
```


## Form CSS Helper
Add this import to your main index.ts/js
```js
import '@idevelopthings/vue-tailwind-ui/css';
```

### Vue example:
```vuejs
<div class="form-group" :class="{'has-error' : form.errors?.name}">
    <label for="name" class="control-label">Name</label>
    <input id="name"
           type="text"
           class="form-control"
           name="name"
           v-model="form.name"
           required
    >
    <div class="help-block" v-if="form.errors?.name">
        <strong>{{ form.errors?.name }}</strong>
    </div>
</div>
```

