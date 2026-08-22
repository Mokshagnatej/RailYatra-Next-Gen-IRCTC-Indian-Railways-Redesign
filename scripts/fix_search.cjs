const fs = require('fs');
const appPath = 'src/components/RailApp.jsx';
let appCode = fs.readFileSync(appPath, 'utf8');

// Add import for useBookingStore at the top
if (!appCode.includes('useBookingStore')) {
  appCode = appCode.replace('import React, { useState, useMemo, useEffect, useRef } from "react";', 'import React, { useState, useMemo, useEffect, useRef } from "react";\nimport { useBookingStore } from "../lib/store.ts";');
}

// Replace SearchScreen state
const searchScreenRegex = /function SearchScreen\(\{ onSearch, onFooterAction \}\) \{[\s\S]*?const \[flexDates, setFlexDates\] = useState\(false\);/;

const searchScreenReplacement = `function SearchScreen({ onSearch, onFooterAction }) {
  const { from, setFrom, to, setTo, date, setDate, cls, setCls, quota, setQuota, passengers, setPassengers } = useBookingStore();
  const [flexDates, setFlexDates] = useState(false);`;

appCode = appCode.replace(searchScreenRegex, searchScreenReplacement);

fs.writeFileSync(appPath, appCode);
