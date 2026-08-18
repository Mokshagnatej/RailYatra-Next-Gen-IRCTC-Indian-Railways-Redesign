import fs from 'fs';

const raw = fs.readFileSync('src/stations.json', 'utf8');
const data = JSON.parse(raw);

const stations = data.features
  .filter(f => f.properties.name && f.properties.code)
  .map(f => {
    // Some names might be title cased, some uppercase. Let's make it title case.
    const name = f.properties.name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    const code = f.properties.code.toUpperCase();
    return `${name} (${code})`;
  })
  // sort alphabetically
  .sort((a, b) => a.localeCompare(b));

// To avoid a massive DOM, maybe we just save the array of strings.
fs.writeFileSync('src/stationList.json', JSON.stringify(stations, null, 2));
console.log(`Saved ${stations.length} stations.`);
