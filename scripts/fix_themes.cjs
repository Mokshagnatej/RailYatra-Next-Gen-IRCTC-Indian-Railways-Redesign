const fs = require('fs');
const files = [
  'src/screens/ExploreScreen.jsx', 
  'src/screens/HelpScreen.jsx', 
  'src/screens/MyTripsScreen.jsx',
  'src/components/common/AuthModal.jsx'
];

for (const path of files) {
  if (fs.existsSync(path)) {
    let code = fs.readFileSync(path, 'utf8');
    
    // Replace bg-white with dynamic surface
    code = code.replace(/bg-white/g, 'bg-[var(--surface)]');
    
    // Replace background: "white" with background: "var(--surface)"
    code = code.replace(/background:\s*["']white["']/g, 'background: "var(--surface)"');
    
    // Replace bg-gray-50 with paper-2
    code = code.replace(/bg-gray-50/g, 'bg-[var(--paper-2)]');
    
    // Replace text-slate-700 / text-slate-500 / text-slate-600 with var(--ink) / var(--steel)
    code = code.replace(/text-slate-[789]00/g, 'text-[var(--ink)]');
    code = code.replace(/text-slate-[456]00/g, 'text-[var(--steel)]');
    
    fs.writeFileSync(path, code);
  }
}
