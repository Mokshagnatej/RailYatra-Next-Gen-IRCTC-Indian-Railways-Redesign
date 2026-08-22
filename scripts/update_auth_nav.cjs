const fs = require('fs');
const path = 'src/components/RailApp.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add imports
const imports = `import AuthModal from "./common/AuthModal.jsx";
import { useAuthStore } from "../lib/store.ts";`;
code = code.replace('import { useJourneyStore } from "../lib/store.ts";', 'import { useJourneyStore } from "../lib/store.ts";\n' + imports);

// 2. Add auth state to TopNav
const topNavOld = `function TopNav({ screen, setScreen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);`;
  
const topNavNew = `function TopNav({ screen, setScreen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();`;
code = code.replace(topNavOld, topNavNew);

// 3. Update Account button
const accountBtnOld = `<button onClick={() => setScreen("account")}
              className="hidden md:flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-medium border transition-all duration-200"
              style={{ borderColor: accountBorder, color: textColor }}>
              <User size={15} />
              <span className={screen === "account" ? "text-[var(--marigold)]" : ""}>{screen === "account" ? "Account" : "Account"}</span>
            </button>`;

const accountBtnNew = `<button onClick={() => isAuthenticated ? logout() : setAuthModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-medium border transition-all duration-200"
              style={{ borderColor: accountBorder, color: textColor }}>
              <User size={15} />
              <span className={screen === "account" ? "text-[var(--marigold)]" : ""}>{isAuthenticated ? user?.name : "Sign In"}</span>
            </button>
            {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}`;

code = code.replace(accountBtnOld, accountBtnNew);

fs.writeFileSync(path, code);
