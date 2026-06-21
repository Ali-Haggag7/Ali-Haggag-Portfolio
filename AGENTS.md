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

## Git & Version Control
- NEVER perform Git commits (`git commit`) or pushes (`git push`) directly. The agent is only responsible for writing and modifying files in the workspace. Staging, committing, and pushing must be handled manually by the user.
