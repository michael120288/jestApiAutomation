/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment:"allure-jest/jsdom",
  testRunner: "jest-circus/runner",

  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}], // Fix regex for TypeScript files
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js", "jest-allure2"],
  testTimeout: 10000, // Increase timeout for long-running tests (e.g., file uploads)

  // ✅ Corrected reporters configuration
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "reports",
        outputName: "junit.xml",
      },
    ],
    [
      "jest-html-reporter",
      {
        pageTitle: "Test Report",
        outputPath: "reports/test-report.html",
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
  ],

};

