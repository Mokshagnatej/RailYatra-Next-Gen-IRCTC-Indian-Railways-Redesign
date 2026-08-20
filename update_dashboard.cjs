const fs = require('fs');
const path = 'src/components/features/LiveJourneyDashboard.jsx';
let code = fs.readFileSync(path, 'utf8');

const importOld = "import React from 'react';";
const importNew = "import React, { useEffect, useState } from 'react';";
code = code.replace(importOld, importNew);

const storeOld = 'const { currentStation, nextStation, eta, speed, distanceRemaining, platform, serviceState, routeProgress } = useJourneyStore();';
const storeNew = `const { currentStation, nextStation, eta, speed, distanceRemaining, platform, serviceState, routeProgress, setJourneyData } = useJourneyStore();
  const [liveProgress, setLiveProgress] = useState(routeProgress || 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveProgress(p => p >= 100 ? 0 : p + 0.1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
`;
code = code.replace(storeOld, storeNew);

const barOld = 'style={{ width: `${routeProgress}%` }}';
const barNew = 'style={{ width: `${liveProgress}%` }}';
code = code.replace(barOld, barNew);

fs.writeFileSync(path, code);
