module.exports = {
	prettier: true,
	parserOptions: {
		project: './tsconfig.xo.json',
	},
	extends: require.resolve('eslint-config-xo-react'),
	rules: {
		'@typescript-eslint/consistent-type-definitions': 'off',
		'@typescript-eslint/naming-convention': 'off',
		'capitalized-comments': 'off',
		'unicorn/no-array-reduce': 'off',
		'no-warning-comments': 'off',
		'import/extensions': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-unknown-property': 'off',
	},
	overrides: [
		{
			files: ['src/app/**/*.ts'],
			rules: {
				'import/no-unassigned-import': 'off',
			},
		},
	],
};
