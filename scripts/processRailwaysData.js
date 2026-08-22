import fs from 'fs';
import path from 'path';

const TRAINS_FILE = '/Users/honeyreddy/.gemini/antigravity-ide/brain/00a38cf3-404e-40b5-993e-22caf14680ac/.system_generated/steps/764/content.md';
const SCHEDULES_FILE = '/Users/honeyreddy/.gemini/antigravity-ide/brain/00a38cf3-404e-40b5-993e-22caf14680ac/.system_generated/steps/768/content.md';
const STATIONS_FILE = '/Users/honeyreddy/.gemini/antigravity-ide/brain/00a38cf3-404e-40b5-993e-22caf14680ac/.system_generated/steps/770/content.md';

function extractJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const jsonStart = content.indexOf('\n\n{') !== -1 ? content.indexOf('\n\n{') + 2 :
                    content.indexOf('\n\n[') !== -1 ? content.indexOf('\n\n[') + 2 : 0;
  const jsonStr = content.substring(jsonStart).trim();
  return JSON.parse(jsonStr);
}

try {
  console.log('Extracting trains...');
  const trainsData = extractJson(TRAINS_FILE);
  console.log('Total train features:', trainsData.features?.length || 0);

  console.log('Extracting schedules...');
  const schedulesData = extractJson(SCHEDULES_FILE);
  console.log('Total schedule entries:', schedulesData.length);

  console.log('Extracting stations...');
  const stationsData = extractJson(STATIONS_FILE);
  console.log('Total station features:', stationsData.features?.length || 0);

} catch (err) {
  console.error('Error:', err);
}
