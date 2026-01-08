/**
 * jest.config.js
 * Purpose: Jest configuration for the repository. Uses `ts-jest` preset
 * and `jsdom` test environment so TypeScript React components can be
 * tested. The config maps `@/` imports to `src/` and loads the
 * global `jest.setup.js` file after environment setup.
 */

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/utils/envWrapper$": "<rootDir>/tests/mocks/envWrapper.cjs",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/pages/**", "!src/**/*.astro"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: false,
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
};
