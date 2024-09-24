const fs = require("fs");
const path = require("path");

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Check if two files have the same code",
      category: "Possible Errors",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          files: {
            type: "array",
            items: { type: "string" },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {};
    const files = options.files || [];

    if (files.length !== 2) {
      context.report({
        loc: { line: 1, column: 1 },
        message: "You need to specify exactly two files to compare.",
      });
      return {};
    }

    const [file1Path, file2Path] = files.map((f) =>
      path.resolve(context.getFilename(), f)
    );

    try {
      const file1Content = fs.readFileSync(file1Path, "utf-8");
      const file2Content = fs.readFileSync(file2Path, "utf-8");

      if (file1Content === file2Content) {
        context.report({
          loc: { line: 1, column: 1 },
          message: `The files ${files[0]} and ${files[1]} have identical content.`,
        });
      }
    } catch (error) {
      context.report({
        loc: { line: 1, column: 1 },
        message: `Error reading files: ${error.message}`,
      });
    }

    return {};
  },
};
