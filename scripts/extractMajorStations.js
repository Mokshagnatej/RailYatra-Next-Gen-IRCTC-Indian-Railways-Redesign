import fs from 'fs';

const allStations = JSON.parse(fs.readFileSync('src/data/allStationsNational.json', 'utf-8'));

// Common and major stations in Indian Railways
const majorCodes = new Set([
  'NDLS', 'DLI', 'NZM', 'ANVT', 'DEC', 'DEE',
  'MMCT', 'BCT', 'CSMT', 'CSTM', 'LTT', 'BDTS', 'DDR', 'PNVL', 'TNA', 'KYN',
  'HWH', 'SDAH', 'KOAA', 'SHM', 'SRC',
  'MAS', 'MS', 'TBM', 'PER',
  'SBC', 'YPR', 'SMVB', 'BNC', 'KJM',
  'HYB', 'SC', 'KCG', 'LPI',
  'BSB', 'BSBS', 'DDU', 'MGS',
  'CNB', 'CPA', 'PRYJ', 'ALD', 'LKO', 'LJN',
  'GKP', 'PNBE', 'PPTA', 'DNR', 'RJPB', 'GAYA',
  'ADI', 'GIMB', 'BRC', 'ST', 'RTM', 'UJN', 'INDB',
  'BPL', 'RKMP', 'HBJ', 'JBP', 'GWL', 'VGLJ', 'JHS', 'AGC', 'AF', 'MTJ',
  'JP', 'JU', 'AII', 'BKN', 'KOTA', 'UDZ',
  'ASR', 'JUC', 'LDH', 'CDG', 'UMB', 'KLK', 'JAT', 'SVDK', 'UHP',
  'PUNE', 'MRJ', 'KOP', 'SUR', 'NGP', 'BSL',
  'BBS', 'PURI', 'CTC', 'ROU', 'TATA', 'RNC', 'DHN', 'ASN',
  'VSKP', 'BZA', 'GNT', 'TPTY', 'RU',
  'TVC', 'ERS', 'ERN', 'CLT', 'SRR', 'TCR', 'CBE', 'MDU', 'TPJ', 'ED', 'SA', 'MAQ',
  'GHY', 'KYQ', 'NJP', 'DBRG', 'AGTL', 'SCL', 'R', 'BSP', 'DURG', 'RIG'
]);

const majorList = allStations.filter(s => majorCodes.has(s.code));
fs.writeFileSync('src/data/majorStations.json', JSON.stringify(majorList, null, 2));
console.log(`Saved ${majorList.length} major junction stations to src/data/majorStations.json`);
