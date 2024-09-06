process.env.NODE_ENV = "lint";

const { ESLint } = require("eslint");
const gitChangedFiles = require("git-changed-files");
const eslintConfig = require("../../../.eslintrc.js");

(async function main() {
  const { unCommittedFiles } = await gitChangedFiles({
    formats: ["*.ts", "*.tsx"],
    // 删除的文件不进行lint
    diffFilter: "ACMRTUXB",
  });

  if (!unCommittedFiles.length) {
    return;
  }

  const eslint = new ESLint({
    fix: true,
    cache: true,
    useEslintrc: false,
    overrideConfig: eslintConfig,
  });

  const results = await eslint.lintFiles(unCommittedFiles);
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);
  // 是否有errors
  // const hasErrors = resultText && resultText.indexOf("(0 errors") === -1;
  // 有errors或warnings时都禁止提交
  if (resultText) {
    throw Error(resultText);
  }
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
