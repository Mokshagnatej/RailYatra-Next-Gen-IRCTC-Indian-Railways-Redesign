const fs = require('fs');
const appPath = 'src/components/RailApp.jsx';
let appCode = fs.readFileSync(appPath, 'utf8');

if (!appCode.includes('DestinationDiscovery')) {
  appCode = appCode.replace('import { StatsBand, PopularRoutes, Services, HowItWorks, TrustStrip, FAQ, QuickTools, Footer } from "./HomeSections.jsx";', 'import { StatsBand, PopularRoutes, Services, HowItWorks, TrustStrip, FAQ, QuickTools, Footer, DestinationDiscovery } from "./HomeSections.jsx";');
}

appCode = appCode.replace('<Services />', '<DestinationDiscovery />\n      <Services />');

fs.writeFileSync(appPath, appCode);
