export default {
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.js'],
    transform: {},
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    coveragePathIgnorePatterns: [
        '/node_modules/'
    ],
};
