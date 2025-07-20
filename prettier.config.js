/**  @type {import("prettier").Config} */
export default {
  printWidth: 120,
  overrides: [
    {
      files: ["*.css", "*.js"],
      options: {
        tabWidth: 4,
      },
    },
  ],
};
