import { translations } from './translations.js';
import { getElements, render, renderLanguage, renderBoostPreview } from './ui.js';
import { initializeTheme, toggleTheme } from './theme.js';

const state = {
  initial: 5000,
  monthly: 100,
  frequency: 'monthly',
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

function syncContributionSlider() {
  if (state.frequency === 'weekly') {
    els.monthly.min = '0';
    els.monthly.max = '500';
    els.monthly.step = '100';
    els.monthly.value = String(Math.round((state.monthly * 12 / 52) / 100) * 100);
  } else {
    els.monthly.min = '0';
    els.monthly.max = '2000';
    els.monthly.step = '100';
    els.monthly.value = String(Math.round(state.monthly / 100) * 100);
  }
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
    const value = Math.round(Number(event.target.value) / 100) * 100;
    event.target.value = String(value);
    state.monthly = state.frequency === 'weekly' ? value * 52 / 12 : value;
    resetBoostPreview();
    rerender();
  });

  els.frequencyToggle.addEventListener('click', event => {
    const button = event.target.closest('button[data-frequency]');
    if (!button || button.dataset.frequency === state.frequency) return;
    state.frequency = button.dataset.frequency;
    syncContributionSlider();
    resetBoostPreview();
    rerender();
  });

  els.durationSwitch.addEventListener('click', event => {
    const button = event.target.closest('button[data-years]');
    if (!button) return;
    state.years = Number(button.dataset.years);
    rerender();
  });

  els.strategyGrid.addEventListener('click', event => {
    const button = event.target.closest('.strategy-btn');
    if (!button) return;
    els.strategyGrid.querySelectorAll('.strategy-btn').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    state.annualReturn = Number(button.dataset.return);
    resetBoostPreview();
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
    state.monthly = Math.min(2000, state.monthly + boost);
    syncContributionSlider();
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
syncContributionSlider();
renderLanguage(state, els, translations);
bindEvents();
rerender();
