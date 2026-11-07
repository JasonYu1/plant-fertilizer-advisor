const fileInput = document.getElementById("file-input");
const dropZone = document.getElementById("drop-zone");
const dropPrompt = document.getElementById("drop-prompt");
const preview = document.getElementById("preview");
const identifyBtn = document.getElementById("identify-btn");
const organSelect = document.getElementById("organ");
const spinner = document.getElementById("spinner");
const errorBox = document.getElementById("error");
const resultsSection = document.getElementById("results");
const candidatesDiv = document.getElementById("candidates");
applyStaticI18n();

const demoBanner = document.getElementById("demo-banner");
const healthSection = document.getElementById("health-section");
const healthVerdict = document.getElementById("health-verdict");
const symptomsSection = document.getElementById("symptoms-section");
const symptomChips = document.getElementById("symptom-chips");
const symptomDetail = document.getElementById("symptom-detail");

let selectedFile = null;
let symptomsData = [];
let activeSymptom = null;

// Load the symptom checklist once
fetch("/api/symptoms?lang=" + encodeURIComponent(LANG))
  .then((r) => r.json())
  .then((list) => {
    symptomsData = list;
    symptomChips.innerHTML = list
      .map((s) => `<button class="chip" data-id="${s.id}">${s.emoji} ${esc(s.label)}</button>`)
      .join("");
    symptomChips.querySelectorAll(".chip").forEach((btn) =>
      btn.addEventListener("click", () => showSymptom(btn.dataset.id))
    );
  })
  .catch(() => {});

function showSymptom(id) {
  const s = symptomsData.find((x) => x.id === id);
  if (!s) return;
  if (activeSymptom === id) {
    activeSymptom = null;
    symptomDetail.classList.add("hidden");
    symptomChips.querySelectorAll(".chip").forEach((b) => b.classList.remove("active"));
    return;
  }
  activeSymptom = id;
  symptomChips.querySelectorAll(".chip").forEach((b) =>
    b.classList.toggle("active", b.dataset.id === id)
  );
  symptomDetail.innerHTML = `
    <div class="symptom-card">
      <h3>${s.emoji} ${esc(s.label)}</h3>
      <span class="label">${esc(t("likelyCauses"))}</span>
      <ul>${s.causes.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
      <span class="label">${esc(t("whatToDo"))}</span>
      <p>${esc(s.action)}</p>
    </div>`;
  symptomDetail.classList.remove("hidden");
}

// --- Per-user API key handling ---
const keyInput = document.getElementById("key-input");
const keySave = document.getElementById("key-save");
const keyClear = document.getElementById("key-clear");
const keyStatus = document.getElementById("key-status");
const keySummary = document.getElementById("key-summary");
let serverHasKey = false;

function getUserKey() {
  try {
    return localStorage.getItem("plantnet_key") || "";
  } catch {
    return "";
  }
}

function refreshKeyUI() {
  const userKey = getUserKey();
  demoBanner.classList.toggle("hidden", serverHasKey || !!userKey);
  if (userKey) {
    keySummary.textContent = t("keySummaryYours");
    keyStatus.textContent = t("keyStatusYours");
  } else if (serverHasKey) {
    keySummary.textContent = t("keySummaryServer");
    keyStatus.textContent = t("keyStatusServer");
  } else {
    keySummary.textContent = t("keySummarySet");
    keyStatus.textContent = "";
  }
}

fetch("/api/status")
  .then((r) => r.json())
  .then((s) => {
    serverHasKey = s.has_key;
    refreshKeyUI();
  })
  .catch(() => refreshKeyUI());

keySave.addEventListener("click", () => {
  const val = keyInput.value.trim();
  if (!val) return;
  try {
    localStorage.setItem("plantnet_key", val);
  } catch {
    keyStatus.textContent = t("keyStatusBlocked");
    return;
  }
  keyInput.value = "";
  refreshKeyUI();
});

keyClear.addEventListener("click", () => {
  try {
    localStorage.removeItem("plantnet_key");
  } catch {}
  keyInput.value = "";
  refreshKeyUI();
});

function setFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  selectedFile = file;
  preview.src = URL.createObjectURL(file);
  preview.classList.remove("hidden");
  dropPrompt.classList.add("hidden");
  identifyBtn.disabled = false;
  resultsSection.classList.add("hidden");
  healthSection.classList.add("hidden");
  symptomsSection.classList.add("hidden");
  errorBox.classList.add("hidden");
}

fileInput.addEventListener("change", () => setFile(fileInput.files[0]));

["dragover", "dragenter"].forEach((ev) =>
  dropZone.addEventListener(ev, (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  })
);
["dragleave", "drop"].forEach((ev) =>
  dropZone.addEventListener(ev, (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
  })
);
dropZone.addEventListener("drop", (e) => setFile(e.dataTransfer.files[0]));

