# InsightBoard — Junior Frontend Developer Internship (5-Week Project)

## Overview
**InsightBoard** is a modern SaaS analytics project developed across a **5-week Junior Frontend Developer Internship**. The repository documents the progressive evolution of a production-quality frontend application, demonstrating semantic HTML5, modern vanilla CSS, modular vanilla JavaScript, WCAG 2.1 AA accessibility, web performance optimization, and dynamic JSON data architecture.

---

## 5-Week Internship Curriculum Progression

```
InsightBoard-Internship/
├── week-1-responsive-landing/    # WEEK 1: Responsive Landing Page (Flexbox, Grid, Mobile Nav)
├── week-2-interactive-ui/        # WEEK 2: Interactive UI Components (Tabs, Accordion, Modal)
├── week-3-accessibility/         # WEEK 3: Accessibility & UX (WCAG AA, Skip Link, ARIA, Focus Trap)
├── week-4-performance/           # WEEK 4: Frontend Performance (Deferred JS, Zero Dependencies)
├── week-5-final-dashboard/       # WEEK 5: Final Capstone Mini Web Application (Dynamic JSON Dashboard)
└── README.md                     # Master Internship Documentation
```

### [Week 1 — Responsive Landing Page](file:///week-1-responsive-landing/README.md)
- **Goal:** Build a responsive marketing landing page with semantic HTML5 and clean CSS.
- **Key Deliverables:** Sticky navigation, hero section with analytics preview, feature grid, 3-step workflow, responsive mobile menu toggle, skip link, and CSS Grid/Flexbox layouts.

### [Week 2 — Interactive UI Components](file:///week-2-interactive-ui/README.md)
- **Goal:** Introduce interactive UI components using vanilla JavaScript and DOM manipulation.
- **Key Deliverables:** Accessible tabbed interface with keyboard arrow navigation, collapsible accordion panels, modal dialog with backdrop dismissal, and event delegation.

### [Week 3 — Accessibility & UX](file:///week-3-accessibility/README.md)
- **Goal:** Ensure full accessibility readiness and screen-reader compatibility.
- **Key Deliverables:** Skip to main content landmark link, distinct `:focus-visible` focus rings, ARIA roles (`role="tablist"`, `role="tabpanel"`, `role="dialog"`), modal focus trapping, live screen reader announcements (`role="status" aria-live="polite"`), and `prefers-reduced-motion` support.

### [Week 4 — Frontend Performance Optimization](file:///week-4-performance/README.md)
- **Goal:** Analyze bottlenecks and eliminate unnecessary runtime weight.
- **Key Deliverables:** Deferred JavaScript loading (`defer`), inline CSS-based visuals instead of heavy charting libraries, elimination of external dependencies, DOM query caching, and visibility-aware state handlers.

### [Week 5 — Final Mini Web Application (Capstone)](file:///week-5-final-dashboard/README.md)
- **Goal:** Build a complete, responsive analytics dashboard fetching live data from a static JSON file.
- **Key Deliverables:**
  - Asynchronous `fetch('data.json')` with zero hardcoded values in HTML.
  - 4 dynamic KPI metrics with benchmarks.
  - Interactive monthly revenue bar chart with period filtering (All 12 Months, H1, H2, Q1-Q4).
  - Tabbed analytics views (Revenue Trend, Product Catalog, Acquisition Channels).
  - Searchable, filterable, and multi-column sortable transactions table.
  - Transaction detail inspector modal with full focus trap and Escape key dismissal.
  - Complete error, loading, and empty state lifecycles.

---

## Technology Stack
- **HTML5:** Semantic landmarks (`header`, `nav`, `main`, `section`, `article`, `figure`, `table`, `footer`)
- **CSS3:** Custom Properties (design tokens), Flexbox, CSS Grid, media queries, `:focus-visible`
- **JavaScript:** Vanilla ES6+, Fetch API, Intl API, Event Delegation, DOM manipulation
- **Data:** Structured `data.json` schema
- **Dependencies:** **None** (100% dependency-free)

---

## How to Run the Project

For Weeks 1–4, open `index.html` directly in any web browser or via a local server.

For **Week 5**, because the application performs client-side `fetch('data.json')`, running through a local HTTP server is recommended to comply with browser CORS policies:

### Using VS Code Live Server (Recommended):
1. Open the project folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey) if you haven't already.
3. Right-click any `index.html` file and select **Open with Live Server**.
4. The dashboard will open in your browser automatically.

---

## Verification & Testing Guide

### Responsive Breakpoints:
- **Desktop (1440px / 1280px / 1024px):** 4-column metrics, split dashboard grid, expanded table.
- **Tablet (768px):** 2-column metrics, horizontal scroll on data tables.
- **Mobile (390px / 375px):** 1-column layout, touch-friendly navigation drawer, minimum 44px tap targets.

### Keyboard & Accessibility:
- Press <kbd>Tab</kbd> upon page load: verify **Skip to main content** link appears.
- Use <kbd>Enter</kbd> or <kbd>Space</kbd> on all interactive buttons.
- In modals, verify <kbd>Tab</kbd> cycles inside the dialog and <kbd>Esc</kbd> closes it.
- Verify focus rings are clearly visible on every interactive element.
