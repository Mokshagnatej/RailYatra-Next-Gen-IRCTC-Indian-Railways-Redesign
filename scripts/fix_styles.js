const fs = require('fs');
const appPath = 'src/components/RailApp.jsx';
let appCode = fs.readFileSync(appPath, 'utf8');

// Remove FONT_IMPORT string definition
appCode = appCode.replace(/const FONT_IMPORT = `[\s\S]*?`;/, '// FONT_IMPORT moved to styles.css');

// Remove <style>{FONT_IMPORT}</style>
appCode = appCode.replace(/<style>\{FONT_IMPORT\}<\/style>/, '');

fs.writeFileSync(appPath, appCode);

const stylesPath = 'src/styles.css';
let stylesCode = fs.readFileSync(stylesPath, 'utf8');

const additionalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,300;1,9..144,400;1,9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

@layer utilities {
  .f-display { font-family: 'Inter', system-ui, sans-serif; letter-spacing: -0.02em; }
  .f-body { font-family: 'Inter', system-ui, sans-serif; }
  .f-mono { font-family: 'IBM Plex Mono', monospace; }
  .f-serif { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.02em; }
  
  .paper-texture {
    background-image: radial-gradient(circle, rgba(15,42,69,0.045) 1px, transparent 1px);
    background-size: 18px 18px;
  }
  
  .ticket-notch { position: relative; }
  .ticket-notch::before, .ticket-notch::after {
    content:''; position:absolute; top:50%; width:16px; height:16px; border-radius:9999px;
    background: var(--paper); transform: translateY(-50%);
  }
  .ticket-notch::before{ left:-8px; }
  .ticket-notch::after{ right:-8px; }

  .glass-card {
    background: rgba(255,255,255,0.65);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }
  
  .glass-hero-card {
    background: rgba(255,255,255,0.68);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border: 1px solid rgba(229,169,61,0.22);
    box-shadow: 0 0 0 1px rgba(229,169,61,0.1), 0 24px 48px -12px rgba(229,169,61,0.12), 0 8px 24px rgba(15,42,69,0.06);
    animation: glow-border 4s ease-in-out infinite;
  }
  
  .glass-stat-badge {
    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(229,169,61,0.18);
  }
  
  .reveal { opacity:0; transform:translateY(22px); transition: opacity 0.65s cubic-bezier(.2,.8,.2,1), transform 0.65s cubic-bezier(.2,.8,.2,1); }
  .reveal.visible { opacity:1; transform:translateY(0); }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
}
`;

// Insert the @import at the top
stylesCode = additionalStyles.split('\n')[1] + '\n' + stylesCode;

// Append utilities at the bottom
stylesCode += '\n' + additionalStyles.split('\n').slice(2).join('\n');

fs.writeFileSync(stylesPath, stylesCode);
