const fs = require('fs');
const appPath = 'src/components/RailApp.jsx';
let appCode = fs.readFileSync(appPath, 'utf8');

// Remove FONT_IMPORT string definition
appCode = appCode.replace(/const FONT_IMPORT = `[\s\S]*?`;/, '// FONT_IMPORT migrated to styles.css');

// Remove <style>{FONT_IMPORT}</style>
appCode = appCode.replace(/<style>\{FONT_IMPORT\}<\/style>/g, '');

fs.writeFileSync(appPath, appCode);
