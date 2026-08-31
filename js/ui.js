import { getSummary, getBoostScenario, projectSavings } from './calculator.js';

export function getElements() {
  return Object.fromEntries([
    'heroTitle','estimatedLabel','investedValue','gainValue','performanceValue','yearsSelect','heroDuration','timeGainValue',
    'milestone1Year','milestone1Value','milestone1Gain','milestone2Year','milestone2Value','milestone2Gain','milestone3Year','milestone3Value','milestone3Gain',
    'goalProgress','goalNumbers','goalPercent','goalPlant','goalDate','growthNote','boostOptions','boostPreview','boostResult','boostTimeSaved','applyBoostBtn',
    'boost100Benefit','boost200Benefit','boost300Benefit',
    'initialCapital','initialValue','monthly','monthlyValue','returnValue','strategyGrid','languageBtn','themeBtn'
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

function milestoneYears(totalYears) {
  const first = 1;
  const middle = Math.max(2, Math.round(totalYears / 2));
  return [first, middle, totalYears];
}

function renderMilestones(state, els, translations) {
  const t = translations[state.lang];
  const years = milestoneYears(state.years);
  const targets = [
    [els.milestone1Year, els.milestone1Value, els.milestone1Gain],
    [els.milestone2Year, els.milestone2Value, els.milestone2Gain],
    [els.milestone3Year, els.milestone3Value, els.milestone3Gain]
  ];

  years.forEach((year, index) => {
    const projection = projectSavings(state, year);
    const gain = Math.max(0, projection.value - projection.invested);
    const [yearEl, valueEl, gainEl] = targets[index];
    yearEl.textContent = `${year} ${year === 1 ? (state.lang === 'fr' ? 'an' : 'year') : t.years}`;
    valueEl.textContent = formatCHF(projection.value);
    gainEl.textContent = `+ ${formatCHF(gain)}`;
  });
}

function boostBenefitLabel(state, translations, boost) {
  const t = translations[state.lang];
  const scenario = getBoostScenario(state, boost);
  if (scenario.monthsSaved === null) return t.boostBenefitCloser;
  if (scenario.monthsSaved <= 0) return t.boostBenefitCloser;
  if (scenario.monthsSaved === 1) return t.boostBenefitOneMonth;
  return t.boostBenefitMonths.replace('{months}', scenario.monthsSaved);
}

function renderBoostBenefits(state, els, translations) {
  els.boost100Benefit.textContent = boostBenefitLabel(state, translations, 100);
  els.boost200Benefit.textContent = boostBenefitLabel(state, translations, 200);
  els.boost300Benefit.textContent = boostBenefitLabel(state, translations, 300);
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
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (t[key]) element.textContent = t[key];
  });
  els.strategyGrid.querySelectorAll('.strategy-btn').forEach(button => {
    button.textContent = t[button.dataset.key];
  });
  [...els.yearsSelect.options].forEach(option => option.textContent = `${option.value} ${t.years}`);
}

export function renderBoostPreview(state, els, translations, boost) {
  const t = translations[state.lang];
  els.boostPreview.hidden = false;

  if (!boost) {
    els.boostOptions.querySelectorAll('.boost-btn').forEach(button => button.classList.remove('active'));
    els.boostResult.textContent = t.selectBoostPrompt;
    els.boostTimeSaved.textContent = t.selectBoostHint;
    els.applyBoostBtn.dataset.boost = '';
    els.applyBoostBtn.disabled = true;
    return;
  }

  const scenario = getBoostScenario(state, boost);
  const date = formatGoalDate(scenario.boostedMonths, state.lang);
  els.boostOptions.querySelectorAll('.boost-btn').forEach(button => {
    button.classList.toggle('active', Number(button.dataset.boost) === boost);
  });

  const horizon = date === 'done' ? t.goalReached : (date || t.goalNotReached);
  els.boostResult.textContent = t.boostSelectedSummary
    .replace('{amount}', formatCHF(scenario.newMonthly))
    .replace('{date}', horizon);

  if (scenario.monthsSaved === null || scenario.monthsSaved === 0) {
    els.boostTimeSaved.textContent = t.noTimeSaved;
  } else if (scenario.monthsSaved === 1) {
    els.boostTimeSaved.textContent = t.oneMonthSaved;
  } else {
    els.boostTimeSaved.textContent = t.monthsSaved.replace('{months}', scenario.monthsSaved);
  }
  els.applyBoostBtn.dataset.boost = String(boost);
  els.applyBoostBtn.disabled = false;
}

export function render(state, els, translations) {
  const t = translations[state.lang];
  const summary = getSummary(state);
  els.heroTitle.textContent = formatCHF(summary.value);
  els.investedValue.textContent = formatCHF(summary.invested);
  els.gainValue.textContent = formatCHF(summary.gains);
  els.performanceValue.textContent = `${summary.performance.toFixed(1)} %`;
  els.timeGainValue.textContent = `+ ${formatCHF(Math.max(0, summary.gains))}`;
  els.heroDuration.textContent = `${state.years} ${t.years}`;
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

  renderMilestones(state, els, translations);
  renderBoostBenefits(state, els, translations);
  setRangeFill(els.initialCapital);
  setRangeFill(els.monthly);
}
