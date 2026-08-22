import fs from 'fs';
import path from 'path';

console.log('Building high-performance National Indian Railways Database...');

const trainsRaw = fs.readFileSync('src/data/raw/trains.json', 'utf-8');
const stationsRaw = fs.readFileSync('src/data/raw/stations.json', 'utf-8');
const schedulesRaw = fs.readFileSync('src/data/raw/schedules.json', 'utf-8');

const trainsJson = JSON.parse(trainsRaw);
const stationsJson = JSON.parse(stationsRaw);
const schedulesJson = JSON.parse(schedulesRaw);

console.log(`Parsed raw data: ${trainsJson.features?.length} trains, ${stationsJson.features?.length} stations, ${schedulesJson.length} schedule entries.`);

// 1. Build stations map
const stationMap = new Map();
const stationCatalog = [];

for (const feat of stationsJson.features) {
  const p = feat.properties || {};
  const code = (p.code || '').trim().toUpperCase();
  if (code && !stationMap.has(code)) {
    const stObj = {
      code,
      name: (p.name || code).replace(/ JN$/i, ' Junction').replace(/ TRM$/i, ' Terminus').replace(/ CNTL$/i, ' Central'),
      state: p.state || '',
      zone: p.zone || '',
      lat: feat.geometry?.coordinates?.[1] ? Number(feat.geometry.coordinates[1].toFixed(4)) : 0,
      lng: feat.geometry?.coordinates?.[0] ? Number(feat.geometry.coordinates[0].toFixed(4)) : 0
    };
    stationMap.set(code, stObj);
    stationCatalog.push(stObj);
  }
}

// 2. Index schedules by train number
const schedulesByTrain = new Map();
for (const item of schedulesJson) {
  if (!item.train_number) continue;
  const tNo = String(item.train_number).trim();
  if (!schedulesByTrain.has(tNo)) {
    schedulesByTrain.set(tNo, []);
  }
  schedulesByTrain.get(tNo).push(item);
}

// 3. Compile trains
const allTrainsList = [];
const seenTrainNos = new Set();

