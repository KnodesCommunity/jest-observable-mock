module.exports = {
	preset: 'ts-jest',
	modulePathIgnorePatterns: [ '<rootDir>/dist/' ],
	moduleNameMapper: {
		'^@knodes/rxjs-testing-utils/(.*)$': [
			'<rootDir>/src/$1/src/index.ts',
		],
	},
};
