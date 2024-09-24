module.exports = {
  rules: {
    "check-duplicate": require("./rules/check-duplicate"),
  },
  configs: {
    recommended: {
      rules: {
        "@nurihaus/nuri/check-duplicate": "error",
      },
    },
  },
};
