const fs = require('fs');
const path = 'src/components/features/CinematicStory.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldShots = `const SHOTS = [
  { id: 1, type: "landscape", color: "bg-orange-100", title: "Sunrise over the Ghats" },
  { id: 2, type: "interior", color: "bg-blue-100", title: "Vistadome Experience" },
  { id: 3, type: "landscape", color: "bg-emerald-100", title: "Konkan Coastline" },
  { id: 4, type: "detail", color: "bg-amber-100", title: "A cup of Chai" }
];`;

const newShots = `const SHOTS = [
  { id: 1, type: "landscape", videoUrl: "https://player.vimeo.com/external/494254425.sd.mp4?s=d00330349454157d0f9836338b2e5a6a683a3d24&profile_id=164&oauth2_token_id=57447761", title: "Sunrise over the Ghats" },
  { id: 2, type: "interior", videoUrl: "https://player.vimeo.com/external/554904838.sd.mp4?s=27d0a2007ceb2713f411cc5d8123289069d2a6a1&profile_id=164&oauth2_token_id=57447761", title: "Vistadome Experience" },
  { id: 3, type: "landscape", videoUrl: "https://player.vimeo.com/external/406001099.sd.mp4?s=e7b4cbce7e15eeb13bc7bc6be7e2dc1157947116&profile_id=139&oauth2_token_id=57447761", title: "Konkan Coastline" },
  { id: 4, type: "detail", videoUrl: "https://player.vimeo.com/external/480112443.sd.mp4?s=34a5323a67d022fc78401340c2be12543b59367d&profile_id=164&oauth2_token_id=57447761", title: "Morning Preparations" }
];`;

code = code.replace(oldShots, newShots);

const oldVideoDiv = `{/* Fallback/Placeholder Visual */}
      <div className={\`absolute inset-0 \${currentShot.color} transition-colors duration-1000\`}>
        <div className="w-full h-full flex flex-col items-center justify-center opacity-40">
          <Play size={48} className="mb-4" />
          <span className="f-mono uppercase tracking-widest text-sm">[Video Placeholder: {currentShot.type}]</span>
        </div>
      </div>`;

const newVideoDiv = `{/* Video Visual */}
      <div className="absolute inset-0 bg-black transition-opacity duration-1000">
        <video 
          key={currentShot.id}
          src={currentShot.videoUrl}
          className="w-full h-full object-cover opacity-80"
          autoPlay
          muted
          playsInline
          loop
        />
      </div>`;

code = code.replace(oldVideoDiv, newVideoDiv);

fs.writeFileSync(path, code);
