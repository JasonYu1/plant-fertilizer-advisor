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
const demoBanner = document.getElementById("demo-banner");

let selectedFile = null;

// Show demo banner if no API key is configured
fetch("/api/status")
  .then((r) => r.json())
  .then((s) => demoBanner.classList.toggle("hidden", s.has_key))
  .catch(() => {});

function setFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  selectedFile = file;
  preview.src = URL.createObjectURL(file);
  preview.classList.remove("hidden");
  dropPrompt.classList.add("hidden");
  identifyBtn.disabled = false;
  resultsSection.classList.add("hidden");
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
    errorBox.textContent = "No plant recognized. Try a closer, sharper photo of a leaf or flower.";
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
          <div class="fert-row"><span class="label">Fertilizer (N-P-K)</span>${esc(fert.npk)}</div>
          <div class="fert-row"><span class="label">What to use</span>${esc(fert.fertilizer)}</div>
          <div class="fert-row"><span class="label">When to feed</span>${esc(fert.schedule)}</div>
          <div class="fert-row"><span class="label">Soil pH</span>${esc(fert.soil_ph)}</div>
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

  resultsSection.classList.remove("hidden");
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function matchNote(fert) {
  if (fert.match_level === "default") {
    return `<p class="match-note">No specific entry for this plant yet — showing safe general guidance.</p>`;
  }
  if (fert.match_level === "family") {
    return `<p class="match-note">Advice based on the plant family (${esc(fert.matched_on)}).</p>`;
  }
  return "";
}

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s == null ? "" : String(s);
  return d.innerHTML;
}
