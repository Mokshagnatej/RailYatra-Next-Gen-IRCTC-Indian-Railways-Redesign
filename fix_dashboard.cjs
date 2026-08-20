const fs = require('fs');
const appPath = 'src/components/RailApp.jsx';
let appCode = fs.readFileSync(appPath, 'utf8');

// Add imports
if (!appCode.includes('LiveJourneyDashboard')) {
  appCode = appCode.replace('import CinematicHeroScenery', 'import LiveJourneyDashboard from "./features/LiveJourneyDashboard.jsx";\nimport { useJourneyStore } from "../lib/store.ts";\nimport CinematicHeroScenery');
}

// Ensure useJourneyStore is called inside RailApp
if (!appCode.includes('const { mode } = useJourneyStore();')) {
  appCode = appCode.replace('function RailApp() {', 'function RailApp() {\n  const { mode } = useJourneyStore();');
  // Just in case it's named differently
  appCode = appCode.replace('export default function RailApp() {', 'export default function RailApp() {\n  const { mode } = useJourneyStore();');
}

// Inject LiveJourneyDashboard inside the hero section
appCode = appCode.replace('<HeroScenery />', '{mode === "journey" && <LiveJourneyDashboard />}\n        <HeroScenery />');

fs.writeFileSync(appPath, appCode);
