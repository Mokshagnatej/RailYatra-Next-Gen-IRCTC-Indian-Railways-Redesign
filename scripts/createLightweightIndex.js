import fs from 'fs';

console.log('Generating optimized lightweight fast search index...');

const allTrains = JSON.parse(fs.readFileSync('src/data/allTrainsNational.json', 'utf-8'));

// 1. Fast search index for the frontend
const searchIndex = allTrains.map(t => {
  const stopCodes = (t.schedule || []).map(s => s.stationCode);
  return {
    no: t.trainNo,
    name: t.trainName,
    type: t.type,
    from: t.fromStationCode,
    fromName: t.fromStationName,
    to: t.toStationCode,
    toName: t.toStationName,
    dep: t.depTime,
    arr: t.arrTime,
    dur: t.totalDuration,
    dist: t.totalDistanceKm,
    stops: Math.max(0, (t.schedule?.length || 2) - 2),
    stopsList: stopCodes,
    classes: t.classes || {},
    pantry: t.pantry,
    zone: t.zone
  };
});

fs.writeFileSync('src/data/trainSearchIndex.json', JSON.stringify(searchIndex));
console.log(`Saved src/data/trainSearchIndex.json (${(fs.statSync('src/data/trainSearchIndex.json').size / 1024 / 1024).toFixed(2)} MB, ${searchIndex.length} trains)`);

// 2. Full details dictionary for top 500 major trains + on-demand fallback
const fullSchedulesDict = {};
for (const t of allTrains) {
  // Store schedule as compact array
  fullSchedulesDict[t.trainNo] = {
    trainNo: t.trainNo,
    trainName: t.trainName,
    type: t.type,
    fromStationCode: t.fromStationCode,
    fromStationName: t.fromStationName,
    toStationCode: t.toStationCode,
    toStationName: t.toStationName,
    depTime: t.depTime,
    arrTime: t.arrTime,
    totalDuration: t.totalDuration,
    totalDistanceKm: t.totalDistanceKm,
    daily: true,
    runsOn: t.runsOn || 'MTWTFSS',
    pantry: t.pantry,
    classes: t.classes,
    schedule: t.schedule
  };
}

fs.writeFileSync('src/data/fullSchedulesDict.json', JSON.stringify(fullSchedulesDict));
console.log(`Saved src/data/fullSchedulesDict.json (${(fs.statSync('src/data/fullSchedulesDict.json').size / 1024 / 1024).toFixed(2)} MB)`);
