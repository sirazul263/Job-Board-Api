const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/testSetup.ts"],
  transform: {
    ...tsJestTransformCfg,
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
};
