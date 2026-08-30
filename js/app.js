import { translations } from './translations.js';
import { getElements, render, renderLanguage, renderBoostPreview } from './ui.js';
import { initializeTheme, toggleTheme } from './theme.js';

const state={initial:5000,monthly:100,years:10,annualReturn:6,goal:40000,goalName:'',lang:localStorage.getItem('bloom-lang')||'fr',selectedBoost:null};
const els=getElements();
function rerender(){render(state,els,translations);renderBoostPreview(state,els,translations,state.selectedBoost);}
function resetBoost(){state.selectedBoost=null;renderBoostPreview(state,els,translations,null);}
function openGoal(){els.goalNameInput.value=state.goalName;els.goalAmountInput.value=String(state.goal);els.goalEditor.hidden=false;els.goalNameInput.focus();}
function closeGoal(){els.goalEditor.hidden=true;}
els.initialCapital.addEventListener('input',e=>{state.initial=+e.target.value;resetBoost();rerender();});
els.monthly.addEventListener('input',e=>{state.monthly=+e.target.value;resetBoost();rerender();});
els.yearsSelect.addEventListener('change',e=>{state.years=+e.target.value;rerender();});
els.strategyGrid.addEventListener('click',e=>{const b=e.target.closest('.strategy-btn');if(!b)return;document.querySelectorAll('.strategy-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.annualReturn=+b.dataset.return;resetBoost();rerender();});
els.goalEditBtn.addEventListener('click',()=>els.goalEditor.hidden?openGoal():closeGoal());
els.goalCancelBtn.addEventListener('click',closeGoal);
els.goalEditor.addEventListener('submit',e=>{e.preventDefault();state.goal=Math.max(1000,Math.min(1000000,+els.goalAmountInput.value||state.goal));state.goalName=els.goalNameInput.value.trim().slice(0,40);closeGoal();resetBoost();rerender();});
els.boostOptions.addEventListener('click',e=>{const b=e.target.closest('.boost-btn');if(!b)return;const boost=+b.dataset.boost;state.selectedBoost=state.selectedBoost===boost?null:boost;renderBoostPreview(state,els,translations,state.selectedBoost);});
els.applyBoostBtn.addEventListener('click',()=>{const boost=+els.applyBoostBtn.dataset.boost||0;if(!boost)return;state.monthly=Math.min(+els.monthly.max,state.monthly+boost);els.monthly.value=String(state.monthly);resetBoost();rerender();});
els.languageBtn.addEventListener('click',()=>{state.lang=state.lang==='fr'?'en':'fr';localStorage.setItem('bloom-lang',state.lang);renderLanguage(state,els,translations);rerender();});
els.themeBtn.addEventListener('click',toggleTheme);
initializeTheme();renderLanguage(state,els,translations);rerender();
