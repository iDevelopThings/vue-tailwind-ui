const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({addComponents, theme}) {
	/**
	 * BUTTON COMPONENTS
	 */
	addComponents({
		'.btn' : {
			transitionProperty       : 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter',
			transitionTimingFunction : 'cubic-bezier(0.4, 0, 0.2, 1)',
			transitionDuration       : '150ms',
			display                  : 'inline-flex',
			alignItems               : 'center',
			borderRadius             : '0.375rem',
			borderWidth              : '1px',
			borderColor              : 'transparent',
			paddingLeft              : '1rem',
			paddingRight             : '1rem',
			paddingTop               : '0.375rem',
			paddingBottom            : '0.375rem',
			fontSize                 : '0.875rem',
			lineHeight               : '1.25rem',
			userSelect               : 'none',
			inlineSize               : 'fit-content',
			whiteSpace               : 'nowrap',
			textTransform            : 'uppercase',
			textDecoration           : 'none',
			fontWeight               : '600',
			boxShadow                : 'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgb(0 0 0 / 0.05)',

			'&:hover'    : {},
			'&:focus'    : {
				opacity : '0.75',
			},
			'&:disabled' : {
				cursor  : 'not-allowed',
				opacity : '0.5',
			},

			'&.btn-sm' : {
				'padding-left'   : '0.5rem',
				'padding-right'  : '0.5rem',
				'padding-top'    : '0.25rem',
				'padding-bottom' : '0.25rem',
				'font-size'      : '0.75rem',
				'line-height'    : '1rem',
			},

			'&.btn-default' : {
				backgroundColor    : 'rgb(229 231 235)',
				color              : 'rgb(55 65 81)',
				'&:hover, &:focus' : {
					backgroundColor : 'rgb(243 244 246)',
				},
			},

			'&.btn-dark' : {
				backgroundColor    : 'rgb(51 65 85)',
				color              : 'rgb(255 255 255)',
				'&:hover, &:focus' : {
					backgroundColor : 'rgb(30 41 59)',
				},
			},

			'&.btn-primary' : {
				backgroundColor    : 'rgb(59 130 246)',
				color              : 'rgb(255 255 255)',
				'&:hover, &:focus' : {
					backgroundColor : 'rgb(37 99 235)',
				},
			},

			'&.btn-success' : {
				backgroundColor    : 'rgb(16 185 129)',
				color              : 'rgb(255 255 255)',
				'&:hover, &:focus' : {
					backgroundColor : 'rgb(5 150 105)',
				},
			},

			'&.btn-danger' : {
				backgroundColor    : 'rgb(239 68 68)',
				color              : 'rgb(255 255 255)',
				'&:hover, &:focus' : {
					backgroundColor : 'rgb(220 38 38)',
				},
			},

			'&.btn-warning' : {
				backgroundColor    : 'rgb(250 204 21)',
				color              : 'rgb(0 0 0)',
				'&:hover, &:focus' : {
					backgroundColor : 'rgb(253 224 71)',
				},
			},
		},

	});

	/**
	 * CARD COMPONENT
	 */
	addComponents({
		'.card' : {
			overflow        : 'hidden',
			borderRadius    : '0.25rem',
			backgroundColor : 'rgb(241 245 249)',
			boxShadow       : '0 0px 15px -3px rgba(0, 0, 0, 0.1), 0 0px 6px -2px rgba(0, 0, 0, 0.05)',
			'.body'         : {
				padding : '1.5rem',
			},
			'> .header'     : {
				display           : 'flex',
				flexDirection     : 'row',
				borderBottomWidth : '1px',
				borderColor       : 'rgb(203 213 225)',
				backgroundColor   : 'rgb(255 255 255)',
				paddingLeft       : '1.5rem',
				paddingRight      : '1.5rem',
				paddingTop        : '1rem',
				paddingBottom     : '1rem',
				fontSize          : '0.875rem',
				lineHeight        : '1.25rem',
				fontWeight        : '700',
				textTransform     : 'uppercase',
				color             : 'rgb(71 85 105)',
			},
			'.footer'       : {
				borderTopWidth  : '1px',
				borderColor     : 'rgb(203 213 225)',
				backgroundColor : 'rgb(255 255 255)',
				paddingLeft     : '1.5rem',
				paddingRight    : '1.5rem',
				paddingTop      : '1rem',
				paddingBottom   : '1rem',
			},
		},
	});
});
