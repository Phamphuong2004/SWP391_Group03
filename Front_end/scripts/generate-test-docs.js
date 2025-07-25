#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function để đọc và parse test files
function parseTestFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const fileName = path.basename(filePath);

  // Extract test descriptions
  const describeMatches = content.match(/describe\(['"`]([^'"`]+)['"`]/g) || [];
  const itMatches = content.match(/it\(['"`]([^'"`]+)['"`]/g) || [];

  const describes = describeMatches.map((match) =>
    match.replace(/describe\(['"`]([^'"`]+)['"`]/, "$1")
  );

  const tests = itMatches.map((match) =>
    match.replace(/it\(['"`]([^'"`]+)['"`]/, "$1")
  );

  return {
    fileName,
    filePath,
    describes,
    tests,
    totalTests: tests.length,
  };
}

// Function để tìm tất cả test files
function findTestFiles(dir) {
  const testFiles = [];

  function walkDir(currentDir) {
    const files = fs.readdirSync(currentDir);

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && file !== "node_modules" && file !== ".git") {
        walkDir(filePath);
      } else if (file.endsWith(".test.jsx") || file.endsWith(".test.js")) {
        testFiles.push(filePath);
      }
    }
  }

  walkDir(dir);
  return testFiles;
}

// Generate HTML
function generateHTML(testData) {
  const totalFiles = testData.length;
  const totalTests = testData.reduce((sum, file) => sum + file.totalTests, 0);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Documentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 1rem 0;
        }
        
        .stat-card {
            background: rgba(255,255,255,0.1);
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            display: block;
        }
        
        .test-file {
            background: white;
            margin-bottom: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .file-header {
            background: #4f46e5;
            color: white;
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .file-name {
            font-size: 1.2rem;
            font-weight: 600;
        }
        
        .test-count {
            background: rgba(255,255,255,0.2);
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.9rem;
        }
        
        .file-content {
            padding: 1.5rem;
        }
        
        .describe-section {
            margin-bottom: 1.5rem;
        }
        
        .describe-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2563eb;
            margin-bottom: 0.8rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .test-list {
            list-style: none;
        }
        
        .test-item {
            padding: 0.5rem 0;
            padding-left: 1.5rem;
            position: relative;
            border-left: 3px solid #10b981;
            margin-bottom: 0.3rem;
            background: #f0fdf4;
            border-radius: 0 4px 4px 0;
        }
        
        .test-item::before {
            content: "✓";
            position: absolute;
            left: 0.5rem;
            color: #10b981;
            font-weight: bold;
        }
        
        .file-path {
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            color: #6b7280;
            margin-top: 0.5rem;
        }
        
        .summary {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-top: 2rem;
        }
        
        .footer {
            text-align: center;
            margin-top: 2rem;
            color: #6b7280;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .header {
                padding: 1rem;
            }
            
            .file-header {
                flex-direction: column;
                gap: 0.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Test Documentation</h1>
            <p>Comprehensive overview of all unit tests in the project</p>
            
            <div class="stats">
                <div class="stat-card">
                    <span class="stat-number">${totalFiles}</span>
                    <span>Test Files</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${totalTests}</span>
                    <span>Total Tests</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${new Date().toLocaleDateString()}</span>
                    <span>Generated</span>
                </div>
            </div>
        </div>
        
        ${testData
          .map(
            (file) => `
            <div class="test-file">
                <div class="file-header">
                    <div class="file-name">${file.fileName}</div>
                    <div class="test-count">${file.totalTests} tests</div>
                </div>
                <div class="file-content">
                    ${file.describes
                      .map(
                        (describe) => `
                        <div class="describe-section">
                            <div class="describe-title">${describe}</div>
                            <ul class="test-list">
                                ${file.tests
                                  .map(
                                    (test) => `
                                    <li class="test-item">${test}</li>
                                `
                                  )
                                  .join("")}
                            </ul>
                        </div>
                    `
                      )
                      .join("")}
                    
                    ${
                      file.describes.length === 0
                        ? `
                        <div class="describe-section">
                            <ul class="test-list">
                                ${file.tests
                                  .map(
                                    (test) => `
                                    <li class="test-item">${test}</li>
                                `
                                  )
                                  .join("")}
                            </ul>
                        </div>
                    `
                        : ""
                    }
                    
                    <div class="file-path">📁 ${file.filePath}</div>
                </div>
            </div>
        `
          )
          .join("")}
        
        <div class="summary">
            <h2>📊 Summary</h2>
            <p>This documentation was automatically generated from test files in the project.</p>
            <ul style="margin-top: 1rem; padding-left: 2rem;">
                <li><strong>Coverage:</strong> Run <code>npm run test:coverage</code> to see code coverage</li>
                <li><strong>Run Tests:</strong> Use <code>npm test</code> to execute all tests</li>
                <li><strong>Watch Mode:</strong> Use <code>npm run test:watch</code> for development</li>
                <li><strong>UI Mode:</strong> Use <code>npm run test:ui</code> for interactive testing</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>Generated on ${new Date().toLocaleString()} | SWP391 Group 03</p>
        </div>
    </div>
</body>
</html>`;

  return html;
}

// Main execution
const srcDir = path.join(__dirname, "../src");
const outputFile = path.join(__dirname, "../test-documentation.html");

console.log("🔍 Scanning for test files...");
const testFiles = findTestFiles(srcDir);

console.log(`📝 Found ${testFiles.length} test files`);
const testData = testFiles.map(parseTestFile);

console.log("🎨 Generating HTML documentation...");
const html = generateHTML(testData);

fs.writeFileSync(outputFile, html);

console.log(`✅ Test documentation generated: ${outputFile}`);
console.log("🚀 Open the file in your browser to view the documentation!");
