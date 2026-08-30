import { getProjectionSeries } from './calculator.js';
const NS='http://www.w3.org/2000/svg';
function el(parent,tag,attrs,text=''){const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text)n.textContent=text;parent.appendChild(n);return n;}
export function renderChart(state,els){
  const W=720,H=260,L=58,R=18,T=20,B=40;
  const pts=getProjectionSeries(state);
  const max=Math.max(...pts.map(p=>p.value),1)*1.12;
  const x=y=>L+(y/state.years)*(W-L-R);
  const y=v=>H-B-(v/max)*(H-T-B);
  els.chartGrid.innerHTML='';
  for(let i=0;i<=4;i++){
    const val=max*i/4, yy=y(val);
    el(els.chartGrid,'line',{x1:L,x2:W-R,y1:yy,y2:yy,class:'grid-line'});
    el(els.chartGrid,'text',{x:L-10,y:yy+4,'text-anchor':'end',class:'axis-label'},Math.round(val/1000)+'k');
  }
  pts.filter((_,i)=>i%Math.max(1,Math.floor(state.years/5))===0||i===pts.length-1).forEach(p=>{
    el(els.chartGrid,'text',{x:x(p.year),y:H-12,'text-anchor':'middle',class:'axis-label'},String(new Date().getFullYear()+p.year));
  });
  const main=pts.map(p=>`${x(p.year)},${y(p.value)}`).join(' ');
  const inv=pts.map(p=>`${x(p.year)},${y(p.invested)}`).join(' ');
  const path=s=>`M ${s.split(' ').join(' L ')}`;
  els.mainPath.setAttribute('d',path(main));
  els.investedPath.setAttribute('d',path(inv));
  const last=pts.at(-1);
  els.areaPath.setAttribute('d',`${path(main)} L ${x(last.year)},${H-B} L ${x(0)},${H-B} Z`);
  els.mainDot.setAttribute('cx',x(last.year));els.mainDot.setAttribute('cy',y(last.value));
  els.investedDot.setAttribute('cx',x(last.year));els.investedDot.setAttribute('cy',y(last.invested));
}
