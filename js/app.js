import { translations } from './translations.js';
import { getElements, render, renderLanguage, renderBoostPreview } from './ui.js';
import { initializeTheme, toggleTheme } from './theme.js';

const state = {
  initial: 5000,
  monthly: 100,
  years: 10,
  annualReturn: 6,
  goal: 30000,
  lang: localStorage.getItem('bloom-lang') || 'fr',
  selectedBoost: null,
  acceleratorOpen: false
};

const els = getElements();
const boostToggleBtn = document.getElementById('boostToggleBtn');
const boostToggleLabel = document.getElementById('boostToggleLabel');
const boostPanel = document.getElementById('boostPanel');

function updateAcceleratorToggle() {
  const t = translations[state.lang];
  boostToggleBtn.setAttribute('aria-expanded', String(state.acceleratorOpen));
  boostToggleLabel.textContent = state.acceleratorOpen ? t.hideAccelerator : t.showAccelerator;
  boostPanel.hidden = !state.acceleratorOpen;
  boostPanel.classList.toggle('revealed', state.acceleratorOpen);
}

function rerender() {
  render(state, els, translations);
  renderBoostPreview(state, els, translations, state.selectedBoost);
  updateAcceleratorToggle();
}

function resetBoostPreview() {
  state.selectedBoost = null;
  renderBoostPreview(state, els, translations, null);
}

function bindEvents() {
  els.initialCapital.addEventListener('input', event => {
    state.initial = Number(event.target.value);
    resetBoostPreview();
    rerender();
  });

  els.monthly.addEventListener('input', event => {
    state.monthly = Number(event.target.value);
    resetBoostPreview();
    rerender();
  });

  els.yearsSelect.addEventListener('change', event => {
    state.years = Number(event.target.value);
    rerender();
  });

  boostToggleBtn.addEventListener('click', () => {
    state.acceleratorOpen = !state.acceleratorOpen;
    updateAcceleratorToggle();
    if (state.acceleratorOpen) {
      window.requestAnimationFrame(() => boostPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
    }
  });

  els.boostOptions.addEventListener('click', event => {
    const button = event.target.closest('.boost-btn');
    if (!button) return;
    const boost = Number(button.dataset.boost);
    state.selectedBoost = state.selectedBoost === boost ? null : boost;
    renderBoostPreview(state, els, translations, state.selectedBoost);
  });

  els.applyBoostBtn.addEventListener('click', () => {
    const boost = Number(els.applyBoostBtn.dataset.boost || 0);
    if (!boost) return;
    state.monthly = Math.min(Number(els.monthly.max), state.monthly + boost);
    els.monthly.value = String(state.monthly);
    resetBoostPreview();
    rerender();
  });

  els.languageBtn.addEventListener('click', () => {
    state.lang = state.lang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('bloom-lang', state.lang);
    renderLanguage(state, els, translations);
    rerender();
  });

  els.themeBtn.addEventListener('click', toggleTheme);
}

initializeTheme();
renderLanguage(state, els, translations);
bindEvents();
rerender();
