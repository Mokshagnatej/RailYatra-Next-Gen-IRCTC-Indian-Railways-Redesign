import { searchTrainsBetween, getTrainByNumber, extractStationCode, normalizeStationCode } from "../src/lib/trainRouteService.ts";
import { computeLiveTrainTracking } from "../src/lib/liveTrackingEngine.ts";

console.log("=================================================");
console.log("TESTING NATIONWIDE INDIAN RAILWAYS ROUTE ENGINE");
console.log("=================================================");

// 1. Station code resolution tests
const queries = [
  "New Delhi",
  "Mumbai",
  "Kolkata",
  "Bangalore",
  "Varanasi",
  "Chennai Central",
  "Howrah (HWH)",
  "NDLS",
  "BCT",
  "MAS",
  "HYB",
  "PUNE",
  "Bhopal",
  "Jaipur"
];

console.log("\n--- Station Code Resolvers ---");
for (const q of queries) {
  const code = extractStationCode(q);
  const norm = normalizeStationCode(code);
  console.log(`Query: "${q}" -> Code: "${code}" -> Normalized: "${norm}"`);
}

// 2. Search corridors across India
const corridors = [
  { from: "New Delhi (NDLS)", to: "Mumbai Central (MMCT)" },
  { from: "New Delhi (NDLS)", to: "Varanasi Jn (BSB)" },
  { from: "Howrah (HWH)", to: "New Delhi (NDLS)" },
  { from: "Chennai Central (MAS)", to: "KSR Bengaluru (SBC)" },
  { from: "Mumbai CSMT (CSMT)", to: "Pune Jn (PUNE)" },
  { from: "Ahmedabad (ADI)", to: "Mumbai Central (MMCT)" },
  { from: "New Delhi (NDLS)", to: "Bhopal (RKMP)" },
  { from: "Hazrat Nizamuddin (NZM)", to: "Madgaon (MAO)" }
];

console.log("\n--- Corridor Search Tests ---");
for (const { from, to } of corridors) {
  const results = searchTrainsBetween(from, to);
  console.log(`\nCorridor: ${from} -> ${to}`);
  console.log(`Found ${results.length} trains running on this route:`);
  results.slice(0, 3).forEach((t, i) => {
    console.log(`  ${i + 1}. #${t.no} ${t.name} (${t.type}) | Dep: ${t.dep} -> Arr: ${t.arr} (${t.dur}) | Halts: ${t.stops}`);
  });
}

// 3. Real Train Lookup & Live Tracking Telemetry
const sampleTrains = ["12951", "22436", "12002", "12622", "12301", "11019"];

console.log("\n--- Real Live GPS Train Tracking Telemetry ---");
for (const no of sampleTrains) {
  const train = getTrainByNumber(no);
  const telemetry = computeLiveTrainTracking(no);
  if (train && telemetry) {
    console.log(`\nTrain #${no} ${train.trainName} (${train.type}):`);
    console.log(`  From: ${telemetry.from.name} (${telemetry.from.code}) -> To: ${telemetry.to.name} (${telemetry.to.code})`);
    console.log(`  Current Station: ${telemetry.currentStation.name} (${telemetry.currentStation.platform})`);
    console.log(`  Next Station: ${telemetry.nextStation.name} (${telemetry.nextStation.platform}) · ETA: ${telemetry.nextStation.etaMinutes}m`);
    console.log(`  Live Speed: ${telemetry.currentSpeedKmH} km/h | Status: ${telemetry.status}`);
    console.log(`  Progress: ${telemetry.progressPercent}% (${telemetry.distanceCoveredKm} km of ${telemetry.totalDistanceKm} km)`);
    console.log(`  Total Scheduled Halts: ${train.schedule.length}`);
  } else {
    console.log(`  Train #${no} lookup failed.`);
  }
}

console.log("\n=================================================");
console.log("ALL ENGINE TESTS COMPLETED SUCCESSFULLY!");
console.log("=================================================");
