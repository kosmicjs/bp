module.exports = {
	prettier: true,
	parserOptions: {
		project: './tsconfig.xo.json',
	},
	extends: require.resolve('eslint-config-xo-react'),
	rules: {
		'@typescript-eslint/consistent-type-definitions': 'off',
		'@typescript-eslint/naming-convention': 'off',
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "next|props" }],
		'capitalized-comments': 'off',
		'import/extensions': 'off',
		'no-warning-comments': 'off',
		'unicorn/no-array-reduce': 'off',
    'no-console': 'error',
    'react/no-unknown-property': 'off',
    'react/react-in-jsx-scope': 'off',
	},
	overrides: [
		{
			files: ['src/client/**/*.ts', 'src/client/**/*.tsx'],
			rules: {
				'import/no-unassigned-import': 'off',
			},
		},
	],
};
