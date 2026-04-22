module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "**/controllers/**/*.js",
    "**/routes/**/*.js",
    "**/middleware/**/*.js",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};
