import { getSummary } from './calculator.js';
import { renderChart } from './chart.js';

export function getElements() {
  return Object.fromEntries([
    'heroTitle','estimatedLabel','encouragement','investedValue','gainValue','performanceValue','yearsSelect',
    'chartGrid','mainPath','investedPath','areaPath','mainDot','investedDot','goalProgress','goalNumbers','goalPercent',
    'initialCapital','initialValue','monthly','monthlyValue','returnValue','languageBtn','themeBtn','strategyGrid'
  ].map(id => [id, document.getElementById(id)]));
}

export function formatCHF(value) {
  return 'CHF ' + Math.round(value).toLocaleString('de-CH').replace(/’/g, "'");
}

export function setRangeFill(input) {
  const min = Number(input.min), max = Number(input.max), value = Number(input.value);
  input.style.setProperty('--pct', `${((value - min) / (max - min)) * 100}%`);
}

export function renderLanguage(state, els, translations) {
  const t = translations[state.lang];
  document.documentElement.lang = state.lang;
  els.languageBtn.textContent = state.lang.toUpperCase();
  els.estimatedLabel.textContent = t.estimatedLabel;
  els.encouragement.textContent = t.encouragement;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (t[key]) element.textContent = t[key];
  });
  document.querySelectorAll('.strategy-btn').forEach(button => button.textContent = t[button.dataset.key]);
  [...els.yearsSelect.options].forEach(option => option.textContent = `${option.value} ${t.years}`);
}

export function render(state, els, translations) {
  const summary = getSummary(state);
  els.heroTitle.textContent = formatCHF(summary.value);
  els.investedValue.textContent = formatCHF(summary.invested);
  els.gainValue.textContent = formatCHF(summary.gains);
  els.performanceValue.textContent = `${summary.performance.toFixed(1)} %`;
  els.initialValue.textContent = formatCHF(state.initial);
  els.monthlyValue.textContent = formatCHF(state.monthly);
  els.returnValue.textContent = `${state.annualReturn.toFixed(1)} % / ${translations[state.lang].perYear}`;
  els.goalProgress.style.width = `${summary.goalProgress}%`;
  els.goalNumbers.textContent = `${formatCHF(summary.value)} / ${state.goal.toLocaleString('de-CH').replace(/’/g, "'")}`;
  els.goalPercent.textContent = `${Math.round(summary.goalProgress)}%`;
  setRangeFill(els.initialCapital);
  setRangeFill(els.monthly);
  renderChart(state, els, translations);
}
