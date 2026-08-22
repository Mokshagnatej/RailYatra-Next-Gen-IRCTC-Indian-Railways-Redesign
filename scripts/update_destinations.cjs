const fs = require('fs');
const path = 'src/components/HomeSections.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldDestinations = `const DESTINATIONS = [
  { title: "Mountains", subtitle: "Himalayan Railways & Escapes", img: "bg-blue-100", color: "text-blue-700" },
  { title: "Coast", subtitle: "Konkan & Southern Shores", img: "bg-teal-100", color: "text-teal-700" },
  { title: "Culture", subtitle: "Temples & Heritage Circuits", img: "bg-amber-100", color: "text-amber-700" },
  { title: "Cities", subtitle: "Metros & Urban Connections", img: "bg-indigo-100", color: "text-indigo-700" },
];`;

const newDestinations = `const DESTINATIONS = [
  { title: "Mountains", subtitle: "Himalayan Railways & Escapes", imgUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop" },
  { title: "Coast", subtitle: "Konkan & Southern Shores", imgUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop" },
  { title: "Culture", subtitle: "Temples & Heritage Circuits", imgUrl: "https://images.unsplash.com/photo-1560179406-1c6c60e0dcb6?q=80&w=800&auto=format&fit=crop" },
  { title: "Cities", subtitle: "Metros & Urban Connections", imgUrl: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=800&auto=format&fit=crop" },
];`;

code = code.replace(oldDestinations, newDestinations);

const oldImgDiv = `{/* Placeholder Image Div */}
            <div className={\`absolute inset-0 transition-transform duration-700 group-hover:scale-105 \${dest.img} flex items-center justify-center opacity-50\`}>
              <span className={\`f-mono text-xs uppercase tracking-widest font-bold \${dest.color}\`}>[Placeholder Media]</span>
            </div>`;

const newImgDiv = `<img 
              src={dest.imgUrl} 
              alt={dest.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />`;

code = code.replace(oldImgDiv, newImgDiv);

fs.writeFileSync(path, code);
