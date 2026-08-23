const fs = require('fs');

const readmeContent = `
<div align="center">

# 🚆 RailYatra — Next-Gen IRCTC Indian Railways Redesign

<a href="https://Mokshagnatej.github.io/RailYatra-Next-Gen-IRCTC-Indian-Railways-Redesign/" target="_blank">
  <img src="https://images.unsplash.com/photo-1541883733221-a1dc6e8656d0?auto=format&fit=crop&q=80&w=1200&h=400" alt="3D Train Aesthetics" width="100%" style="border-radius: 12px; margin: 15px 0;">
</a>

### *Book Indian train tickets without the guesswork. A Premium 3D-inspired Redesign.*

An ambitious, human-centered UI/UX transformation of the Indian Railways Catering & Tourism Corporation (IRCTC) portal. Engineered for speed, clarity, transparency, and delight.

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-764ABC?style=for-the-badge&logo=react&logoColor=white)](https://github.com/pmndrs/zustand)
[![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-Latest-F56565?style=for-the-badge&logo=feather&logoColor=white)](https://lucide.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://vite-pwa-org.netlify.app/)

**Live Site:** [https://Mokshagnatej.github.io/RailYatra-Next-Gen-IRCTC-Indian-Railways-Redesign/](https://Mokshagnatej.github.io/RailYatra-Next-Gen-IRCTC-Indian-Railways-Redesign/)

</div>

---

## 🌟 What is RailYatra?

Millions of passengers book train tickets across India every day. However, traditional booking portals suffer from high cognitive friction during Tatkal windows, stressful payment dead-ends, and outdated visual aesthetics.

**RailYatra solves this** with an ultra-clean, intuitive, single-page reactive architecture featuring honest seat availability indicators, animated real-time rail radar, instant modal tools, and a frictionless booking engine.

---

## 🚀 Live Demo & Interactive Preview

> **Experience the live build deployed via GitHub Actions!** 
> 
> 👉 [Click here to open the Live App](https://Mokshagnatej.github.io/RailYatra-Next-Gen-IRCTC-Indian-Railways-Redesign/)

<details>
<summary><b>✨ Interactive Walkthrough (Click to Expand)</b></summary>
<br>

1. **Dark Mode Integration**: Toggle your device's system settings to Dark Mode to see the UI automatically shift colors!
2. **Book a Ticket**: Search for a train, select your berth, and try out the OTP checkout flow.
3. **Live Dashboard**: Watch the simulated train radar move in real-time.
4. **PWA Support**: Install it on your phone for offline ticket viewing.
</details>

---

## 🛠️ What I Use & How I Use It (Tech Stack)

### ⚛️ Frontend Framework
- **React 19**: Used for building isolated, highly interactive UI components like the \`LiveRailRadarCard\`.
- **TypeScript**: Ensures type safety across complex booking payloads and train schedules.

### ⚡ Build Tool & Deployment
- **Vite 8**: Provides lightning-fast HMR during development and bundles our application optimally.
- **GitHub Actions**: Automates the CI/CD pipeline, pushing our \`dist\` directly to GitHub Pages upon every commit.

### 📦 State Management
- **Zustand**: A small, fast, scalable bearbones state-management solution.
  - *How I use it:* Manages global states like \`useJourneyStore\` (tracking the live train progress) and \`useBookingStore\` (storing ticket data persistently).

### 🎨 Styling & 3D Aesthetics
- **Tailwind CSS V4**: Rapid utility-first styling.
- **CSS Modules & Variables**: Used for the deep dark-mode and custom color mappings (like \`--marigold\` and \`--blue\`).
- **Glassmorphism**: Backdrop blur effects are heavily used in modals to give a modern, layered, "floating" 3D aesthetic to the UI.

### 🌐 PWA (Progressive Web App)
- **Vite PWA Plugin**: Automatically generates service workers.
  - *How I use it:* Caches the app shell and user's \`MyTripsScreen\` so they can access their e-ticket even when the train goes through a tunnel and they lose network connectivity.

---

## 📐 Architecture & Flow

\`\`\`mermaid
graph TD
    A[Root Shell: RailApp.jsx] --> B[Top Navigation & Brand Header]
    A --> C{Screen State Router}
    
    C -->|search| D[SearchScreen]
    C -->|booking| F[BookingScreen]
    C -->|trips| H[MyTripsScreen]
    C -->|explore| I[ExploreScreen]
    
    D --> L[LiveRailRadarCard]
    D --> M[EndToEndTrainTrack]
    
    H --> N[E-Ticket & QR Modal]
    H --> O[Live Route Tracker Modal]
    
    I --> Q[Interactive Tourism Hub]
\`\`\`

---

## 🎨 Design System & Tokens

The design system honors Indian Railways' heritage while adopting a modern editorial aesthetic:

| Token | CSS Variable | Hex / Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Deep Rail Blue** | \`--blue\` | \`#0F2A45\` | Primary navigation, brand surfaces, active buttons |
| **Marigold Yellow** | \`--marigold\` | \`#E5A93D\` | Call-to-actions, badges, brand accents |
| **Heritage Paper** | \`--paper\` | \`#F7F4EC\` | Soft textured warm canvas background |
| **Forest Green** | \`--green\` | \`#1F7A4C\` | Confirmed seats, on-time alerts, verified KYC |
| **Signal Red** | \`--red\` | \`#C23B32\` | Cancellations, errors, Tatkal warnings |

---

## 💻 Getting Started (Local Setup)

<details open>
<summary><b>1. Clone the repository</b></summary>

\`\`\`bash
git clone https://github.com/Mokshagnatej/RailYatra-Next-Gen-IRCTC-Indian-Railways-Redesign.git
cd RailYatra-Next-Gen-IRCTC-Indian-Railways-Redesign
\`\`\`
</details>

<details open>
<summary><b>2. Install dependencies</b></summary>

\`\`\`bash
npm install
\`\`\`
</details>

<details open>
<summary><b>3. Start the local server</b></summary>

\`\`\`bash
npm run dev
\`\`\`
> The application will be live at \`http://localhost:5173/\`.
</details>

---

## 👥 Contributors & Credits

- **Design & Engineering**: Redesigned with care for the Indian rail commuter community.
- **Disclaimer**: *This project is an independent UI/UX concept and portfolio demonstration. Not officially affiliated with or endorsed by Indian Railways or IRCTC Ltd.*

<div align="center">
  <sub>Made with ❤️ for Indian Railways travelers.</sub>
</div>
`;

fs.writeFileSync('README.md', readmeContent);
