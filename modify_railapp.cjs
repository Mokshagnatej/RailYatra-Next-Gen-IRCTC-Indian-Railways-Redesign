const fs = require('fs');

let content = fs.readFileSync('src/components/RailApp.jsx', 'utf8');

// Add imports
const imports = `import TopNav from "./layout/TopNav.jsx";
import Footer from "./layout/Footer.jsx";
import QuickLinksModal from "./modals/QuickLinksModal.jsx";\n`;

content = content.replace(/(import { getDateStrip, formatDateShort, formatDateMedium, formatDateLong } from "\.\.\/lib\/dateUtils";)/, "$1\n" + imports);

// We need to replace the TopNav function block. We'll use a regex that matches from `function TopNav(` up to `function QuickLinksModal(`.
// Wait, TopNav might be before QuickLinksModal, separated by some comments.
content = content.replace(/function TopNav\(\{\s*screen,\s*setScreen\s*\}\)[\s\S]*?(?=\/\* Hyper-Realistic Full-Width)/, "");

content = content.replace(/function QuickLinksModal\(\{\s*modal,\s*onClose,\s*onNavigate\s*\}\)[\s\S]*?(?=\/\* ---------------- INTERACTIVE FOOTER ---------------- \*\/)/, "");

content = content.replace(/function Footer\(\{\s*onAction\s*\}\)[\s\S]*?(?=\/\* ---------------- SEARCH SCREEN ---------------- \*\/)/, "");

fs.writeFileSync('src/components/RailApp.jsx', content);
console.log("Successfully modified RailApp.jsx");
