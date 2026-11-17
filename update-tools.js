const fs = require("fs");
const path = require("path");

const root = __dirname;
const toolsDir = path.join(root, "tools");
const themeFile = path.join(root, "css", "tools-theme.css");

if (!fs.existsSync(toolsDir)) {
  console.error("ERROR: tools folder nahi mila!");
  process.exit(1);
}

if (!fs.existsSync(themeFile)) {
  console.error("ERROR: css/tools-theme.css nahi mili!");
  process.exit(1);
}

let updated = 0;
let skipped = 0;

function processDirectory(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
      continue;
    }

    if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".html")) {
      continue;
    }

    let html = fs.readFileSync(fullPath, "utf8");

    if (html.includes("tools-theme.css")) {
      skipped++;
      continue;
    }

    const relativePath = path.relative(
      path.dirname(fullPath),
      themeFile
    ).replace(/\\/g, "/");

    const href = relativePath.startsWith(".")
      ? relativePath
      : "./" + relativePath;

    const link = `\n<link rel="stylesheet" href="${href}" data-protools-theme="true">\n`;

    if (/<\/head\s*>/i.test(html)) {
      html = html.replace(/<\/head\s*>/i, link + "</head>");
    } else if (/<body[\s>]/i.test(html)) {
      html = html.replace(/<body[\s>]/i, link + "<body");
    } else {
      html = link + html;
    }

    fs.writeFileSync(fullPath, html, "utf8");
    updated++;
    console.log("Updated:", path.relative(root, fullPath));
  }
}

processDirectory(toolsDir);

console.log("\n================================");
console.log("PROTOOLS THEME UPDATE COMPLETE");
console.log("Updated:", updated);
console.log("Already updated:", skipped);
console.log("================================");