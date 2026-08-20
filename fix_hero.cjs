const fs = require('fs');
const appPath = 'src/components/RailApp.jsx';
let appCode = fs.readFileSync(appPath, 'utf8');

// Add import
if (!appCode.includes('CinematicHeroScenery')) {
  appCode = appCode.replace('import { RangoliOverlay', 'import CinematicHeroScenery from "./common/CinematicHero.jsx";\nimport { RangoliOverlay');
}

const oldHeroScenery = /\/\* ── Warm Light Hero Scenery \(Cultural \+ Futuristic\) ── \*\/[\s\S]*?function HeroScenery\(\) \{[\s\S]*?return \([\s\S]*?\);\n\}/;

const newHeroScenery = `/* ── Cinematic Hero Scenery ── */
function HeroScenery() {
  return <CinematicHeroScenery />;
}`;

appCode = appCode.replace(oldHeroScenery, newHeroScenery);

fs.writeFileSync(appPath, appCode);
