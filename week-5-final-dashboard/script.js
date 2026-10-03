const state = {
  data: null,
  query: "",
  statusFilter: "all",
  sortColumn: "customer",
  sortAscending: true,
  period: "all",
  isLoading: false
};

const DOM = {
  menuToggle: document.getElementById("menuToggle"),
  navMenu: document.getElementById("navMenu"),
  refreshBtn: document.getElementById("refreshBtn"),
  lastUpdated: document.getElementById("lastUpdated"),
  heroRevenue: document.getElementById("heroRevenue"),
  heroGrowth: document.getElementById("heroGrowth"),
  heroCustomers: document.getElementById("heroCustomers"),
  miniBars: document.getElementById("miniBars"),
  metrics: document.getElementById("metrics"),
  chart: document.getElementById("chart"),
  chartSummary: document.getElementById("chartSummary"),
  periodFilter: document.getElementById("periodFilter"),
  productsBody: document.getElementById("productsBody"),
  channels: document.getElementById("channels"),
  search: document.getElementById("search"),
  statusFilter: document.getElementById("statusFilter"),
  resetFiltersBtn: document.getElementById("resetFiltersBtn"),
  clearFilterBtn: document.getElementById("clearFilterBtn"),
  transactionsBody: document.getElementById("transactionsBody"),
  emptyState: document.getElementById("emptyState"),
  tableStatus: document.getElementById("tableStatus"),
  loadingIndicator: document.getElementById("loadingIndicator"),
  errorBanner: document.getElementById("errorBanner"),
  errorMessage: document.getElementById("errorMessage"),
  retryBtn: document.getElementById("retryBtn"),
  quickViewBtn: document.getElementById("quickView"),
  helpBtn: document.getElementById("helpBtn"),
  helpModal: document.getElementById("helpModal"),
  closeHelpModal: document.getElementById("closeHelpModal"),
  helpDoneBtn: document.getElementById("helpDoneBtn"),
  detailModal: document.getElementById("detailModal"),
  closeDetailModal: document.getElementById("closeDetailModal"),
  detailDoneBtn: document.getElementById("detailDoneBtn"),
  detailModalContent: document.getElementById("detailModalContent"),
  tabButtons: document.querySelectorAll(".tab-btn"),
  tabPanels: document.querySelectorAll(".tab-panel"),
  sortButtons: document.querySelectorAll(".sort-btn"),
  accordionTriggers: document.querySelectorAll(".accordion-trigger")
};

let activeModalTrigger = null;

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

function formatNumber(num) {
  return new Intl.NumberFormat("en-US").format(num);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[monthIndex]} ${day}, ${year}`;
  }
  return dateStr;
}

function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Fetch dashboard metrics and monthly data from data.json
async function loadData() {
  state.isLoading = true;
  showLoading(true);
  hideError();

  if (DOM.refreshBtn) {
    DOM.refreshBtn.disabled = true;
    DOM.refreshBtn.setAttribute("aria-busy", "true");
  }

  try {
    const response = await fetch("data.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: Unable to retrieve data.json`);
    }

    const data = await response.json();
    state.data = data;
    showLoading(false);

    try {
      renderDashboard(data);
    } catch (renderErr) {
      console.error("Dashboard render error:", renderErr);
    }
  } catch (err) {
    console.error("Dashboard data load error:", err);
    showLoading(false);
    showError(
      "Unable to load dashboard data. Please make sure you are running the project through VS Code Live Server and try again."
    );
  } finally {
    state.isLoading = false;
    if (DOM.refreshBtn) {
      DOM.refreshBtn.disabled = false;
      DOM.refreshBtn.setAttribute("aria-busy", "false");
    }
  }
}

function showLoading(isLoading) {
  if (DOM.loadingIndicator) {
    DOM.loadingIndicator.classList.toggle("active", isLoading);
  }
}

function showError(message) {
  if (DOM.errorBanner) {
    DOM.errorBanner.hidden = false;
    if (DOM.errorMessage) {
      DOM.errorMessage.textContent = message;
    }
  }
}

function hideError() {
  if (DOM.errorBanner) {
    DOM.errorBanner.hidden = true;
  }
}

// Render all dashboard sections with latest state
function renderDashboard(data) {
  renderHero(data);
  renderMetrics(data.metrics);
  renderChart();
  renderProducts(data.products);
  renderChannels(data.channels);
  renderTable();
}

