export default {
    testEnvironment: 'node',
    transform: {},
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    coveragePathIgnorePatterns: [
        '/node_modules/'
    ],
    testMatch: ['**/tests/**/*.test.js'],
    injectGlobals: true,
};
