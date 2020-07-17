module.exports = {
  moduleFileExtensions: ['js', 'json', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(png|jpg|jpeg|gif)$': '<rootDir>/test/__mocks__/assertMocks.js',
    '\\h3-plugins-developer.js': '<rootDir>/test/__mocks__/h3pluginMocks.js',
  },
  setupFiles: ['<rootDir>/test/__mocks__/localStorageMock.js'],
  testRegex: '/test/spec/form-logic/.*.spec.js$',
  // testRegex: '/test/spec/form-logic/init-set-value/init-set-value.spec.js$',
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest',
  },
  collectCoverage: false,
  coverageDirectory: '<rootDir>/test/coverage',
  collectCoverageFrom: [
    '**/src/**',
    '**/*.{js,vue}',
    '!**/src/icons/**',
    '!**/src/styles/**',
    '!**/node_modules/**',
    '!**/packages/**',
  ],
  coverageReporters: ['html', 'text-summary'],
};
