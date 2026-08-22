const fs = require('fs');
const path = 'src/components/RailApp.jsx';
let code = fs.readFileSync(path, 'utf8');

const hookOld = 'const { isAuthenticated, user, logout } = useAuthStore();';
const hookNew = 'const { isAuthenticated, user, logout, addJourney } = useAuthStore();';
code = code.replace(hookOld, hookNew);

const confirmedOld = 'onConfirmed={(b) => { setBooking(b); setScreen("confirmation"); window.scrollTo({ top: 0 }); }}';
const confirmedNew = 'onConfirmed={(b) => { setBooking(b); addJourney(b); setScreen("confirmation"); window.scrollTo({ top: 0 }); }}';
code = code.replace(confirmedOld, confirmedNew);

fs.writeFileSync(path, code);
