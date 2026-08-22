const fs = require('fs');
const path = 'src/components/HomeSections.jsx';
if (fs.existsSync(path)) {
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(/bg-white/g, 'bg-[var(--surface)]');
  code = code.replace(/text-slate-[789]00/g, 'text-[var(--ink)]');
  code = code.replace(/text-slate-[456]00/g, 'text-[var(--steel)]');
  fs.writeFileSync(path, code);
}
