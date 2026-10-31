// Mizan — demo mode: a pretend database saved only on this device, with sample data.
// Turned on by the "Try the demo" buttons. Nothing here touches the real database.
const DEMO_FLAG = "mizan_demo";
const isDemo = () => { try { return localStorage.getItem(DEMO_FLAG) === "1"; } catch (e) { return false; } };

function startDemo(as) {
  try {
    localStorage.setItem(DEMO_FLAG, "1");
    localStorage.removeItem("mizan_demo_data");
    localStorage.setItem("mizan_demo_session", JSON.stringify({ id: as === "admin" ? "demo-admin" : "demo-sara" }));
  } catch (e) {}
  location.reload();
}
function exitDemo() {
  try { ["mizan_demo", "mizan_demo_data", "mizan_demo_session"].forEach(k => localStorage.removeItem(k)); } catch (e) {}
  location.reload();
}

if (isDemo()) {
  const ago = d => new Date(Date.now() - d * 864e5).toISOString();
  const day = d => { const x = new Date(); x.setDate(x.getDate() - d); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
  const receiptSVG = "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="420" height="560"><rect width="100%" height="100%" fill="#fff"/><rect x="20" y="20" width="380" height="70" rx="10" fill="#1f6f4a"/><text x="210" y="65" font-family="Arial" font-size="26" fill="#fff" text-anchor="middle">Transfer receipt</text><text x="40" y="150" font-family="Arial" font-size="22" fill="#333">Amount: 250 SAR</text><text x="40" y="195" font-family="Arial" font-size="20" fill="#555">To: Nojood Nutrition</text><text x="40" y="235" font-family="Arial" font-size="20" fill="#555">From: Noura K.</text><text x="40" y="275" font-family="Arial" font-size="20" fill="#555">Status: Completed ✓</text><text x="210" y="520" font-family="Arial" font-size="16" fill="#999" text-anchor="middle">DEMO</text></svg>');
  const SEVEN = [
    { name: "1300", kcal: 1300, meals: { b: "b3", s1: "s4", l: "l4", s2: "s6", d: "d4" }, source: "ready" },
    { name: "1350", kcal: 1350, meals: { b: "b4", s1: "s1", l: "l13", s2: "s10", d: "d1" }, source: "ready" },
    { name: "1200", kcal: 1200, meals: { b: "b1", s1: "s6", l: "l2", s2: "s9", d: "d8" }, source: "ready" },
    { name: "1340", kcal: 1340, meals: { b: "b7", s1: "s3", l: "l9", s2: "s5", d: "d10" }, source: "custom" },
    { name: "1340", kcal: 1340, meals: { b: "b1", s1: "s6", l: "l14", s2: "s10", d: "d5" }, source: "custom" },
    { name: "1450", kcal: 1450, meals: { b: "b2", s1: "s3", l: "l8", s2: "s4", d: "d7" }, source: "ready" },
    { name: "1340", kcal: 1340, meals: { b: "b3", s1: "s2", l: "l11", s2: "s4", d: "d6" }, source: "custom" }
  ];
  const seed = () => ({
    profiles: [
      { id: "demo-admin", role: "admin", name: "نجود (تجريبي)", email: "pro@demo.sa", paid: true, pay_status: "confirmed", plans: [], history: [], progress: {} },
      { id: "demo-sara", role: "client", name: "سارة أحمد", email: "sara@demo.sa", phone: "0500000000", sex: "female", age: 27, height: 162, weight: 68, activity: 1.375, goal: "lose",
        kcal: 1340, bmr: 1400, package: "plus", paid: true, pay_status: "confirmed", plans: SEVEN, today: { date: day(0), plan: 0, progress: { b: "done" } },
        history: [{ date: day(3), plan: 1, done: 5, skipped: 0 }, { date: day(2), plan: 3, done: 4, skipped: 1 }, { date: day(1), plan: 2, done: 5, skipped: 0 }],
        workout_link: "https://www.youtube.com/results?search_query=home+workout+beginner", inbody_requested: false, health: "", food: "ما أحب السمك", created_at: ago(26), period_start: ago(26) },
      { id: "demo-noura", role: "client", name: "نورة خالد", email: "noura@demo.sa", phone: "0550000000", sex: "female", age: 31, height: 158, weight: 74, activity: 1.2, goal: "lose",
        kcal: 1250, bmr: 1390, package: "plus", paid: false, pay_status: "pending", receipt_path: "demo/receipt.svg", receipt_type: "image", receipt_sender: "Noura K.", receipt_amount: 250,
        receipt_date: new Date().toISOString(), plans: [], history: [], inbody_requested: true, health: "غدة درقية وآخذ دواء", created_at: ago(4) },
      { id: "demo-reem", role: "client", name: "ريم سعد", email: "reem@demo.sa", phone: "0560000000", sex: "female", age: 24, height: 165, weight: 60, activity: 1.55, goal: "keep",
        kcal: null, bmr: null, package: "basic", paid: true, pay_status: "confirmed", plans: [], history: [], inbody_requested: false, health: "", food: "", created_at: ago(3) },
      { id: "demo-hind", role: "client", name: "هند محمد", email: "hind@demo.sa", phone: "0570000000", sex: "female", age: 38, height: 160, weight: 80, activity: 1.2, goal: "lose",
        kcal: 1350, package: "plus", paid: true, pay_status: "confirmed", plans: SEVEN, today: null,
        history: [{ date: day(9), plan: 0, done: 2, skipped: 3 }, { date: day(8), plan: 1, done: 1, skipped: 4 }, { date: day(7), plan: 2, done: 2, skipped: 3 }, { date: day(6), plan: 4, done: 1, skipped: 2 }, { date: day(5), plan: 5, done: 0, skipped: 5 }],
        inbody_requested: false, health: "", food: "", created_at: ago(29), period_start: ago(29), renew_requested_at: ago(1) }
    ],
    schedules: (typeof DEMO_SCHEDULES === "function" ? DEMO_SCHEDULES() : []).map((s, i) => ({ id: "demo-s" + i, created_at: new Date().toISOString(), ...s })),
    recipes: [],
    checkins: [
      { id: "ci1", user_id: "demo-sara", date: ago(21), weight: 67.4, waist: 84, rating: 3 },
      { id: "ci2", user_id: "demo-sara", date: ago(14), weight: 66.9, waist: 83, rating: 2 },
      { id: "ci3", user_id: "demo-sara", date: ago(7), weight: 66.1, waist: 82, rating: 3 },
      { id: "ci4", user_id: "demo-hind", date: ago(24), weight: 79.6, waist: 98, rating: 4 },
      { id: "ci5", user_id: "demo-hind", date: ago(17), weight: 80.2, waist: 99, rating: 5 },
      { id: "ci6", user_id: "demo-hind", date: ago(10), weight: 80.9, waist: 99, rating: 5 }
    ],
    inbody: [{ id: "ib1", user_id: "demo-sara", date: new Date(Date.now() - 20 * 864e5).toISOString(), weight: 70.2, fat: 33, muscle: 24.1 },
             { id: "ib2", user_id: "demo-sara", date: new Date(Date.now() - 2 * 864e5).toISOString(), weight: 68.4, fat: 31.8, muscle: 24.5 }]
  });
  const loadData = () => { try { return JSON.parse(localStorage.getItem("mizan_demo_data")) || seed(); } catch (e) { return seed(); } };
  let data = null;
  const getData = () => { if (!data) { data = loadData(); keepData(); } return data; };
  const keepData = () => { try { localStorage.setItem("mizan_demo_data", JSON.stringify(data)); } catch (e) {} };
  const session = () => { try { return JSON.parse(localStorage.getItem("mizan_demo_session") || "null"); } catch (e) { return null; } };
  const wait = () => new Promise(r => setTimeout(r, 120));

  function filterRows(rows, query) {
    const q = new URLSearchParams(query || "");
    for (const [k, v] of q.entries()) {
      if (k === "select" || k === "order") continue;
      const val = v.replace(/^eq\./, "");
      rows = rows.filter(r => String(r[k]) === val);
    }
    const order = q.get("order");
    if (order) { const [f, dir] = order.split("."); rows = rows.slice().sort((a, b) => (a[f] > b[f] ? 1 : a[f] < b[f] ? -1 : 0) * (dir === "desc" ? -1 : 1)); }
    return rows;
  }
  Object.assign(DB, {   // replace the methods (works even with an old cached db.js)
    async signUp() { throw new Error("demo"); },
    async signIn() { throw new Error("demo"); },
    async signOut() { exitDemo(); },
    async user() { return { id: document.getElementById("admin-login") ? "demo-admin" : "demo-sara" }; },   // each app opens as its sample user
    async select(table, query) { await wait(); return JSON.parse(JSON.stringify(filterRows(getData()[table] || [], query))); },
    async insert(table, row) { await wait(); const r = { id: row.id || "demo-" + Date.now() + Math.random().toString(36).slice(2, 6), created_at: new Date().toISOString(), date: new Date().toISOString(), ...row }; (getData()[table] = getData()[table] || []).push(r); keepData(); return JSON.parse(JSON.stringify(r)); },
    async update(table, id, changes) { await wait(); const r = getData()[table].find(x => x.id === id); Object.assign(r, changes); keepData(); return JSON.parse(JSON.stringify(r)); },
    async remove(table, id) { await wait(); getData()[table] = getData()[table].filter(x => x.id !== id); keepData(); },
    async upload(bucket, path) { return path; },
    async signedUrl() { return receiptSVG; }
  });

  // banner on every page
  document.addEventListener("DOMContentLoaded", () => {
    const bar = document.createElement("div");
    bar.className = "demo-bar";
    bar.innerHTML = '<span data-i18n="demo_on"></span><button type="button" data-i18n="demo_exit"></button>';
    document.body.prepend(bar);
    const tr = () => bar.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    tr(); document.addEventListener("langchange", tr);
    bar.querySelector("button").addEventListener("click", exitDemo);
  });
}
