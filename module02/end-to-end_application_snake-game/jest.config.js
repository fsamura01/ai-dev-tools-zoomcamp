export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testMatch: ["<rootDir>/src/__tests__/**/*.test.{js,jsx}"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
};
