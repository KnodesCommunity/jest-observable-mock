module.exports = {
	env: { node: true },
	extends: '@knodes/eslint-config/ts',
	parserOptions: {
		project: [ './tsconfig.json', './tsconfig.spec.json' ],
		ecmaVersion: 2020,
		sourceType: 'module',
	},
};
