import { getSummary, getBoostScenario } from './calculator.js';
import { renderChart } from './chart.js';

export function getElements() {
  return Object.fromEntries([
    'heroTitle','estimatedLabel','encouragement','investedValue','gainValue','performanceValue','yearsSelect',
    'chartGrid','mainPath','investedPath','areaPath','mainDot','investedDot','goalProgress','goalNumbers','goalPercent',
    'goalPlant','goalDate','growthNote','boostOptions','boostPreview','boostResult','boostTimeSaved','applyBoostBtn',
    'initialCapital','initialValue','monthly','monthlyValue','returnValue','languageBtn','themeBtn','strategyGrid'
  ].map(id => [id, document.getElementById(id)]));
}

export function formatCHF(value) {
  return 'CHF ' + Math.round(value).toLocaleString('de-CH').replace(/’/g, "'");
}

function formatGoalDate(months, lang) {
  if (months === null) return null;
  if (months === 0) return 'done';
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-CH' : 'en-GB', { month: 'long', year: 'numeric' }).format(date);
}

function getPlantStage(progress) {
  if (progress >= 100) return '🏁';
  if (progress >= 80) return '🌳';
  if (progress >= 50) return '🪴';
  if (progress >= 20) return '🌿';
  return '🌱';
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

export function renderBoostPreview(state, els, translations, boost) {
  const t = translations[state.lang];
  if (!boost) {
    els.boostPreview.hidden = true;
    els.boostOptions.querySelectorAll('.boost-btn').forEach(button => button.classList.remove('active'));
    return;
  }

  const scenario = getBoostScenario(state, boost);
  const date = formatGoalDate(scenario.boostedMonths, state.lang);
  els.boostOptions.querySelectorAll('.boost-btn').forEach(button => {
    button.classList.toggle('active', Number(button.dataset.boost) === boost);
  });

  els.boostPreview.hidden = false;
  els.boostResult.textContent = `${t.withMonthly.replace('{amount}', formatCHF(scenario.newMonthly))} → ${date === 'done' ? t.goalReached : (date || t.goalNotReached)}`;
  if (scenario.monthsSaved === null || scenario.monthsSaved === 0) {
    els.boostTimeSaved.textContent = '';
  } else if (scenario.monthsSaved === 1) {
    els.boostTimeSaved.textContent = t.oneMonthSaved;
  } else {
    els.boostTimeSaved.textContent = t.monthsSaved.replace('{months}', scenario.monthsSaved);
  }
  els.applyBoostBtn.dataset.boost = String(boost);
}

export function render(state, els, translations) {
  const t = translations[state.lang];
  const summary = getSummary(state);
  els.heroTitle.textContent = formatCHF(summary.value);
  els.investedValue.textContent = formatCHF(summary.invested);
  els.gainValue.textContent = formatCHF(summary.gains);
  els.performanceValue.textContent = `${summary.performance.toFixed(1)} %`;
  els.initialValue.textContent = formatCHF(state.initial);
  els.monthlyValue.textContent = formatCHF(state.monthly);
  els.returnValue.textContent = `${state.annualReturn.toFixed(1)} % / ${t.perYear}`;
  els.goalProgress.style.width = `${summary.goalProgress}%`;
  els.goalNumbers.textContent = `${formatCHF(summary.value)} / ${formatCHF(state.goal)}`;
  els.goalPercent.textContent = `${Math.round(summary.goalProgress)}%`;
  els.goalPlant.textContent = getPlantStage(summary.goalProgress);

  const date = formatGoalDate(summary.goalMonths, state.lang);
  els.goalDate.textContent = date === 'done' ? t.goalReached : (date || t.goalNotReached);
  els.growthNote.textContent = t.growthNote.replace('{amount}', formatCHF(Math.max(0, summary.gains)));

  setRangeFill(els.initialCapital);
  setRangeFill(els.monthly);
  renderChart(state, els, translations);
}
