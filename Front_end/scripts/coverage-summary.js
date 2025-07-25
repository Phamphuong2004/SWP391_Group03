#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc file coverage JSON
const coveragePath = path.join(__dirname, "../coverage/coverage-final.json");

if (!fs.existsSync(coveragePath)) {
  console.log(
    "❌ Không tìm thấy file coverage. Hãy chạy: npm run test:coverage"
  );
  process.exit(1);
}

const coverage = JSON.parse(fs.readFileSync(coveragePath, "utf8"));

// Tính toán tổng coverage
let totalStatements = 0;
let coveredStatements = 0;
let totalBranches = 0;
let coveredBranches = 0;
let totalFunctions = 0;
let coveredFunctions = 0;
let totalLines = 0;
let coveredLines = 0;

const fileDetails = [];

Object.entries(coverage).forEach(([filePath, data]) => {
  // Bỏ qua các file test và config
  if (
    filePath.includes(".test.") ||
    filePath.includes(".spec.") ||
    filePath.includes("test-setup.js") ||
    filePath.includes("config.")
  ) {
    return;
  }

  const statements = data.s || {};
  const branches = data.b || {};
  const functions = data.f || {};

  const fileStatements = Object.values(statements).length;
  const fileCoveredStatements = Object.values(statements).filter(
    (v) => v > 0
  ).length;

  const fileBranches = Object.values(branches).flat().length;
  const fileCoveredBranches = Object.values(branches)
    .flat()
    .filter((v) => v > 0).length;

  const fileFunctions = Object.values(functions).length;
  const fileCoveredFunctions = Object.values(functions).filter(
    (v) => v > 0
  ).length;

  const fileLines = Object.keys(data.statementMap || {}).length;
  const fileCoveredLines = Object.keys(data.statementMap || {}).filter(
    (lineNum) => statements[data.statementMap[lineNum]] > 0
  ).length;

  totalStatements += fileStatements;
  coveredStatements += fileCoveredStatements;
  totalBranches += fileBranches;
  coveredBranches += fileCoveredBranches;
  totalFunctions += fileFunctions;
  coveredFunctions += fileCoveredFunctions;
  totalLines += fileLines;
  coveredLines += fileCoveredLines;

  const stmtPercent = fileStatements
    ? ((fileCoveredStatements / fileStatements) * 100).toFixed(2)
    : 0;
  const branchPercent = fileBranches
    ? ((fileCoveredBranches / fileBranches) * 100).toFixed(2)
    : 0;
  const funcPercent = fileFunctions
    ? ((fileCoveredFunctions / fileFunctions) * 100).toFixed(2)
    : 0;
  const linePercent = fileLines
    ? ((fileCoveredLines / fileLines) * 100).toFixed(2)
    : 0;

  fileDetails.push({
    file: filePath.replace(process.cwd(), "").replace(/\\/g, "/"),
    statements: `${stmtPercent}%`,
    branches: `${branchPercent}%`,
    functions: `${funcPercent}%`,
    lines: `${linePercent}%`,
  });
});

// Tính phần trăm tổng
const stmtPercent = totalStatements
  ? ((coveredStatements / totalStatements) * 100).toFixed(2)
  : 0;
const branchPercent = totalBranches
  ? ((coveredBranches / totalBranches) * 100).toFixed(2)
  : 0;
const funcPercent = totalFunctions
  ? ((coveredFunctions / totalFunctions) * 100).toFixed(2)
  : 0;
const linePercent = totalLines
  ? ((coveredLines / totalLines) * 100).toFixed(2)
  : 0;

console.log("\n🧪 CODE COVERAGE SUMMARY");
console.log("=".repeat(50));
console.log(`📊 Tổng quan:`);
console.log(
  `   Statements: ${stmtPercent}% (${coveredStatements}/${totalStatements})`
);
console.log(
  `   Branches:   ${branchPercent}% (${coveredBranches}/${totalBranches})`
);
console.log(
  `   Functions:  ${funcPercent}% (${coveredFunctions}/${totalFunctions})`
);
console.log(`   Lines:      ${linePercent}% (${coveredLines}/${totalLines})`);

console.log("\n📁 Chi tiết theo file:");
console.log("-".repeat(50));

// Sắp xếp theo coverage thấp nhất
fileDetails
  .filter((f) => parseFloat(f.statements) > 0) // Chỉ hiện các file có coverage
  .sort((a, b) => parseFloat(a.statements) - parseFloat(b.statements))
  .forEach((file) => {
    console.log(`${file.file}`);
    console.log(
      `   Statements: ${file.statements}, Branches: ${file.branches}, Functions: ${file.functions}, Lines: ${file.lines}`
    );
  });

console.log("\n📈 Khuyến nghị:");
if (parseFloat(stmtPercent) < 80) {
  console.log("❗ Coverage thấp hơn 80%. Nên viết thêm unit test.");
} else if (parseFloat(stmtPercent) < 90) {
  console.log("⚠️  Coverage tốt nhưng có thể cải thiện thêm.");
} else {
  console.log("✅ Coverage rất tốt! Tiếp tục duy trì.");
}

console.log("\n🚀 Để xem chi tiết HTML report:");
console.log("   Mở file: coverage/index.html trong browser");
