const fs = require('fs');
const appPath = 'src/components/HomeSections.jsx';
let appCode = fs.readFileSync(appPath, 'utf8');

const additionalContent = `
/* ---------------- destination discovery ---------------- */

const DESTINATIONS = [
  { title: "Mountains", subtitle: "Himalayan Railways & Escapes", img: "bg-blue-100", color: "text-blue-700" },
  { title: "Coast", subtitle: "Konkan & Southern Shores", img: "bg-teal-100", color: "text-teal-700" },
  { title: "Culture", subtitle: "Temples & Heritage Circuits", img: "bg-amber-100", color: "text-amber-700" },
  { title: "Cities", subtitle: "Metros & Urban Connections", img: "bg-indigo-100", color: "text-indigo-700" },
];

export function DestinationDiscovery() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="f-mono text-xs tracking-widest uppercase" style={{ color: "var(--marigold-2)" }}>Explore</p>
          <h2 className="f-serif font-bold text-3xl mt-1" style={{ color: "var(--ink)" }}>Find your next journey</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DESTINATIONS.map((dest, i) => (
          <div key={dest.title} className="group relative rounded-2xl overflow-hidden cursor-pointer h-64 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Placeholder Image Div */}
            <div className={\`absolute inset-0 transition-transform duration-700 group-hover:scale-105 \${dest.img} flex items-center justify-center opacity-50\`}>
              <span className={\`f-mono text-xs uppercase tracking-widest font-bold \${dest.color}\`}>[Placeholder Media]</span>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="f-serif font-bold text-xl text-white mb-1">{dest.title}</h3>
              <p className="f-body text-sm text-white/80">{dest.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`;

appCode += additionalContent;

fs.writeFileSync(appPath, appCode);
