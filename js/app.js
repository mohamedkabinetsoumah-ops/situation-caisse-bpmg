/* ============================================================
   Situation de Caisse — logique applicative (100% locale)
   ============================================================ */

const STORAGE_KEYS = {
  settings: 'caisse_settings_v1',
  history: 'caisse_history_v1'
};

const DEFAULT_SETTINGS = {
  institution: 'GRANDIR ENSEMBLE',
  agence: 'AGENCE CONSTANTIN',
  caissier: '',
  chefAgence: '',
  currencies: {
    GNF: {
      label: 'Franc Guinéen',
      symbol: 'GNF',
      decimals: 0,
      wordName: { singular: 'Franc Guinéen', plural: 'Francs Guinéens' },
      denominations: [20000, 10000, 5000, 2000, 1000, 500, 100, 50, 25, 10, 5, 1]
    },
    EUR: {
      label: 'Euro',
      symbol: '€',
      decimals: 0,
      wordName: { singular: 'Euro', plural: 'Euros' },
      denominations: [200, 100, 50, 20, 10, 5, 2, 1]
    },
    USD: {
      label: 'Dollar US',
      symbol: '$',
      decimals: 0,
      wordName: { singular: 'Dollar US', plural: 'Dollars US' },
      denominations: [100, 50, 20, 10, 5, 1]
    }
  }
};

const CURRENCY_ORDER = ['GNF', 'EUR', 'USD'];

/* ---------------- Storage helpers ---------------- */

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) return structuredClone(DEFAULT_SETTINGS);
    const parsed = JSON.parse(raw);
    // merge shallowly with defaults so new fields introduced later still exist
    const merged = structuredClone(DEFAULT_SETTINGS);
    Object.assign(merged, parsed);
    merged.currencies = Object.assign({}, DEFAULT_SETTINGS.currencies, parsed.currencies || {});
    // le nombre de decimales n'est pas modifiable par l'utilisateur : on force
    // toujours la valeur du code, meme si une ancienne sauvegarde locale en contient une autre.
    Object.keys(merged.currencies).forEach(code => {
      if (DEFAULT_SETTINGS.currencies[code]) {
        merged.currencies[code].decimals = DEFAULT_SETTINGS.currencies[code].decimals;
      }
    });
    return merged;
  } catch (e) {
    console.error('Paramètres illisibles, réinitialisation', e);
    return structuredClone(DEFAULT_SETTINGS);
  }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.history);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Historique illisible', e);
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
}

function uid() {
  return 'sc_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function todayISO() {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d - tz).toISOString().slice(0, 10);
}

/* ---------------- Nombre -> lettres (français) ---------------- */

const UNITS = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
  'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const TENS = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

function convertBelowHundred(n) {
  if (n < 20) return UNITS[n];
  const ten = Math.floor(n / 10);
  const unit = n % 10;
  if (ten === 7 || ten === 9) {
    // soixante-dix..soixante-dix-neuf / quatre-vingt-dix..dix-neuf
    const base = TENS[ten - 1];
    return base + '-' + UNITS[10 + unit];
  }
  if (unit === 0) {
    return ten === 8 ? TENS[ten] + 's' : TENS[ten];
  }
  if (unit === 1 && ten !== 8) {
    return TENS[ten] + ' et un';
  }
  return TENS[ten] + '-' + UNITS[unit];
}

function convertBelowThousand(n) {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  let out = '';
  if (hundreds > 0) {
    out += (hundreds === 1 ? 'cent' : UNITS[hundreds] + ' cent');
    if (rest === 0 && hundreds > 1) out += 's';
  }
  if (rest > 0) {
    out += (out ? ' ' : '') + convertBelowHundred(rest);
  }
  return out;
}

