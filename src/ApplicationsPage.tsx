import { useEffect, useMemo, useRef, useState } from "react";

/** ---------- Types & stub data ---------- */

type Status = "Approved" | "Pending" | "Under Review" | "Rejected" | "Send Back";
type AppItem = {
  id: string;
  applicant: string;
  product: string;
  amount: number;
  status: Status;
  tenorMonths: number;
  collateral?: string;
  notes?: string;
  attachments: { id: string; name: string; size: number }[];
  createdAt: string;
  updatedAt: string;
};

const STUB_APPS: AppItem[] = [
  {
    id: "A-1024",
    applicant: "Sarah Johnson",
    product: "Personal Loan",
    amount: 25000,
    status: "Approved",
    tenorMonths: 24,
    collateral: "",
    notes: "N/A",
    attachments: [{ id: "f1", name: "ID.pdf", size: 234567 }],
    createdAt: "2025-08-01T10:15:00Z",
    updatedAt: "2025-09-01T08:20:00Z",
  },
  {
    id: "A-1025",
    applicant: "Orion Textiles Ltd.",
    product: "Term Loan",
    amount: 12500000,
    status: "Under Review",
    tenorMonths: 60,
    collateral: "Factory land",
    notes: "Awaiting CM observation",
    attachments: [
      { id: "f2", name: "Financials_FY23.pdf", size: 1240000 },
      { id: "f3", name: "Collateral_Valuation.xlsx", size: 280000 },
    ],
    createdAt: "2025-09-01T10:15:00Z",
    updatedAt: "2025-09-10T12:45:00Z",
  },
  {
    id: "A-1026",
    applicant: "Delta Agro Traders",
    product: "Working Capital",
    amount: 6000000,
    status: "Send Back",
    tenorMonths: 12,
    collateral: "Receivables",
    notes: "Observation: receivables ageing mismatch.",
    attachments: [{ id: "f4", name: "Bank_Statement_Q2.pdf", size: 820000 }],
    createdAt: "2025-09-04T09:00:00Z",
    updatedAt: "2025-09-07T17:00:00Z",
  },
  {
    id: "A-1027",
    applicant: "City Logistics Co.",
    product: "Name Clearance",
    amount: 0,
    status: "Pending",
    tenorMonths: 0,
    collateral: "",
    notes: "Waiting for TH–CRM review.",
    attachments: [],
    createdAt: "2025-09-05T12:00:00Z",
    updatedAt: "2025-09-06T16:00:00Z",
  },
];

/** ---------- Small UI atoms ---------- */

function StatusChip({ value }: { value: Status }) {
  const map: Record<Status, { bg: string; fg: string; br: string }> = {
    Approved: { bg: "#e6fff5", fg: "#065f46", br: "#99f6e4" },
    Pending: { bg: "#eef2ff", fg: "#3730a3", br: "#c7d2fe" },
    "Under Review": { bg: "#fff7ed", fg: "#9a3412", br: "#fed7aa" },
    Rejected: { bg: "#ffe4e6", fg: "#9f1239", br: "#fecdd3" },
    "Send Back": { bg: "#fff7e6", fg: "#8a5300", br: "#ffd591" },
  };
  const { bg, fg, br } = map[value];
  return (
    <span
      className="status-chip"
      style={{ background: bg, color: fg, borderColor: br }}
      aria-label={`Status: ${value}`}
    >
      {value}
    </span>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field-row">
      <div className="field-label">{label}</div>
      <div className="field-value">{children}</div>
    </div>
  );
}

function bytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/** ---------- The page (no routing; views swap by state) ---------- */

type View = "dashboard" | "details" | "form";

