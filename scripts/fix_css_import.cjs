const fs = require('fs');
const stylesPath = 'src/styles.css';
let stylesCode = fs.readFileSync(stylesPath, 'utf8');

// Find the import line that contains fonts.googleapis.com
const importLine = "@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');";

if (stylesCode.includes(importLine)) {
  stylesCode = stylesCode.replace(importLine, '');
  stylesCode = importLine + '\n' + stylesCode;
  fs.writeFileSync(stylesPath, stylesCode);
  console.log("Moved import to top");
} else {
  console.log("Import line not found exactly. Searching dynamically...");
  const dynamicRegex = /@import url\('https:\/\/fonts\.googleapis\.com[^']+'\);/g;
  const matched = stylesCode.match(dynamicRegex);
  if (matched) {
    for (const match of matched) {
      stylesCode = stylesCode.replace(match, '');
    }
    stylesCode = matched.join('\n') + '\n' + stylesCode;
    fs.writeFileSync(stylesPath, stylesCode);
    console.log("Moved dynamic imports to top");
  } else {
    console.log("No fonts import found");
  }
}
