const fs = require('fs');
const path = 'src/components/features/LiveJourneyDashboard.jsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('Coffee')) {
  code = code.replace("import { MapPin, Navigation, Clock, Activity } from 'lucide-react';", "import { MapPin, Navigation, Clock, Activity, Coffee, X } from 'lucide-react';");
}
if (!code.includes('const [showFoodModal')) {
  code = code.replace('const [liveProgress, setLiveProgress] = useState(routeProgress || 0);', 'const [liveProgress, setLiveProgress] = useState(routeProgress || 0);\n  const [showFoodModal, setShowFoodModal] = useState(false);');
}

fs.writeFileSync(path, code);
