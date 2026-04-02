<div align="center">
  <h1>✨ Ali Haggag | Full-Stack Portfolio</h1>
  
  <p>
    A high-performance, pixel-perfect personal portfolio built with <b>Next.js 15</b>.
    Features a modern dark mode UI, seamless <b>PWA</b> support, an integrated <b>Google Gemini AI</b> assistant,
    a dynamic <b>GitHub Activity Panel</b>, and a ruthlessly optimized rendering pipeline targeting <b>60fps</b> on all devices.
  </p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img src="https://img.shields.io/badge/Framer_Motion-EF0082?style=for-the-badge&logo=framer&logoColor=white" />
    <img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" />
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  </p>
  <br />
  <img src="/main-preview.png" alt="Project Preview" width="100%" style="border-radius: 10px;" />
</div>

<br />

## 🚀 Live Demo

[Click here to visit my portfolio](https://ali-haggag-portfolio.vercel.app/)

---

## 🔥 Key Features

### 🤖 AI Intelligence
- **Powered by Gemini Pro:** Direct integration with Google's latest LLM to act as a personal assistant representing my resume and skills.
- **Smart Context:** Maintains conversation history for fluid, accurate responses — with a fully overhauled assistant architecture using `rAF` scrolling and stable memoization for zero-lag chat UX.

### 🎨 UI/UX Design
- **Cinematic Dark Mode:** A custom "Midnight Obsidian" theme with dark set as CSS default in `:root` — permanently eliminating white flash on load.
- **Responsive Layout:** Perfectly optimized for desktop and mobile, including GPU-accelerated floating dock and battle scars accordion for zero-lag mobile UX.
- **Smooth Animations:** Powered by Framer Motion with spring-based hover physics, clip-path animations, and CSS keyframes — all optimized to eliminate layout thrashing and hit 60fps.
- **Custom 404 Page:** Terminal-styled 404 experience with optimized particle effects.

### 🧠 Skills Section
- **Categorized Technical Arsenal:** Fully refactored into a dynamic **Bento Grid** layout with detailed expertise mapping.
- **Battle-Tested UI:** Amber → Violet themed badge system for battle-tested skills, with fluid hover animations on skill badges.
- **Expanded Cloud Stack:** Now includes **Azure**, **Inngest**, **PostgreSQL** (production-ready), **Supabase** (production-ready), and observability tools.
- **Optimized Modal Performance:** GPU-layered modals with focus trap and stable handler types.

### 🗂️ Projects Section
- **Morphing Bento Cards:** Fully optimized bento grid cards targeting 60fps scroll performance — Framer Motion bottlenecks fully eradicated.
- **Split Project Modal:** Refactored into a dedicated component for cleaner architecture and supercharged animations.
- **Mount-Once Video Pattern:** Videos use a stable mount-once pattern with modal orchestration to prevent unnecessary re-renders.
- **Enhanced CTA Buttons:** High-contrast hover states with interactive depth effects.

### 📅 Timeline & Battle Scars
- **Spring-Based Scroll:** Optimized scroll hooks with spring physics for smooth timeline navigation.
- **Battle Scars Overhaul:** Clip-path animation, grid layout, and a custom `useStableMap` hook for stable rendering.
- **Deep-Linking:** Precision URL deep-linking for Battle Scars entries with transient URL support.
- **Suspense Boundary:** BattleScars wrapped in Suspense for `searchParams` compatibility.

### 📬 Contact Section
- **GitHub Activity Panel:** Replaced the Globe with a dynamic, real-time **GitHub Activity Panel** with fallback stats guard for API failures.
- **Lightweight Styling:** Heavy blurs replaced with lightweight radial gradients, and unnecessary `will-change` tags stripped for better VRAM usage.

### ⚙️ Engineering & Performance
- **GPU Hardware Acceleration:** Injected across the entire pipeline — hero, particles, dock, skills, timeline, footer, and more.
- **Canvas Batch Rendering:** Hero particles use canvas batch rendering with `requestAnimationFrame` to eliminate VRAM-heavy blurs.
- **Zero Hydration Flash:** Initial states added to always-mounted motion elements; icon transitions deferred until after mount.
- **CSS Optimizations:** Heavy `clip` replaced with `clip-path` for glitch animations; global scroll optimized.
- **Accessibility:** All Lighthouse accessibility issues resolved — ARIA labels, touch targets, video captions — achieving a **100% Lighthouse score**.
- **Local SVGs:** Migrated to local SVGs for zero-latency icon rendering.
- **PWA Support:** Fully installable on mobile with custom splash screens and offline capabilities.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js 15 (App Router + Turbopack) |
| **Language** | TypeScript |
| **Styling & UI** | Tailwind CSS & Magic UI |
| **Animations** | Framer Motion + CSS Keyframes |
| **AI Integration** | Google Generative AI SDK (Gemini Pro) |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

Follow these steps to run the portfolio locally:

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/Ali-Haggag7/portfolio.git
cd portfolio

# Install dependencies
npm install
```

### 2. Setup Configuration

```bash
# Create a .env.local file in the root directory and add your Google Gemini API key:
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

### 3. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 📸 Interface Previews

| **Desktop View** | **Mobile PWA View** |
| :---: | :---: |
| <img src="/desktop-view.png" width="100%" /> | <img src="/mobile-view.png" width="100%" /> |

---

## 📈 Recent Updates

> All changes shipped between **Mar 25 – Apr 1, 2026**

- ✅ PostgreSQL & Supabase marked as **production-ready**
- ✅ GitHub Activity Panel replacing Globe in Contact section
- ✅ Dynamic Bento Grid for Skills with detailed expertise mapping
- ✅ Deep-linking support for Battle Scars
- ✅ Terminal-styled custom 404 page
- ✅ Zero white flash — dark mode set at CSS `:root` level
- ✅ Lighthouse **100% accessibility score**
- ✅ Full GPU acceleration pipeline across all major sections
- ✅ Split Project Modal with supercharged animations
- ✅ Canvas batch rendering for hero particles at 60fps

---

<div align="center">
<br />
<p>Made with ❤️ by <b>Ali Haggag</b></p>
<a href="https://www.linkedin.com/in/ali-haggag7/">
  <img src="https://img.shields.io/badge/Connect-LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
</a>
<a href="mailto:ali.haggag2005@gmail.com">
  <img src="https://img.shields.io/badge/Contact-Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
</a>
<a href="https://github.com/Ali-Haggag7">
  <img src="https://img.shields.io/badge/Portfolio-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
</a>
</div>
