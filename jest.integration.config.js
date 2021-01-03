const baseConfig = require( './jest.config' );
module.exports = {
	...baseConfig,
	collectCoverage: false,
	testMatch: [
		'**/__tests__/integration/**/*.[jt]s',
		'!**/__tests__/integration/helpers/**/*.[jt]s',
		'!**/__tests__/integration/**/__*.[jt]s',
	],
	globals: {
		...baseConfig.globals,
		'ts-jest': {
			...baseConfig.globals['ts-jest'],
			tsconfig: './__tests__/tsconfig.json',
		},
	},
};
