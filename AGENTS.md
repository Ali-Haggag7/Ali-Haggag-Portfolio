# Portfolio Master — AI Agent Rules

## Performance & Token Optimization
- NEVER use the browser subagent (`browser_subagent`) to open URLs, inspect pages, or verify changes unless the user explicitly requests it in the prompt. Let the user perform visual validation manually to save tokens and time.

## Communication Style
- When interacting in Arabic, always output responses in friendly Egyptian Arabic (عامية مصرية روشة ومحترمة) wrapped in an HTML container with RTL text direction (e.g. `<div dir="rtl" style="text-align: right; font-family: sans-serif; line-height: 1.7;">`) for maximum readability.

## Code Quality & Design System
- NEVER use raw Tailwind palette colors (e.g. `bg-blue-500`, `text-green-500`) or hardcoded hex values (e.g. `#3B82F6`) in components. Always use the project's CSS variables (e.g. `hsl(var(--accent-blue))`) to ensure light/dark theme compliance.
- Every interactive modal (like `Chatbot` or project details modal) must implement a focus trap and an Escape key keydown listener for keyboard accessibility.
- All clickable elements (buttons, links) must satisfy the 44x44px touch target guidelines. Use appropriate padding or height classes.
- Ensure date-based APIs (like GitHub contribution heatmaps) correctly filter out future dates relative to today's date to prevent display bugs.
- On mobile/touch devices, ensure that any hover-based tooltips or custom popup displays are also triggerable via a tap/click event (representing a touch toggle of the hover state) to maintain feature parity with desktop.

# 🚨 Strict AI Agent Guidelines

Welcome! Before making any modifications or writing code in this repository, you must adhere strictly to the following rules set by the repository owner:

---

## 🚫 1. No Direct Commits/Pushes
* **Do NOT** run any git commit or push commands directly on the user's terminal/workspace.
* Your role is to write down the exact git commands in the chat for the user to review, copy, and run manually.

## 🚫 2. No Web Browser Automation
* **Do NOT** trigger any browser automation tools (e.g., Puppeteer, Playwright, or browser subagents) to test the UI.
* Modify the code files directly, and the user will manually verify the results in their browser and provide feedback.

## 🚫 3. Direct File Editing Only
* **Do NOT** write temporary scripts (such as Python or Node.js scripts) to experiment with the code.
* Edit the core project files (`index.html`, `style.css`, `js/app.js`, `js/ui.js`, `js/config.js`) directly and immediately.

## 🚫 4. Minimize Terminal Commands
* **Do NOT** launch any arbitrary terminal commands or local servers unless explicitly requested by the user.
* Make the code edits directly, then summarize your changes briefly and clearly in the chat.

## ✍️ 5. RTL Alignment for Arabic Responses
* When communicating in Arabic, ensure your responses start with Right-to-Left (RTL) alignment so that the text is formatted cleanly and readable.