export default function ApplicationsPage() {
  const [view, setView] = useState<View>("dashboard");

  // list controls
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [productFilter, setProductFilter] = useState<string | "All">("All");

  const [items, setItems] = useState<AppItem[]>([]);
  const [selected, setSelected] = useState<AppItem | null>(null);

  // toast + modals
  const [toast, setToast] = useState<string | null>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const [showReviewSheet, setShowReviewSheet] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // fake latency load
  useEffect(() => {
    const t = setTimeout(() => {
      setItems(STUB_APPS);
      setSelected(STUB_APPS[0]);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const mQ =
        !q ||
        it.applicant.toLowerCase().includes(q.toLowerCase()) ||
        it.id.toLowerCase().includes(q.toLowerCase());
      const mS = statusFilter === "All" || it.status === statusFilter;
      const mP = productFilter === "All" || it.product === productFilter;
      return mQ && mS && mP;
    });
  }, [items, q, statusFilter, productFilter]);

  // form state
  const [form, setForm] = useState({
    applicant: "",
    product: "",
    amount: "",
    tenor: "",
    collateral: "",
    notes: "",
    fileName: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errs = {
    applicant: form.applicant.trim() ? "" : "Applicant is required",
    product: form.product ? "" : "Choose a product",
    amount: /^\d+(\.\d{1,2})?$/.test(form.amount) ? "" : "Enter a valid amount",
    tenor: /^\d+$/.test(form.tenor) ? "" : "Enter months (integer)",
  };
  const invalid = Object.values(errs).some(Boolean);

  // toasts via live region (assistive tech announces) — recommended pattern for dynamic updates. :contentReference[oaicite:1]{index=1}
  useEffect(() => {
    if (toast && liveRef.current) {
      liveRef.current.textContent = toast;
      const t = setTimeout(() => setToast(null), 2200);
      return () => clearTimeout(t);
    }
  }, [toast]);

  /** --------- dashboard card → details view --------- */
  function openDetails(app: AppItem) {
    setSelected(app);
    setView("details");
  }

  /** --------- form actions --------- */
  function onSubmit() {
    setShowReviewSheet(true);
  }
  function confirmSubmit() {
    setShowReviewSheet(false);
    setView("dashboard");
    setToast("Sent for review");
  }
  function onReject() {
    setShowRejectModal(true);
  }
  function confirmReject() {
    setShowRejectModal(false);
    setView("dashboard");
    setToast("Sent back");
  }

  /** --------- reusable UI --------- */
  const headerActions = (
    <div className="appbar-actions">
      <button className="btn" onClick={() => setView("form")}>New</button>
      <button
        className="btn"
        onClick={() => {
          // simple export of the current filtered list as JSON
          const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "applications.json";
          a.click();
        }}
      >
        Export
      </button>
      <button className="btn" onClick={() => alert("Help placeholder")}>Help</button>
    </div>
  );

  return (
    <div className="admin-shell light-surface">
      {/* Left navigation drawer: dashboard categories (static) — familiar discovery pattern on desktop. :contentReference[oaicite:2]{index=2} */}
      <aside className="nav">
        <div className="brand">LAS</div>
        <nav>
          <a className={view === "dashboard" ? "active" : ""} onClick={() => setView("dashboard")}>Dashboard</a>
          <a onClick={() => setView("dashboard")}>Applications</a>
          <a>Pending</a>
          <a>Approved</a>
          <a>Declined</a>
          <a>Reports</a>
          <a>Settings</a>
        </nav>
      </aside>

      <main className="content">
        {/* Top app bar — page title left; actions right; white surface with subtle divider. :contentReference[oaicite:3]{index=3} */}
        <header className="appbar">
          <div>
            <div className="title">Applications</div>
            <div className="subtitle">Banking Process Viewer</div>
          </div>
          {headerActions}
        </header>

        {/* View switcher (no routing) */}
        <div className="view-tabs" role="tablist" aria-label="Page views">
          <button role="tab" aria-selected={view === "dashboard"} className={view === "dashboard" ? "active" : ""} onClick={() => setView("dashboard")}>Dashboard</button>
          <button role="tab" aria-selected={view === "details"} className={view === "details" ? "active" : ""} onClick={() => setView("details")} disabled={!selected}>Details</button>
          <button role="tab" aria-selected={view === "form"} className={view === "form" ? "active" : ""} onClick={() => setView("form")}>Loan Proposal Form</button>
        </div>

        {/* ---------- Dashboard: short cards ---------- */}
        {view === "dashboard" && (
          <section aria-label="Applications list">
            <div className="list-controls">
              <input
                className="textfield"
                placeholder="Search applications…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search applications"
              />
              <select
                className="textfield"
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Status | "All")}
              >
                {["All", "Approved", "Pending", "Under Review", "Rejected", "Send Back"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                className="textfield"
                aria-label="Filter by product"
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value as string | "All")}
              >
                {["All", ...Array.from(new Set(items.map((i) => i.product)))].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <div className="caption">Showing {filtered.length} of {items.length}</div>
            </div>

            <div role="list" className="card-list">
              {items.length === 0 && (
                <div className="skeleton">Loading…</div>
              )}
              {items.length > 0 && filtered.length === 0 && (
                <div className="empty">No applications found</div>
              )}
              {filtered.map((it) => (
                <article role="listitem" className="app-card" key={it.id}>
                  <div>
                    <div className="card-title">{it.applicant}</div>
                    <div className="card-line">
                      <span className="muted">{it.product}</span>
                      <span className="muted">Amount:</span>{" "}
                      <strong>{it.amount.toLocaleString()}</strong>
                    </div>
                  </div>
                  <div className="card-right">
                    <StatusChip value={it.status} />
                    <button
                      className="link"
                      aria-label={`View details for ${it.applicant}`}
                      onClick={() => openDetails(it)}
                    >
                      View details →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ---------- Details page ---------- */}
        {view === "details" && selected && (
          <section className="details">
            <header className="details-header">
              <div>
                <h2 className="details-title">{selected.applicant}</h2>
                <div className="details-meta">
                  Created {new Date(selected.createdAt).toLocaleString()} • Updated {new Date(selected.updatedAt).toLocaleString()}
                </div>
              </div>
              <StatusChip value={selected.status} />
            </header>

            <div className="details-sections">
              <FieldRow label="Summary">
                <div>{selected.notes || "—"}</div>
              </FieldRow>
              <FieldRow label="Product & Amount">
                <div>{selected.product} — <strong>{selected.amount.toLocaleString()}</strong></div>
              </FieldRow>
              <FieldRow label="Tenor">
                <div>{selected.tenorMonths} months</div>
              </FieldRow>
              <FieldRow label="Collateral">
                <div>{selected.collateral || "—"}</div>
              </FieldRow>
              <FieldRow label="Attachments">
                <ul className="attachments">
                  {selected.attachments.length === 0 && <li>None</li>}
                  {selected.attachments.map((f) => (
                    <li key={f.id}>{f.name} <span className="muted">({bytes(f.size)})</span></li>
                  ))}
                </ul>
              </FieldRow>
            </div>

            <div className="details-actions">
              <button className="btn" onClick={() => setView("dashboard")}>Back to Applications</button>
            </div>
          </section>
        )}

        {/* ---------- Loan Proposal Form (single column) ---------- */}
        {view === "form" && (
          <section className="form-page" aria-labelledby="formTitle">
            <header className="form-header">
              <div>
                <h2 id="formTitle">Loan Proposal</h2>
                <span className="status-chip" style={{ background: "#eef2ff", color: "#3730a3", borderColor: "#c7d2fe" }}>Draft</span>
              </div>
              <button className="icon-btn" aria-label="Edit">✎</button>
            </header>

            <form className="form" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
              <label className="form-field">
                <span>Applicant Name *</span>
                <input
                  aria-invalid={!!(touched.applicant && errs.applicant)}
                  aria-describedby="err-applicant"
                  value={form.applicant}
                  onChange={(e) => setForm({ ...form, applicant: e.target.value })}
                  onBlur={() => setTouched({ ...touched, applicant: true })}
                />
                {touched.applicant && errs.applicant && <small id="err-applicant" className="error">{errs.applicant}</small>}
              </label>

              <label className="form-field">
                <span>Product *</span>
                <select
                  aria-invalid={!!(touched.product && errs.product)}
                  aria-describedby="err-product"
                  value={form.product}
                  onChange={(e) => setForm({ ...form, product: e.target.value })}
                  onBlur={() => setTouched({ ...touched, product: true })}
                >
                  <option value="">Select…</option>
                  <option>Personal Loan</option>
                  <option>Term Loan</option>
                  <option>Working Capital</option>
                  <option>Name Clearance</option>
                </select>
                {touched.product && errs.product && <small id="err-product" className="error">{errs.product}</small>}
              </label>

              <label className="form-field">
                <span>Requested Amount *</span>
                <input
                  inputMode="decimal"
                  placeholder="e.g., 25000"
                  aria-invalid={!!(touched.amount && errs.amount)}
                  aria-describedby="err-amount"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  onBlur={() => setTouched({ ...touched, amount: true })}
                />
                {touched.amount && errs.amount && <small id="err-amount" className="error">{errs.amount}</small>}
              </label>

              <label className="form-field">
                <span>Tenor (months) *</span>
                <input
                  inputMode="numeric"
                  placeholder="e.g., 24"
                  aria-invalid={!!(touched.tenor && errs.tenor)}
                  aria-describedby="err-tenor"
                  value={form.tenor}
                  onChange={(e) => setForm({ ...form, tenor: e.target.value })}
                  onBlur={() => setTouched({ ...touched, tenor: true })}
                />
                {touched.tenor && errs.tenor && <small id="err-tenor" className="error">{errs.tenor}</small>}
              </label>

              <label className="form-field">
                <span>Collateral (optional)</span>
                <input value={form.collateral} onChange={(e) => setForm({ ...form, collateral: e.target.value })} />
              </label>

              <label className="form-field">
                <span>Notes (optional)</span>
                <textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </label>

              <label className="form-field">
                <span>Document Upload (single file)</span>
                <input
                  type="file"
                  onChange={(e) => setForm({ ...form, fileName: e.target.files?.[0]?.name || "" })}
                />
                {form.fileName && <small className="muted">Selected: {form.fileName}</small>}
              </label>

              {/* Sticky bar */}
              <div className="sticky-bar" role="toolbar" aria-label="Submit or Reject">
                <button className="btn primary" type="submit" disabled={invalid}>Submit</button>
                <button className="btn" type="button" onClick={onReject}>Reject</button>
              </div>
            </form>

            {/* Review & Submit sheet */}
            {showReviewSheet && (
              <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
                <div className="sheet-card">
                  <h3 id="sheetTitle">Review &amp; Submit</h3>
                  <p className="muted">Next recipient: <strong>RM → Team Head–Business</strong></p>
                  <p className="muted">What happens next: <strong>Business review &amp; recommendation</strong></p>
                  <p className="muted">Estimated window: <strong>48 hours</strong></p>
                  <div className="sheet-actions">
                    <button className="btn" onClick={() => setShowReviewSheet(false)}>Cancel</button>
                    <button className="btn primary" onClick={confirmSubmit}>Confirm &amp; Send</button>
                  </div>
                </div>
              </div>
            )}

            {/* Reject modal */}
            {showRejectModal && (
              <div className="modal" role="dialog" aria-modal="true" aria-labelledby="rejectTitle">
                <div className="modal-card">
                  <h3 id="rejectTitle">Reject — reason</h3>
                  <textarea rows={4} placeholder="Enter reason…" />
                  <div className="modal-actions">
                    <button className="btn" onClick={() => setShowRejectModal(false)}>Cancel</button>
                    <button className="btn primary" onClick={confirmReject}>Send back</button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Toast (ARIA live) */}
        <div className="toast" aria-live="polite" aria-atomic="true" ref={liveRef}>
          {toast && <div className="toast-card">{toast}</div>}
        </div>
      </main>
    </div>
  );
}
