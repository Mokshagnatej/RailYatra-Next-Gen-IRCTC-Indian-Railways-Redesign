import fs from 'fs';
import https from 'https';
import path from 'path';

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Downloading Indian Railways datasets from datameet/railways...');
  
  try {
    const [trainsRaw, schedulesRaw, stationsRaw] = await Promise.all([
      downloadFile('https://raw.githubusercontent.com/datameet/railways/master/trains.json'),
      downloadFile('https://raw.githubusercontent.com/datameet/railways/master/schedules.json'),
      downloadFile('https://raw.githubusercontent.com/datameet/railways/master/stations.json'),
    ]);

    console.log('Parsing trains GeoJSON...');
    const trainsJson = JSON.parse(trainsRaw);
    console.log(`Loaded ${trainsJson.features.length} train records!`);

    console.log('Parsing schedules JSON...');
    const schedulesJson = JSON.parse(schedulesRaw);
    console.log(`Loaded ${schedulesJson.length} schedule entries!`);

    console.log('Parsing stations GeoJSON...');
    const stationsJson = JSON.parse(stationsRaw);
    console.log(`Loaded ${stationsJson.features.length} stations!`);

    // Group schedules by train_number
    const schedulesByTrain = new Map();
    for (const item of schedulesJson) {
      if (!item.train_number) continue;
      const tNo = String(item.train_number).trim();
      if (!schedulesByTrain.has(tNo)) {
        schedulesByTrain.set(tNo, []);
      }
      schedulesByTrain.get(tNo).push(item);
    }

    // Station coordinates map
    const stationMap = new Map();
    for (const feat of stationsJson.features) {
      const p = feat.properties || {};
      const code = (p.code || '').trim().toUpperCase();
      if (code) {
        stationMap.set(code, {
          code,
          name: p.name || code,
          state: p.state || '',
          zone: p.zone || '',
          coordinates: feat.geometry?.coordinates || [0, 0]
        });
      }
    }

    // Process all trains
    const allTrainsList = [];
    const trainsIndex = {};

    for (const feat of trainsJson.features) {
      const p = feat.properties || {};
      const trainNo = String(p.number || '').trim();
      if (!trainNo || trainNo.length < 4) continue;

      const trainName = (p.name || '').trim();
      const fromCode = (p.from_station_code || '').trim().toUpperCase();
      const toCode = (p.to_station_code || '').trim().toUpperCase();
      const fromName = (p.from_station_name || fromCode).trim();
      const toName = (p.to_station_name || toCode).trim();
      const distance = p.distance || 0;
      const durationH = p.duration_h || 0;
      const durationM = p.duration_m || 0;
      const trainType = p.type || 'Express';
      const zone = p.zone || 'IR';

      // Get stop schedule
      const rawSchedule = schedulesByTrain.get(trainNo) || schedulesByTrain.get(trainNo.padStart(5, '0')) || [];
      // Sort schedule by id or arrival/departure
      rawSchedule.sort((a, b) => (a.id || 0) - (b.id || 0));

      const schedule = rawSchedule.map((s, idx) => {
        const sCode = (s.station_code || '').trim().toUpperCase();
        const stInfo = stationMap.get(sCode) || {};
        return {
          seq: idx + 1,
          stationCode: sCode,
          stationName: s.station_name || stInfo.name || sCode,
          arr: s.arrival && s.arrival !== 'None' ? s.arrival.slice(0, 5) : (idx === 0 ? 'Starts' : '--:--'),
          dep: s.departure && s.departure !== 'None' ? s.departure.slice(0, 5) : (idx === rawSchedule.length - 1 ? 'Ends' : '--:--'),
          haltMin: s.arrival && s.departure && s.arrival !== 'None' && s.departure !== 'None' ? '2 min' : (idx === 0 || idx === rawSchedule.length - 1 ? '--' : '2 min'),
          day: s.day || 1,
          platform: `PF ${(idx % 5) + 1}`,
          state: stInfo.state || ''
        };
      });

      // Compute classes
      const classes = {};
      if (p.first_ac) classes['1A'] = { status: 'AVAILABLE', n: 6, fare: Math.max(1200, Math.round(distance * 3.2)) };
      if (p.second_ac) classes['2A'] = { status: 'AVAILABLE', n: 18, fare: Math.max(800, Math.round(distance * 1.9)) };
      if (p.third_ac) classes['3A'] = { status: 'AVAILABLE', n: 42, fare: Math.max(500, Math.round(distance * 1.35)) };
      if (p.chair_car) classes['CC'] = { status: 'AVAILABLE', n: 68, fare: Math.max(350, Math.round(distance * 0.95)) };
      if (p.sleeper || Object.keys(classes).length === 0) classes['SL'] = { status: 'AVAILABLE', n: 90, fare: Math.max(180, Math.round(distance * 0.48)) };

      const durStr = `${durationH}h ${durationM}m`;
      const depTime = (p.departure || '08:00:00').slice(0, 5);
      const arrTime = (p.arrival || '20:00:00').slice(0, 5);

      const trainRecord = {
        trainNo,
        trainName,
        type: trainType === 'SF' ? 'Superfast' : trainType === 'DEMU' ? 'Passenger' : trainType,
        fromStationCode: fromCode,
        fromStationName: fromName,
        toStationCode: toCode,
        toStationName: toName,
        depTime,
        arrTime,
        totalDuration: durStr,
        totalDistanceKm: distance,
        zone,
        daily: true,
        runsOn: 'MTWTFSS',
        pantry: trainType.includes('Rajdhani') || trainType.includes('Shatabdi') || trainType.includes('Duronto') || distance > 800,
        classes,
        scheduleCount: schedule.length,
        schedule,
        coordinates: feat.geometry?.coordinates || []
      };

      allTrainsList.push(trainRecord);
      trainsIndex[trainNo] = trainRecord;
    }

    console.log(`Successfully compiled ${allTrainsList.length} Indian Railways trains!`);

    // Write national train database
    const outDir = path.resolve('src/data');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const outPath = path.join(outDir, 'nationalTrainDatabase.json');
    fs.writeFileSync(outPath, JSON.stringify(allTrainsList, null, 2));
    console.log(`Saved database to ${outPath} (${(fs.statSync(outPath).size / 1024 / 1024).toFixed(2)} MB)`);

    // Write all stations database
    const stationsList = Array.from(stationMap.values());
    const stationsOutPath = path.join(outDir, 'allStations.json');
    fs.writeFileSync(stationsOutPath, JSON.stringify(stationsList, null, 2));
    console.log(`Saved ${stationsList.length} stations to ${stationsOutPath}`);

  } catch (err) {
    console.error('Build Error:', err);
  }
}

main();
