/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@hive/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