function numberToFrenchWords(value) {
  let n = Math.round(Math.abs(value));
  if (n === 0) return 'zéro';
  const scales = [
    { value: 1000000000000, singular: 'billion', plural: 'billions' },
    { value: 1000000000, singular: 'milliard', plural: 'milliards' },
    { value: 1000000, singular: 'million', plural: 'millions' },
    { value: 1000, singular: 'mille', plural: 'mille' }
  ];
  let parts = [];
  for (const scale of scales) {
    if (n >= scale.value) {
      const count = Math.floor(n / scale.value);
      n = n % scale.value;
      if (scale.value === 1000) {
        parts.push(count === 1 ? 'mille' : convertBelowThousand(count) + ' mille');
      } else {
        const countWords = convertBelowThousand(count);
        parts.push((count === 1 ? 'un ' : countWords + ' ') + (count === 1 ? scale.singular : scale.plural));
      }
    }
  }
  if (n > 0) parts.push(convertBelowThousand(n));
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

function amountInWords(value, currencyCfg) {
  const words = numberToFrenchWords(value);
  const rounded = Math.round(Math.abs(value));
  const name = rounded <= 1 ? currencyCfg.wordName.singular : currencyCfg.wordName.plural;
  return (words.charAt(0).toUpperCase() + words.slice(1)) + ' ' + name.toUpperCase();
}

/* ---------------- État applicatif ---------------- */

let settings = loadSettings();
let history = loadHistory();

let state = {
  currency: 'GNF',
  date: todayISO(),
  counts: {},          // { denomValue: qty }
  soldePrecedent: 0,
  entree: 0,
  versement: 0,
  sortie: 0,
  paiement: 0,
  caissier: settings.caissier || '',
  chefAgence: settings.chefAgence || '',
  notes: '',
  status: 'brouillon',
  id: null
};

function currentCurrencyCfg() {
  return settings.currencies[state.currency];
}

function computeTotals() {
  const cfg = currentCurrencyCfg();
  let totalPhysique = 0;
  for (const denom of cfg.denominations) {
    const qty = Number(state.counts[denom]) || 0;
    totalPhysique += qty * denom;
  }
  const soldeComptable = (Number(state.soldePrecedent) || 0)
    + (Number(state.entree) || 0)
    + (Number(state.versement) || 0)
    - (Number(state.sortie) || 0)
    - (Number(state.paiement) || 0);
  const ecart = totalPhysique - soldeComptable;
  let ecartType = 'equilibre';
  if (Math.abs(ecart) >= 1) {
    ecartType = ecart < 0 ? 'deficit' : 'excedent';
  }
  return { totalPhysique, soldeComptable, ecart, ecartType };
}

function fmt(value) {
  return Number(value || 0).toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

/* ---------------- Recherche du solde précédent (report automatique) ---------------- */

function findLastClosedBalance(currency, beforeDate) {
  const closed = history
    .filter(h => h.currency === currency && h.status === 'cloture' && h.date < beforeDate)
    .sort((a, b) => a.date < b.date ? 1 : -1);
  return closed.length ? closed[0] : null;
}

/* ---------------- Rendu : Saisie ---------------- */

function renderCurrencyTabs() {
  const wrap = document.getElementById('currencyTabs');
  wrap.innerHTML = '';
  CURRENCY_ORDER.filter(c => settings.currencies[c]).forEach(code => {
    const btn = document.createElement('button');
    btn.className = 'currency-tab-btn' + (code === state.currency ? ' active' : '');
    btn.textContent = code;
    btn.dataset.code = code;
    btn.addEventListener('click', () => {
      persistCurrentDraftLocalOnly();
      state.currency = code;
      loadDraftForCurrentSelection();
      renderAll();
    });
    wrap.appendChild(btn);
  });
}

function renderDenomTable() {
  const cfg = currentCurrencyCfg();
  document.getElementById('currencyLabel').textContent = `(${cfg.label} — ${cfg.symbol})`;
  const body = document.getElementById('denomBody');
  body.innerHTML = '';
  cfg.denominations.forEach(denom => {
    const qty = state.counts[denom] || '';
    const amount = (Number(state.counts[denom]) || 0) * denom;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="denom-value">${fmt(denom, cfg)}</td>
      <td><input type="number" min="0" step="1" inputmode="numeric" data-denom="${denom}" value="${qty}"></td>
      <td class="denom-amount">${fmt(amount, cfg)}</td>
    `;
    body.appendChild(tr);
  });
  body.querySelectorAll('input[data-denom]').forEach(input => {
    input.addEventListener('input', e => {
      const denom = e.target.dataset.denom;
      state.counts[denom] = e.target.value === '' ? 0 : Number(e.target.value);
      renderComputed();
      updateDenomAmountCell(input, denom, cfg);
    });
  });
}

function updateDenomAmountCell(input, denom, cfg) {
  const row = input.closest('tr');
  const amount = (Number(state.counts[denom]) || 0) * Number(denom);
  row.querySelector('.denom-amount').textContent = fmt(amount, cfg);
}

function renderComputed() {
  const cfg = currentCurrencyCfg();
  const { totalPhysique, soldeComptable, ecart, ecartType } = computeTotals();

  document.getElementById('totalPhysiqueCell').textContent = fmt(totalPhysique, cfg);
  document.getElementById('soldeComptableCell').textContent = fmt(soldeComptable, cfg);
  document.getElementById('amountWords').textContent =
    'Arrêté à la somme de : ' + amountInWords(totalPhysique, cfg);

  const banner = document.getElementById('ecartBanner');
  const label = document.getElementById('ecartLabel');
  const amountEl = document.getElementById('ecartAmount');
  banner.classList.remove('ecart-equilibre', 'ecart-deficit', 'ecart-excedent');
  banner.classList.add('ecart-' + ecartType);
  label.textContent = ecartType === 'equilibre' ? 'ÉQUILIBRE' : ecartType === 'deficit' ? 'DÉFICIT' : 'EXCÉDENT';
  amountEl.textContent = ecartType === 'equilibre' ? fmt(0, cfg) : fmt(Math.abs(ecart), cfg) + ' ' + cfg.symbol;

  const badge = document.getElementById('statusBadge');
  if (state.status === 'cloture') {
    badge.textContent = 'Clôturée';
    badge.className = 'badge badge-cloture';
  } else {
    badge.textContent = 'Brouillon';
    badge.className = 'badge badge-draft';
  }
}

function renderEntryForm() {
  document.getElementById('dateInput').value = state.date;
  document.getElementById('soldePrecedent').value = state.soldePrecedent;
  document.getElementById('entree').value = state.entree;
  document.getElementById('versement').value = state.versement;
  document.getElementById('sortie').value = state.sortie;
  document.getElementById('paiement').value = state.paiement;
  document.getElementById('caissierInput').value = state.caissier;
  document.getElementById('chefAgenceInput').value = state.chefAgence;
  document.getElementById('notesInput').value = state.notes;
  document.getElementById('printCaissierName').textContent = state.caissier || ' ';
  document.getElementById('printChefName').textContent = state.chefAgence || ' ';

  const isClosed = state.status === 'cloture';
  document.querySelectorAll('#view-saisie input, #view-saisie textarea').forEach(el => {
    el.disabled = isClosed;
  });
  document.getElementById('btnCloturer').disabled = isClosed;
  document.getElementById('btnSaveDraft').disabled = isClosed;
}

function renderAll() {
  renderCurrencyTabs();
  renderDenomTable();
  renderEntryForm();
  renderComputed();
}

/* ---------------- Chargement / sauvegarde de la saisie courante ---------------- */

function draftKeyFor(currency, date) {
  return currency + '_' + date;
}

function loadDraftForCurrentSelection() {
  const existing = history.find(h => h.currency === state.currency && h.date === state.date);
  if (existing) {
    state = structuredClone(existing);
    return;
  }
  const lastClosed = findLastClosedBalance(state.currency, state.date);
  state = {
    id: null,
    currency: state.currency,
    date: state.date,
    counts: {},
    soldePrecedent: lastClosed ? computeStoredSoldeComptable(lastClosed) : 0,
    entree: 0,
    versement: 0,
    sortie: 0,
    paiement: 0,
    caissier: settings.caissier || '',
    chefAgence: settings.chefAgence || '',
    notes: '',
    status: 'brouillon'
  };
}

function computeStoredSoldeComptable(entry) {
  return (Number(entry.soldePrecedent) || 0) + (Number(entry.entree) || 0) + (Number(entry.versement) || 0)
    - (Number(entry.sortie) || 0) - (Number(entry.paiement) || 0);
}

function persistCurrentDraftLocalOnly() {
  // keeps in-memory state only; explicit save happens on button click
}

function readFormIntoState() {
  state.date = document.getElementById('dateInput').value || todayISO();
  state.soldePrecedent = Number(document.getElementById('soldePrecedent').value) || 0;
  state.entree = Number(document.getElementById('entree').value) || 0;
  state.versement = Number(document.getElementById('versement').value) || 0;
  state.sortie = Number(document.getElementById('sortie').value) || 0;
  state.paiement = Number(document.getElementById('paiement').value) || 0;
  state.caissier = document.getElementById('caissierInput').value.trim();
  state.chefAgence = document.getElementById('chefAgenceInput').value.trim();
  state.notes = document.getElementById('notesInput').value.trim();
}

function upsertHistory(entry) {
  const idx = history.findIndex(h => h.id === entry.id || (h.currency === entry.currency && h.date === entry.date));
  if (idx >= 0) {
    entry.id = history[idx].id || uid();
    history[idx] = entry;
  } else {
    entry.id = entry.id || uid();
    history.push(entry);
  }
  saveHistory(history);
}

function saveDraft() {
  readFormIntoState();
  state.status = state.status === 'cloture' ? 'cloture' : 'brouillon';
  const entry = structuredClone(state);
  entry.savedAt = new Date().toISOString();
  upsertHistory(entry);
  state.id = entry.id;
  showToast('Brouillon enregistré.');
  renderComputed();
}

function cloturerSituation() {
  readFormIntoState();
  if (!state.caissier) {
    showToast('Merci de renseigner le nom du/de la caissier(ère) avant la clôture.');
    return;
  }
  const { ecartType, ecart } = computeTotals();
  if (ecartType !== 'equilibre') {
    const cfg = currentCurrencyCfg();
    const proceed = confirm(
      `Un écart de ${fmt(Math.abs(ecart), cfg)} ${cfg.symbol} (${ecartType.toUpperCase()}) a été détecté.\n` +
      `Voulez-vous tout de même clôturer la situation ?`
    );
    if (!proceed) return;
  }
  state.status = 'cloture';
  state.closedAt = new Date().toISOString();
  const entry = structuredClone(state);
  upsertHistory(entry);
  state.id = entry.id;
  showToast('Situation clôturée.');
  renderAll();
}

/* ---------------- Historique ---------------- */

function renderHistoryFilters() {
  const sel = document.getElementById('histCurrencyFilter');
  sel.innerHTML = '<option value="">Toutes devises</option>' +
    CURRENCY_ORDER.filter(c => settings.currencies[c]).map(c => `<option value="${c}">${c}</option>`).join('');
}

function renderHistoryTable() {
  const currencyFilter = document.getElementById('histCurrencyFilter').value;
  const fromDate = document.getElementById('histFromDate').value;
  const toDate = document.getElementById('histToDate').value;

  let rows = history.slice().sort((a, b) => a.date < b.date ? 1 : -1);
  if (currencyFilter) rows = rows.filter(r => r.currency === currencyFilter);
  if (fromDate) rows = rows.filter(r => r.date >= fromDate);
  if (toDate) rows = rows.filter(r => r.date <= toDate);

  const body = document.getElementById('histBody');
  body.innerHTML = '';
  document.getElementById('histEmpty').hidden = rows.length !== 0;

  rows.forEach(r => {
    const cfg = settings.currencies[r.currency] || DEFAULT_SETTINGS.currencies[r.currency];
    const totalPhysique = Object.entries(r.counts || {}).reduce((sum, [denom, qty]) => sum + Number(denom) * (Number(qty) || 0), 0);
    const soldeComptable = computeStoredSoldeComptable(r);
    const ecart = totalPhysique - soldeComptable;
    const ecartType = Math.abs(ecart) < 1 ? 'equilibre' : (ecart < 0 ? 'deficit' : 'excedent');

    const tr = document.createElement('tr');
    tr.className = 'row-' + ecartType;
    tr.innerHTML = `
      <td>${r.date}</td>
      <td>${r.currency}</td>
      <td>${fmt(totalPhysique, cfg)}</td>
      <td>${fmt(soldeComptable, cfg)}</td>
      <td>${ecartType === 'equilibre' ? '—' : fmt(Math.abs(ecart), cfg) + ' (' + ecartType.toUpperCase() + ')'}</td>
      <td>${r.status === 'cloture' ? 'Clôturée' : 'Brouillon'}</td>
      <td>${escapeHtml(r.caissier)}</td>
      <td><button class="link-btn" data-open="${r.id}">Ouvrir</button></td>
    `;
    body.appendChild(tr);
  });

  body.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const entry = history.find(h => h.id === btn.dataset.open);
      if (!entry) return;
      state = structuredClone(entry);
      switchView('saisie');
      renderAll();
    });
  });
}

function exportHistoryCsv() {
  const lines = [['Date', 'Devise', 'Total physique', 'Solde comptable', 'Ecart', 'Statut', 'Caissier', "Chef d'agence", 'Notes'].join(';')];
  history.slice().sort((a, b) => a.date < b.date ? -1 : 1).forEach(r => {
    const totalPhysique = Object.entries(r.counts || {}).reduce((sum, [denom, qty]) => sum + Number(denom) * (Number(qty) || 0), 0);
    const soldeComptable = computeStoredSoldeComptable(r);
    const ecart = totalPhysique - soldeComptable;
    lines.push([r.date, r.currency, totalPhysique, soldeComptable, ecart, r.status, r.caissier || '', r.chefAgence || '', (r.notes || '').replace(/;/g, ',')].join(';'));
  });
  downloadFile('historique_caisse.csv', lines.join('\n'), 'text/csv;charset=utf-8');
}

/* ---------------- Paramètres ---------------- */

function renderSettingsForm() {
  document.getElementById('settingInstitution').value = settings.institution;
  document.getElementById('settingAgence').value = settings.agence;
  document.getElementById('settingCaissier').value = settings.caissier;
  document.getElementById('settingChefAgence').value = settings.chefAgence;

  const grid = document.getElementById('denomSettingsGrid');
  grid.innerHTML = '';
  CURRENCY_ORDER.filter(c => settings.currencies[c]).forEach(code => {
    const cfg = settings.currencies[code];
    const col = document.createElement('div');
    col.className = 'denom-settings-col';
    col.innerHTML = `
      <h3>${code} — ${cfg.label}</h3>
      <textarea data-currency="${code}">${cfg.denominations.join('\n')}</textarea>
    `;
    grid.appendChild(col);
  });

  document.getElementById('brandAgence').textContent = settings.agence;
  document.getElementById('brandInstitution').textContent = settings.institution;
}

function saveSettingsForm() {
  settings.institution = document.getElementById('settingInstitution').value.trim() || DEFAULT_SETTINGS.institution;
  settings.agence = document.getElementById('settingAgence').value.trim() || DEFAULT_SETTINGS.agence;
  settings.caissier = document.getElementById('settingCaissier').value.trim();
  settings.chefAgence = document.getElementById('settingChefAgence').value.trim();
  saveSettings(settings);
  document.getElementById('brandAgence').textContent = settings.agence;
  document.getElementById('brandInstitution').textContent = settings.institution;
  showToast('Paramètres enregistrés.');
}

function saveDenomSettings() {
  document.querySelectorAll('#denomSettingsGrid textarea').forEach(ta => {
    const code = ta.dataset.currency;
    const values = ta.value.split('\n')
      .map(v => v.trim())
      .filter(v => v !== '')
      .map(Number)
      .filter(v => !isNaN(v) && v > 0)
      .sort((a, b) => b - a);
    if (values.length) settings.currencies[code].denominations = values;
  });
  saveSettings(settings);
  showToast('Coupures mises à jour.');
  if (state.currency) renderDenomTable();
  renderComputed();
}

/* ---------------- Sauvegarde / restauration globale ---------------- */

function exportBackup() {
  const payload = { settings, history, exportedAt: new Date().toISOString() };
  downloadFile('sauvegarde_caisse_' + todayISO() + '.json', JSON.stringify(payload, null, 2), 'application/json');
}

function importBackup(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);
      if (payload.settings) { settings = payload.settings; saveSettings(settings); }
      if (payload.history) { history = payload.history; saveHistory(history); }
      showToast('Sauvegarde importée.');
      renderSettingsForm();
      renderHistoryFilters();
      renderHistoryTable();
      loadDraftForCurrentSelection();
      renderAll();
    } catch (e) {
      alert("Le fichier sélectionné n'est pas une sauvegarde valide.");
    }
  };
  reader.readAsText(file);
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ---------------- Navigation ---------------- */

function switchView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  if (view === 'historique') {
    renderHistoryFilters();
    renderHistoryTable();
  }
  if (view === 'parametres') {
    renderSettingsForm();
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { toast.hidden = true; }, 2600);
}

/* ---------------- Câblage des événements ---------------- */

function wireEvents() {
  document.getElementById('mainNav').addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (btn) switchView(btn.dataset.view);
  });

  document.getElementById('dateInput').addEventListener('change', e => {
    state.date = e.target.value;
    loadDraftForCurrentSelection();
    state.date = e.target.value;
    renderAll();
  });

  ['soldePrecedent', 'entree', 'versement', 'sortie', 'paiement'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      readFormIntoState();
      renderComputed();
    });
  });

  document.getElementById('btnSaveDraft').addEventListener('click', saveDraft);
  document.getElementById('btnCloturer').addEventListener('click', cloturerSituation);
  document.getElementById('btnPrint').addEventListener('click', () => {
    readFormIntoState();
    document.getElementById('printCaissierName').textContent = state.caissier || ' ';
    document.getElementById('printChefName').textContent = state.chefAgence || ' ';
    window.print();
  });

  document.getElementById('histCurrencyFilter').addEventListener('change', renderHistoryTable);
  document.getElementById('histFromDate').addEventListener('change', renderHistoryTable);
  document.getElementById('histToDate').addEventListener('change', renderHistoryTable);
  document.getElementById('histExportCsv').addEventListener('click', exportHistoryCsv);

  document.getElementById('btnSaveSettings').addEventListener('click', saveSettingsForm);
  document.getElementById('btnSaveDenoms').addEventListener('click', saveDenomSettings);
  document.getElementById('btnExportBackup').addEventListener('click', exportBackup);
  document.getElementById('importBackupInput').addEventListener('change', e => {
    if (e.target.files[0]) importBackup(e.target.files[0]);
    e.target.value = '';
  });
}

/* ---------------- PWA : installation ---------------- */

let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  document.getElementById('installBtn').hidden = false;
});
document.addEventListener('DOMContentLoaded', () => {
  const installBtn = document.getElementById('installBtn');
  installBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installBtn.hidden = true;
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW non enregistré', err));
  });
}

/* ---------------- Initialisation ---------------- */

function init() {
  wireEvents();
  document.getElementById('brandAgence').textContent = settings.agence;
  document.getElementById('brandInstitution').textContent = settings.institution;
  loadDraftForCurrentSelection();
  renderAll();
}

document.addEventListener('DOMContentLoaded', init);
