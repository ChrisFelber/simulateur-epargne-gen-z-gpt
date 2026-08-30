import { translations } from './translations.js';
import { getElements, render, renderLanguage } from './ui.js';
import { initializeTheme, toggleTheme } from './theme.js';

const state = {
  initial: 5000,
  monthly: 100,
  years: 10,
  annualReturn: 6,
  goal: 30000,
  lang: localStorage.getItem('bloom-lang') || 'fr'
};

const els = getElements();

function rerender() {
  render(state, els, translations);
}

function bindEvents() {
  els.initialCapital.addEventListener('input', event => {
    state.initial = Number(event.target.value);
    rerender();
  });

  els.monthly.addEventListener('input', event => {
    state.monthly = Number(event.target.value);
    rerender();
  });

  els.yearsSelect.addEventListener('change', event => {
    state.years = Number(event.target.value);
    rerender();
  });

  els.strategyGrid.addEventListener('click', event => {
    const button = event.target.closest('.strategy-btn');
    if (!button) return;
    document.querySelectorAll('.strategy-btn').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    state.annualReturn = Number(button.dataset.return);
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
