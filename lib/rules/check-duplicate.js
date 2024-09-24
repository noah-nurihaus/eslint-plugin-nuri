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

    const currentFilePath = path.resolve(process.cwd(), context.getFilename());
    const [file1Path, file2Path] = files.map((f) =>
      path.isAbsolute(f) ? f : path.resolve(process.cwd(), f)
    );

    if (currentFilePath !== file1Path && currentFilePath !== file2Path) {
      return {};
    }

    try {
      const normalizeContent = (content) => content.replace(/\s+/g, "");
      const file1Content = fs.readFileSync(file1Path, "utf-8");
      const file2Content = fs.readFileSync(file2Path, "utf-8");

      const file1ContentNormalized = normalizeContent(file1Content);
      const file2ContentNormalized = normalizeContent(file2Content);

      if (file1ContentNormalized !== file2ContentNormalized) {
        context.report({
          loc: { line: 1, column: 1 },
          message: `The files ${files[0]} and ${files[1]} have different content.`,
        });
      }
    } catch (error) {
      console.error("Error reading files:", error);
      context.report({
        loc: { line: 1, column: 1 },
        message: `Error reading files: ${error.message}`,
      });
    }

    return {};
  },
};