identifyBtn.addEventListener("click", async () => {
  if (!selectedFile) return;

  spinner.classList.remove("hidden");
  errorBox.classList.add("hidden");
  resultsSection.classList.add("hidden");
  identifyBtn.disabled = true;

  const form = new FormData();
  form.append("image", selectedFile);
  form.append("organ", organSelect.value);
  form.append("lang", LANG);
  const userKey = getUserKey();
  if (userKey) form.append("api_key", userKey);

  try {
    const resp = await fetch("/api/identify", { method: "POST", body: form });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || `Server error (${resp.status})`);
    renderResults(data);
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");
  } finally {
    spinner.classList.add("hidden");
    identifyBtn.disabled = false;
  }
});

function renderResults(data) {
  candidatesDiv.innerHTML = "";

  if (!data.results || data.results.length === 0) {
    errorBox.textContent = t("noPlant");
    errorBox.classList.remove("hidden");
    return;
  }

  data.results.forEach((r, i) => {
    const fert = r.fertilizer;
    const common = r.common_names && r.common_names.length ? r.common_names[0] : r.scientific_name;
    const pct = Math.round(r.score * 100);

    const card = document.createElement("div");
    card.className = "candidate";
    card.innerHTML = `
      <button class="candidate-header" aria-expanded="${i === 0}">
        <div class="candidate-name">
          <div class="common">${esc(common)}</div>
          <div class="latin">${esc(r.scientific_name)}${r.family ? " · " + esc(r.family) : ""}</div>
        </div>
        <span class="score-badge">${pct}%</span>
      </button>
      <div class="fert-details ${i === 0 ? "" : "hidden"}">
        <div class="fert-category">🌿 ${esc(fert.category)}</div>
        <div class="fert-grid">
          <div class="fert-row"><span class="label">${esc(t("labelNpk"))}</span>${esc(fert.npk)}</div>
          <div class="fert-row"><span class="label">${esc(t("labelUse"))}</span>${esc(fert.fertilizer)}</div>
          <div class="fert-row"><span class="label">${esc(t("labelWhen"))}</span>${esc(fert.schedule)}</div>
          <div class="fert-row"><span class="label">${esc(t("labelPh"))}</span>${esc(fert.soil_ph)}</div>
        </div>
        <ul class="tips">${fert.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        ${matchNote(fert)}
      </div>`;

    card.querySelector(".candidate-header").addEventListener("click", (e) => {
      const details = card.querySelector(".fert-details");
      const nowHidden = details.classList.toggle("hidden");
      e.currentTarget.setAttribute("aria-expanded", String(!nowHidden));
    });

    candidatesDiv.appendChild(card);
  });

  renderHealth(data.health, data.results[0]);
  symptomsSection.classList.remove("hidden");

  resultsSection.classList.remove("hidden");
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderHealth(health, topResult) {
  healthSection.classList.remove("hidden");

  if (!health || !health.model_available) {
    healthVerdict.innerHTML = `<div class="health-card neutral">${esc(t("noModelMsg"))}</div>`;
    return;
  }
  if (health.error) {
    healthVerdict.innerHTML = `<div class="health-card neutral">${esc(health.error)}</div>`;
    return;
  }
  if (!health.covered_crop) {
    healthVerdict.innerHTML = `<div class="health-card neutral">
      ${t("notCoveredMsg", { plant: esc(topResult ? topResult.scientific_name : "?") })}</div>`;
    return;
  }

  const top = health.predictions[0];
  const pct = Math.round(top.score * 100);
  const lowConfidence = top.score < 0.4;
  const alternates = health.predictions
    .slice(1)
    .filter((p) => p.score >= 0.1)
    .map((p) => `${esc(p.label)} (${Math.round(p.score * 100)}%)`)
    .join(", ");

  if (top.healthy) {
    healthVerdict.innerHTML = `<div class="health-card good">
      <h3>${esc(t("healthyTitle"))}</h3>
      <p>${esc(t("healthyDetail", { pct: pct, label: top.label }))}</p>
      ${alternates ? `<p class="alt">${esc(t("alsoConsidered"))} ${alternates}</p>` : ""}
      ${lowConfidence ? `<p class="alt">${esc(t("lowConfTip"))}</p>` : ""}
    </div>`;
  } else {
    healthVerdict.innerHTML = `<div class="health-card bad">
      <h3>${esc(t("possibleIssue", { label: top.label }))}</h3>
      <p class="conf">${esc(t("modelConf", { pct: pct }))}${lowConfidence ? esc(t("lowConfNote")) : ""}</p>
      <span class="label">${esc(t("whatToDo"))}</span>
      <p>${esc(top.advice)}</p>
      ${alternates ? `<p class="alt">${esc(t("alsoConsidered"))} ${alternates}</p>` : ""}
    </div>`;
  }
}

function matchNote(fert) {
  if (fert.match_level === "default") {
    return `<p class="match-note">${esc(t("matchDefault"))}</p>`;
  }
  if (fert.match_level === "family") {
    return `<p class="match-note">${esc(t("matchFamily", { name: fert.matched_on }))}</p>`;
  }
  return "";
}

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s == null ? "" : String(s);
  return d.innerHTML;
}