for (const feat of trainsJson.features) {
  const p = feat.properties || {};
  const rawNo = String(p.number || '').trim();
  if (!rawNo || rawNo.length < 3) continue;

  const trainNo = rawNo.length === 4 ? `0${rawNo}` : rawNo;
  if (seenTrainNos.has(trainNo)) continue;
  seenTrainNos.add(trainNo);

  const trainName = (p.name || `Express ${trainNo}`).trim();
  const fromCode = (p.from_station_code || '').trim().toUpperCase();
  const toCode = (p.to_station_code || '').trim().toUpperCase();
  const fromName = p.from_station_name || stationMap.get(fromCode)?.name || fromCode;
  const toName = p.to_station_name || stationMap.get(toCode)?.name || toCode;
  const distance = p.distance || 0;
  const durationH = p.duration_h || Math.round(distance / 55) || 12;
  const durationM = p.duration_m || 0;
  const rawType = p.type || 'Exp';

  let type = 'Express';
  const nameLower = trainName.toLowerCase();
  if (nameLower.includes('vande bharat')) type = 'Vande Bharat';
  else if (nameLower.includes('rajdhani')) type = 'Rajdhani';
  else if (nameLower.includes('shatabdi')) type = 'Shatabdi';
  else if (nameLower.includes('duronto')) type = 'Duronto';
  else if (nameLower.includes('garib rath')) type = 'Garib Rath';
  else if (nameLower.includes('jan shatabdi')) type = 'Jan Shatabdi';
  else if (nameLower.includes('tejas')) type = 'Tejas Express';
  else if (nameLower.includes('humsafar')) type = 'Humsafar Express';
  else if (nameLower.includes('superfast') || rawType === 'SF') type = 'Superfast';
  else if (rawType === 'DEMU' || rawType === 'Pass') type = 'Passenger';

  // Get and sort stops
  let sched = schedulesByTrain.get(rawNo) || schedulesByTrain.get(trainNo) || schedulesByTrain.get(String(parseInt(rawNo, 10))) || [];
  sched.sort((a, b) => (a.id || 0) - (b.id || 0));

  let schedule = [];
  if (sched.length > 0) {
    schedule = sched.map((s, idx) => {
      const sCode = (s.station_code || '').trim().toUpperCase();
      const st = stationMap.get(sCode);
      const arr = s.arrival && s.arrival !== 'None' ? s.arrival.slice(0, 5) : (idx === 0 ? 'Starts' : '--:--');
      const dep = s.departure && s.departure !== 'None' ? s.departure.slice(0, 5) : (idx === sched.length - 1 ? 'Ends' : '--:--');
      const distKm = Math.round((distance / Math.max(1, sched.length - 1)) * idx);

      return {
        seq: idx + 1,
        stationCode: sCode,
        stationName: s.station_name || st?.name || sCode,
        arr,
        dep,
        haltMin: arr !== '--:--' && dep !== '--:--' && arr !== 'Starts' && dep !== 'Ends' ? '2 min' : (idx === 0 || idx === sched.length - 1 ? '--' : '2 min'),
        distKm,
        day: s.day || (idx > sched.length / 2 && durationH > 16 ? 2 : 1),
        platform: `PF ${(idx % 4) + 1}`,
        state: st?.state || ''
      };
    });
  } else {
    const depTime = (p.departure || '08:00:00').slice(0, 5);
    const arrTime = (p.arrival || '20:00:00').slice(0, 5);
    schedule = [
      { seq: 1, stationCode: fromCode, stationName: fromName, arr: 'Starts', dep: depTime, haltMin: '--', distKm: 0, day: 1, platform: 'PF 1', state: stationMap.get(fromCode)?.state || '' },
      { seq: 2, stationCode: toCode, stationName: toName, arr: arrTime, dep: 'Ends', haltMin: '--', distKm: distance, day: durationH > 16 ? 2 : 1, platform: 'PF 1', state: stationMap.get(toCode)?.state || '' }
    ];
  }

  // Calculate realistic fare classes
  const classes = {};
  if (p.first_ac) classes['1A'] = { status: 'AVAILABLE', n: 6, fare: Math.max(1250, Math.round(distance * 3.2)) };
  if (p.second_ac) classes['2A'] = { status: 'AVAILABLE', n: 22, fare: Math.max(850, Math.round(distance * 1.9)) };
  if (p.third_ac || type === 'Rajdhani' || type === 'Duronto' || type === 'Garib Rath') {
    classes['3A'] = { status: 'AVAILABLE', n: 48, fare: Math.max(540, Math.round(distance * 1.35)) };
  }
  if (p.chair_car || type === 'Shatabdi' || type === 'Vande Bharat' || type === 'Jan Shatabdi') {
    classes['CC'] = { status: 'AVAILABLE', n: 72, fare: Math.max(380, Math.round(distance * 0.95)) };
    classes['EC'] = { status: 'AVAILABLE', n: 12, fare: Math.max(900, Math.round(distance * 1.8)) };
  }
  if (p.sleeper || Object.keys(classes).length === 0) {
    classes['SL'] = { status: 'AVAILABLE', n: 90, fare: Math.max(175, Math.round(distance * 0.48)) };
    if (!classes['3A']) classes['3A'] = { status: 'AVAILABLE', n: 36, fare: Math.max(540, Math.round(distance * 1.35)) };
    if (!classes['2A']) classes['2A'] = { status: 'AVAILABLE', n: 14, fare: Math.max(850, Math.round(distance * 1.9)) };
  }

  const dep = (p.departure || schedule[0]?.dep || '08:00').slice(0, 5);
  const arr = (p.arrival || schedule[schedule.length - 1]?.arr || '20:00').slice(0, 5);

  allTrainsList.push({
    trainNo,
    trainName,
    type,
    fromStationCode: fromCode,
    fromStationName: fromName,
    toStationCode: toCode,
    toStationName: toName,
    depTime: dep,
    arrTime: arr,
    totalDuration: `${durationH}h ${durationM}m`,
    totalDistanceKm: distance,
    zone: p.zone || 'IR',
    daily: true,
    runsOn: 'MTWTFSS',
    pantry: type === 'Rajdhani' || type === 'Vande Bharat' || type === 'Shatabdi' || type === 'Duronto' || distance > 700,
    classes,
    schedule
  });
}

console.log(`Compiled ${allTrainsList.length} complete train records with ${stationCatalog.length} stations!`);

// Write datasets
fs.writeFileSync('src/data/allTrainsNational.json', JSON.stringify(allTrainsList));
fs.writeFileSync('src/data/allStationsNational.json', JSON.stringify(stationCatalog));

console.log('Saved src/data/allTrainsNational.json and src/data/allStationsNational.json successfully!');