// Render top summary banner and mini trend bars
function renderHero(data) {
  if (!data) return;

  if (DOM.lastUpdated && data.meta && data.meta.lastUpdatedFormatted) {
    DOM.lastUpdated.textContent = data.meta.lastUpdatedFormatted;
  }

  const totalYTD = data.monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);
  if (DOM.heroRevenue) {
    DOM.heroRevenue.textContent = formatCurrency(totalYTD);
  }

  const revenueMetric = data.metrics.find(m => m.id === "revenue") || data.metrics[0];
  if (DOM.heroGrowth && revenueMetric) {
    DOM.heroGrowth.textContent = `${revenueMetric.change} vs benchmark`;
  }

  const customerMetric = data.metrics.find(m => m.id === "customers");
  if (DOM.heroCustomers && customerMetric) {
    DOM.heroCustomers.textContent = `Active customers: ${formatNumber(customerMetric.value)}`;
  }

  if (DOM.miniBars && Array.isArray(data.monthlyRevenue)) {
    const maxRev = Math.max(...data.monthlyRevenue.map(m => m.revenue));
    DOM.miniBars.innerHTML = data.monthlyRevenue
      .map(item => {
        const heightPct = Math.max(12, Math.round((item.revenue / maxRev) * 100));
        return `<i style="height:${heightPct}%" title="${item.month}: ${formatCurrency(item.revenue)}" aria-hidden="true"></i>`;
      })
      .join("");
  }
}

