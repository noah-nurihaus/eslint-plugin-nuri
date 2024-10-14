const fs = require("fs");
const path = require("path");

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Check if multiple pairs of files have the same code",
      category: "Possible Errors",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          filePairs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                referenceFile: { type: "string" }, // 기준 파일
                targetFiles: {
                  type: "array", // 여러 대상 파일을 받을 수 있음
                  items: { type: "string" }, // 각 대상 파일의 경로
                },
              },
              required: ["referenceFile", "targetFiles"],
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {};
    const filePairs = options.filePairs || [];

    filePairs.forEach(({ referenceFile, targetFiles }) => {
      const referenceFilePath = path.resolve(process.cwd(), referenceFile);

      // 참조 파일 내용 읽기
      let referenceContent;
      try {
        referenceContent = fs.readFileSync(referenceFilePath, "utf-8");
      } catch (error) {
        context.report({
          loc: { line: 1, column: 1 },
          message: `Cannot read reference file: ${referenceFilePath}`,
        });
        return;
      }

      // 각 targetFile과 참조 파일 비교
      targetFiles.forEach((targetFile) => {
        const targetFilePath = path.resolve(process.cwd(), targetFile);

        let targetContent;
        try {
          targetContent = fs.readFileSync(targetFilePath, "utf-8");
        } catch (error) {
          context.report({
            loc: { line: 1, column: 1 },
            message: `Cannot read target file: ${targetFilePath}`,
          });
          return;
        }

        // 파일 내용이 다르면 오류 보고
        const normalizeContent = (content) => content.replace(/\s+/g, "");
        const referenceContentNormalized = normalizeContent(referenceContent);
        const targetContentNormalized = normalizeContent(targetContent);

        if (referenceContentNormalized !== targetContentNormalized) {
          context.report({
            loc: { line: 1, column: 1 },
            message: `The files ${referenceFile} and ${targetFile} have different content.`,
          });
        }
      });
    });

    return {};
  },
};
