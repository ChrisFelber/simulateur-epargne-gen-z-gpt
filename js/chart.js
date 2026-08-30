import { getProjectionSeries } from './calculator.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

function addSvgElement(parent, tag, attributes, text = '') {
  const element = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  if (text) element.textContent = text;
  parent.appendChild(element);
}

export function renderChart(state, els, translations) {
  const W = 720, H = 320, left = 58, right = 18, top = 24, bottom = 45;
  const plotW = W - left - right, plotH = H - top - bottom;
  const points = getProjectionSeries(state);
  const maxValue = Math.max(...points.map(point => point.value));
  const maxY = Math.max(10000, Math.ceil(maxValue / 10000) * 10000);
  const x = year => left + (year / state.years) * plotW;
  const y = value => top + plotH - (value / maxY) * plotH;
  const pathFor = key => points.map((point, index) => `${index ? 'L' : 'M'} ${x(point.year).toFixed(1)} ${y(point[key]).toFixed(1)}`).join(' ');
  const mainPath = pathFor('value');
  const investedPath = pathFor('invested');

  els.mainPath.setAttribute('d', mainPath);
  els.investedPath.setAttribute('d', investedPath);
  els.areaPath.setAttribute('d', `${mainPath} L ${x(state.years)} ${top + plotH} L ${left} ${top + plotH} Z`);

  const last = points.at(-1);
  els.mainDot.setAttribute('cx', x(state.years));
  els.mainDot.setAttribute('cy', y(last.value));
  els.investedDot.setAttribute('cx', x(state.years));
  els.investedDot.setAttribute('cy', y(last.invested));

  els.chartGrid.replaceChildren();
  for (let index = 0; index <= 3; index++) {
    const value = maxY * index / 3;
    const yy = y(value);
    addSvgElement(els.chartGrid, 'line', { class: 'grid-line', x1: left, y1: yy, x2: W - right, y2: yy });
    addSvgElement(els.chartGrid, 'text', { class: 'axis-label', x: left - 12, y: yy + 4, 'text-anchor': 'end' }, value === 0 ? '0' : `${Math.round(value / 1000)}k`);
  }
  [0, Math.round(state.years / 2), state.years].forEach(tick => addSvgElement(els.chartGrid, 'text', { class: 'axis-label', x: x(tick), y: H - 15, 'text-anchor': 'middle' }, String(tick)));
  addSvgElement(els.chartGrid, 'text', { class: 'axis-label', x: left - 12, y: 14, 'text-anchor': 'end' }, 'CHF');
  addSvgElement(els.chartGrid, 'text', { class: 'axis-label', x: W - right, y: H - 15, 'text-anchor': 'end' }, translations[state.lang].years);
}
