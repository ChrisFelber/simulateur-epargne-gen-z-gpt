export function projectSavings({initial,monthly,annualReturn},year){
  const months=Math.round(year*12);
  const monthlyRate=annualReturn/100/12;
  let value=initial;
  for(let month=0;month<months;month++) value=value*(1+monthlyRate)+monthly;
  return {value,invested:initial+monthly*months};
}

export function getProjectionSeries(state){
  const points=[];
  for(let year=0;year<=state.years;year++) points.push({year,...projectSavings(state,year)});
  return points;
}

export function getSummary(state){
  const final=projectSavings(state,state.years);
  const gains=final.value-final.invested;
  const performance=final.invested?gains/final.invested*100:0;
  const goalProgress=Math.min(100,final.value/state.goal*100);
  return {...final,gains,performance,goalProgress};
}
