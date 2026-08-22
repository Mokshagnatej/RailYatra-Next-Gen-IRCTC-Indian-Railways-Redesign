const fs = require('fs');
const appPath = 'src/components/RailApp.jsx';
let appCode = fs.readFileSync(appPath, 'utf8');

if (!appCode.includes('CinematicStory')) {
  appCode = appCode.replace('import CinematicHeroScenery', 'import CinematicStory from "./features/CinematicStory.jsx";\nimport CinematicHeroScenery');
}

appCode = appCode.replace('<QuickTools />', '<CinematicStory />\n      <QuickTools />');

fs.writeFileSync(appPath, appCode);
