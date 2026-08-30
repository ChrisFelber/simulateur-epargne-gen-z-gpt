import { getSummary, getBoostScenario } from './calculator.js';
import { renderChart } from './chart.js';
export function getElements(){
  return Object.fromEntries([
    'heroTitle','estimatedLabel','encouragement','investedValue','gainValue','performanceValue','yearsSelect',
    'chartGrid','mainPath','investedPath','areaPath','mainDot','investedDot',
    'goalProgress','goalNumbers','goalPercent','goalPlant','goalDate','growthNote','goalName',
    'goalEditBtn','goalEditor','goalNameInput','goalAmountInput','goalCancelBtn',
    'boostOptions','boostPreview','boostResult','boostTimeSaved','boostTimeDetail','applyBoostBtn',
    'initialCapital','initialValue','monthly','monthlyValue','returnValue','languageBtn','themeBtn','strategyGrid'
  ].map(id=>[id,document.getElementById(id)]));
}
export function formatCHF(value){return 'CHF '+Math.round(value).toLocaleString('de-CH').replace(/’/g,"'");}
function formatGoalDate(months,lang){
  if(months===null)return null;if(months===0)return'done';
  const d=new Date();d.setMonth(d.getMonth()+months);
  return new Intl.DateTimeFormat(lang==='fr'?'fr-CH':'en-GB',{month:'long',year:'numeric'}).format(d);
}
function stage(p){if(p>=100)return'✨';if(p>=80)return'🌸';if(p>=50)return'🪴';if(p>=20)return'🌿';return'🌱';}
export function setRangeFill(input){
  const min=+input.min,max=+input.max,val=+input.value;
  input.style.setProperty('--pct',`${((val-min)/(max-min))*100}%`);
}
export function renderLanguage(state,els,tr){
  const t=tr[state.lang];document.documentElement.lang=state.lang;els.languageBtn.textContent=state.lang.toUpperCase();
  els.estimatedLabel.textContent=t.estimatedLabel;els.encouragement.textContent=t.encouragement;
  document.querySelectorAll('[data-i18n]').forEach(n=>{const k=n.dataset.i18n;if(t[k])n.textContent=t[k];});
  document.querySelectorAll('.strategy-btn').forEach(b=>b.textContent=t[b.dataset.key]);
  [...els.yearsSelect.options].forEach(o=>o.textContent=`${o.value} ${t.years}`);
}
export function renderBoostPreview(state,els,tr,boost){
  const t=tr[state.lang];
  if(!boost){els.boostPreview.hidden=true;els.boostOptions.querySelectorAll('.boost-btn').forEach(b=>b.classList.remove('active'));return;}
  const s=getBoostScenario(state,boost),date=formatGoalDate(s.boostedMonths,state.lang);
  els.boostOptions.querySelectorAll('.boost-btn').forEach(b=>b.classList.toggle('active',+b.dataset.boost===boost));
  els.boostPreview.hidden=false;
  els.boostResult.textContent=`${t.withMonthly.replace('{amount}',formatCHF(s.newMonthly))} → ${date==='done'?t.goalReached:(date||t.goalNotReached)}`;
  if(s.monthsSaved===null||s.monthsSaved===0){els.boostTimeSaved.textContent='';els.boostTimeDetail.textContent='';}
  else if(s.monthsSaved===1){els.boostTimeSaved.textContent=t.oneMonthSaved;els.boostTimeDetail.textContent=t.oneMonthSavedDetail;}
  else{els.boostTimeSaved.textContent=t.monthsSaved.replace('{months}',s.monthsSaved);els.boostTimeDetail.textContent=t.timeSavedDetail.replace('{months}',s.monthsSaved);}
  els.applyBoostBtn.dataset.boost=String(boost);
}
export function render(state,els,tr){
  const t=tr[state.lang],s=getSummary(state);
  els.heroTitle.textContent=formatCHF(s.value);els.investedValue.textContent=formatCHF(s.invested);
  els.gainValue.textContent=formatCHF(s.gains);els.performanceValue.textContent=`${s.performance.toFixed(1)} %`;
  els.initialValue.textContent=formatCHF(state.initial);els.monthlyValue.textContent=formatCHF(state.monthly);
  els.returnValue.textContent=`${state.annualReturn.toFixed(1)} % / ${t.perYear}`;
  els.goalProgress.style.width=`${s.goalProgress}%`;els.goalNumbers.textContent=`${formatCHF(s.value)} / ${formatCHF(state.goal)}`;
  els.goalPercent.textContent=`${Math.round(s.goalProgress)}%`;els.goalPlant.textContent=stage(s.goalProgress);
  els.goalName.textContent=state.goalName||t.worldTrip;
  const date=formatGoalDate(s.goalMonths,state.lang);els.goalDate.textContent=date==='done'?t.goalReached:(date||t.goalNotReached);
  els.growthNote.textContent=t.growthNote.replace('{amount}',formatCHF(Math.max(0,s.gains)));
  setRangeFill(els.initialCapital);setRangeFill(els.monthly);renderChart(state,els);
}
