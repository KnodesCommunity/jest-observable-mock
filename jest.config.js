module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	globals: {
		'ts-jest': {
			tsconfig: 'tsconfig.spec.json',
			compiler: 'ttypescript',
		},
	},
	moduleFileExtensions: [ 'js', 'ts' ],
	testPathIgnorePatterns: ['node_modules'],
	collectCoverageFrom: ['src/**/*.{[jt]s}'],
	modulePathIgnorePatterns: [ '<rootDir>/dist' ],
	testMatch: [
		'<rootDir>/src/**/*.{spec,test}.[jt]s',
	],
};