// Render KPI metric cards with change badges
function renderMetrics(metrics) {
  if (!DOM.metrics || !Array.isArray(metrics)) return;

  DOM.metrics.innerHTML = metrics
    .map(metric => {
      let formattedVal = metric.value;
      if (metric.format === "currency") formattedVal = formatCurrency(metric.value);
      else if (metric.format === "number") formattedVal = formatNumber(metric.value);
      else if (metric.format === "percent") formattedVal = `${metric.value}%`;

      const badgeClass = metric.isPositive ? "badge-positive" : "badge-negative";

      return `
        <article class="metric-card" tabindex="0">
          <div class="metric-header">
            <span class="metric-label">${metric.label}</span>
            <span class="badge ${badgeClass}">${metric.change}</span>
          </div>
          <div class="metric-value">${formattedVal}</div>
          <div class="metric-footer">
            <span class="metric-benchmark">${metric.benchmark || metric.period}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

// Render monthly revenue bar chart based on selected period
function renderChart() {
  if (!DOM.chart || !state.data || !Array.isArray(state.data.monthlyRevenue)) return;

  let items = [...state.data.monthlyRevenue];

  if (state.period === "first") {
    items = items.slice(0, 6);
  } else if (state.period === "second") {
    items = items.slice(6);
  } else if (state.period === "q1") {
    items = items.slice(0, 3);
  } else if (state.period === "q2") {
    items = items.slice(3, 6);
  } else if (state.period === "q3") {
    items = items.slice(6, 9);
  } else if (state.period === "q4") {
    items = items.slice(9, 12);
  }

  const revenues = items.map(x => x.revenue);
  const targets = items.map(x => x.target || x.revenue);
  const maxVal = Math.max(...revenues, ...targets, 1);
  const chartHeightPx = 220;

  DOM.chart.innerHTML = items
    .map(item => {
      const actualHeight = Math.max(8, Math.round((item.revenue / maxVal) * chartHeightPx));
      const targetHeight = Math.max(8, Math.round(((item.target || item.revenue) / maxVal) * chartHeightPx));

      return `
        <div class="chart-col" tabindex="0" aria-label="${item.fullMonth || item.month}: Actual ${formatCurrency(item.revenue)}, Target ${formatCurrency(item.target || 0)}">
          <div class="bar-tooltip">
            <strong>${item.fullMonth || item.month}</strong><br>
            Actual: ${formatCurrency(item.revenue)}<br>
            Target: ${formatCurrency(item.target || 0)}
          </div>
          <div class="bar-group">
            <div class="chart-bar actual" style="height: ${actualHeight}px"></div>
            <div class="chart-bar target" style="height: ${targetHeight}px"></div>
          </div>
          <span class="chart-label" aria-hidden="true">${item.month}</span>
        </div>
      `;
    })
    .join("");

  if (DOM.chartSummary) {
    const totalRev = revenues.reduce((a, b) => a + b, 0);
    const avgRev = Math.round(totalRev / revenues.length);
    const maxMonth = items.reduce((prev, curr) => (curr.revenue > prev.revenue ? curr : prev), items[0]);
    const minMonth = items.reduce((prev, curr) => (curr.revenue < prev.revenue ? curr : prev), items[0]);

    DOM.chartSummary.innerHTML = `
      <div class="chart-stat">
        <span>Period Total</span>
        <strong>${formatCurrency(totalRev)}</strong>
      </div>
      <div class="chart-stat">
        <span>Monthly Average</span>
        <strong>${formatCurrency(avgRev)}</strong>
      </div>
      <div class="chart-stat">
        <span>Highest Month</span>
        <strong>${maxMonth.month} (${formatCurrency(maxMonth.revenue)})</strong>
      </div>
      <div class="chart-stat">
        <span>Lowest Month</span>
        <strong>${minMonth.month} (${formatCurrency(minMonth.revenue)})</strong>
      </div>
    `;
  }
}

// Render top products performance table
function renderProducts(products) {
  if (!DOM.productsBody || !Array.isArray(products)) return;

  DOM.productsBody.innerHTML = products
    .map(product => `
      <tr>
        <td><strong>${product.name}</strong></td>
        <td><span class="badge">${product.category}</span></td>
        <td>${formatCurrency(product.price)}</td>
        <td>${formatNumber(product.activeSubscribers)}</td>
        <td><strong>${formatCurrency(product.monthlyRevenue)}</strong></td>
        <td><span class="badge badge-completed">${product.status}</span></td>
      </tr>
    `)
    .join("");
}

// Render acquisition channel breakdown
function renderChannels(channels) {
  if (!DOM.channels || !Array.isArray(channels)) return;

  DOM.channels.innerHTML = channels
    .map(channel => `
      <div class="channel-card">
        <div class="channel-header">
          <span class="channel-name">${channel.name}</span>
          <span class="channel-share">${channel.percent}%</span>
        </div>
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" style="width: ${channel.percent}%"></div>
        </div>
        <div class="channel-meta">
          <span>${formatNumber(channel.visitors)} visitors</span>
          <span>Conversion: <strong>${channel.conversion}</strong></span>
        </div>
      </div>
    `)
    .join("");
}

// Filter, sort, and render transaction table rows
function renderTable() {
  if (!DOM.transactionsBody || !state.data || !Array.isArray(state.data.transactions)) return;

  const raw = state.data.transactions;
  const q = state.query.trim().toLowerCase();

  let rows = raw.filter(item => {
    const searchable = `${item.customer} ${item.email || ""} ${item.product} ${item.category || ""} ${item.id || ""}`.toLowerCase();
    return searchable.includes(q);
  });

  if (state.statusFilter !== "all") {
    rows = rows.filter(item => item.status.toLowerCase() === state.statusFilter.toLowerCase());
  }

  rows.sort((a, b) => {
    const col = state.sortColumn;
    let av = a[col];
    let bv = b[col];

    if (col === "amount") {
      return state.sortAscending ? av - bv : bv - av;
    }
    if (col === "date") {
      const da = new Date(av).getTime();
      const db = new Date(bv).getTime();
      return state.sortAscending ? da - db : db - da;
    }

    av = String(av || "").toLowerCase();
    bv = String(bv || "").toLowerCase();
    return state.sortAscending ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  DOM.sortButtons.forEach(btn => {
    const key = btn.dataset.sort;
    const th = btn.closest("th");
    const indicator = btn.querySelector(".sort-indicator");

    if (key === state.sortColumn) {
      const direction = state.sortAscending ? "ascending" : "descending";
      if (th) th.setAttribute("aria-sort", direction);
      if (indicator) indicator.textContent = state.sortAscending ? "▲" : "▼";
    } else {
      if (th) th.setAttribute("aria-sort", "none");
      if (indicator) indicator.textContent = "↕";
    }
  });

  if (rows.length === 0) {
    DOM.transactionsBody.innerHTML = "";
    if (DOM.emptyState) DOM.emptyState.hidden = false;
    if (DOM.tableStatus) DOM.tableStatus.textContent = "0 transactions matching criteria";
    return;
  }

  if (DOM.emptyState) DOM.emptyState.hidden = true;

  DOM.transactionsBody.innerHTML = rows
    .map(item => {
      let badgeStyle = "badge-completed";
      if (item.status === "Pending") badgeStyle = "badge-pending";
      if (item.status === "Refunded") badgeStyle = "badge-refunded";

      return `
        <tr>
          <td><time datetime="${item.date}">${formatDate(item.date)}</time></td>
          <td><code>${item.id}</code></td>
          <td class="customer-cell">
            <span class="customer-name">${item.customer}</span>
            <span class="customer-email">${item.email || ""}</span>
          </td>
          <td>
            <strong>${item.product}</strong>
            <small style="display:block; color:var(--text-subtle);">${item.category || ""}</small>
          </td>
          <td class="amount-value">${formatCurrency(item.amount)}</td>
          <td><span class="badge ${badgeStyle}">${item.status}</span></td>
          <td>
            <button class="btn-inspect" type="button" data-inspect-id="${item.id}" aria-label="View details for ${item.customer}">
              Inspect
            </button>
          </td>
        </tr>
      `;
    })
    .join("");

  if (DOM.tableStatus) {
    const total = raw.length;
    DOM.tableStatus.textContent = `Showing ${rows.length} of ${total} transaction${total === 1 ? "" : "s"}`;
  }
}

// Open modal dialog and trap focus
function openModal(modalEl, triggerBtn) {
  if (!modalEl) return;
  activeModalTrigger = triggerBtn || document.activeElement;
  modalEl.hidden = false;
  document.body.classList.add("modal-open");

  const focusable = modalEl.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (focusable.length > 0) {
    focusable[0].focus();
  }
}

// Close modal dialog and restore trigger focus
function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.hidden = true;
  document.body.classList.remove("modal-open");

  if (activeModalTrigger && typeof activeModalTrigger.focus === "function") {
    activeModalTrigger.focus();
  }
}

// Populate and open transaction detail inspector
function showTransactionDetail(id) {
  if (!state.data || !Array.isArray(state.data.transactions)) return;
  const item = state.data.transactions.find(tx => tx.id === id);
  if (!item) return;

  let badgeStyle = "badge-completed";
  if (item.status === "Pending") badgeStyle = "badge-pending";
  if (item.status === "Refunded") badgeStyle = "badge-refunded";

  if (DOM.detailModalContent) {
    let statusIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
    let statusColorClass = "detail-status-completed";
    if (item.status === "Pending") {
      statusIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
      statusColorClass = "detail-status-pending";
    }
    if (item.status === "Refunded") {
      statusIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`;
      statusColorClass = "detail-status-refunded";
    }

    const icons = {
      id: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>`,
      date: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
      user: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      mail: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 4 12 13 2 4"/></svg>`,
      product: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
      amount: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
    };

    DOM.detailModalContent.innerHTML = `
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-icon" style="color:#4f46e5; background:#eef2ff;">${icons.id}</span>
          <div>
            <span class="detail-label">Transaction ID</span>
            <strong>${item.id}</strong>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-icon" style="color:#2563eb; background:#eff6ff;">${icons.date}</span>
          <div>
            <span class="detail-label">Date</span>
            <strong>${formatDate(item.date)}</strong>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-icon" style="color:#059669; background:#ecfdf5;">${icons.user}</span>
          <div>
            <span class="detail-label">Customer</span>
            <strong>${item.customer}</strong>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-icon" style="color:#2563eb; background:#eff6ff;">${icons.mail}</span>
          <div>
            <span class="detail-label">Email Address</span>
            <strong>${item.email || "N/A"}</strong>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-icon" style="color:#7c3aed; background:#f5f3ff;">${icons.product}</span>
          <div>
            <span class="detail-label">Product Tier</span>
            <strong>${item.product} (${item.category || "General"})</strong>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-icon" style="color:#059669; background:#ecfdf5;">${icons.amount}</span>
          <div>
            <span class="detail-label">Billed Amount</span>
            <strong class="detail-amount">${formatCurrency(item.amount)}</strong>
          </div>
        </div>
        <div class="detail-status-bar ${statusColorClass}">
          <span class="detail-status-icon">${statusIcon}</span>
          <div>
            <span class="detail-label">Processing Status</span>
            <span class="badge ${badgeStyle}">${item.status}</span>
          </div>
        </div>
      </div>
    `;
  }

  openModal(DOM.detailModal);
}
// Trap keyboard focus and handle Escape key inside active modal
document.addEventListener("keydown", event => {
  const activeModal = [DOM.helpModal, DOM.detailModal].find(m => m && !m.hidden);
  if (!activeModal) return;

  if (event.key === "Escape") {
    closeModal(activeModal);
    return;
  }

  if (event.key === "Tab") {
    const focusable = activeModal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

// Initialize dashboard event listeners
function initEventListeners() {
  if (DOM.menuToggle && DOM.navMenu) {
    DOM.menuToggle.addEventListener("click", () => {
      const isOpen = DOM.navMenu.classList.toggle("open");
      DOM.menuToggle.setAttribute("aria-expanded", String(isOpen));
      DOM.menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    document.querySelectorAll("#navMenu a").forEach(link => {
      link.addEventListener("click", () => {
        DOM.navMenu.classList.remove("open");
        DOM.menuToggle.setAttribute("aria-expanded", "false");
        DOM.menuToggle.setAttribute("aria-label", "Open navigation menu");
      });
    });
  }

  if (DOM.refreshBtn) DOM.refreshBtn.addEventListener("click", loadData);
  if (DOM.retryBtn) DOM.retryBtn.addEventListener("click", loadData);

  if (DOM.periodFilter) {
    DOM.periodFilter.addEventListener("change", e => {
      state.period = e.target.value;
      renderChart();
    });
  }

  DOM.tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      DOM.tabButtons.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      DOM.tabPanels.forEach(p => p.classList.add("hidden"));

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const targetPanel = document.getElementById(btn.getAttribute("aria-controls"));
      if (targetPanel) targetPanel.classList.remove("hidden");
    });
  });

  if (DOM.search) {
    // Debounce search input to avoid excessive re-renders
    DOM.search.addEventListener(
      "input",
      debounce(e => {
        state.query = e.target.value;
        renderTable();
      }, 150)
    );
  }

  if (DOM.statusFilter) {
    DOM.statusFilter.addEventListener("change", e => {
      state.statusFilter = e.target.value;
      renderTable();
    });
  }

  const resetHandler = () => {
    state.query = "";
    state.statusFilter = "all";
    if (DOM.search) DOM.search.value = "";
    if (DOM.statusFilter) DOM.statusFilter.value = "all";
    renderTable();
  };

  if (DOM.resetFiltersBtn) DOM.resetFiltersBtn.addEventListener("click", resetHandler);
  if (DOM.clearFilterBtn) DOM.clearFilterBtn.addEventListener("click", resetHandler);

  // Toggle column sorting order
  DOM.sortButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const col = btn.dataset.sort;
      if (state.sortColumn === col) {
        state.sortAscending = !state.sortAscending;
      } else {
        state.sortColumn = col;
        state.sortAscending = true;
      }
      renderTable();
    });
  });

  if (DOM.transactionsBody) {
    DOM.transactionsBody.addEventListener("click", e => {
      const inspectBtn = e.target.closest("[data-inspect-id]");
      if (inspectBtn) {
        showTransactionDetail(inspectBtn.dataset.inspectId);
      }
    });
  }

  if (DOM.quickViewBtn) {
    DOM.quickViewBtn.addEventListener("click", () => openModal(DOM.helpModal, DOM.quickViewBtn));
  }
  if (DOM.helpBtn) {
    DOM.helpBtn.addEventListener("click", () => openModal(DOM.helpModal, DOM.helpBtn));
  }

  if (DOM.closeHelpModal) {
    DOM.closeHelpModal.addEventListener("click", () => closeModal(DOM.helpModal));
  }
  if (DOM.helpDoneBtn) {
    DOM.helpDoneBtn.addEventListener("click", () => closeModal(DOM.helpModal));
  }
  if (DOM.closeDetailModal) {
    DOM.closeDetailModal.addEventListener("click", () => closeModal(DOM.detailModal));
  }
  if (DOM.detailDoneBtn) {
    DOM.detailDoneBtn.addEventListener("click", () => closeModal(DOM.detailModal));
  }

  document.querySelectorAll(".modal").forEach(modalEl => {
    modalEl.addEventListener("click", e => {
      if (e.target.dataset.close === "true") {
        closeModal(modalEl);
      }
    });
  });

  // Toggle accordion panel expand/collapse
  DOM.accordionTriggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const panel = document.getElementById(trigger.getAttribute("aria-controls"));
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      const icon = trigger.querySelector(".accordion-icon");

      trigger.setAttribute("aria-expanded", String(!isExpanded));
      if (icon) icon.textContent = isExpanded ? "+" : "−";
      if (panel) panel.hidden = isExpanded;
    });
  });
  // Smooth scroll with fixed header offset
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const targetHref = link.getAttribute("href");
      if (!targetHref || targetHref === "#") return;

      if (targetHref === "#top") {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth"
        });
        if (window.location.hash) {
          history.replaceState(null, "", window.location.pathname + window.location.search);
        }
        return;
      }

      const targetEl = document.querySelector(targetHref);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });

        targetEl.setAttribute("tabindex", "-1");
        targetEl.focus({ preventScroll: true });
        history.pushState(null, "", targetHref);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initEventListeners();
  loadData();
});
