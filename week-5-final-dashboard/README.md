# InsightBoard — Week 5 Final Mini Web Application

## Overview
**InsightBoard** is a responsive, accessible SaaS analytics dashboard built with **semantic HTML5**, **modern vanilla CSS**, and **clean vanilla JavaScript**. It serves as the capstone project for the 5-week Junior Frontend Developer Internship, unifying all previously acquired skills: responsive layout design, interactive components, accessibility compliance, frontend performance optimization, and dynamic asynchronous JSON data integration.

---

## Architecture & Technology Stack
- **Structure:** Semantic HTML5 (`header`, `nav`, `main`, `section`, `article`, `figure`, `table`, `footer`)
- **Styling:** Vanilla CSS3 utilizing CSS Custom Properties (design tokens), Flexbox, CSS Grid, and responsive breakpoints
- **Logic:** Vanilla JavaScript (ES6+) with modular functions, asynchronous `fetch()`, and event delegation
- **Data Source:** Static `data.json` file representing real-world business analytics
- **External Dependencies:** **Zero** (no frameworks, no jQuery, no heavyweight chart libraries)

---

## Dynamic Data Integration (`data.json`)
The application contains **zero hardcoded metric or transactional values** in the HTML. Upon loading, JavaScript initiates a client-side `fetch('data.json')` request and populates the interface dynamically.

### Data Schema:
1. **`meta`**: Last updated timestamps, active fiscal period label, and currency formatting standards.
2. **`metrics`**: Array of 4 KPI objects containing ID, label, value, formatting type (`currency`, `number`, `percent`), period change (+18.4%), growth rate, positive/negative boolean, and benchmark comparison.
3. **`monthlyRevenue`**: 12 monthly performance records featuring month label, full month name, actual revenue, performance target, order count, and growth percentage.
4. **`channels`**: Traffic acquisition channels with share percentage, absolute visitor counts, and conversion rates.
5. **`products`**: Tiered product subscriptions with monthly price, active subscriber counts, and recurring monthly revenue.
6. **`transactions`**: Granular transaction ledger containing transaction ID, ISO date, customer name, email address, subscribed product tier, category, dollar amount, and status (`Completed`, `Pending`, `Refunded`).

Modifying any value in `data.json` and clicking **"↻ Refresh data"** updates the entire dashboard in real time.

---

## Key Features & Interactivity

### 1. Executive Performance Hero
- Live calculated Year-To-Date (YTD) total revenue dynamically derived from monthly records.
- Live growth and active customer badges.
- Dynamic sparkline bars scaled proportionally to monthly performance.
- "Executive Summary" button opening an overview modal with keyboard navigation guides.

### 2. Live Dashboard & KPI Cards
- 4 dynamic KPI cards: Total Revenue, Active Customers, Total Orders, and Conversion Rate.
- Visual trend badges with positive/negative semantic indicators.
- Live "Updated" timestamp badge and working **"↻ Refresh data"** button with loading animation.

### 3. Analytics Visualizations with Tabs & Period Filtering
- **Tabbed Interface:** Switch between "Revenue & Target Trend", "Product Performance", and "Acquisition Channels" with full ARIA tablist semantics.
- **Period Filter:** Dynamic dropdown filter on the revenue chart:
  - *All 12 Months*
  - *H1: Jan – Jun*
  - *H2: Jul – Dec*
  - *Quarterly Views: Q1, Q2, Q3, Q4*
- **Interactive Bar Chart:** Proportional CSS/DOM flex bars comparing Actual Revenue against Targets, with hover tooltips displaying exact amounts.
- **Dynamic Period Summary:** Computes Period Total, Monthly Average, Highest Month, and Lowest Month for the selected period in real time.

### 4. Searchable, Filterable & Sortable Transactions Table
- **Live Search:** Debounced input matching across customer name, email, product, category, and transaction ID.
- **Status Filter:** Dropdown filtering by transaction status (*All Statuses*, *Completed*, *Pending*, *Refunded*).
- **Multi-Column Sorting:** Sort by Date, ID, Customer, Product, Amount, or Status with ascending/descending toggling, visual indicators (▲/▼), and `aria-sort` accessibility attributes.
- **Empty State:** If a search or filter yields zero matching records, a clean empty state card appears with a "Clear Filters" recovery button.
- **Transaction Inspector Modal:** Clicking "Inspect" on any record opens a modal dialog displaying full transaction metadata.

### 5. Architectural FAQ & Insights (Accordion)
- Expandable accordion items demonstrating Week 2 & 3 interactivity applied to technical documentation and internship questions.

---

## Accessibility (WCAG 2.1 AA Compliance)
- **Landmarks & Skip Link:** Prominent Skip to Main Content link placed as the first focusable element in `<body>`.
- **Keyboard Navigation:** 100% operable via keyboard alone (`Tab`, `Shift + Tab`, `Enter`, `Space`, `Escape`).
- **Focus Rings:** Distinct, high-contrast `:focus-visible` indicators with 3px outline and 2px offset.
- **Modal Focus Trapping:** When any modal opens, keyboard focus is trapped within the dialog. Pressing `Escape` or clicking the backdrop closes the modal and returns focus to the initiating button.
- **Table Semantics:** Includes `<caption class="sr-only">`, `<th scope="col">`, and dynamic `aria-sort="ascending|descending|none"`.
- **Live Regions:** Screen readers receive non-intrusive updates via `role="status"` and `aria-live="polite"` when filters change or data reloads.
- **Reduced Motion:** Fully respects `prefers-reduced-motion: reduce` by disabling smooth scrolling and transitions for sensitive users.

---

## Error Handling Lifecycle
- **Loading State:** Displays a spinner and "Loading dashboard data..." message while fetching.
- **Success State:** Seamlessly parses JSON and renders all dashboard widgets.
- **Error State:** If `fetch()` fails (e.g. invalid path or CORS restriction), an error banner displays: *"Unable to load dashboard data."* alongside an interactive **Retry** button.
- **Empty State:** If datasets or filtered queries yield 0 results, an informative empty state card offers a single-click reset.

---

## How to Run Locally

Because the application fetches `data.json` via asynchronous HTTP requests, running through `file://` may be blocked by modern browser security policies (CORS). Use a lightweight local HTTP server:

### Option A: VS Code Live Server (Recommended)
1. Open the project folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey) if you haven't already.
3. Right-click `week-5-final-dashboard/index.html`.
4. Select **Open with Live Server**.
5. The dashboard will open in your browser automatically.

---

## Testing Verification Script
1. **Desktop (1440px / 1280px / 1024px):**
   - Check 4-column KPI layout and 2-column analytics view.
   - Click "Product Performance" and "Acquisition Channels" tabs.
   - Select period "H1: Jan – Jun" and verify chart recalculates.
2. **Tablet (768px):**
   - Verify 2-column KPI grid and horizontal table scrolling.
3. **Mobile (390px / 375px):**
   - Tap hamburger menu toggle; verify menu slides in and closes when clicking a link or toggling again.
   - Verify chart and table adapt gracefully without horizontal viewport breakage.
4. **Interactivity & Data:**
   - Type `"Pro Plan"` in transaction search; verify only 4 matching rows remain.
   - Change status filter to `"Pending"`; verify only 2 pending rows appear.
   - Click "Reset" button; verify full 12 transactions return.
   - Click "Amount" header; verify numeric sorting from $99 to $999.
   - Click "Inspect" on transaction `TX-1001`; verify modal displays transaction details. Press `Escape` to close.
   - Click "↻ Refresh data"; verify loading spinner activates and data reloads.
